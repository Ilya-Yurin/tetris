import Cell from './cell';

class Row {
  constructor(tetris, addTo) {
    addTo = addTo || 'bottom';
    this.tetris = tetris;
    this.DOM = document.createElement(tetris.params.selectors.row);
    this.DOM.className = this.tetris.params.classes.row.common;
    if (addTo === 'bottom') {
      this.tetris.fieldDOM.appendChild(this.DOM);
    } else {
      this.tetris.fieldDOM.insertBefore(this.DOM, this.tetris.fieldDOM.firstChild);
    }
    this.cells = [];

    for (let i = 0, l = this.tetris.params.cells; i < l; i++) {
      this.cells.push(new Cell(this));
    }
  }

  process(rowIndex) {
    for (let i = 0, l = this.cells.length; i < l; i++) {
      this.cells[i].process(rowIndex, i);
    }
  }

  recreate(rowIndex) {
    this.tetris.fieldDOM.removeChild(this.DOM);
    this.tetris.rows.splice(rowIndex, 1);
    this.tetris.rows.unshift(new Row(this.tetris, 'top'));
  }
}

export default Row;
