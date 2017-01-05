import Row from './row';
import Figure from './figure';

class Tetris {
  static tickCbsFor = {};
  static counter = 0;
  static defaultParams = {
    rows: 25,
    cells: 11,
    tickDelay: 800,
    movingDelay: 100,
    rotatingDelay: 180,
    boostingDelay: 20,
    figuresInQueue: 5,
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
      field: 'div',
      control: 'div',
      queue: 'div',
      figure: 'div',
      figureCell: 'div',
      figureRow: 'div',
      container: 'div'
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
      cell: {
        filled: 'tetris__cell-filled',
        common: 'tetris__cell',
        highlighted: 'tetris__cell-highlighted',
        colored: 'tetris__cell-colored'
      },
      tetris: {
        common: 'tetris',
        paused: 'tetris-paused',
        started: 'tetris-started',
        played: 'tetris-played'
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
      },
      control: {
        common: 'tetris__control'
      },
      queue: {
        common: 'tetris__queue'
      },
      figure: {
        common: 'tetris__figure'
      },
      figureRow: {
        common: 'tetris__figure-row'
      },
      figureCell: {
        common: 'tetris__figure-cell',
        empty: 'tetris__figure-cell_empty',
        filled: 'tetris__figure-cell_filled',
        color: 'tetris__figure-cell_colored'
      },
      container: {
        common: 'tetris__container'
      }
    }
  };
  static cloneDeep(objectToBeCloned) {
    if (!(objectToBeCloned instanceof Object)) {
      return objectToBeCloned;
    }

    // создаём объект на основе констркуктора, это может быть Array или Object
    const objectClone = new objectToBeCloned.constructor();

    const keys = Object.keys(objectToBeCloned);
    for (let i = 0, l = keys.length; i < l; i++) {
      const prop = keys[i];
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

  // overwrite - перезаписывать свойство если оно есть, или оставить исходным
  static assignDeep(objectToAssign, objectToBeAssigned, overwrite) {
    overwrite = overwrite || false;
    if (!(objectToAssign instanceof Object) || !(objectToBeAssigned instanceof Object)) {
      return;
    }

    const keys = Object.keys(objectToBeAssigned);
    for (let i = 0, l = keys.length; i < l; i++) {
      const prop = keys[i];

      if (Object.prototype.hasOwnProperty.call(objectToAssign, prop)) {
        if (objectToAssign[prop] instanceof Object && objectToAssign[prop] instanceof Object) {
          Tetris.assignDeep(objectToAssign[prop], objectToBeAssigned[prop], overwrite);
        } else if (overwrite) {
          objectToAssign[prop] = Tetris.cloneDeep(objectToBeAssigned[prop]);
        }
      } else {
        objectToAssign[prop] = Tetris.cloneDeep(objectToBeAssigned[prop]);
      }
    }
  }

  constructor(params) {
    // для генерации имени пользователя
    this.index = ++Tetris.counter;

    // делаем параметры на основе дефолтных
    params = params || {};
    this.params = Tetris.cloneDeep(params);
    Tetris.assignDeep(this.params, Tetris.defaultParams);

    // берём имя из параметров или генерируем на основе индекса
    if (!this.params.playerName) {
      this.params.playerName = `Player ${this.index}`;
    }

    // DOM каркаса тетриса
    this.DOM = document.createElement(this.params.selectors.tetris);
    document.querySelector('body').appendChild(this.DOM);
    this.DOM.className = this.params.classes.tetris.common;

    // DOM контейнера, для удобства CSS
    this.containerDOM = document.createElement(this.params.selectors.container);
    this.DOM.appendChild(this.containerDOM);
    this.containerDOM.className = this.params.classes.container.common;

    // DOM игрового поля
    this.fieldDOM = document.createElement(this.params.selectors.field);
    this.containerDOM.appendChild(this.fieldDOM);
    this.fieldDOM.className = this.params.classes.field.common;

    // DOM очков
    this.scoreDOM = document.createElement(this.params.selectors.score);
    this.containerDOM.appendChild(this.scoreDOM);
    this.scoreDOM.className = this.params.classes.score.common;
    this.scoreDOM.textContent = 0;

    // DOM control'a
    this.controlDOM = document.createElement(this.params.selectors.control);
    this.containerDOM.appendChild(this.controlDOM);
    this.controlDOM.className = this.params.classes.control.common;

    // DOM кнопки паузы
    this.pauseDOM = document.createElement(this.params.selectors.pause);
    this.controlDOM.appendChild(this.pauseDOM);
    this.pauseDOM.className = this.params.classes.pause.common;
    this.pauseDOM.innerText = this.params.texts.pause;
    this.pauseDOM.addEventListener('click', () => {
      this.pause();
    });

    // DOM кнопки старта
    this.startDOM = document.createElement(this.params.selectors.start);
    this.controlDOM.appendChild(this.startDOM);
    this.startDOM.className = this.params.classes.start.common;
    this.startDOM.innerText = this.params.texts.start;
    this.startDOM.addEventListener('click', () => {
      this.start();
    });

    // DOM кнопки возобновления игры
    this.unpauseDOM = document.createElement(this.params.selectors.unpause);
    this.controlDOM.appendChild(this.unpauseDOM);
    this.unpauseDOM.className = this.params.classes.unpause.common;
    this.unpauseDOM.innerText = this.params.texts.unpause;
    this.unpauseDOM.addEventListener('click', () => {
      this.unpause();
    });

    // DOM queue
    this.queueDOM = document.createElement(this.params.selectors.queue);
    this.containerDOM.appendChild(this.queueDOM);
    this.queueDOM.className = this.params.classes.queue.common;

    // флаг для ускорения фигуры
    this.boosting = false;

    // здесь будем хранить все строки игрового поля (в них все ячейки)
    this.rows = [];

    // храним очки пользователя
    this.score = 0;

    // подготавливаем очередь фигур
    this.figuresQueue = [];
    for (let i = 0; i < this.params.figuresInQueue; i++) {
      this.figuresQueue.push(new Figure(this));
    }

    // перерисовывам очередь
    this.processQueue();

    // флаг, который отображаем вызов метода start
    this.started = false;

    // здесь храним время последних действий частоту которых надо ограничить
    this.lastTickTime = 0;
    this.lastMovingTime = 0;
    this.lastRotatingTime = 0;
    this.lastBoostingTime = 0;

    // время фактической игры без пауз и простоев
    this.gameTime = 0;

    // общее время жизни тетриса
    this.liveTime = 0;

    // текущая фигура которой управляет игрок
    this.figure = new Figure(this);

    // флаги для отлова действий пользователя
    this.paused = false;
    this.moveRight = false;
    this.moveLeft = false;
    this.rotating = false;

    // флаг конца игры
    this.gameOver = false;


    for (let i = 0, l = this.params.rows; i < l; i++) {
      this.rows.push(new Row(this));
    }

    // ловим действия пользователя для работы с управлением фигуры пользователя
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === this.params.control.boost) { // это код кнопки «Вниз»
        this.boosting = false;
      }

      if (event.keyCode === this.params.control.moveRight) {
        this.moveRight = false;
      }

      if (event.keyCode === this.params.control.rotate) {
        this.rotating = false;
      }

      if (event.keyCode === this.params.control.moveLeft) {
        this.moveLeft = false;
      }
    }, false);

    // ловим действия пользователя для работы с управлением фигуры пользователя
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === this.params.control.boost) {
        this.boosting = true;
      }

      if (event.keyCode === this.params.control.moveRight) {
        this.moveRight = true;
      }

      if (event.keyCode === this.params.control.rotate) {
        this.rotating = true;
      }

      if (event.keyCode === this.params.control.moveLeft) {
        this.moveLeft = true;
      }
    }, false);
  }

  // метод, который надо вызвать после инициализации тетриса, чтобы игра началась
  start() {
    this.started = true;
    this.DOM.classList.add(this.params.classes.tetris.started);
    this.DOM.classList.add(this.params.classes.tetris.played);
    Tetris.addToTickCbs(this);
  }

  // снимает игру с паузы
  unpause() {
    if (!this.started) {
      return;
    }

    this.paused = false;
    this.DOM.classList.remove(this.params.classes.tetris.paused);
    this.DOM.classList.add(this.params.classes.tetris.played);
    Tetris.addToTickCbs(this);
  }

  // рисуем очередь
  processQueue() {
    this.queueDOM.innerHTML = '';
    for (let i = 0, l = this.figuresQueue.length; i < l; i++) {
      const figure = this.figuresQueue[i];
      const form = figure.form;
      const figureDOM = document.createElement(this.params.selectors.figure);
      this.queueDOM.appendChild(figureDOM);
      figureDOM.className = this.params.classes.figure.common;
      for (let ri = 0, rl = form.length; ri < rl; ri++) {
        const row = form[ri];
        const rowDOM = document.createElement(this.params.selectors.figureRow);
        figureDOM.appendChild(rowDOM);
        rowDOM.className = this.params.classes.figureRow.common;
        for (let ci = 0, cl = row.length; ci < cl; ci++) {
          const cell = row[ci];
          const cellDOM = document.createElement(this.params.selectors.figureCell);
          rowDOM.appendChild(cellDOM);
          cellDOM.classList.add(this.params.classes.figureCell.common);
          if (cell) {
            cellDOM.classList.add(this.params.classes.figureCell.filled);
          } else {
            cellDOM.classList.add(this.params.classes.figureCell.empty);
          }
          cellDOM.classList.add(`${this.params.classes.figureCell.color}-${figure.colorIndex}`);
        }
      }
    }
  }

  // ставит игру на паузу
  pause() {
    if (!this.started) {
      return;
    }

    this.paused = true;
    this.DOM.classList.add(this.params.classes.tetris.paused);
    this.DOM.classList.remove(this.params.classes.tetris.played);
    Tetris.removeFromTickCbs(this);
  }

  // ядро тетриса, перерисовывает поле, реагирует на действия пользователя
  tick(dt) {
    // считаем фактическое время жизни тетриса
    this.liveTime += dt;

    // ничего не делаем, если игра закончилась, на паузе или не начата
    if (this.gameOver || this.paused || !this.started) {
      return;
    }

    // считаем время игры без пауз
    this.gameTime += dt;

    // вспомогательные флаги для обработки действий пользователя
    //  даже если пользователь нажал кнопку или хочет сделать какое-либо действие
    //  мы должны его обработать только при определенном наборе условий, например, если выдержана определенная задержка между действиями
    let processMoving = false;
    let processRotating = false;
    let processBoosting = false;

    // обрабатываем действия на перемещение и вращение подконтрольной фигуры пользователя
    if (this.figure) {
      // пользователь нажал на вращение, то мы должны разрещать его только в n времени
      if (this.rotating && (this.gameTime - this.lastRotatingTime) >= this.params.rotatingDelay) {
        this.figure.rotate();
        processRotating = true;
      }

      // если пользователь нажал boost то мы должны разрешать его только в n времени
      if (this.boosting && (this.gameTime - this.lastBoostingTime) >= this.params.boostingDelay) {
        processBoosting = true;
      }

      // если пользователь нажал на перемещении то мы должны разрешать его только в n времнеи
      if ((this.gameTime - this.lastMovingTime) >= this.params.movingDelay) {
        if (this.moveLeft) {
          this.figure.move('left');
          processMoving = true;
        }
        if (this.moveRight) {
          this.figure.move('right');
          processMoving = true;
        }
      }
    }

    // трекаем время для реализации задержки перемещения
    if (processMoving) {
      this.lastMovingTime = this.gameTime;
    }

    // трекаем время для реализации задержки вращения
    if (processRotating) {
      this.lastRotatingTime = this.gameTime;
    }

    // запускаем отрисовку вращения и перемещения фигуры, но только если пользователь не жмёт в это время bost
    //  чтобы избежать двойной отрисовки
    if ((this.gameTime - this.lastTickTime) < this.params.tickDelay && !processBoosting) {
      if (processMoving || processRotating) {
        this.processRows();
      }
      return;
    }

    // трекаем время для реализации задержки boost
    if (processBoosting) {
      this.lastBoostingTime = this.gameTime;
    }

    // трекаем время для реализации глобальной задержки
    this.lastTickTime = this.gameTime;

    // если фигура с чем-то соприкоснулась, то мы добавляем её к независымым кирпичикам
    if (this.figure.touched()) {
      this.figure.toBricks();

      // проверяем заполненость линий
      this.checkFilledLines();

      // фигуре некуда двигаться дальше начала, игра закончилась
      if (this.figure.coords[this.figure.coords.length - 1].y === 0) {
        this.gameOver = true;
        Tetris.removeFromTickCbs(this);
        return;
      }

      // берём фигуру из очереди и закидываем новую фигуру в очередь
      // перерисовываем очередь
      this.figure = this.figuresQueue.shift();
      this.figuresQueue.push(new Figure(this));
      this.processQueue();
    } else { // иначе просто двигаем фигуру ниже
      this.figure.move('bottom');
    }

    // делаем отрисовку
    //  в целях экономии ресурсов нужно не делать отрисоку по глобальному таймеру и в момент вращения/перемещения фигур одновременно (двойная отрисовка)
    this.processRows();
  }

  // работаем со строками, в частности отрисовываем их
  processRows() {
    for (let i = 0, l = this.rows.length; i < l; i++) {
      this.rows[i].process(i);
    }
  }

  // проверяем заполненость линий
  checkFilledLines() {
    // за каждую линию даём 100 очков
    //  также за каждую линиую в подряд за раз увеличиваем множитель очков
    //  за одну линию множитель будет равен 0, поэтому 0 доп очков
    //  за 2 линии, будет равен 1, за 3 линии, будет равен 2
    //  например за 3 линии очки будут: 300 + 300 * 2
    let scope = 0;
    let multiply = -1;
    for (let i = 0, l = this.rows.length; i < l; i++) {
      const row = this.rows[i];
      let filledCount = 0;
      for (let n = 0, s = row.cells.length; n < s; n++) {
        const cell = row.cells[n];
        if (cell.filled) {
          filledCount++;
        }
      }

      if (filledCount === row.cells.length) {
        this.rows[i].recreate(i);
        scope += 100;
        multiply += 1;
      }
    }

    if (scope) {
      this.score = (this.score * 1) + scope + (scope * multiply);
      this.scoreDOM.innerText = this.score;
    }
  }
}

// браузер стремится запрашивать 60 кадров в секунду
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
                              || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let lastFrameTime;

// вызывает каждый тетрис на каждый адрес и передаём dt - задержку между кадрами (милесекунд)
function ticker() {
  lastFrameTime = lastFrameTime || Date.now();
  const nowTime = Date.now();
  const dt = nowTime - lastFrameTime;
  lastFrameTime = nowTime;
  Tetris.gameTime += dt;

  const keys = Object.keys(Tetris.tickCbsFor);
  for (let i = 0, l = keys.length; i < l; i++) {
    Tetris.tickCbsFor[keys[i]].tick(dt);
  }

  requestAnimationFrame(ticker);
}

requestAnimationFrame(ticker);

export default Tetris;
