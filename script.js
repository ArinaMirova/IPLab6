window.onload = function(){
    var body = document.body,
        menu = document.createElement('div'),
        widthInput = document.createElement('input'),
        heightInput = document.createElement('input'),
        countInput = document.createElement('input'),
        buttonStart = document.createElement('button'),
        gameWindow = document.createElement('table');
    
    buttonStart.innerHTML = 'Почати гру';
    
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.justifyContent = 'center';
    menu.style.alignItems = 'center';
    menu.style.marginBottom = '50px';

    menu.appendChild(document.createTextNode('Ширина поля: '));
    menu.appendChild(widthInput);
    menu.appendChild(document.createTextNode('Висота поля: '));
    menu.appendChild(heightInput);
    menu.appendChild(document.createTextNode('Кількість мін: '));
    menu.appendChild(countInput);
    menu.appendChild(buttonStart);

    body.appendChild(menu);
    body.appendChild(gameWindow);

    buttonStart.onclick = function(){
        var width = widthInput.value || 5,
            height = heightInput.value || 5,
            count = countInput.value || 3;

        game(width, height, count);
    }

    function game(width, height, count) {
        var map = [],
            firstClick = false,
            isEnd = false;
        
        gameWindow.setAttribute('border', '1');
        gameWindow.style.borderCollapse = 'collapse';
        gameWindow.style.margin = '0 auto';
        gameWindow.innerHTML = '';

        initMap();
        initWindow();

        function initWindow() {
            for(var i = 0; i < height; i++) {
                var tr = document.createElement('tr');

                for(var j = 0; j < width; j++) {
                    tr.appendChild(map[i][j].el);
                }

                gameWindow.appendChild(tr);
            }
        }

        function leftClick(y, x) {
            if(!firstClick) {
                setUpMap(y, x);
                firstClick = true;
            }
            
            if(map[y][x].flag) return;

            if(map[y][x].isBomb) fail(y, x);
            else {
                showRec(y, x);
                
                if(checkWin()) {
                    win();
                }
            }        
        }
        
        function checkWin() {
            for(var i = 0; i < height; i++) {
                for(var j = 0; j < width; j++) {
                    if(!map[i][j].isBomb && map[i][j].hidden) {
                        return false;
                    }
                }
            }
            
            return true;
        }

        function rightClick(y, x) {
            if(!map[y][x].hidden) return;
            
            if(map[y][x].flag) {
                map[y][x].flag = false;
                map[y][x].el.style.backgroundImage = '';
            } else {
                map[y][x].flag = true;
                map[y][x].el.style.backgroundImage = 'url("images/flag.png")';
            }
        }

        function showRec(y, x) {
            map[y][x].el.style.background = 'white';
            map[y][x].hidden = false;
            map[y][x].flag = false;

            if(map[y][x].value == 0) {            
                if(y + 1 < height && !map[y + 1][x].isBomb && map[y + 1][x].hidden && !map[y + 1][x].flag) {
                    showRec(y + 1, x);                    
                }
                
                if(y - 1 >= 0 && !map[y - 1][x].isBomb && map[y - 1][x].hidden && !map[y - 1][x].flag) {
                    showRec(y - 1, x);                    
                }
                
                if(x + 1 < width && !map[y][x + 1].isBomb && map[y][x + 1].hidden && !map[y][x + 1].flag) {
                    showRec(y, x + 1);                    
                }
                
                if(x - 1 >= 0 && !map[y][x - 1].isBomb && map[y][x - 1].hidden && !map[y][x - 1].flag) {
                    showRec(y, x - 1);                    
                }
                
            } else {
                map[y][x].el.innerHTML = map[y][x].value;
            }
        }

        function fail(y, x) {
            showField();       

            map[y][x].el.style.backgroundColor = 'white';
            map[y][x].el.style.backgroundImage = 'url("images/explosion.png")';  

            alert('YOU LOSE');
            
            isEnd = true;
        }

        function win() {
            showField();

            alert('YOU WIN');
            
            isEnd = true;
        }

        function showField() {
            for(var i = 0; i < height; i++) {
                for(var j = 0; j < width; j++) {
                    if(map[i][j].isBomb) {
                        map[i][j].el.style.backgroundColor = 'white';
                        map[i][j].el.style.backgroundImage = 'url("images/bomb.png")';                    
                    } else {
                        map[i][j].el.style.background = 'white';

                        if(map[i][j].value != 0) {
                            map[i][j].el.innerHTML = map[i][j].value;
                        }
                    }
                }
            }
        }

        function initMap() {
            for(var i = 0; i < height; i++) {
                var row = [];

                for(var j = 0; j < width; j++) {                
                    var td = document.createElement('td');
                    
                    td.style.backgroundSize = 'cover';
                    td.style.width = '20px';
                    td.style.height = '20px';
                    td.style.backgroundColor = 'lightgrey';
                    
                    row.push(new Element(j, i, td));
                }

                map.push(row);
            }
        }
        
        function Element(x, y, el) {
            var that = this;

            that.x = x;
            that.y = y;
            that.value = 0;
            that.el = el;
            that.isBomb = false;
            that.hidden = true;
            that.flag = false;

            that.el.onmouseup = function(event){
                if(isEnd) return;
                
                switch(event.which) {
                    case 1:
                        leftClick(that.y, that.x);
                        break;
                    case 3:
                        rightClick(that.y, that.x);
                        break;
                }
            };

            that.el.oncontextmenu = function() {
                return false;
            };
        }

        function setUpMap(sY, sX) {
            for(var i = 0; i < count; i++) {
                var y = randomInteger(0, height - 1),
                    x = randomInteger(0, width - 1);

                if(map[y][x].isBomb || (y == sY && x == sX)) {
                    i--;
                    continue;
                } else { 
                    map[y][x].isBomb = true;

                    if(y + 1 < height) {
                        map[y + 1][x].value += 1;
                        
                        if(x + 1 < width) {
                            map[y + 1][x + 1].value += 1;                    
                        }

                        if(x - 1 >= 0) {
                            map[y + 1][x - 1].value += 1;                    
                        }
                    }

                    if(y - 1 >= 0) {
                        map[y - 1][x].value += 1;  
                        
                        if(x + 1 < width) {
                            map[y - 1][x + 1].value += 1;                    
                        }

                        if(x - 1 >= 0) {
                            map[y - 1][x - 1].value += 1;                    
                        }
                    }

                    if(x + 1 < width) {
                        map[y][x + 1].value += 1;                    
                    }

                    if(x - 1 >= 0) {
                        map[y][x - 1].value += 1;                    
                    }
                }
            }
        }
    }   

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }   
}