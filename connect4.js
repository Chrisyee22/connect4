class Connect4{
  constructor(selector){
    this.ROWS = 6;
    this.COLS = 7;
    this.player = 'purple';
    this.player = 'green';
    this.selector = selector;
    this.isGameOver = false;
    this.createBoard();
    this.setupEventListeners();
  }

  createBoard(){
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    this.player = 'purple';
    for(let row = 0; row < this.ROWS; row ++){
      const $row = $('<div>')
        .addClass('row');
      for (let col = 0; col < this.COLS; col++) {
        const $col = $('<div>')
          .addClass('col empty')
          .attr('data-col', col)
          .attr('data-row', row);
        $row.append($col);
      }
      $board.append($row);
    }
  }

  setupEventListeners(){
    const $board = $(this.selector);
    const that = this;

    function findLastEmptyCell(col){
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length -1; i >= 0; i--){
        const $cell = $(cells[i]);
        if ($cell.hasClass('empty')){
          return $cell;
        }
      }
      return null;
    }

    $board.on('mouseenter', '.col.empty', function(){
      if(that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });

    $board.on('mouseleave','.col', function(){
      $('.col').removeClass(`next-${that.player}`);
    });

    $board.on('click', '.col.empty', function(){
      if(that.isGameOver) return;
      const col = $(this).data('col');
      const row = $(this).data('row');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.removeClass(`empty next-${that.player}`);
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data('player', that.player);

      const winner = that.checkForWinner($lastEmptyCell.data('row'),
        $lastEmptyCell.data('col'))
      if(winner){
        that.isGameOver = true;
        alert(`Game Over! Player ${that.player} has won!`);
        $('.col.empty').removeClass('empty');
        return;
      }

      that.player = (that.player === 'purple') ? 'green' : 'purple';
      $(this).trigger('mouseenter');

    });
  }

  checkForWinner(row, col){
    const that = this;

    function $getSlot(i, j){
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction){
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
      let $next = $getSlot(i, j);
      while (i >= 0 &&
      i < that.ROWS &&
      j >= 0 &&
      j < that.COLS &&
      $next.data('player') === that.player){
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getSlot(i, j);
      }
      return total;
    }

    function checkWin(a, b){
      const total = 1 +
      checkDirection(a) +
      checkDirection(b);
      if (total >= 4){
        return that.player;
      } else {
        return null;
      }
    }

    function checkVerticals(){
      return checkWin({i: -1, j: 0}, {i: 1, j: 0});
    }

    function checkHorizontals(){
      return checkWin({i: 0, j: -1}, { i: 0, j: 1});
    }
    function checkDiagonal1(){
      return checkWin({i: 1, j: -1}, { i: 1, j: 1});
    }

    function checkDiagonal2(){
      return checkWin({i: 1, j: 1}, { i: -1, j: -1});
    }
    return checkVerticals()|| checkHorizontals() || checkDiagonal1() || checkDiagonal2()
  }

  restart() {
    this.createBoard();
  }
}
