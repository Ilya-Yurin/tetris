class Cell {
  constructor(row) {
    this.row = row;
    this.tetris = this.row.tetris;
    this.DOM = document.createElement(this.tetris.params.selectors.cell);
    this.row.DOM.appendChild(this.DOM);
    this.DOM.className = this.tetris.params.classes.cell.common;
    this.filled = false;
    this.colored = false;
  }

  process(rowIndex, cellIndex) {
    let needleFilled = false;
    let needleHighlighted = false;
    let colorIndex;

    if (this.tetris.figure) {
      for (let i = 0, l = this.tetris.figure.coords.length; i < l; i++) {
        const coord = this.tetris.figure.coords[i];

        if (coord.x === cellIndex) {
          needleHighlighted = true;
        }

        if (
          coord.x === cellIndex
          && coord.y === rowIndex
        ) {
          this.DOM.classList.add(this.tetris.params.classes.cell.filled);
          colorIndex = this.tetris.figure.colorIndex;
          needleFilled = true;
        }
      }
    }

    if (this.colorIndex !== undefined) {
      colorIndex = this.colorIndex;
    }

    if (colorIndex) {
      this.DOM.classList.add(`${this.tetris.params.classes.cell.colored}-${colorIndex}`);
      this.colored = true;
    } else if (this.colored) {
      this.colored = false;
      this.DOM.className = this.DOM.className.replace(new RegExp(`(${this.tetris.params.classes.cell.colored}-\\d)*`, 'ig'), '');
    }

    if (!needleFilled && !this.filled) {
      this.DOM.classList.remove(this.tetris.params.classes.cell.filled);
    }

    if (this.filled) {
      this.DOM.classList.add(this.tetris.params.classes.cell.filled);
    }

    if (needleHighlighted) {
      this.DOM.classList.add(this.tetris.params.classes.cell.highlighted);
    } else {
      this.DOM.classList.remove(this.tetris.params.classes.cell.highlighted);
    }
  }

}

export default Cell;
