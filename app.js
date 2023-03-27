'use strict';

let is_start = false;
let WIDTH = 16,
    HEIGHT = 16,
    BOMBS_COUNT = 40;

const hintBtn = document.querySelector('.hint');
let cntHints = 0;

const ownLevel = document.querySelector('.own');
const ownBtn = document.querySelector('.own-btn');
const ownLevelWidth = ownLevel.querySelector('#width');
const ownLevelHeight = ownLevel.querySelector('#height');
const ownLevelBombs = ownLevel.querySelector('#bombs');

document.querySelectorAll('input[name="level"]').forEach(radioBtn => 
            radioBtn.addEventListener('change', 
            () => {
                if (radioBtn.value == 1) {
                    WIDTH = 8;
                    HEIGHT = 8;
                    BOMBS_COUNT = 10;

                    hintBtn.addEventListener('click', getHint);
                    hintBtn.classList.remove('hidden');
                    cntHints = 3;

                    ownLevel.classList.add('hidden');
                    detachOwnLevel();

                    startGame();
                } else if (radioBtn.value == 2) {
                    WIDTH = 12;
                    HEIGHT = 12;
                    BOMBS_COUNT = 20;

                    hintBtn.removeEventListener('click', getHint);
                    hintBtn.classList.add('hidden');

                    ownLevel.classList.add('hidden');
                    detachOwnLevel();

                    startGame();
                } else if (radioBtn.value == 3) {
                    WIDTH = 16;
                    HEIGHT = 16;
                    BOMBS_COUNT = 40;

                    hintBtn.removeEventListener('click', getHint);
                    hintBtn.classList.add('hidden');

                    ownLevel.classList.add('hidden');
                    detachOwnLevel();

                    startGame();
                } else {
                    WIDTH = 0;
                    HEIGHT = 0;
                    BOMBS_COUNT = 0;

                    ownLevel.classList.remove('hidden');

                    hintBtn.removeEventListener('click', getHint);
                    hintBtn.classList.add('hidden');
                    attachOwnLevel();
                }
            }));
    
const smile = document.querySelector('.smile');
smile.addEventListener('click', () => {
    resetType();
    toggleTypeOne.disabled = false;
    toggleTypeSet.disabled = false;
    startGame();
});

const field = document.querySelector('.field');
field.addEventListener('contextmenu', event => event.preventDefault());
let cells;


const digits = document.querySelectorAll('.digit');
const game = document.querySelector('.game');
const container = document.querySelector('.container');
    
const counter100 = document.querySelector('#counter-mines-100');
const counter10 = document.querySelector('#counter-mines-10');
const counter1 = document.querySelector('#counter-mines-1');

let timerId;
const timer100 = document.querySelector('#timer-100');
const timer10 = document.querySelector('#timer-10');
const timer1 = document.querySelector('#timer-1');

let typeClick = "cell";

const toggleTypeOne = document.querySelector('.flag-one');
const toggleTypeSet = document.querySelector('.flag-set');

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
        .test(navigator.userAgent)) {
    document.querySelector('.type-click').classList.remove('hidden');

    toggleTypeSet.addEventListener('click', toggleType);
    toggleTypeOne.addEventListener('click', toggleTypeOneTime);
}

const texts = document.querySelectorAll('.text-2');

    
let closeCount;
let leftMines;
let bombs = [];
    

startGame();

function startGame() {
    if (is_start) {
        unbindHandler();
        is_start = false;
    }
    
    bombs = [];
    
    closeCount = WIDTH * HEIGHT;
    leftMines = BOMBS_COUNT;

    document.querySelectorAll('input[name="size_cell"]').forEach(radioBtn => 
            radioBtn.addEventListener('change', handleRadioSizeCell));
    renderField(closeCount);
    renderCounter(BOMBS_COUNT);
    renderTimer(0);
    
    installationMines(BOMBS_COUNT);
    
    cntHints = 3;
    hintBtn.disabled = false;
    hintBtn.innerHTML = 'У вас 3 подсказки';
};

function getHint() {
    const closedCellsWithoutMine = cells.filter((cell, index) => !bombs.includes(index) && cell.dataset.isOpen != 1);
    
    cntHints--;
    if (cntHints <= 0) {
        hintBtn.disabled = true;
        hintBtn.innerHTML = 'У вас 0 подсказок';
    } else {
        cntHints == 1
            ? hintBtn.innerHTML = 'У вас 1 подсказка'
            : hintBtn.innerHTML = 'У вас 2 подсказки';
    }
    
    const res = Math.floor(Math.random() * (closedCellsWithoutMine.length - 1));
    const cell = closedCellsWithoutMine[res];
    
    if (cell.dataset.flag == 1) {
        cell.dataset.flag = 0;
        cell.classList.replace(cell.classList[2], 'flag_green');
    } else {
        cell.classList.replace(cell.classList[2], 'cell_green');
    }
}

