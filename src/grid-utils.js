const minGridCol = 2;
const maxGridCol = 12;
const minGridGap = 5;
const maxGridGap = 100;
const body = document.querySelector('body');
const styles = {
    gridContainer:
        `position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: 100vh;
        grid-gap: 30px;`,
    gridColumn:
        `opacity: 0.15;
        background-color: #000000;`,
    gridInfos:
        `position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 15px;
        z-index: 99999;`,
    gridInfosItem:
        `display: flex;
        line-height: 1.5`,
    gridInfosProperty:
        `width: 90px;`
};

var isEditable = false;

function gridHelper(event) {
    event.preventDefault();
    var pressedKey = event.key;

    switch (pressedKey) {
        case 'g':
            appendGridHelper();
            appendGridInfos();
            break;
        case 'Escape':
            destroyGridHelper();
            destroyGridInfos();
            break;
        case 'ArrowLeft':
            reduceGuttersWidth();
            break;
        case 'ArrowRight':
            increaseGuttersWidth();
            break;
        case 'ArrowDown':
            reduceGridColumns();
            break;
        case 'ArrowUp':
            increaseGridColumns();
            break;
        default:
            console.log('No action found for this keyboard key.');
    }
}

window.addEventListener('keydown', gridHelper);

function appendGridHelper() {
    isEditable = true;
    var gridContainer = document.createElement('div');
    gridContainer.classList.add('grid');
    gridContainer.style = styles.gridContainer;

    for (var i = 0; i < maxGridCol; i++) {
        var gridColumn = document.createElement('div');
        gridColumn.classList.add('grid__col');
        gridColumn.style = styles.gridColumn;
        gridContainer.appendChild(gridColumn);
    }

    body.appendChild(gridContainer);

    return isEditable;
}

function appendGridInfos() {
    var gridInfos = document.createElement('div');
    gridInfos.classList.add('gridInfos');
    gridInfos.style = styles.gridInfos;

    var gridInfosItem = document.createElement('div');
    gridInfosItem.classList.add('gridInfos__item');
    gridInfosItem.style = styles.gridInfosItem;

    var gridInfosPropertyColumns = document.createElement('span');
    gridInfosPropertyColumns.classList.add('gridInfos__property__columns');
    gridInfosPropertyColumns.style = styles.gridInfosProperty;
    gridInfosPropertyColumns.innerHTML = 'Columns :';

    var gridInfosNbColumns = document.createElement('span');
    gridInfosNbColumns.classList.add('gridInfos__number__columns');
    gridInfosNbColumns.innerHTML = maxGridCol;

    gridInfosItem.appendChild(gridInfosPropertyColumns);
    gridInfosItem.appendChild(gridInfosNbColumns);
    gridInfos.appendChild(gridInfosItem);

    var gridInfosItem = document.createElement('div');
    gridInfosItem.classList.add('gridInfos__item');
    gridInfosItem.style = styles.gridInfosItem;

    var gridInfosPropertyGutters = document.createElement('span');
    gridInfosPropertyGutters.classList.add('gridInfos__property__gutters');
    gridInfosPropertyGutters.style = styles.gridInfosProperty;
    gridInfosPropertyGutters.innerHTML = 'Gutters :';

    var gridInfosNbGutters = document.createElement('span');
    gridInfosNbGutters.classList.add('gridInfos__number__gutters');
    gridInfosNbGutters.innerHTML = '30px';

    gridInfosItem.appendChild(gridInfosPropertyGutters);
    gridInfosItem.appendChild(gridInfosNbGutters);
    gridInfos.appendChild(gridInfosItem);

    body.appendChild(gridInfos);
}

function destroyGridHelper() {
    if (isEditable) {
        var grid = document.querySelector('.grid');
        grid.remove();
    }
}

function destroyGridInfos() {
    if (isEditable) {
        var gridInfos = document.querySelector('.gridInfos');
        gridInfos.remove();
    }
}

function reduceGuttersWidth() {
    if (isEditable) {
        var grid = document.querySelector('.grid');
        var gutters = window.getComputedStyle(grid).getPropertyValue('grid-gap');
        var gridGutters = document.querySelector('.gridInfos__number__gutters');
        gutters = parseInt(gutters);

        if (gutters > minGridGap) {
            gutters = gutters - 5;
            grid.style.gridGap = gutters + 'px';
            gridGutters.textContent = gutters + 'px';
        } else {
            alert('You have reached the minimum margins size.');
        }
    }
}

function increaseGuttersWidth() {
    if (isEditable) {
        var grid = document.querySelector('.grid');
        var gutters = window.getComputedStyle(grid).getPropertyValue('grid-gap');
        var gridGutters = document.querySelector('.gridInfos__number__gutters');
        gutters = parseInt(gutters);

        if (gutters < maxGridGap) {
            gutters = gutters + 5;
            grid.style.gridGap = gutters + 'px';
            gridGutters.textContent = gutters + 'px';
        } else {
            alert('You have reached the maximum margins size.');
        }
    }
}

function reduceGridColumns() {
    if (isEditable) {
        var grid = document.querySelector('.grid');
        var gridNumber = document.querySelector('.gridInfos__number__columns');
        var columns = document.querySelectorAll('.grid__col');
        var lastCol = grid.lastChild;
        columns = columns.length;

        if (columns > minGridCol) {
            grid.removeChild(lastCol);
            columns = columns - 1;
            grid.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
            gridNumber.textContent = columns;

        } else {
            alert('You have reached the minimum number of columns.');
        }
    }
}

function increaseGridColumns() {
    if (isEditable) {
        var grid = document.querySelector('.grid');
        var gridNumber = document.querySelector('.gridInfos__number__columns');
        var columns = document.querySelectorAll('.grid__col');
        columns = columns.length;

        if (columns < maxGridCol) {
            var column = document.createElement('div');
            column.classList.add('grid__col');
            column.style = styles.gridColumn;
            grid.appendChild(column);
            columns = columns + 1;
            grid.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
            gridNumber.textContent = columns;
        } else {
            alert('You have reached the maximum number of columns.');
        }
    }
}

if (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0) {
    alert('Grid-Utils not working in Safari. Please use another browser.');
}