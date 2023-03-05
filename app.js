'use strict';

startGame(16, 16, 40);

function startGame(width, height, bombsCount) {
    const field = document.querySelector('.field');
    const widthCell = 2;
    field.style.gridTemplateColumns = `repeat(${width}, ${widthCell}rem)`;
    document.querySelector('.container').style.width = `${width * widthCell}rem`;

    const smile = document.querySelector('.smile');
    smile.addEventListener('click', unbindHandler);

    const imgCount = ['null', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

    const counter = document.querySelector('.counter');
    renderCounter(bombsCount);
    let leftMines = bombsCount;

    let is_start = false;
    let timerId;
    const timer = document.querySelector('.timer');
    renderTimer(0);

    const cellsCount = width * height;
    
    field.innerHTML = '<button></button>'.repeat(cellsCount);
    const cells = [...field.children];

    let closeCount = cellsCount;

    let bombs = [...Array(cellsCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, bombsCount);

    field.addEventListener('contextmenu', handlePreventDefault);
    cells.forEach(cell => {
        cell.style.height = `${widthCell}rem`;
        cell.dataset.flag = 0;
        cell.innerHTML = '<img class="count_mines" src="img/closed_cell.png" alt="count mines">';
        cell.addEventListener('mousedown', handleButton);
        cell.addEventListener('click', handleClick);
    });
    
    function handleButton(event) {
        const index = event.target.tagName == 'BUTTON' 
            ? cells.indexOf(event.target)
            : cells.indexOf(event.target.parentElement);

        const cell = cells[index];
        
        if (event.buttons == 2) {
           if (cell.dataset.flag == 0) {
                leftMines--;
                renderCounter(leftMines);
                cell.innerHTML = '<img class="count_mines" src="img/flag.png" alt="count mines">';
            } else if (cell.dataset.flag == 1) {
                leftMines++;
                renderCounter(leftMines);
                cell.innerHTML = '<img class="count_mines" src="img/question.png" alt="count mines">';
            } else {
                cell.innerHTML = '<img class="count_mines" src="img/closed_cell.png" alt="count mines">';
            }
            cell.dataset.flag = cell.dataset.flag < 3 
                ? cell.dataset.flag + 1 
                : 0;
        }
    }

    function handlePreventDefault(event) {
        event.preventDefault();
    }

    function handleClick(event) {
        const index = event.target.tagName == 'BUTTON' 
            ? cells.indexOf(event.target)
            : cells.indexOf(event.target.parentElement);

        const column = index % width;
        const row = Math.floor(index / width);

        open(row, column);
    }

    function renderCounter(leftMines)
    {
        counter.innerHTML = `
        <img class="counter__img" src="img/${imgCount[Math.floor(leftMines / 100)]}.png" alt="">
        <img class="counter__img" src="img/${imgCount[Math.floor((leftMines % 100) / 10)]}.png" alt="">
        <img class="counter__img" src="img/${imgCount[leftMines % 10]}.png" alt="">
        `;
    }

    function renderTimer(value)
    {
        timer.innerHTML = `
        <img class="timer__img" src="img/${imgCount[Math.floor(value / 100)]}.png" alt="">
        <img class="timer__img" src="img/${imgCount[Math.floor((value % 100) / 10)]}.png" alt="">
        <img class="timer__img" src="img/${imgCount[value % 10]}.png" alt="">
        `;
    }

    function isValid(row, column) {
        return row >= 0 
            && row < height
            && column >= 0
            && column < width;
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

    function open(row, column) {
        
        if (!is_start) {
            is_start = true;
            while (isBomb(row, column)) {
                bombs = [...Array(cellsCount).keys()]
                .sort(() => Math.random() - 0.5)
                .slice(0, bombsCount);
            }

            let timerGame = 0;
            timerId = setInterval(() => renderTimer(timerGame++), 1000);
        }

        if (!isValid(row, column)) {
            return;
        }

        const index = row * width + column;
        const cell = cells[index];

        if (cell.disabled || cell.dataset.flag == 1) {
            return;
        }
        cell.disabled = true;
        
        if (isBomb(row, column)) {
            cell.innerHTML = '<img class="count_mines" src="img/detonated_mine.png" alt="count mines">';
            cell.dataset.flag = 5;
            endGame(false);
            return;
        }
        
        closeCount--;

        const count = getMinesCount(row, column);
        if (closeCount <= bombsCount) {
            endGame(true);
        }

        if (count > 0) {
            cell.innerHTML=`<img class="count_mines" src="img/${imgCount[count]}_mines.png" alt="count mines">`;
            return;
        }

        openAround(row, column);
    }

    function openAround(row, column) {
        const cell = cells[row * width + column];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                cell.innerHTML = '<img class="count_mines" src="img/opened_cell.png" alt="count mines">';
                open(row + y, column + x);
            }
        }
    }

    function isBomb(row, column) {
        if (!isValid(row, column)) return false;

        const index = row * width + column;

        return bombs.includes(index);
    }

    function unbindHandler() {
        clearTimeout(timerId);

        cells.forEach(cell => {
            cell.removeEventListener('mousedown', handleButton);
            cell.removeEventListener('click', handleClick);
        });
    }

    function endGame(is_win) {
        unbindHandler();
        
        for (const bomb of bombs) {
            if (cells[bomb].dataset.flag == 1 || cells[bomb].dataset.flag == 5) {
                continue;
            } else {
                cells[bomb].innerHTML = '<img class="count_mines" src="img/mine.png" alt="count mines">';
            }
        }

        const flags = cells.filter(cell => cell.dataset.flag == 1);
        for (const flag of flags) {
            const index_flag = cells.indexOf(flag);
            if (!bombs.includes(index_flag)) {
                flag.innerHTML = '<img class="count_mines" src="img/error_mine.png" alt="count mines">';
            }
        }


        if (is_win) {
            smile.innerHTML = '<img class="smile__img" src="img/win_smile.png" alt="smile">';
        } else {
            smile.innerHTML = '<img class="smile__img" src="img/lose_smile.png" alt="smile">';
        }
    }
}