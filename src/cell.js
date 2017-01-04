class Cell {
  constructor(row) {
    this.row = row;
    this.tetris = this.row.tetris;
    this.DOM = document.createElement(this.tetris.params.selectors.cell);
    this.row.DOM.appendChild(this.DOM);
    this.DOM.className = this.tetris.params.classes.cell.common;
    this.filled = false;
  }

  process(rowIndex, cellIndex) {
    let needleFilled = false;
    let needleHighlighted = false;
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
        needleFilled = true;
      }
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
