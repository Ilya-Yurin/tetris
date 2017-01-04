import Tetris from './tetris';

class Figure {
  static forms = [
    [
      [1, 1],
      [0, 1, 1],
      {
        rotatable: true,
        base: [0, 1]
      }
    ],
    [
      [1],
      [1],
      [1],
      [1],
      {
        rotatable: true,
        base: [1, 0]
      }
    ],
    [
      [1, 0, 1],
      [1, 1, 1],
      {
        rotatable: true,
        base: [1, 1]
      }
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      {
        rotatable: true,
        base: [1, 1]
      }
    ],
    [
      [0, 1, 1],
      [1, 1],
      {
        rotatable: true,
        base: [0, 1]
      }
    ],
    [
      [1, 1],
      [1],
      [1],
      {
        rotatable: true,
        base: [0, 0]
      }
    ],
    [
      [1, 1],
      [1, 1],
      {
        rotatable: false
      }
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
      {
        rotatable: true,
        base: [0, 1]
      }
    ],
    [
      [1],
      [1, 1],
      {
        rotatable: true,
        base: [1, 0]
      }
    ],
    [
      [0, 1],
      [1, 1],
      {
        rotatable: true,
        base: [1, 1]
      }
    ],
    [
      [1],
      {
        rotatable: false
      }
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
      {
        rotatable: false
      }
    ],
    // [
    //   [0, 0, 1, 0, 0],
    //   [0, 1, 1, 1, 0],
    //   [1, 1, 1, 1, 1],
    //   [0, 1, 1, 1, 0],
    //   [0, 0, 1, 0, 0],
    //   {
    //     rotatable: false
    //   }
    // ]
    [
      [1, 1],
      {
        rotatable: true,
        base: [0, 0]
      }
    ]
  ];

  static rotate(baseCoord, rotateCoords) {
    for(let i = 0, l = rotateCoords.length; i < l; i++) {
      let coord = rotateCoords[i];
      let relativeFromBase = {
        x: coord.x - baseCoord.x,
        y: coord.y - baseCoord.y
      };

      let transormed = {
        x: -1 * relativeFromBase.y,
        y: 1 * relativeFromBase.x
      };

      coord.x = baseCoord.x + transormed.x;
      coord.y = baseCoord.y + transormed.y;
    }
  }

  constructor(tetris) {
    this.tetris = tetris;
    let form = Tetris.cloneDeep(Figure.forms[Math.floor(Math.random() * Figure.forms.length)]);
    this.desc =  form.pop();

    if(this.desc.rotatable) {
      this.rotateCoords = [];
    }

    this.coords = [];
    for(let i = 0, l = form.length; i < l; i++) {
      let row = form[i];
      let x = 0;
      for(let n = 0, s = row.length; n < s; n++) {
        if(row[n]) {
          let coord = {
            x: x,
            y: i
          };
          this.coords.push(coord);

          if(this.desc.rotatable) {
            if(this.desc.base[0] === i && this.desc.base[1] === n) {
              this.baseCoord = coord;
            } else {
              this.rotateCoords.push(coord);
            }
          }
        }
        x++;
      }
    }

    if(this.desc.rotatable) {
      let rotateCount = Math.floor(Math.random() * 4);
      // максимум вращаем 3 раза
      while(rotateCount--) {
        Figure.rotate(this.baseCoord, this.rotateCoords);
      }
    }

    let maxX;
    let minX;
    let width;
    let maxY;
    let minY;
    let height;
    let minCoord;
    for(let i = 0, l = this.coords.length; i < l; i++) {
      let coord = this.coords[i];

      if(maxX === undefined)
        maxX = coord.x;
      if(minX === undefined)
        minX = coord.x;

      if(maxY === undefined)
        maxY = coord.y;
      if(minY === undefined)
        minY = coord.y;

      if(minCoord === undefined)
        minCoord = coord;

      if(coord.x > maxX)
        maxX = coord.x;
      if(coord.x < minX)
        minX = coord.x;

      if(coord.y > maxY)
        maxY = coord.y;
      if(coord.y < minY)
        minY = coord.y;
    }
    width = maxX - minX + 1;
    height = maxY - minY + 1;

    let startX = Math.floor((tetris.params.cells - width) / 2);
    let startY = -1 * (height - 1);
    let offsetX = startX - minX;
    let offsetY = startY - minY;

    for(let i = 0, l = this.coords.length; i < l; i++) {
      let coord = this.coords[i];

      coord.x += offsetX;
      coord.y += offsetY;
    }

    // let width = 0;
    // let height = form.length;
    // let startX = 0;
    //
    // for(let i = 0, l = form.length; i < l; i++) {
    //   if(width < form[i].length)
    //     width = form[i].length;
    // }
    //
    // if(width < tetris.params.cells)
    //   startX = Math.floor((tetris.params.cells - width) / 2);
    //
    // this.coords = [];
    // let x = startX;
    // let y = -1 * (height - 1);
    // for(let i = 0, l = form.length; i < l; i++) {
    //   let row = form[i];
    //   for(let n = 0, s = row.length; n < s; n++) {
    //     if(row[n]) {
    //       let coord = {
    //         x: x,
    //         y: y
    //       };
    //       this.coords.push(coord);
    //
    //       if(this.desc.rotatable) {
    //         if(this.desc.base[0] === i && this.desc.base[1] === n) {
    //           this.baseCoord = coord;
    //         } else {
    //           this.rotateCoords.push(coord);
    //         }
    //       }
    //     }
    //     x++;
    //   }
    //   y++;
    //   x = startX;
    // }
  }