function installationMines(countInstallMines) {
    let cnt = 0;
    let withoutMines = [];

    if (bombs) {
        for (let i = 0; i < cells.length; i++) {
            if (!bombs.includes(i) && cells[i].dataset.isOpen == 0) {
                withoutMines.push(i);
            }
        }
    } else {
        withoutMines = cells.keys();
    }

    while (cnt < countInstallMines) {
        const index = Math.floor(Math.random() * withoutMines.length);
        if (!bombs.includes(withoutMines[index])) {
            bombs.push(withoutMines[index]);
            cnt++;
        }
    }
}

function toggleTypeOneTime() {
    toggleTypeSet.classList.replace('flag-set-press', 'flag-set');

    if (typeClick != 'flag') {
        toggleTypeOne.classList.replace('flag-one', 'flag-one-press');
        typeClick = 'flag';
    } else {
        toggleTypeOne.classList.replace('flag-one-press', 'flag-one');
        typeClick = 'cell';
    }
}

function toggleType() {
    toggleTypeOne.classList.replace('flag-one-press', 'flag-one');

    if (typeClick != 'flags') {
        typeClick = 'flags';
        toggleTypeSet.classList.replace('flag-set', 'flag-set-press');
    } else {
        typeClick = 'cell';
        toggleTypeSet.classList.replace('flag-set-press', 'flag-set');
    }
};

function resetType() {
    typeClick = 'cell';
    toggleTypeSet.classList.replace('flag-set-press', 'flag-set');
    toggleTypeOne.classList.replace('flag-one-press', 'flag-one');
}

function toggleFlag(index) {
    const cell = cells[index];
    
    if (cell.dataset.isOpen == 1) {
        return false;
    }
    
    if (cell.dataset.flag == 0) {
        leftMines--;
        renderCounter(leftMines);
        cell.classList.replace(cell.classList[2], 'flag');
    } else if (cell.dataset.flag == 1) {
        leftMines++;
        renderCounter(leftMines);
        cell.classList.replace(cell.classList[2], 'question');
    } else {
        cell.classList.replace(cell.classList[2], 'cell_closed');
    }
    cell.dataset.flag = cell.dataset.flag < 3 
        ? cell.dataset.flag + 1 
        : 0;
    
    return true;
}

function attachOwnLevel() {
    ownLevelWidth.addEventListener('keypress', handleMoveNext);
    ownLevelHeight.addEventListener('keypress', handleMoveNext);
    ownLevelBombs.addEventListener('keypress', handleMoveNext);
    ownBtn.addEventListener('click', handleStart);
}

function detachOwnLevel() {
    ownLevelWidth.removeEventListener('keypress', handleMoveNext);
    ownLevelHeight.removeEventListener('keypress', handleMoveNext);
    ownLevelBombs.removeEventListener('keypress', handleMoveNext);
    ownBtn.removeEventListener('click', handleStart);
}

function handleStart() {
    const w = +ownLevelWidth.value;
    const h = +ownLevelHeight.value;
    const b = +ownLevelBombs.value;

    if (isValidNumber(w) && isValidNumber(h) && isValidNumber(b) && b < w  * h) {
        WIDTH = w;
        HEIGHT = h;
        BOMBS_COUNT = b;
    } else {
        alert('Width, height and number of bombs must be > 0. And number of bombs must be < weight * height')
    }

    startGame();
}

function isValidNumber(num) {
    return !isNaN(num) && num > 0;
}

function handleMoveNext(event) {
    if (event.key == "Enter" || event.key == "Tab") {
        console.log(event.target.nextElementSibling.focus());
    }
}

function handleButton(event) {
    const index = cells.indexOf(event.target);
    const cell = cells[index];
    
    if (event.buttons == 2) {
        if (cell.dataset.isOpen == 1) {
            return;
        }
        
        toggleFlag(index);
        
    } else if (event.buttons == 4) {
        event.preventDefault();
        handleDblClick(event);
    }
}

function handleDblClick(event) {
    const index = cells.indexOf(event.target);
    const column = index % WIDTH;
    const row = Math.floor(index / WIDTH);
    
    const cell = cells[index];
    if (cell.dataset.isOpen == 1 && cell.dataset.countMines == getFlagsCount(row, column)) {
        openAround(row, column);
    }
}

function handleClick(event) {
    const index = cells.indexOf(event.target);
    const column = index % WIDTH;
    const row = Math.floor(index / WIDTH);

    if (typeClick === "cell") {
        open(row, column);
    } else {
        if (!toggleFlag(index) || typeClick == 'flags') {
            return;
        }
        typeClick = 'cell';
        toggleTypeOne.classList.replace('flag-one-press', 'flag-one');
    }
}

