/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _tetris = __webpack_require__(1);
	
	var _tetris2 = _interopRequireDefault(_tetris);
	
	__webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var tetrises = [];
	
	tetrises.push(new _tetris2.default({
	  rows: 30,
	  cells: 15,
	  tickDelay: 300,
	  control: {
	    moveLeft: 37,
	    moveRight: 39,
	    boost: 40,
	    rotate: 38
	  }
	}), new _tetris2.default({
	  rows: 30,
	  cells: 15,
	  tickDelay: 300,
	  control: {
	    moveLeft: 65,
	    moveRight: 68,
	    boost: 83,
	    rotate: 87
	  }
	}));
	
	// автоматически стартуем все тетрисы в одно время
	setTimeout(function () {
	  var i = tetrises.length;
	  while (i--) {
	    tetrises[i].start();
	  }
	}, 1000);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _row = __webpack_require__(2);
	
	var _row2 = _interopRequireDefault(_row);
	
	var _figure = __webpack_require__(4);
	
	var _figure2 = _interopRequireDefault(_figure);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tetris = function () {
	  _createClass(Tetris, null, [{
	    key: 'cloneDeep',
	    value: function cloneDeep(objectToBeCloned) {
	      if (!(objectToBeCloned instanceof Object)) {
	        return objectToBeCloned;
	      }
	
	      // создаём объект на основе констркуктора, это может быть Array или Object
	      var objectClone = new objectToBeCloned.constructor();
	
	      var keys = Object.keys(objectToBeCloned);
	      for (var i = 0, l = keys.length; i < l; i++) {
	        var prop = keys[i];
	        objectClone[prop] = Tetris.cloneDeep(objectToBeCloned[prop]);
	      }
	
	      return objectClone;
	    }
	  }, {
	    key: 'removeFromTickCbs',
	    value: function removeFromTickCbs(tetris) {
	      delete Tetris.tickCbsFor[tetris.index];
	    }
	  }, {
	    key: 'addToTickCbs',
	    value: function addToTickCbs(tetris) {
	      Tetris.tickCbsFor[tetris.index] = tetris;
	    }
	
	    // overwrite - перезаписывать свойство если оно есть, или оставить исходным
	
	  }, {
	    key: 'assignDeep',
	    value: function assignDeep(objectToAssign, objectToBeAssigned, overwrite) {
	      overwrite = overwrite || false;
	      if (!(objectToAssign instanceof Object) || !(objectToBeAssigned instanceof Object)) {
	        return;
	      }
	
	      var keys = Object.keys(objectToBeAssigned);
	      for (var i = 0, l = keys.length; i < l; i++) {
	        var prop = keys[i];
	
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
	  }]);
	
	  function Tetris(params) {
	    var _this = this;
	
	    _classCallCheck(this, Tetris);
	
	    // для генерации имени пользователя
	    this.index = ++Tetris.counter;
	
	    // делаем параметры на основе дефолтных
	    params = params || {};
	    this.params = Tetris.cloneDeep(params);
	    Tetris.assignDeep(this.params, Tetris.defaultParams);
	
	    // берём имя из параметров или генерируем на основе индекса
	    if (!this.params.playerName) {
	      this.params.playerName = 'Player ' + this.index;
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
	    this.pauseDOM.addEventListener('click', function () {
	      _this.pause();
	    });
	
	    // DOM кнопки старта
	    this.startDOM = document.createElement(this.params.selectors.start);
	    this.controlDOM.appendChild(this.startDOM);
	    this.startDOM.className = this.params.classes.start.common;
	    this.startDOM.innerText = this.params.texts.start;
	    this.startDOM.addEventListener('click', function () {
	      _this.start();
	    });
	
	    // DOM кнопки возобновления игры
	    this.unpauseDOM = document.createElement(this.params.selectors.unpause);
	    this.controlDOM.appendChild(this.unpauseDOM);
	    this.unpauseDOM.className = this.params.classes.unpause.common;
	    this.unpauseDOM.innerText = this.params.texts.unpause;
	    this.unpauseDOM.addEventListener('click', function () {
	      _this.unpause();
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
	    for (var i = 0; i < this.params.figuresInQueue; i++) {
	      this.figuresQueue.push(new _figure2.default(this));
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
	    this.figure = new _figure2.default(this);
	
	    // флаги для отлова действий пользователя
	    this.paused = false;
	    this.moveRight = false;
	    this.moveLeft = false;
	    this.rotating = false;
	
	    // флаг конца игры
	    this.gameOver = false;
	
	    for (var _i = 0, l = this.params.rows; _i < l; _i++) {
	      this.rows.push(new _row2.default(this));
	    }
	
	    // ловим действия пользователя для работы с управлением фигуры пользователя
	    document.addEventListener('keyup', function (event) {
	      if (event.keyCode === _this.params.control.boost) {
	        // это код кнопки «Вниз»
	        _this.boosting = false;
	      }
	
	      if (event.keyCode === _this.params.control.moveRight) {
	        _this.moveRight = false;
	      }
	
	      if (event.keyCode === _this.params.control.rotate) {
	        _this.rotating = false;
	      }
	
	      if (event.keyCode === _this.params.control.moveLeft) {
	        _this.moveLeft = false;
	      }
	    }, false);
	
	    // ловим действия пользователя для работы с управлением фигуры пользователя
	    document.addEventListener('keydown', function (event) {
	      if (event.keyCode === _this.params.control.boost) {
	        _this.boosting = true;
	      }
	
	      if (event.keyCode === _this.params.control.moveRight) {
	        _this.moveRight = true;
	      }
	
	      if (event.keyCode === _this.params.control.rotate) {
	        _this.rotating = true;
	      }
	
	      if (event.keyCode === _this.params.control.moveLeft) {
	        _this.moveLeft = true;
	      }
	    }, false);
	  }
	
	  // метод, который надо вызвать после инициализации тетриса, чтобы игра началась
	
	
	  _createClass(Tetris, [{
	    key: 'start',
	    value: function start() {
	      this.started = true;
	      this.DOM.classList.add(this.params.classes.tetris.started);
	      this.DOM.classList.add(this.params.classes.tetris.played);
	      Tetris.addToTickCbs(this);
	    }
	
	    // снимает игру с паузы
	
	  }, {
	    key: 'unpause',
	    value: function unpause() {
	      if (!this.started) {
	        return;
	      }
	
	      this.paused = false;
	      this.DOM.classList.remove(this.params.classes.tetris.paused);
	      this.DOM.classList.add(this.params.classes.tetris.played);
	      Tetris.addToTickCbs(this);
	    }
	
	    // рисуем очередь
	
	  }, {
	    key: 'processQueue',
	    value: function processQueue() {
	      this.queueDOM.innerHTML = '';
	      for (var i = 0, l = this.figuresQueue.length; i < l; i++) {
	        var figure = this.figuresQueue[i];
	        var form = figure.form;
	        var figureDOM = document.createElement(this.params.selectors.figure);
	        this.queueDOM.appendChild(figureDOM);
	        figureDOM.className = this.params.classes.figure.common;
	        for (var ri = 0, rl = form.length; ri < rl; ri++) {
	          var row = form[ri];
	          var rowDOM = document.createElement(this.params.selectors.figureRow);
	          figureDOM.appendChild(rowDOM);
	          rowDOM.className = this.params.classes.figureRow.common;
	          for (var ci = 0, cl = row.length; ci < cl; ci++) {
	            var cell = row[ci];
	            var cellDOM = document.createElement(this.params.selectors.figureCell);
	            rowDOM.appendChild(cellDOM);
	            cellDOM.classList.add(this.params.classes.figureCell.common);
	            if (cell) {
	              cellDOM.classList.add(this.params.classes.figureCell.filled);
	            } else {
	              cellDOM.classList.add(this.params.classes.figureCell.empty);
	            }
	            cellDOM.classList.add(this.params.classes.figureCell.color + '-' + figure.colorIndex);
	          }
	        }
	      }
	    }
	
	    // ставит игру на паузу
	
	  }, {
	    key: 'pause',
	    value: function pause() {
	      if (!this.started) {
	        return;
	      }
	
	      this.paused = true;
	      this.DOM.classList.add(this.params.classes.tetris.paused);
	      this.DOM.classList.remove(this.params.classes.tetris.played);
	      Tetris.removeFromTickCbs(this);
	    }
	
	    // ядро тетриса, перерисовывает поле, реагирует на действия пользователя
	
	  }, {
	    key: 'tick',
	    value: function tick(dt) {
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
	      var processMoving = false;
	      var processRotating = false;
	      var processBoosting = false;
	
	      // обрабатываем действия на перемещение и вращение подконтрольной фигуры пользователя
	      if (this.figure) {
	        // пользователь нажал на вращение, то мы должны разрещать его только в n времени
	        if (this.rotating && this.gameTime - this.lastRotatingTime >= this.params.rotatingDelay) {
	          this.figure.rotate();
	          processRotating = true;
	        }
	
	        // если пользователь нажал boost то мы должны разрешать его только в n времени
	        if (this.boosting && this.gameTime - this.lastBoostingTime >= this.params.boostingDelay) {
	          processBoosting = true;
	        }
	
	        // если пользователь нажал на перемещении то мы должны разрешать его только в n времнеи
	        if (this.gameTime - this.lastMovingTime >= this.params.movingDelay) {
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
	      if (this.gameTime - this.lastTickTime < this.params.tickDelay && !processBoosting) {
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
	        var canMove = true;
	        for (var i = 0, l = this.figure.coords.length; i < l; i++) {
	          var coord = this.figure.coords[i];
	          if (coord.y === 0 && this.rows[coord.y].cells[coord.x].filled) {
	            canMove = false;
	            break;
	          }
	        }
	        if (!canMove) {
	          this.gameOver = true;
	          Tetris.removeFromTickCbs(this);
	          return;
	        }
	
	        // берём фигуру из очереди и закидываем новую фигуру в очередь
	        // перерисовываем очередь
	        this.figure = this.figuresQueue.shift();
	        this.figuresQueue.push(new _figure2.default(this));
	        this.processQueue();
	      } else {
	        // иначе просто двигаем фигуру ниже
	        this.figure.move('bottom');
	      }
	
	      // делаем отрисовку
	      //  в целях экономии ресурсов нужно не делать отрисоку по глобальному таймеру и в момент вращения/перемещения фигур одновременно (двойная отрисовка)
	      this.processRows();
	    }
	
	    // работаем со строками, в частности отрисовываем их
	
	  }, {
	    key: 'processRows',
	    value: function processRows() {
	      for (var i = 0, l = this.rows.length; i < l; i++) {
	        this.rows[i].process(i);
	      }
	    }
	
	    // проверяем заполненость линий
	
	  }, {
	    key: 'checkFilledLines',
	    value: function checkFilledLines() {
	      // за каждую линию даём 100 очков
	      //  также за каждую линиую в подряд за раз увеличиваем множитель очков
	      //  за одну линию множитель будет равен 0, поэтому 0 доп очков
	      //  за 2 линии, будет равен 1, за 3 линии, будет равен 2
	      //  например за 3 линии очки будут: 300 + 300 * 2
	      var scope = 0;
	      var multiply = -1;
	      for (var i = 0, l = this.rows.length; i < l; i++) {
	        var row = this.rows[i];
	        var filledCount = 0;
	        for (var n = 0, s = row.cells.length; n < s; n++) {
	          var cell = row.cells[n];
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
	        this.score = this.score * 1 + scope + scope * multiply;
	        this.scoreDOM.innerText = this.score;
	      }
	    }
	  }]);
	
	  return Tetris;
	}();
	
	// браузер стремится запрашивать 60 кадров в секунду
	
	
	Tetris.tickCbsFor = {};
	Tetris.counter = 0;
	Tetris.defaultParams = {
	  rows: 25,
	  cells: 11,
	  tickDelay: 800,
	  movingDelay: 180,
	  rotatingDelay: 180,
	  boostingDelay: 30,
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
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	var lastFrameTime = void 0;
	
	// вызывает каждый тетрис на каждый адрес и передаём dt - задержку между кадрами (милесекунд)
	function ticker() {
	  lastFrameTime = lastFrameTime || Date.now();
	  var nowTime = Date.now();
	  var dt = nowTime - lastFrameTime;
	  lastFrameTime = nowTime;
	  Tetris.gameTime += dt;
	
	  var keys = Object.keys(Tetris.tickCbsFor);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    Tetris.tickCbsFor[keys[i]].tick(dt);
	  }
	
	  requestAnimationFrame(ticker);
	}
	
	requestAnimationFrame(ticker);
	
	exports.default = Tetris;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _cell = __webpack_require__(3);
	
	var _cell2 = _interopRequireDefault(_cell);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Row = function () {
	  function Row(tetris, addTo) {
	    _classCallCheck(this, Row);
	
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
	
	    for (var i = 0, l = this.tetris.params.cells; i < l; i++) {
	      this.cells.push(new _cell2.default(this));
	    }
	  }
	
	  _createClass(Row, [{
	    key: 'process',
	    value: function process(rowIndex) {
	      for (var i = 0, l = this.cells.length; i < l; i++) {
	        this.cells[i].process(rowIndex, i);
	      }
	    }
	  }, {
	    key: 'recreate',
	    value: function recreate(rowIndex) {
	      this.tetris.fieldDOM.removeChild(this.DOM);
	      this.tetris.rows.splice(rowIndex, 1);
	      this.tetris.rows.unshift(new Row(this.tetris, 'top'));
	    }
	  }]);
	
	  return Row;
	}();
	
	exports.default = Row;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cell = function () {
	  function Cell(row) {
	    _classCallCheck(this, Cell);
	
	    this.row = row;
	    this.tetris = this.row.tetris;
	    this.DOM = document.createElement(this.tetris.params.selectors.cell);
	    this.row.DOM.appendChild(this.DOM);
	    this.DOM.className = this.tetris.params.classes.cell.common;
	    this.filled = false;
	    this.colored = false;
	  }
	
	  _createClass(Cell, [{
	    key: 'process',
	    value: function process(rowIndex, cellIndex) {
	      var needleFilled = false;
	      var needleHighlighted = false;
	      var colorIndex = void 0;
	
	      if (this.tetris.figure) {
	        for (var i = 0, l = this.tetris.figure.coords.length; i < l; i++) {
	          var coord = this.tetris.figure.coords[i];
	
	          if (coord.x === cellIndex) {
	            needleHighlighted = true;
	          }
	
	          if (coord.x === cellIndex && coord.y === rowIndex) {
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
	        this.DOM.classList.add(this.tetris.params.classes.cell.colored + '-' + colorIndex);
	        this.colored = true;
	      } else if (this.colored) {
	        this.colored = false;
	        this.DOM.className = this.DOM.className.replace(new RegExp('(' + this.tetris.params.classes.cell.colored + '-\\d)*', 'ig'), '');
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
	  }]);
	
	  return Cell;
	}();
	
	exports.default = Cell;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _tetris = __webpack_require__(1);
	
	var _tetris2 = _interopRequireDefault(_tetris);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Figure = function () {
	  _createClass(Figure, null, [{
	    key: 'mathRotate',
	    value: function mathRotate(baseCoord, rotateCoords) {
	      for (var i = 0, l = rotateCoords.length; i < l; i++) {
	        var coord = rotateCoords[i];
	        var relativeFromBase = {
	          x: coord.x - baseCoord.x,
	          y: coord.y - baseCoord.y
	        };
	
	        var transormed = {
	          x: -1 * relativeFromBase.y,
	          y: 1 * relativeFromBase.x
	        };
	
	        coord.x = baseCoord.x + transormed.x;
	        coord.y = baseCoord.y + transormed.y;
	      }
	    }
	  }, {
	    key: 'mathMove',
	    value: function mathMove(direction, coords) {
	      switch (direction) {
	        case 'left':
	          for (var i = 0, l = coords.length; i < l; i++) {
	            var coord = coords[i];
	            coord.x--;
	          }
	          break;
	
	        case 'right':
	          for (var _i = 0, _l = coords.length; _i < _l; _i++) {
	            var _coord = coords[_i];
	            _coord.x++;
	          }
	          break;
	
	        case 'bottom':
	          for (var _i2 = 0, _l2 = coords.length; _i2 < _l2; _i2++) {
	            var _coord2 = coords[_i2];
	            _coord2.y++;
	          }
	          break;
	        default:
	          break;
	      }
	    }
	  }]);
	
	  function Figure(tetris) {
	    _classCallCheck(this, Figure);
	
	    this.colorIndex = Math.floor(Math.random() * 4) + 1;
	    this.tetris = tetris;
	    this.form = _tetris2.default.cloneDeep(Figure.forms[Math.floor(Math.random() * Figure.forms.length)]);
	    this.desc = this.form.pop();
	
	    if (this.desc.rotatable) {
	      this.rotateCoords = [];
	    }
	
	    this.coords = [];
	    for (var i = 0, l = this.form.length; i < l; i++) {
	      var row = this.form[i];
	      var x = 0;
	      for (var n = 0, s = row.length; n < s; n++) {
	        if (row[n]) {
	          var coord = {
	            x: x,
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
	      var rotateCount = Math.floor(Math.random() * 4);
	      // максимум вращаем 3 раза
	      while (rotateCount--) {
	        Figure.mathRotate(this.baseCoord, this.rotateCoords);
	      }
	    }
	
	    var maxX = void 0;
	    var minX = void 0;
	    var maxY = void 0;
	    var minY = void 0;
	    var minCoord = void 0;
	    for (var _i3 = 0, _l3 = this.coords.length; _i3 < _l3; _i3++) {
	      var _coord3 = this.coords[_i3];
	
	      if (maxX === undefined) {
	        maxX = _coord3.x;
	      }
	      if (minX === undefined) {
	        minX = _coord3.x;
	      }
	
	      if (maxY === undefined) {
	        maxY = _coord3.y;
	      }
	      if (minY === undefined) {
	        minY = _coord3.y;
	      }
	
	      if (minCoord === undefined) {
	        minCoord = _coord3;
	      }
	
	      if (_coord3.x > maxX) {
	        maxX = _coord3.x;
	      }
	      if (_coord3.x < minX) {
	        minX = _coord3.x;
	      }
	
	      if (_coord3.y > maxY) {
	        maxY = _coord3.y;
	      }
	      if (_coord3.y < minY) {
	        minY = _coord3.y;
	      }
	    }
	    var width = maxX - minX + 1;
	    var height = maxY - minY + 1;
	
	    var startX = Math.floor((tetris.params.cells - width) / 2);
	    var startY = -1 * height;
	    var offsetX = startX - minX;
	    var offsetY = startY - minY;
	
	    for (var _i4 = 0, _l4 = this.coords.length; _i4 < _l4; _i4++) {
	      var _coord4 = this.coords[_i4];
	
	      _coord4.x += offsetX;
	      _coord4.y += offsetY;
	    }
	  }
	
	  _createClass(Figure, [{
	    key: 'touched',
	    value: function touched() {
	      for (var i = 0, l = this.coords.length; i < l; i++) {
	        var coord = this.coords[i];
	
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
	  }, {
	    key: 'toBricks',
	    value: function toBricks() {
	      for (var i = 0, l = this.coords.length; i < l; i++) {
	        var coord = this.coords[i];
	        if (coord.y >= 0) {
	          this.tetris.rows[coord.y].cells[coord.x].filled = true;
	          this.tetris.rows[coord.y].cells[coord.x].colorIndex = this.colorIndex;
	        }
	      }
	    }
	  }, {
	    key: 'rotate',
	    value: function rotate() {
	      if (!this.desc.rotatable) {
	        return;
	      }
	
	      var pristineCoords = _tetris2.default.cloneDeep(this.coords);
	      Figure.mathRotate(this.baseCoord, this.rotateCoords);
	
	      for (var i = 0, l = this.coords.length; i < l; i++) {
	        var coord = this.coords[i];
	
	        if (coord.x < 0) {
	          Figure.mathMove('right', this.coords);
	        } else if (coord.x > this.tetris.params.cells - 1) {
	          Figure.mathMove('left', this.coords);
	        }
	
	        var row = this.tetris.rows[coord.y];
	        if (row) {
	          var cell = row.cells[coord.x];
	          var rowAbove = this.tetris.rows[coord.y - 1];
	          var cellAbove = void 0;
	          if (rowAbove) {
	            cellAbove = rowAbove.cells[coord.x];
	          }
	
	          if (cell && cell.filled || cellAbove && cellAbove.filled) {
	            if (this.baseCoord.x < coord.x) {
	              Figure.mathMove('left', this.coords);
	            } else if (this.baseCoord.x > coord.x) {
	              Figure.mathMove('right', this.coords);
	            }
	          }
	        }
	      }
	
	      for (var _i5 = 0, _l5 = this.coords.length; _i5 < _l5; _i5++) {
	        var _coord5 = this.coords[_i5];
	
	        if (_coord5.y >= 0) {
	          var _row = this.tetris.rows[_coord5.y];
	          if (!_row) {
	            _tetris2.default.assignDeep(this.coords, pristineCoords, true);
	            return;
	          }
	
	          var _cell = _row.cells[_coord5.x];
	          if (!_cell || _cell.filled) {
	            _tetris2.default.assignDeep(this.coords, pristineCoords, true);
	            return;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'move',
	    value: function move(direction) {
	      var canMove = void 0;
	
	      switch (direction) {
	        case 'left':
	          canMove = true;
	          for (var i = 0, l = this.coords.length; i < l; i++) {
	            var coord = this.coords[i];
	
	            if (coord.x - 1 < 0) {
	              canMove = false;
	              break;
	            }
	
	            if (this.tetris.rows[coord.y] && this.tetris.rows[coord.y].cells[coord.x - 1] && this.tetris.rows[coord.y].cells[coord.x - 1].filled) {
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
	          for (var _i6 = 0, _l6 = this.coords.length; _i6 < _l6; _i6++) {
	            var _coord6 = this.coords[_i6];
	
	            if (_coord6.x + 2 > this.tetris.params.cells) {
	              canMove = false;
	              break;
	            }
	
	            if (this.tetris.rows[_coord6.y] && this.tetris.rows[_coord6.y].cells[_coord6.x + 1] && this.tetris.rows[_coord6.y].cells[_coord6.x + 1].filled) {
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
	  }]);
	
	  return Figure;
	}();
	
	Figure.forms = [[[1, 1], [0, 1, 1], {
	  rotatable: true,
	  base: [0, 1]
	}], [[1], [1], [1], [1], {
	  rotatable: true,
	  base: [1, 0]
	}], [[1, 0, 1], [1, 1, 1], {
	  rotatable: true,
	  base: [1, 1]
	}], [[0, 1, 0], [1, 1, 1], {
	  rotatable: true,
	  base: [1, 1]
	}], [[0, 1, 1], [1, 1], {
	  rotatable: true,
	  base: [0, 1]
	}], [[1, 1], [1], [1], {
	  rotatable: true,
	  base: [0, 0]
	}], [[1, 1], [1, 1], {
	  rotatable: false
	}], [[1, 1], [0, 1], [0, 1], {
	  rotatable: true,
	  base: [0, 1]
	}], [[1], [1, 1], {
	  rotatable: true,
	  base: [1, 0]
	}], [[0, 1], [1, 1], {
	  rotatable: true,
	  base: [1, 1]
	}], [[1], {
	  rotatable: false
	}], [[0, 1, 0], [1, 1, 1], [0, 1, 0], {
	  rotatable: false
	}], [[1, 1], {
	  rotatable: true,
	  base: [0, 0]
	}]];
	exports.default = Figure;

/***/ },
/* 5 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map