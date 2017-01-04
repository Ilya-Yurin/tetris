import Row from './row';
import Figure from './figure';

class Tetris {
  static tickCbsFor = {};
  static counter = 0;
  static difficults = ['easy', 'medium', 'hard', 'nightmare', 'hell'];
  static defaultParams = {
    rows: 25,
    cells: 11,
    difficult: 'easy',
    control: {
      moveLeft: 37,
      moveRight: 39,
      boost: 40,
      rotate: 38
    },
    selectors: {
      tetris: 'div',
      row: 'div',
      cell: 'div',
      score: 'div',
      pause: 'button',
      start: 'button',
      unpause: 'button',
      field: 'div'
    },
    texts: {
      unpause: 'Play',
      pause: 'Pause',
      start: 'Start'
    },
    classes: {
      row: {
        filled: 'tetris__row-filled',
        common: 'tetris__row'
      },
      cell:{
        filled: 'tetris__cell-filled',
        common: 'tetris__cell',
        highlighted: 'tetris__cell-highlighted',
        colored: 'tetris__cell-colored'
      },
      tetris: {
        common: 'tetris',
        paused: 'tetris-paused',
        started: 'tetris-started'
      },
      field: {
        common: 'tetris__field'
      },
      score: {
        common: 'tetris__score'
      },
      pause: {
        common: 'tetris__pause'
      },
      start: {
        common: 'tetris__start'
      },
      unpause: {
        common: 'tetris__unpause'
      }
    }
  };
  static cloneDeep(objectToBeCloned) {
    if (!(objectToBeCloned instanceof Object)) {
      return objectToBeCloned;
    }

    let objectClone = new objectToBeCloned.constructor;

    for (let prop in objectToBeCloned) {
      if(!objectToBeCloned.hasOwnProperty(prop))
        continue;

      objectClone[prop] = Tetris.cloneDeep(objectToBeCloned[prop]);
    }

    return objectClone;
  }

  static removeFromTickCbs(tetris) {
    delete Tetris.tickCbsFor[tetris.index];
  }

  static addToTickCbs(tetris) {
    Tetris.tickCbsFor[tetris.index] = tetris;
  }

  static assignDeep(objectToAssign, objectToBeAssigned) {
    if (!(objectToAssign instanceof Object) || !(objectToBeAssigned instanceof Object)) {
      return;
    }

    for (let prop in objectToBeAssigned) {
      if(!objectToBeAssigned.hasOwnProperty(prop))
        continue;

      if(objectToAssign.hasOwnProperty(prop)) {
        if(objectToAssign[prop] instanceof Object && objectToAssign[prop] instanceof Object)
          Tetris.assignDeep(objectToAssign[prop], objectToBeAssigned[prop]);
      } else {
        objectToAssign[prop] = Tetris.cloneDeep(objectToBeAssigned[prop]);
      }
    }
  }

  constructor(params) {
    this.index = ++Tetris.counter;
    params = params || {};
    this.params = Tetris.cloneDeep(params);
    Tetris.assignDeep(this.params, Tetris.defaultParams);
    this.DOM = document.createElement(this.params.selectors.tetris);
    this.fieldDOM = document.createElement(this.params.selectors.field);
    this.DOM.appendChild(this.fieldDOM);
    this.fieldDOM.className = this.params.classes.field.common;

    this.pauseDOM = document.createElement(this.params.selectors.pause);
    this.DOM.appendChild(this.pauseDOM);
    this.pauseDOM.className = this.params.classes.pause.common;
    this.pauseDOM.innerText = this.params.texts.pause;

    this.pauseDOM.addEventListener('click', function (event) {
      this.pause();
    }.bind(this));

    this.startDOM = document.createElement(this.params.selectors.start);
    this.DOM.appendChild(this.startDOM);
    this.startDOM.className = this.params.classes.start.common;
    this.startDOM.innerText = this.params.texts.start;

    this.startDOM.addEventListener('click', function (event) {
      this.start();
    }.bind(this));

    this.unpauseDOM = document.createElement(this.params.selectors.unpause);
    this.DOM.appendChild(this.unpauseDOM);
    this.unpauseDOM.className = this.params.classes.unpause.common;
    this.unpauseDOM.innerText = this.params.texts.unpause;

    this.unpauseDOM.addEventListener('click', function (event) {
      this.unpause();
    }.bind(this));

    this.boost = false;

    if(!this.params.playerName)
      this.params.playerName = `Player ${this.index}`;

    this.params.movingDeelay = 100;

    this.rows = [];
    this.score = 0;
    this.started = false;
    this.lastTickTime = 0;
    this.lastMovingTime = 0;
    this.gameTime = 0;
    this.figure = null;
    this.paused = false;
    this.gameOver = false;
    this.moveRight = false;
    this.moveLeft = false;
    document.querySelector('body').appendChild(this.DOM);
    this.DOM.className = this.params.classes.tetris.common;
    this.scoreDOM = document.createElement(this.params.selectors.score);
    this.DOM.appendChild(this.scoreDOM);
    this.scoreDOM.className = this.params.classes.score.common;
    this.scoreDOM.textContent = 0;

    for(let i = 0, l = this.params.rows; i < l; i++) {
      this.rows.push(new Row(this));
    }

    document.addEventListener('keyup', function (event) {
      if(event.keyCode == this.params.control.boost) { // это код кнопки «Вниз»
        this.boost = false;
      }

      if (event.keyCode == this.params.control.moveRight)
        this.moveRight = false;

      if(event.keyCode == this.params.control.moveLeft)
        this.moveLeft = false;
    }.bind(this), false);

    document.addEventListener('keydown', function (event) {
      if(event.keyCode == this.params.control.boost) // это код кнопки «Вниз»
        this.boost = true;

      if (event.keyCode == this.params.control.moveRight)
        this.moveRight = true;

      if (event.keyCode == this.params.control.rotate) {
        this.figure.rotate();
      }

      if(event.keyCode == this.params.control.moveLeft)
        this.moveLeft = true;
    }.bind(this), false);

    let tickDeelay;
    switch(this.params.difficult) {
      case 'easy':
        tickDeelay = 1000;
        break;
      case 'medium':
        tickDeelay = 800;
        break;
      case 'hard':
        tickDeelay = 700;
        break;
      case 'nightmare':
        tickDeelay = 500;
        break;
      case 'hell':
        tickDeelay = 400;
        break;
      case 'impossible':
        tickDeelay = 50;
        break;
      default:
        tickDeelay = 800;
        break;
    }

    this.tickDeelay = tickDeelay;
  }

