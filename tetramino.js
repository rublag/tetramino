/**
 * Created by user on 14.03.2015.
 */
fieldX = 10;
fieldY = 22;
field = new Array(fieldY);
for(i=0; i< field.length; ++i)
    field[i] = new Array(fieldX);

rows = document.getElementsByClassName("row");
for(var row = 0; row < rows.length; ++row)
{
    cells = rows[row].getElementsByClassName("cell");
    for(var cell = 0; cell < cells.length; ++cell)
    {
        field[row][cell] = cells[cell];
    }
}

function clearField()
{
    for(var i = 0; i < field.length; ++i)
        for(var j = 0; j < field[i].length; ++j)
            setColor(j, i, "");
}

var tetraminos =
    [
        [2, 2, [[0, 1], [0, 1]], "yellow"],
        [4, 4, [[], [0, 1, 2, 3],[],[]], "cyan"],
        [3, 3, [[1], [0, 1, 2], []], "purple"],
        [3, 3, [[0], [0, 1, 2], []], "blue"],
        [3, 3, [[2], [0, 1, 2], []], "orange"],
        [3, 3, [[1, 2], [0, 1], []], "green"],
        [3, 3, [[0, 1], [1, 2], []], "red"]
    ];

var tetramino = [0, 0, 0];

function insertTM(x, y, TM)
{
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
            setColor(x+TM[2][row][cell], y+row, TM[3]);
    }
    tetramino = [x, y, TM];
}

function removeTM()
{
    var x = tetramino[0];
    var y = tetramino[1];
    var TM = tetramino[2];
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
            setColor(x+TM[2][row][cell], y+row, "");
    }
}

function updateTM(TMx, TMy)
{
    removeTM();
    if(!hasCollisions(TMx, TMy, tetramino[2]))
    {
        insertTM(TMx, TMy, tetramino[2]);
        return true;
    }
    else insertTM(tetramino[0], tetramino[1], tetramino[2]);
    return false;
}

function shiftTM(direction)
{
    switch(direction)
    {
        case 'l': return updateTM(tetramino[0]-1, tetramino[1]); break;
        case 'r': return updateTM(tetramino[0]+1, tetramino[1]); break;
        case 'b': return updateTM(tetramino[0], tetramino[1]+1); break;
    }
}

function hasCollisions(TMx, TMy, TM)
{
    var clear = true;
    for(var y = 0; clear && y < TM[2].length; ++y)
    {
        for(var x = 0; clear && x < TM[2][y].length; ++x)
        {
            if(TMx+TM[2][y][x] > fieldX-1 || TMy+y > fieldY-1 || TMx+TM[2][y][x] < 0 || TMy+y < 0)
            {
                clear = false;
                break;
            }
            clear = isClear(TMx+TM[2][y][x], TMy+y);
        }
    }
    return !clear;
}

function rRotatedTM(TM)
{
    var TMArray = new Array(TM[1]);
    for(var i = 0; i < TMArray.length; ++i)
    {
        TMArray[i] = [];
    }
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
        {
            TMArray[ TM[2][row][cell]].push(TM[2].length-1-row)
        }
    }
    return [TM[1], TM[0], TMArray, TM[3]];
}

function lRotatedTM(TM)
{
    var TMArray = new Array(TM[1]);
    for(var i = 0; i < TMArray.length; ++i)
    {
        TMArray[i] = [];
    }
    for(var row = 0; row < TM[0]; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
        {
            TMArray[ TM[1]-TM[2][row][cell]-1 ].push(row)
        }
    }
    return [TM[1], TM[0], TMArray, TM[3]];
}

function rRotateTM()
{
    var x = tetramino[0];
    var y = tetramino[1];
    var TM = tetramino[2];
    var color = tetramino[3];
    removeTM();
    var rotated = rRotatedTM(tetramino[2]);
    if(!hasCollisions(x, y, rotated))
        insertTM(x, y, rotated);
    else insertTM(x, y, TM);
}

function lRotateTM()
{
    var x = tetramino[0];
    var y = tetramino[1];
    var TM = tetramino[2];
    removeTM();
    var rotated = lRotatedTM(tetramino[2]);
    if(!hasCollisions(x, y, rotated))
        insertTM(x, y, rotated);
    else insertTM(x, y, TM);
}

function TMToMask(TM)
{
    var mask = new Array(TM[0]);
    for(var i = 0; i < mask.length; ++i)
        mask[i] = new Array(TM[1]);

    for(var row = 0; row < TM[2].length; ++row)
    {
        for(var cell = 0; cell < TM[2][row].length; ++cell)
        {
            mask[row][ TM[row][cell] ] = 1;
        }
    }
    return [TM[0], TM[1], mask];
}

