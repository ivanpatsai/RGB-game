var h1 = document.querySelector('h1');
var squares = document.querySelectorAll('.square');
var colorDisplay = document.getElementById('colorDisplay');
var message = document.querySelector('.message');
var resetBtn = document.getElementById('reset');
var lvlBtns = document.querySelectorAll('.level');

//object to store colors
var colorObj = {
    0: [],
    1: [],
    2: []
};

//initial setup
var level = 6;
var difficult = false;
var colors;
var pickedColor;

reloadColors();

document.addEventListener('click', function (e) {
    var target = e.target;
    //action when click on color options
    if (target.classList.contains('square')) {
        var clickedColor = target.style.backgroundColor;
        if (clickedColor !== pickedColor) {
            wrongPick(target);
        } else {
            correctPick();
        }
    }
    //action when click on New Game or Play Again button
    if (target.id === 'reset') {
        removeClass(squares, 'wrong');
        reset();
        reloadColors();
    }
    //click on mode buttons
    if (target.classList.contains('level')) {
        removeClass(lvlBtns, 'selected');
        target.classList.add('selected');
        difficult = (target.getAttribute('data-difficult') === 'true');
        level = +target.getAttribute('data-items');
        reset();
        reloadColors();
    }
});

//action when guessed correct color
function correctPick() {
    removeClass(squares, 'wrong');
    squares.forEach(function (square) {
        square.style.backgroundColor = pickedColor;
    });
    h1.style.background = pickedColor;
    message.textContent = 'Correct!';
    resetBtn.textContent = 'Play again?';
}

//action when guessed wrong collor
function wrongPick(target) {
    target.classList.add('wrong');
    message.textContent = 'Try Again!'
}

//fill up colorObj with random numbers
function randomColorsArray() {
    //clear objs arrays before set new colors
    colorObj[0] = [];
    colorObj[1] = [];
    colorObj[2] = [];
    //range for random numbers
    var max = 256;
    var min = 0;
    for (var j = 0; j < 3; j++) {
        //making range narrower if selected hard or expert
        if (difficult) {
            var secret = randomColor(max, min);
            if (secret > 206) {
                max = 256;
                min = secret - 40;
            } else if (secret < 50) {
                min = 0;
                max = secret + 40;
            } else {
                max = secret + 40;
                min = secret - 40;
            }
        }
        //generate random numbers to fill array
        for (var i = 0; i < level; i++) {
            colorObj[j].push(randomColor(max, min));
        }
    }
    return makeColorArray();
}

//random number in fixed range
function randomColor(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//make array of colors from colorObj data
function makeColorArray() {
    var arr = [];
    for (var i = 0; i < level; i++) {
        arr.push("rgb(" + colorObj[0][i] + ', ' + colorObj[1][i] + ', ' + colorObj[2][i] + ')')
    }
    return arr;
}

// display divs according to the mode you chose
function displayColors() {
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].classList.remove('wrong');
            squares[i].style.backgroundColor = colors[i];
            squares[i].style.display = 'block';
        } else {
            squares[i].style.display = 'none';
        }
    }
}

//resets view
function reloadColors() {
    colors = randomColorsArray();
    pickColor();
    displayColors();
}

// random color that user have to guess from color array
function pickColor() {
    pickedColor = colors[Math.floor(Math.random() * level)];
    colorDisplay.textContent = pickedColor;
}

//removes class from each array item
function removeClass(arr, className) {
    arr.forEach(function (itm) {
        itm.classList.remove(className)
    })
}

//resets view when user starts new game
function reset() {
    message.textContent = '';
    resetBtn.textContent = 'New colors';
    h1.style.background = '#3f75a2';
}
