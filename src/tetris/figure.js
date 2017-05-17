import Tetris from './tetris';

class Figure {

  // вращает координаты по часовой стрелке
  static mathRotate(baseCoord, rotateCoords) {
    for (let i = 0, l = rotateCoords.length; i < l; i++) {
      const coord = rotateCoords[i];
      const relativeFromBase = {
        x: coord.x - baseCoord.x,
        y: coord.y - baseCoord.y
      };

      const transormed = {
        x: -1 * relativeFromBase.y,
        y: 1 * relativeFromBase.x
      };

      coord.x = baseCoord.x + transormed.x;
      coord.y = baseCoord.y + transormed.y;
    }
  }

  // сдвигает фигуру в нужное направление
  static mathMove(direction, coords) {
    switch (direction) {
      case 'left':
        for (let i = 0, l = coords.length; i < l; i++) {
          const coord = coords[i];
          coord.x--;
        }
        break;

      case 'right':
        for (let i = 0, l = coords.length; i < l; i++) {
          const coord = coords[i];
          coord.x++;
        }
        break;

      case 'bottom':
        for (let i = 0, l = coords.length; i < l; i++) {
          const coord = coords[i];
          coord.y++;
        }
        break;
      default:
        break;
    }
  }

  constructor(tetris) {
    this.colorIndex = Math.floor(Math.random() * 4) + 1;
    this.tetris = tetris;
    this.form = Tetris.cloneDeep(tetris.params.figuresForms[Math.floor(Math.random() * tetris.params.figuresForms.length)]);
    this.desc = this.form.pop();

    if (this.desc.rotatable) {
      this.rotateCoords = [];
    }

    this.coords = [];
    for (let i = 0, l = this.form.length; i < l; i++) {
      const row = this.form[i];
      let x = 0;
      for (let n = 0, s = row.length; n < s; n++) {
        if (row[n]) {
          const coord = {
            x,
            y: i
          };
          this.coords.push(coord);

          if (this.desc.rotatable) {
            if (this.desc.base[0] === i && this.desc.base[1] === n) {
              this.baseCoord = coord;
            } else {
              this.rotateCoords.push(coord);
            }
          }
        }
        x++;
      }
    }

    if (this.desc.rotatable) {
      let rotateCount = Math.floor(Math.random() * 4);
      // максимум вращаем 3 раза
      while (rotateCount--) {
        Figure.mathRotate(this.baseCoord, this.rotateCoords);
      }
    }

    let maxX;
    let minX;
    let maxY;
    let minY;
    let minCoord;
    for (let i = 0, l = this.coords.length; i < l; i++) {
      const coord = this.coords[i];

      if (maxX === undefined) { maxX = coord.x; }
      if (minX === undefined) {
        minX = coord.x;
      }

      if (maxY === undefined) {
        maxY = coord.y;
      }
      if (minY === undefined) { minY = coord.y; }

      if (minCoord === undefined) {
        minCoord = coord;
      }

      if (coord.x > maxX) { maxX = coord.x; }
      if (coord.x < minX) {
        minX = coord.x;
      }

      if (coord.y > maxY) { maxY = coord.y; }
      if (coord.y < minY) {
        minY = coord.y;
      }
    }
    const width = (maxX - minX) + 1;
    const height = (maxY - minY) + 1;

    const startX = Math.floor((tetris.params.cells - width) / 2);
    const startY = -1 * (height);
    const offsetX = startX - minX;
    const offsetY = startY - minY;

    for (let i = 0, l = this.coords.length; i < l; i++) {
      const coord = this.coords[i];

      coord.x += offsetX;
      coord.y += offsetY;
    }
  }

  touched() {
    for (let i = 0, l = this.coords.length; i < l; i++) {
      const coord = this.coords[i];

      if (coord.y >= -1) {
        // в конце поля
        if (this.tetris.rows[coord.y + 1] === undefined) {
          return true;
        }

        // за фигурой есть что-то
        if (this.tetris.rows[coord.y + 1].cells[coord.x].filled) {
          return true;
        }
      }
    }

    return false;
  }

  toBricks() {
    for (let i = 0, l = this.coords.length; i < l; i++) {
      const coord = this.coords[i];
      if (coord.y >= 0) {
        this.tetris.rows[coord.y].cells[coord.x].filled = true;
        this.tetris.rows[coord.y].cells[coord.x].colorIndex = this.colorIndex;
      }
    }
  }

  rotate() {
    if (!this.desc.rotatable) {
      return;
    }

    const pristineCoords = Tetris.cloneDeep(this.coords);
    Figure.mathRotate(this.baseCoord, this.rotateCoords);

    for (let i = 0, l = this.coords.length; i < l; i++) {
      const coord = this.coords[i];

      if (coord.x < 0) {
        Figure.mathMove('right', this.coords);
      } else if (coord.x > (this.tetris.params.cells - 1)) {
        Figure.mathMove('left', this.coords);
      }

      const row = this.tetris.rows[coord.y];
      if (row) {
        const cell = row.cells[coord.x];
        const rowAbove = this.tetris.rows[coord.y - 1];
        let cellAbove;
        if (rowAbove) {
          cellAbove = rowAbove.cells[coord.x];
        }

        if ((cell && cell.filled) || (cellAbove && cellAbove.filled)) {
          if (this.baseCoord.x < coord.x) {
            Figure.mathMove('left', this.coords);
          } else if (this.baseCoord.x > coord.x) {
            Figure.mathMove('right', this.coords);
          }
        }
      }
    }

    for (let i = 0, l = this.coords.length; i < l; i++) {
      const coord = this.coords[i];

      if (coord.y >= 0) {
        const row = this.tetris.rows[coord.y];
        if (!row) {
          Tetris.assignDeep(this.coords, pristineCoords, true);
          return;
        }

        const cell = row.cells[coord.x];
        if (!cell || cell.filled) {
          Tetris.assignDeep(this.coords, pristineCoords, true);
          return;
        }
      }
    }
  }

  move(direction) {
    let canMove;

    switch (direction) {
      case 'left':
        canMove = true;
        for (let i = 0, l = this.coords.length; i < l; i++) {
          const coord = this.coords[i];

          if ((coord.x - 1) < 0) {
            canMove = false;
            break;
          }

          if (
            this.tetris.rows[coord.y]
            && this.tetris.rows[coord.y].cells[coord.x - 1]
            && this.tetris.rows[coord.y].cells[coord.x - 1].filled
          ) {
            canMove = false;
            break;
          }
        }

        if (canMove) {
          Figure.mathMove('left', this.coords);
        }
        break;

      case 'right':
        canMove = true;
        for (let i = 0, l = this.coords.length; i < l; i++) {
          const coord = this.coords[i];

          if ((coord.x + 2 > this.tetris.params.cells)) {
            canMove = false;
            break;
          }

          if (
            this.tetris.rows[coord.y]
            && this.tetris.rows[coord.y].cells[coord.x + 1]
            && this.tetris.rows[coord.y].cells[coord.x + 1].filled
          ) {
            canMove = false;
            break;
          }
        }

        if (canMove) {
          Figure.mathMove('right', this.coords);
        }
        break;

      case 'bottom':
        if (this.touched()) {
          return;
        }

        Figure.mathMove('bottom', this.coords);
        break;
      default:
        break;
    }
  }
}

export default Figure;
