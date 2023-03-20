'use strict';

let is_start = false;
let WIDTH = 16,
    HEIGHT = 16,
    BOMBS_COUNT = 40;

document.querySelectorAll('input[name="level"]').forEach(radioBtn => 
            radioBtn.addEventListener('change', 
            () => {
                if (radioBtn.value == 1) {
                    WIDTH = 8,
                    HEIGHT = 8,
                    BOMBS_COUNT = 10
                } else if (radioBtn.value == 2) {
                    WIDTH = 12,
                    HEIGHT = 12,
                    BOMBS_COUNT = 20
                } else if (radioBtn.value == 3) {
                    WIDTH = 16,
                    HEIGHT = 16,
                    BOMBS_COUNT = 40
                }
                startGame();
            }));
    
const smile = document.querySelector('.smile');
smile.addEventListener('click', () => {
    startGame();
});

const field = document.querySelector('.field');
field.addEventListener('contextmenu', event => event.preventDefault());
let cells;

const counter100 = document.querySelector('#counter-mines-100');
const counter10 = document.querySelector('#counter-mines-10');
const counter1 = document.querySelector('#counter-mines-1');

let timerId;
const timer100 = document.querySelector('#timer-100');
const timer10 = document.querySelector('#timer-10');
const timer1 = document.querySelector('#timer-1');

let typeClick = document.querySelector('input[name="type-click"]:checked').value;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) {
        document.querySelector('.type-click').classList.remove('hidden');
    document.querySelectorAll('input[name="type-click"]').forEach(radioBtn => 
            radioBtn.addEventListener('change', handleRadioTypeClick));
}

const texts = document.querySelectorAll('.text-2');

let toggleType = document.querySelector('.toggle-type');
toggleType.addEventListener('click', toggleTypeOneTime);
    
let closeCount;
let leftMines;
let bombs;
    

startGame();

function startGame() {
    if (is_start) {
        unbindHandler();
        is_start = false;
    }
    
    closeCount = WIDTH * HEIGHT;
    leftMines = BOMBS_COUNT;
    
    bombs = [...Array(closeCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, BOMBS_COUNT);
    
    const sizeCell = Number(document.querySelector('input[name="size_cell"]:checked').value);

    document.querySelectorAll('input[name="size_cell"]').forEach(radioBtn => 
            radioBtn.addEventListener('change', handleRadioSizeCell));
    renderField(closeCount, sizeCell);
    renderSize(sizeCell);

    renderCounter(BOMBS_COUNT);
    renderTimer(0);
    
    // console.log(1, cells);
};

function toggleTypeOneTime() {
    if (typeClick === 'flag') {
        toggleType.classList.replace('flag_green', 'flag');
        typeClick = 'cell';
    } else {
        toggleType.classList.replace('flag', 'flag_green');
        typeClick = 'flag';
    }
}

function toggleFlag(index) {
    const cell = cells[index];
    
    if (cell.dataset.isOpen == 1) {
        return;
    }
    
    if (cell.dataset.flag == 0) {
        leftMines--;
        renderCounter(leftMines);
        // cell.innerHTML = '<img class="count_mines" src="img/flag.png" alt="count mines">';
        cell.classList.replace(cell.classList[2], 'flag');
    } else if (cell.dataset.flag == 1) {
        leftMines++;
        renderCounter(leftMines);
        // cell.innerHTML = '<img class="count_mines" src="img/question.png" alt="count mines">';
        cell.classList.replace(cell.classList[2], 'question');
    } else {
        // cell.innerHTML = '<img class="count_mines" src="img/closed_cell.png" alt="count mines">';
        cell.classList.replace(cell.classList[2], 'cell_closed');
    }
    cell.dataset.flag = cell.dataset.flag < 3 
        ? cell.dataset.flag + 1 
        : 0;
}
function handleRadioSizeCell(event) {
    renderSize(Number(event.target.value));
};

function handleRadioTypeClick(event) {
    typeClick = document.querySelector('input[name="type-click"]:checked').value;
    if (typeClick === 'flag') {
        toggleType.disabled = true;
        toggleType.classList.replace(toggleType.classList[0], 'flag_grey');
    } else {
        toggleType.disabled = false;
        toggleType.classList.replace(toggleType.classList[0], 'flag');
    }
};

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
    if (typeClick === "flag") {
        return;
    }
    
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

   // console.log(2, cells);
    // console.log(index);
    // console.log(cells[index]);
    if (typeClick === "cell") {
        open(row, column);
    } else {
        toggleFlag(index);
        if (toggleType.disabled) {
            return;
        }
        typeClick = 'cell';
        toggleType.classList.replace('flag_green', 'flag');
    }
}