  touched() {
    for(let i = 0, l = this.coords.length; i < l; i++) {
      let coord = this.coords[i];

      if(coord.y >= 0) {
        // в конце поля
        if (this.tetris.rows[coord.y + 1] === undefined)
          return true;

        // за фигурой есть что-то
        if(this.tetris.rows[coord.y + 1].cells[coord.x].filled)
          return true;
      }
    }

    return false;
  }

  toBricks() {
    for(let i = 0, l = this.coords.length; i < l; i++) {
      let coord = this.coords[i];
      if(coord.y >= 0) {
        this.tetris.rows[coord.y].cells[coord.x].filled = true;
        // this.tetris.dirtyCells[`${this.tetris.rows[coord.y].index}-${this.tetris.rows[coord.y].cells[coord.x].index}`] = this.tetris.rows[coord.y].cells[coord.x];
      }
    }
  }

  rotate() {
    if(!this.desc.rotatable)
      return;

    if(this.tetris.gameOver || this.tetris.paused || !this.tetris.started)
      return;

    Figure.rotate(this.baseCoord, this.rotateCoords);

    for(let i = 0, l = this.coords.length; i < l; i++) {
      let coord = this.coords[i];

      if(coord.x < 0)
        this.move('right');

      if(coord.x > (this.tetris.params.cells - 1))
        this.move('left');
    }

    this.tetris.processRows();
  }

  move(direction) {

    let canMove;

    switch(direction) {
      case 'left':
        canMove = true;
        for(let i = 0, l = this.coords.length; i < l; i++) {
          let coord = this.coords[i];

          if((coord.x - 1) < 0) {
            canMove = false;
            break;
          }

          if(
            this.tetris.rows[coord.y] &&
            (!this.tetris.rows[coord.y].cells[coord.x - 1] || this.tetris.rows[coord.y].cells[coord.x - 1].filled)
          ) {
            canMove = false;
            break;
          }
        }

        if(canMove) {
          for(let i = 0, l = this.coords.length; i < l; i++) {
                let coord = this.coords[i];
                coord.x--;
              }
        }
        break;

      case 'right':
        canMove = true;
        for(let i = 0, l = this.coords.length; i < l; i++) {
          let coord = this.coords[i];

          if((coord.x + 1 > this.tetris.cells)) {
            canMove = false;
            break;
          }

          if(
            this.tetris.rows[coord.y] &&
            (!this.tetris.rows[coord.y].cells[coord.x + 1] || this.tetris.rows[coord.y].cells[coord.x + 1].filled)
          ) {
            canMove = false;
            break;
          }
        }

        if(canMove) {
          for(let i = 0, l = this.coords.length; i < l; i++) {
            let coord = this.coords[i];
            coord.x++;
          }
        }
        break;

      case 'bottom':
        if(this.touched())
          return;

        for (let i = 0, l = this.coords.length; i < l; i++) {
          const coord = this.coords[i];
          coord.y++;
        }
        break;
    }
  }
}

export default Figure;