function createTM()
{
    var TMId = getRandomInt(0, 7);
    var xOffset = Math.round((fieldX-1)/2-tetraminos[TMId][1]/2);
    if(!hasCollisions(xOffset, 0, tetraminos[TMId]))
        insertTM(xOffset, 0, tetraminos[TMId]);
    else stop();
}

function setColor(x, y, color)
{
    field[y][x].style.backgroundColor = color;
}

function atEdges()
{
    var edges = new Array(4);
    edges[0] = tetramino[1] == 0;
    edges[1] = tetramino[0] == 0;
    edges[2] = tetramino[0]+tetramino[2][1]-1 == 9;
    edges[3] = tetramino[1]+tetramino[2][0]-1 == 19;
    return edges;
}

function isClear(x, y)
{
    return !field[y][x].style.backgroundColor
}

function hasObstacles(direction)
{
    var x = tetramino[0];
    var y = tetramino[1];
    var clear = true;
    switch(direction)
    {
        case 'l':
            for(var row = 0; row < tetramino[2][0] && clear; ++row) clear = isClear(x+tetramino[2][2][row][0]-1, y+row);
            return !clear;
            break;
        case 'r':
            for(var row = 0; row < tetramino[2][0] && clear; ++row) clear = isClear(x+tetramino[2][2][row][tetramino[2][2][row].length-1]+1, y+row);
            return !clear;
            break;
        case 'b':
            for(var cell = 0; cell < tetramino[2][2][tetramino[2][0]-1].length && clear; ++cell) clear = isClear(x+tetramino[2][2][tetramino[2][0]-1][cell], y+tetramino[2][0]);
            return !clear;
            break;
        default: return true; break;
    }
}

function shift(direction)
{
    switch(direction)
    {
        case 'l': shiftTM('l'); break;
        case 'r': shiftTM('r'); break;
    }
}

function isLineFilled(y)
{
    var allFilled = true;
    for(var i = 0; i < field[y].length && allFilled; ++i)
    {
        if(isClear(i, y)) allFilled = false;
    }
    return allFilled
}

function clearLine(y)
{
    for(var i = 0; i < field[y].length; ++i)
    {
        setColor(i, y, "");
    }
}

function shiftLines(y)
{
    for(var i = y; i > 0; --i)
    {
        clearLine(i);
        for(var j = 0; j < field[y].length; ++j) field[i][j].style.backgroundColor = field[i-1][j].style.backgroundColor;
    }
}

function fall()
{
    if(!shiftTM('b'))
    {
        for(var i = 0, add_score = false; i < tetramino[2][0] && tetramino[1]+i < fieldY; ++i)
        {
            if(isLineFilled(tetramino[1]+i))
            {
                shiftLines(tetramino[1]+i);
                add_score = true;
            }
        }
        createTM();
        if(add_score) score += 1;
        if(score >= 5)
        {
            delay -= 20;
            change_speed();
            score = 0;
        }
    }
}

var score = 0;
function change_speed()
{
    clearInterval(ival);
    ival = setInterval(fall, delay);
}

var delay = 200;

var paused = false;
var started = false;
var ival = 0;
function start()
{
    delay = 1000;
    clearField();
    createTM();
    ival = setInterval(fall, delay);
    started = true;
    document.game_controls.start_button.disabled = true;
    document.game_controls.pause_button.disabled = false;
    document.game_controls.stop_button.disabled = false;
    document.game_controls.pause_button.textContent = "Pause"
}

function stop()
{
    clearInterval(ival);
    started = false;
    document.game_controls.stop_button.disabled = true;
    document.game_controls.pause_button.disabled = true;
    document.game_controls.start_button.disabled = false;
    document.game_controls.pause_button.textContent = "Stopped";
}

function switchPause()
{
    if(!started) return false;
    if(paused)
    {
        fall();
        ival = setInterval(fall, delay);
        paused = false;
        document.game_controls.pause_button.textContent="Pause";
    }
    else
    {
        clearInterval(ival);
        paused = true;
        document.game_controls.pause_button.textContent="Resume";
    }
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function rotate(direction)
{
    switch(direction)
    {
        case 'l': lRotateTM(); break;
        case 'r': rRotateTM(); break;
    }
}

document.addEventListener('keydown', function(event)
{
    switch (event.keyCode) {
        case "Q".charCodeAt(0): rotate('l'); break;
        case "E".charCodeAt(0): rotate('r'); break;
        case "A".charCodeAt(0): if(started && !paused) shift('l'); break;
        case "D".charCodeAt(0): if(started && !paused) shift('r'); break;
        case "S".charCodeAt(0): if(started && !paused) fall(); break;
        case 13: switchState(); break;
        case 32: switchPause(); break;
    }
});

function switchState()
{
    if(started) stop();
    else start();
}