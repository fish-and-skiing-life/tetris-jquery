$(document).ready(function(){
  window.Game = window.Game || {};
  // 定数定義teigi
  Game.row= 20;
  Game.column = 10;
  Game.LEFT = "Left";
  Game.RIGHT = "Right";
  Game.UP = "Up";
  Game.DOWN = "Down";
  Game.EMPTY = 0;
  Game.FULL = 1;
  Game.next =0; // 次のブロックのIDの格納変数
  Game.startPointColumn = 3; // スタート位置のx座標
  Game.StartPointRow = 0;  // スタート位置のy座標

  // shape_numberからblockの形を取得し返す関数
  var getShape = function(shape_number){
    var block
    switch(Game.next){
      case 0:
        block = getShape1();
      break;
      case 1:
        block = getShape2();
      break;
      case 2:
        block = getShape3();
      break;
      case 3:
        block = getShape4();
      break;
      case 4:
        block = getShape5();
      break;
      case 5:
        block = getShape6();
      break;
      default:
        block = getShape7();
    }
    return block
  }

  var getShape1 = function(){
    var blockCells =[
                  [1,1,1],
                  [0,1,0],
                  [0,0,0], 
                ];
    return blockCells;
  };
  var getShape2 = function(){
    var blockCells =[
                  [1,1,1],
                  [0,0,0],
                  [0,0,0],               
                ];
    return blockCells;
  };
  var getShape3 = function(){
    var blockCells =[
                  [1,1,0],
                  [1,1,0],
                  [0,0,0],
                ];
                
    return blockCells;
  };
  var getShape4 = function(){
    var blockCells =[
                  [1,0,0],
                  [1,1,0],
                  [0,1,0], 
                ];
    return blockCells;
  };
  var getShape5 = function(){
    var blockCells =[
                  [1,0,0],
                  [1,0,0],
                  [1,1,0], 
                ];
    return blockCells;
  };
  var getShape6 = function(){
    var blockCells =[
                  [0,0,1],
                  [0,0,1],
                  [0,1,1],
                ];
    return blockCells;
  };
  var getShape7 = function(){
    var blockCells =[
                  [0,1,0],
                  [1,1,0],
                  [1,0,0],
                ];
    return blockCells;
  };

  // テトリスの描写管理kannri
  // 行列の番号をid(ex: r1c1)に格納kakunou
  Game.drawGameMap=function(){
    var html ="";
    for(var i=0;i<Game.row;i++){
      html+="<tr>";
      for(var j=0;j<Game.column;j++){
        html+="<td id='r"+i+"c"+j+"' class='cell'></td>";
      }
      html+="</tr>";
    }
    $("#gameMap").html(html);
    
    // プレビュー画面
    html="";
    for(var i=0;i<3;i++){
      html+="<tr>";
      for(var j=0;j<3;j++){
        html+="<td id='pr"+i+"pc"+j+"' class='cell'></td>";
      }
      html+="</tr>";
    }
    $("#gamePreviewMap").html(html);
  }
  
  Game.Board = function(){
    // ボードの行列を作成し、全てのセルに0を入力
    this.cells =[];
    for(var row=0;row< Game.row;row++){
      var rowObject =[];
      for(var column=0; column< Game.column;column++){
        rowObject[column ] = Game.EMPTY;
      }
      this.cells[row] = rowObject;
    }

    // ゲーム画面を空にする
    this.clearGameBoard = function(){
      for(var row=0;row< Game.row;row++){
        for(var column=0; column< Game.column;column++){
          $("#r"+row+"c"+column).removeClass("cell");
          $("#r"+row+"c"+column).removeClass("block");
          $("#r"+row+"c"+column).removeClass("animate");
        }  
      }
    };

    // 揃った行に色をつける処理
    this.animateRow = function(row){
      for(var column=0; column< Game.column;column++){
        $("#r"+row+"c"+column).addClass("animate");
      }
    };


    // 一行揃ったときの処理
    // 一度描写を消したのちに描写をし直し 
    this.drawGameBoard = function (){
      this.clearGameBoard();
      for(var row=0;row< Game.row;row++){
        for(var column=0; column< Game.column;column++){
          var className;
          className = (this.cells[row][column] == Game.EMPTY)? 'cell': 'block'
          $("#r"+row+"c"+column).addClass(className);
        }
      }
    };
  };

  Game.gameBoard  = new Game.Board();

  // ブロック情報の宣言
  Game.Block=function(){
    this.currentRow = Game.StartPointRow 
    this.currentColumn = Game.startPointColumn
    this.blockCells =[];
    
    // 画面表示時に呼ばれる関数
    this.init=function(){
      for(var row=0;row< 3;row++){
        var rowObject =[];
        
        for(var column=0; column< 3;column++){
          rowObject[column ] = 0 ;
        }
        this.blockCells[row] = rowObject;
      }
      this.createARadomBlock();
      this.drawBlock();
    };

    // nextにある、ブロックをblockCellsに格納し、nextにランダムでブロックを生成し格納、プレビューに表示する
    this.createARadomBlock = function(){
      var random = parseInt(Math.random() * 7);
      this.blockCells = getShape(Game.next)
      Game.next = random;
      this.showPreview();
    };

    // 次のブロックの描写
    this.showPreview = function(){
      var blockCells;
      blockCells = getShape(Game.next)
      for(var r = 0;r< 3; r++){
        for(var c=0;c< 3; c++){           
          if(blockCells[r][c]==1){
            $("#pr"+r+"pc"+c).addClass("block");
          }
          else{
            $("#pr"+r+"pc"+c).removeClass("block");
          }
        }
      }
    };  

    this.rotateBlock = function(){
      // 3*3の行列の作成
      var newBlock = [];
      for(var r = 0; r < 3 ;r++){
        newBlock[r] = [];
        for(var c =0; c< 3;c++){
          newBlock[r][c] = 0;
        }
      }

      // ブロックを回転させる
      for(var r = 0; r < 3 ;r++){
        for(var c =0; c< 3;c++){
          newBlock[c][r] = this.blockCells[r][2-c];
        }
      }
      return newBlock
    };    
    
    this.isOrigin = function(){
        return (this.currentRow == 0 && this.currentColumn == 3? true : false)        
    };

    // ブロックをbordに描写する関数 
    this.drawBlock = function(){
      for(var r = 0;r< 3; r++){
        for(var c=0;c< 3; c++){           
          if(this.blockCells[r][c]==1){
            var y = this.currentRow + r;
            var x = this.currentColumn + c;
            $("#r"+y+"c"+x).addClass("block");
          }
        }
      }
    };

    this.isSafeToRotate = function(){
      var newBlock = this.rotateBlock()
      var ok = true;

      // boardに回転させたブロック情報を格納
      for(var r = 0; r < 3 ;r++){
        for(var c =0; c< 3;c++){
          if( newBlock[r][c] == Game.FULL){
            var y = this.currentRow + r;
            var x = this.currentColumn + c;
            
            if (Game.gameBoard.cells[ y ] [ x] != Game.EMPTY ){
              return false;
            }
          }
        }
      }
      return ok;
    };

    this.rotate = function(){ 
      if(!this.isSafeToRotate()){
        return
      };

      this.clearOldDrawing();
      this.blockCells = this.rotateBlock()
      this.drawBlock();
    };

    // 変更前のブロック情報を削除する
    this.clearOldDrawing = function(){
      for(var r = 0;r< 3; r++){
        for(var c=0;c< 3; c++){           
          if(this.blockCells[r][c]==1){
            var y = this.currentRow + r;
            var x = this.currentColumn + c;
            $("#r"+y+"c"+x).removeClass("block");
          }
        }
      }
    };

    // blockCellsのデータをgameBOardに反映させる
    this.storeGameBoardData = function(){
      for(var r = 0; r < 3 ;r++){
        for(var c =0; c< 3;c++){
          var y = this.currentRow + r  ;
          var x = this.currentColumn + c;
          if( this.blockCells[r][c] == Game.FULL)
          {
            Game.gameBoard.cells[y][x] = Game.FULL;
          }
        }
      }
    };

    this.processGameRow = function(){
      var rowIndexToRemove= [];
      // テトリスの下の行から実行していく
      for(var last = Game.row-1 ; last >=0; last--){
        var ok  = true;
        // 行が揃っているかの判定。揃ってたら ok をtrueにする
        for(var col =0 ;col < Game.column ;col++){
          ok = ok && Game.gameBoard.cells[last][col] == Game.FULL;
        }

        // 揃った行番号の追加       
        if (ok){ 
          rowIndexToRemove.unshift(last);
        }
      }

      // ブロックを下に移動させる処理
      for(var lastIndex = 0 ; lastIndex < rowIndexToRemove.length;  lastIndex ++){
        var rowIndex = rowIndexToRemove[ lastIndex ];
        var animateRow = rowIndex;

        for(var c =0; c < Game.column; c++){
          Game.gameBoard.cells[rowIndex][c] = Game.gameBoard.cells[rowIndex-1][c];
        }

        rowIndex --;
        while(rowIndex > 0 ){
          for(var c =0; c < Game.column; c++){
            Game.gameBoard.cells[rowIndex][c] = Game.gameBoard.cells[rowIndex-1][c];
            
          }
          rowIndex --;
        }


        for(var col =0; col < Game.column; col++){
          //Add the empty row at top
          Game.gameBoard.cells[0][col] = Game.EMPTY;
        }
        Game.gameBoard.animateRow(animateRow);
        setTimeout(function(){
          Game.gameBoard.drawGameBoard();
        },100);
        Game.score += 1000;
      }
      
      Game.displayScore();
    };  
    
    this.isSafeToMoveDown = function(){
      var ok = true;
      
      for(var r = 0; r < 3 ;r++){
        for(var c =0; c< 3;c++){          
          if( this.blockCells[r][c] == Game.FULL){
            var y = this.currentRow + r +1 ;
            var x = this.currentColumn + c;
            // 最後の行かの判定
            if(y >= Game.row  ){
              return false;
            }
            if (Game.gameBoard.cells[ y ] [ x] != Game.EMPTY ){
              return false;
            }
          }
        }
      }
      return ok;
    };

    this.isSafeToMoveLeft = function(){
      var ok = true;
      for(var r = 0; r < 3 ;r++){
        for(var c =0; c< 3;c++){
          var y = this.currentRow + r  ;
          var x = this.currentColumn + c -1;
          if( this.blockCells[r][c] == Game.FULL){
            if(x < 0){
                return false;
            }
            if (Game.gameBoard.cells[y][x] != Game.EMPTY ){
              return false;
            }
          }
        }
      }
      return ok;
    };  
    
    this.isSafeToMoveRight = function(){
      var ok = true;
      for(var r = 0; r < 3 ;r++){
        for(var c =0; c< 3;c++){
          var y = this.currentRow + r  ;
          var x = this.currentColumn + c +1;
          if( this.blockCells[r][c] == Game.FULL){
            if(this.x + 2 >= Game.column){
              return false;
            }
            if (Game.gameBoard.cells[ y ] [ x] != Game.EMPTY ){
              return false;
            }
          }
        }
      }
      return ok;
    };

    // ブロックの落下処理。もし下まで行っていたら新しいブロックを出現させる
    this.moveDown = function(){
      if (this.isSafeToMoveDown()){
        this.clearOldDrawing();
        this.currentRow ++;
        this.drawBlock();
      }
      
      // 新しいブロックの描写
      else  {
        this.storeGameBoardData();
        this.processGameRow();
        Game.current  = new Game.Block ();
        Game.current.init();
      }
    };

    this.moveRight = function(){
      if(this.isSafeToMoveRight()){
        this.clearOldDrawing();
        this.currentColumn ++;
        this.drawBlock();
      }
    };

    this.moveLeft = function(){
      if(this.isSafeToMoveLeft()){
        this.clearOldDrawing();
        this.currentColumn --;
        this.drawBlock();
      }
    };
  };
  Game.drawGameMap();
  Game.current  = new Game.Block ();
  Game.current.init();
  Game.score = 0;

  // スコア制御
  Game.displayScore = function(){
    $("#gameScore").text(Game.score);
  };
  window.timer = window.setInterval(function(){
    if(Game.current.isSafeToMoveDown()){
      Game.current.moveDown();
    }
    else if (! Game.current.isOrigin()){
      Game.current.storeGameBoardData();
      Game.current.processGameRow();
      Game.current  = new Game.Block ();
      Game.current.init();
    }
    else{
      alert("ゲームオーバー。リロードしてやり直してください");
      clearInterval(timer);
    }
  },1000);

  // ブロック操作関係の処理
  $(document).keydown(function(e){
    try{
      //space
      if(e.keyCode == 32) {
        Game.current.rotate();
      }
      //left
      if (e.keyCode == 37){ 
        Game.current.moveLeft();
      }
      //Right
      if(e.keyCode == 39){
        Game.current.moveRight();
      }
      //Down
      if(e.keyCode == 40){
        if(Game.current.isSafeToMoveDown()){
          Game.current.moveDown();
        }
        else if (! Game.current.isOrigin()){
            Game.current.storeGameBoardData();
            Game.current.processGameRow();
            Game.current  = new Game.Block ();
            Game.current.init();
        }
        else{
          alert("ゲームオーバー。リロードしてやり直してください");
          clearInterval(timer);
        }
      }
    }
    catch(e)
    {
      alert("ゲームオーバー。リロードしてやり直してください");
    }
  });
});