  start() {
    this.started = true;
    this.DOM.classList.add(this.params.classes.tetris.started);
    Tetris.addToTickCbs(this);
  }

  unpause() {
    if(!this.started)
      return;

    this.paused = false;
    this.DOM.classList.remove(this.params.classes.tetris.paused);
    Tetris.addToTickCbs(this);
  }

  pause() {
    if(!this.started)
      return;

    this.paused = true;
    this.DOM.classList.add(this.params.classes.tetris.paused);
    Tetris.removeFromTickCbs(this);
  }

  tick(dt) {
    this.gameTime += dt;
    let moving = false;

    if(this.figure && this.gameTime - this.lastMovingTime >= this.params.movingDeelay) {
      if(this.moveLeft) {
        this.figure.move('left');
        moving = true;
      }
      if(this.moveRight) {
        this.figure.move('right');
        moving = true;
      }
    }

    if(this.gameTime - this.lastTickTime < this.tickDeelay && !this.boost) {
      if(moving){
        this.lastMovingTime = this.gameTime;
        this.processRows();
      }
      return;
    }

    if(this.gameOver || this.paused || !this.started)
      return;

    this.lastTickTime = this.gameTime;
    if(!this.figure)
      this.figure = new Figure(this);

    this.processRows();

    if (this.figure.touched()) {
      this.figure.toBricks();
      this.checkFilledLines();

      // фигуре некуда двигаться дальше начала, игра закончилась
      if(this.figure.coords[this.figure.coords.length - 1].y === 0) {
        this.gameOver = true;
        Tetris.removeFromTickCbs(this);
        console.info(`${this.params.playerName} game over!`);
        return;
      }

      this.figure = null;
    } else {
      this.figure.move('bottom');
    }
  }

  processRows() {
    for (let i = 0, l = this.rows.length; i < l; i++)
      this.rows[i].process(i);
  }

  checkFilledLines() {
    let scope = 0;
    let multiply = -1;
    for(let i = 0, l = this.rows.length; i < l; i++) {
      let row = this.rows[i];
      let filledCount = 0;
      for(let n = 0, s = row.cells.length; n < s; n++) {
        let cell = row.cells[n];
        if(cell.filled)
          filledCount++;
      }

      if(filledCount === row.cells.length) {
        this.rows[i].recreate(i);
        scope += 100;
        multiply += 1;
      }
    }

    if(scope) {
      this.score = (this.score * 1) + scope + scope * multiply;
      this.scoreDOM.innerText = this.score;
    }
  }
}

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let lastFrameTime;

requestAnimationFrame(ticker);

function ticker() {
  lastFrameTime = lastFrameTime || Date.now();
  let nowTime = Date.now();
  let dt = nowTime - lastFrameTime;
  lastFrameTime = nowTime;
  Tetris.gameTime += dt;

  for(let i in Tetris.tickCbsFor) {
    if(!Tetris.tickCbsFor.hasOwnProperty(i))
      continue;

    Tetris.tickCbsFor[i].tick(dt);
  }

  requestAnimationFrame(ticker);
}

export default Tetris;