function renderField(closeCount, sizeCell) {
    smile.classList.replace(smile.classList[0], 'smile');;

    field.innerHTML = '<button></button>'.repeat(closeCount);
    field.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr`;

    container.style.minWidth = `${WIDTH * 2.5 + 2}rem`;

    cells = [...field.children];

    cells.forEach(cell => {
        cell.classList.add('cell');
        cell.classList.add(`size-${sizeCell}`);
        cell.classList.add('cell_closed');
        
        cell.dataset.flag = 0;
        cell.dataset.isOpen = 0;
        cell.dataset.countMines = 0;
        
        cell.addEventListener('mousedown', handleButton);
        cell.addEventListener('click', handleClick);
        cell.addEventListener('dblclick', handleDblClick);
    })    
}

function renderCounter(leftMines)
{
    let hundreds = Math.floor(leftMines / 100) % 10;

    if (leftMines < 0) {
        hundreds = 'minus';
        leftMines = Math.abs(leftMines);
    } else {
        hundreds = Math.floor(leftMines / 100) % 10;
    }
    
    const tenths = Math.floor(leftMines / 10) % 10;
    const units = leftMines % 10;
    
    if (hundreds != counter100.classList[1].slice(-1)) {
        counter100.classList.replace(counter100.classList[1], `digit_${hundreds}`);
    }
    
    if (tenths != counter10.classList[1].slice(-1)) {
        counter10.classList.replace(counter10.classList[1], `digit_${tenths}`);
    }
    
    counter1.classList.replace(counter1.classList[1], `digit_${units}`);
}

function renderTimer(value)
{
    const hundreds = Math.floor(value / 100) % 10;
    const tenths = Math.floor(value / 10) % 10;
    const units = value % 10;
    
    if (hundreds != timer100.classList[1].slice(-1)) {
        timer100.classList.replace(timer100.classList[1], `digit_${hundreds}`);
    }
    
    if (tenths != timer10.classList[1].slice(-1)) {
        timer10.classList.replace(timer10.classList[1], `digit_${tenths}`);
    }
    
    timer1.classList.replace(timer1.classList[1], `digit_${units}`);
}

function isValid(row, column) {
    return row >= 0 
        && row < HEIGHT
        && column >= 0
        && column < WIDTH;
}

function getMinesCount(row, column) {
    let count = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (isBomb(row + y, column + x)) {
                count++;
            }
        }
    }

    return count;
}

function getFlagsCount(row, column) {
    let count = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (isValid(row + y, column + x) && cells[(row + y) * WIDTH + column + x].dataset.flag == 1) {
                count++;
            }
        }
    }

    return count;
}

function open(row, column) {
    if (!isValid(row, column)) {
        return;
    }
    
    const index = row * WIDTH + column;
    const cell = cells[index];
    
    if (cell.dataset.isOpen == 1 || cell.dataset.flag == 1) {
        return;
    }
    
    cell.dataset.isOpen = 1;
    
    if (!is_start) {
        is_start = true;
        if (isBomb(row, column)) {
            bombs = bombs.filter((bomb) => bomb != index);
            installationMines(1);
        }
        
        let timerGame = 0;
        timerId = setInterval(() => renderTimer(timerGame++), 1000);
    }
    
    if (isBomb(row, column)) {
        cell.classList.replace(cell.classList[2], 'mine_detonated');
        cell.dataset.flag = 5;
        endGame(false);
        return;
    }
    
    closeCount--;

    const count = getMinesCount(row, column);
    if (closeCount <= BOMBS_COUNT) {
        endGame(true);
    }

    if (count > 0) {
        cell.dataset.countMines = count;
        cell.classList.replace(cell.classList[2], `cell_${count}`);
        return;
    }
    cell.classList.replace(cell.classList[2], 'cell_opened');
    openAround(row, column);
}

function openAround(row, column) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            open(row + y, column + x);
        }
    }
}

function isBomb(row, column) {
    const index = row * WIDTH + column;
    
    if (!isValid(row, column)) return false;

    return bombs.includes(index);
}

function unbindHandler() {
    clearTimeout(timerId);

    cells.forEach(cell => {
        cell.removeEventListener('mousedown', handleButton);
        cell.removeEventListener('click', handleClick);
        cell.removeEventListener('dblclick', handleDblClick);
    });
}

function endGame(is_win) {
    unbindHandler();
    hintBtn.disabled = true;
    toggleTypeOne.disabled = true;
    toggleTypeSet.disabled = true;
    resetType();

    for (const bomb of bombs) {
        if (cells[bomb].dataset.flag == 1 || cells[bomb].dataset.flag == 5) {
            continue;
        } else {
            cells[bomb].classList.replace(cells[bomb].classList[2], 'mine');
        }
    }

    const flags = cells.filter(cell => cell.dataset.flag == 1);
    for (const flag of flags) {
        const index_flag = cells.indexOf(flag);
        if (!bombs.includes(index_flag)) {
            flag.classList.replace(flag.classList[2], 'mine_error');
        }
    }

    if (is_win) {
        smile.classList.replace(smile.classList[0], 'smile_win');
    } else {
        smile.classList.replace(smile.classList[0], 'smile_lose');
    }
}