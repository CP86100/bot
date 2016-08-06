$(document).ready(function(){
    
    $('td').addClass('clean'); //This sets the default class(backgground-color) of the board.
    $('#a0').addClass('bot'); //This sets the bot onto the default position [0,0].
    
    var numOfBots = 1; //This is the maximum number of bots allowed on the boeard.
    var numberOfDirtyCells = 0;
 
   $('td').click(function(){
       
       if(numOfBots < 1 && !$(this).hasClass('bot')){
           $(this).addClass('bot');
           numOfBots++;
       }
       else if($(this).hasClass('bot')){
           $(this).removeClass('bot');
           numOfBots--;
       }
       else if($(this).hasClass('clean')){
           $(this).removeClass('clean').addClass('dirty');
           numberOfDirtyCells++;
       }
       else{
            $(this).removeClass('dirty').addClass('clean');
       }
       
   });
    
    $('#auto').click(function(){
        var numberOfMoves = 0;
        var repeat = setInterval(function(){
            if(numberOfDirtyCells > 0){
                $('#next').click();
                numberOfMoves++;
            }
            else{
                new Audio('./TaDa.wav').play();
                clearInterval(repeat);
                setTimeout(function(){alert('The bot has cleaned all the dirty cells in '+numberOfMoves+' moves.');},100);
            }
        },500);
        
    });
    $('#next').click(function(){
       
        var bot = new pos();//Represents the bot's position on the board.
        var board = $().board();//This will represent the board.

        //This nested loop fills the board with the dirty cells and records the bot's position.
        var countDirty = 0;
        
        for(var r = 0; r < 5; r++){
            for(var c = 0; c < 5; c++){
                var id = $().getId(r,c);
                
                if($(id).hasClass('dirty')){
                    board[r][c] = "d";
                    countDirty++;
                }
                if($(id).hasClass('bot')){
                    bot = new pos(r,c);
                    
                    if(!$(id).hasClass('dirty')){
                        board[r][c] = "b";
                    }
                }
            }
        }
        var moveSound = new Audio('./moveSound.wav');
        var clean = new Audio('./clean.wav');

        var move = $().nextCell(bot,board);
        console.log('Command for next move: '+move);
        
        var a = 0;
        var b = 0;
        
            if(move.localeCompare('UP') == 0){
                a--;
            }
            else if(move.localeCompare('DOWN') == 0){
                a++;
            }
            else if(move.localeCompare('LEFT') == 0){
                b--;
            }
            else if(move.localeCompare('RIGHT') == 0){
                b++;
            }
            if(a != 0 || b != 0){
                var id = $().getId(bot.x,bot.y);
                $(id).removeClass('bot');
                id = $().getId(bot.x+a,bot.y+b);
                $(id).addClass('bot');
                moveSound.play();
            }
            else{
                var id = $().getId(bot.x,bot.y);
                $(id).removeClass('dirty').addClass('clean');
                numberOfDirtyCells--;
                clean.play();
            }
    });
    
    (function($){
        
        //This function gets the <td> #id that corresponds to the 2D array [0-4][0-4].
        $.fn.getId = function(a,b){
            return '#'+String.fromCharCode(97+a)+b;
        };
        
        //This function returns a 5*5 board filled with '-'.
        $.fn.board = function(){
            var board = new Array();
            for(var r = 0; r < 5; r++){
                board[r] = new Array();
                for(var c = 0; c < 5; c++){
                    board[r][c] = "-";
                }
            }
            return board;
        };
        
        //This function will find the next cell to got to.
        $.fn.nextCell = function(bot,board){
            var closest = new pos();
            closest.dist = 1000;
            
            for(var x = 0; x < 5; x++){
                for(var y = 0; y < 5; y++){
                    
                    if(board[x][y].localeCompare('d') == 0){
                        var temp = $().getDist(bot, new pos(x,y));
                        if(closest.dist > temp){
                            closest = new pos(x,y);
                            closest.dist = temp;
                        }
                    }
                }
            }
            var move = new pos(bot.x-closest.x,bot.y-closest.y);
            var ans;
            
            if(move.x > 0)
                ans = 'UP'
            else if(move.x < 0)
                ans = 'DOWN';
            else if(move.y < 0)
                ans = 'RIGHT';
            else if(move.y > 0)
                ans = 'LEFT';
            else
                ans = 'CLEAN';
            
            return ans;
        };
        
        $.fn.getDist = function(a,b){
            return (Math.abs(a.x-b.x)+Math.abs(a.y-b.y));
        };
        
    })(jQuery);
    
    //This Class represents a positon x,y.
    pos = function(x,y){
        this.x = x;
        this.y = y;
        this.dist = Infinity;
    }
    
});