function renderField(closeCount, sizeCell) {
    smile.classList.replace(smile.classList[0], 'smile');
    field.innerHTML = '<button></button>'.repeat(closeCount);
    cells = [...field.children];

    cells.forEach(cell => {
        cell.classList.add('cell');
        cell.classList.add(`size-${sizeCell}`);
        cell.classList.add('cell_closed');
        cell.dataset.flag = 0;
        cell.dataset.isOpen = 0;
        cell.dataset.countMines = 0;
        // cell.innerHTML = '<img class="count_mines" src="img/closed_cell.png" alt="count mines">';
        cell.addEventListener('mousedown', handleButton);
        cell.addEventListener('click', handleClick);
        cell.addEventListener('dblclick', handleDblClick);
    })    
}

function renderSize(sizeCell) {
    field.style.gridTemplateColumns = `repeat(${WIDTH}, ${sizeCell}rem)`;
    smile.classList.replace(smile.classList[1], `size-${2 * sizeCell}`);
    toggleType.classList.replace(toggleType.classList[2], `size-${sizeCell + 1}`);
    
    cells.forEach(cell => cell.classList.replace(cell.classList[1], `size-${sizeCell}`));
    texts.forEach(text => text.classList.replace(text.classList[0], `text-${sizeCell}`));
    
    document.querySelectorAll('.digit').forEach(img => img.classList.replace(img.classList[2], `digit-size-${sizeCell}`));
    document.querySelector('.game').style.width = `${WIDTH * sizeCell}rem`;
    document.querySelector('.container').style.minWidth = `${WIDTH * sizeCell + 2}rem`;
}

function renderCounter(leftMines)
{
    const hundredths = Math.floor((leftMines % 1000) / 100);
    const tenths = Math.floor(leftMines / 10);
    const units = leftMines % 10;
    
    if (hundredths != timer100.classList[1].slice(-1)) {
        timer100.classList.replace(timer100.classList[1], `digit_${hundredths}`);
    }
    
    if (tenths != counter10.classList[1].slice(-1)) {
        counter10.classList.replace(counter10.classList[1], `digit_${tenths}`);
    }
    
    counter1.classList.replace(counter1.classList[1], `digit_${units}`);
}

function renderTimer(value)
{
    const hundredths = Math.floor((value % 1000) / 100);
    const tenths = Math.floor((value % 100) / 10);
    const units = value % 10;
    
    if (hundredths != timer100.classList[1].slice(-1)) {
        timer100.classList.replace(timer100.classList[1], `digit_${hundredths}`);
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
    if (!is_start) {
        is_start = true;
        while (isBomb(row, column)) {
            bombs = [...Array(closeCount).keys()]
            .sort(() => Math.random() - 0.5)
            .slice(0, BOMBS_COUNT);
        }

        let timerGame = 0;
        timerId = setInterval(() => renderTimer(timerGame++), 1000);
    }
    

    if (!isValid(row, column)) {
        return;
    }
    
    const index = row * WIDTH + column;
    const cell = cells[index];
    
    if (cell.dataset.isOpen == 1 || cell.dataset.flag == 1) {
        return;
    }
    
    cell.dataset.isOpen = 1;
    
    if (isBomb(row, column)) {
        // cell.innerHTML = '<img class="count_mines" src="img/detonated_mine.png" alt="count mines">';
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
        // cell.innerHTML=`<img class="count_mines" src="img/${imgCount[count]}_mines.png" alt="count mines">`;
        cell.classList.replace(cell.classList[2], `cell_${count}`);
        return;
    }
    // cell.innerHTML = '<img class="count_mines" src="img/opened_cell.png" alt="count mines">';
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
    
    for (const bomb of bombs) {
        if (cells[bomb].dataset.flag == 1 || cells[bomb].dataset.flag == 5) {
            continue;
        } else {
            // cells[bomb].innerHTML = '<img class="count_mines" src="img/mine.png" alt="count mines">';
            cells[bomb].classList.replace(cells[bomb].classList[2], 'mine');
        }
    }

    const flags = cells.filter(cell => cell.dataset.flag == 1);
    for (const flag of flags) {
        const index_flag = cells.indexOf(flag);
        if (!bombs.includes(index_flag)) {
            // flag.innerHTML = '<img class="count_mines" src="img/error_mine.png" alt="count mines">';
            flag.classList.replace(flag.classList[2], 'mine_error');
        }
    }


    if (is_win) {
        smile.classList.replace(smile.classList[0], 'smile_win');
    } else {
        smile.classList.replace(smile.classList[0], 'smile_lose');
    }
}