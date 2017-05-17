import Tetris from './tetris';

const tetrises = [];

tetrises.push(
  new Tetris({
    rows: 30,
    cells: 15,
    tickDelay: 300,
    control: {
      moveLeft: 37,
      moveRight: 39,
      boost: 40,
      rotate: 38
    },
  }),
  new Tetris({
    rows: 30,
    cells: 15,
    tickDelay: 300,
    control: {
      moveLeft: 65,
      moveRight: 68,
      boost: 83,
      rotate: 87
    },
  })
);

// автоматически стартуем все тетрисы в одно время
setTimeout(() => {
  let i = tetrises.length;
  while (i--) {
    tetrises[i].start();
  }
}, 1000);
