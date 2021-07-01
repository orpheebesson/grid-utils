const minGridCol = 2;
const maxGridCol = window.innerWidth > 768 ? 12 : 6;
const minGridGap = 5;
const maxGridGap = 100;
const body = document.querySelector('body');
var isEditable = false;
var paddingGrid = window.innerWidth > 640 ? '0.9375rem' : '0.625rem';

var css = `.grid { position: fixed; top: 0; left: 50%; height: 100%; width: 100%; max-width: 75rem; transform: translateX(-50%); pointer-events: none; display: grid; grid-template-columns: repeat(${maxGridCol}, 1fr); grid-gap: 30px; z-index: 99999; border: 1px solid orange; padding: ${paddingGrid}; } .grid--fullWidth { max-width: initial; border: none;} .grid__col { opacity: 0.15; background-color: #000000;} .gridInfos { position: fixed; top: 50%; right: 0; transform: translateY(-50%); color: white; background-color: rgba(0, 0, 0, 0.5); padding: 15px; z-index: 99999; } .gridInfos__item { display: flex; align-items: center; line-height: 1.5; } .gridInfos__property__columns, .gridInfos__property__gutters, .gridInfos__property__fullWidth { width: 90px; } .gridInfos__input__fullWidth { margin: 0; } .cross { position: fixed; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none; z-index: 99999; } .cross__verticalLine { position: absolute; left: 50%; height: 100%; width: 1px; background: orange; } .cross__horizontalLine { position: absolute; top: 50%; height: 1px; width: 100%; background: orange; }`;
const head = document.getElementsByTagName('head')[0];
var style = document.createElement('style');

head.appendChild(style);

style.appendChild(document.createTextNode(css));

function gridHelper(event) {
    var pressedKey = event.key;

    switch (pressedKey) {
        case 'g':
            appendGridHelper();
            appendGridInfos();
            appendCross();
            break;
        case 'Escape':
            destroyElement('.grid');
            destroyElement('.gridInfos');
            destroyElement('.cross');
            break;
        case 'ArrowLeft':
            event.preventDefault();
            reduceGuttersWidth();
            break;
        case 'ArrowRight':
            event.preventDefault();
            increaseGuttersWidth();
            break;
        case 'ArrowDown':
            event.preventDefault();
            reduceGridColumns();
            break;
        case 'ArrowUp':
            event.preventDefault();
            increaseGridColumns();
            break;
    }
}

window.addEventListener('keydown', gridHelper);

function appendGridHelper() {
    if (!document.body.contains(document.querySelector('.grid'))) {
        isEditable = true;
        var gridContainer = document.createElement('div');
        gridContainer.classList.add('grid');

        for (var i = 0; i < maxGridCol; i++) {
            var gridColumn = document.createElement('div');
            gridColumn.classList.add('grid__col');
            gridContainer.appendChild(gridColumn);
        }

        body.appendChild(gridContainer);

        return isEditable;
    }
}

function appendGridInfos() {
    if (!document.body.contains(document.querySelector('.gridInfos'))) {
        var gridInfos = document.createElement('div');
        gridInfos.classList.add('gridInfos');

        var gridInfosItem = document.createElement('div');
        gridInfosItem.classList.add('gridInfos__item');

        var gridInfosPropertyColumns = document.createElement('span');
        gridInfosPropertyColumns.classList.add('gridInfos__property__columns');
        gridInfosPropertyColumns.innerHTML = 'Columns :';

        var gridInfosNbColumns = document.createElement('span');
        gridInfosNbColumns.classList.add('gridInfos__number__columns');
        gridInfosNbColumns.innerHTML = maxGridCol;

        gridInfosItem.appendChild(gridInfosPropertyColumns);
        gridInfosItem.appendChild(gridInfosNbColumns);
        gridInfos.appendChild(gridInfosItem);

        var gridInfosItem = document.createElement('div');
        gridInfosItem.classList.add('gridInfos__item');

        var gridInfosPropertyGutters = document.createElement('span');
        gridInfosPropertyGutters.classList.add('gridInfos__property__gutters');
        gridInfosPropertyGutters.innerHTML = 'Gutters :';

        var gridInfosNbGutters = document.createElement('span');
        gridInfosNbGutters.classList.add('gridInfos__number__gutters');
        gridInfosNbGutters.innerHTML = '30px';

        gridInfosItem.appendChild(gridInfosPropertyGutters);
        gridInfosItem.appendChild(gridInfosNbGutters);
        gridInfos.appendChild(gridInfosItem);

        var gridInfosItem = document.createElement('div');
        gridInfosItem.classList.add('gridInfos__item');

        var gridInfosPropertyFullWidth = document.createElement('span');
        gridInfosPropertyFullWidth.classList.add('gridInfos__property__fullWidth');
        gridInfosPropertyFullWidth.innerHTML = 'Full width :';

        var gridInfosFullWidth = document.createElement('input');
        gridInfosFullWidth.setAttribute('type', 'checkbox');
        gridInfosFullWidth.classList.add('gridInfos__input__fullWidth');

        gridInfosItem.appendChild(gridInfosPropertyFullWidth);
        gridInfosItem.appendChild(gridInfosFullWidth);
        gridInfos.appendChild(gridInfosItem);

        body.appendChild(gridInfos);

        var checkboxFullWidth = document.querySelector('.gridInfos__input__fullWidth');
        checkboxFullWidth.addEventListener('change', setFullWidthGrid);
    }
}

function appendCross() {
    if (!document.body.contains(document.querySelector('.cross'))) {
        var crossContainer = document.createElement('div');
        crossContainer.classList.add('cross');

        var verticalLine = document.createElement('div');
        verticalLine.classList.add('cross__verticalLine');
        crossContainer.appendChild(verticalLine);

        var horizontalLine = document.createElement('div');
        horizontalLine.classList.add('cross__horizontalLine');
        crossContainer.appendChild(horizontalLine);

        body.appendChild(crossContainer);
    }
}

/**
 * Removes an element from the DOM
 * 
 * @param {string} element 
 */
function destroyElement(element) {
    if (isEditable) {
        if (document.body.contains(document.querySelector(element))) {
            var element = document.querySelector(element);
            element.remove();
        }
    }
}

function reduceGuttersWidth() {
    if (isEditable) {
        if (document.body.contains(document.querySelector('.grid'))) {
            var grid = document.querySelector('.grid');
            var gutters = window.getComputedStyle(grid).getPropertyValue('grid-gap');
            var gridGutters = document.querySelector('.gridInfos__number__gutters');
            gutters = parseInt(gutters);

            if (gutters > minGridGap) {
                gutters = gutters - 5;
                grid.style.gridGap = gutters + 'px';
                gridGutters.textContent = gutters + 'px';
            } else {
                limitGrid('gutters');
                setTimeout(function () {
                    initStyleGrid('gutters');
                }, 500);
            }
        }
    }
}

function increaseGuttersWidth() {
    if (isEditable) {
        if (document.body.contains(document.querySelector('.grid'))) {
            var grid = document.querySelector('.grid');
            var gutters = window.getComputedStyle(grid).getPropertyValue('grid-gap');
            var gridGutters = document.querySelector('.gridInfos__number__gutters');
            gutters = parseInt(gutters);

            if (gutters < maxGridGap) {
                gutters = gutters + 5;
                grid.style.gridGap = gutters + 'px';
                gridGutters.textContent = gutters + 'px';
            } else {
                limitGrid('gutters');
                setTimeout(function () {
                    initStyleGrid('gutters');
                }, 500);
            }
        }
    }
}

function reduceGridColumns() {
    if (isEditable) {
        if (document.body.contains(document.querySelector('.grid'))) {
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
                limitGrid('columns');
                setTimeout(function () {
                    initStyleGrid('columns');
                }, 500);
            }
        }
    }
}

function increaseGridColumns() {
    if (isEditable) {
        if (document.body.contains(document.querySelector('.grid'))) {
            var grid = document.querySelector('.grid');
            var gridNumber = document.querySelector('.gridInfos__number__columns');
            var columns = document.querySelectorAll('.grid__col');
            columns = columns.length;

            if (columns < maxGridCol) {
                var column = document.createElement('div');
                column.classList.add('grid__col');
                grid.appendChild(column);
                columns = columns + 1;
                grid.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
                gridNumber.textContent = columns;
            } else {
                limitGrid('columns');
                setTimeout(function () {
                    initStyleGrid('columns');
                }, 500);
            }
        }
    }
}

/**
 * Limits the number of columns or the width of the gutters in the grid
 * 
 * @param {string} property : 'columns' | 'gutters'
 */
function limitGrid(property) {
    if (property == 'columns') {
        var columns = document.querySelectorAll('.grid__col');

        for (var i = 0; i < columns.length; i++) {
            columns[i].style.backgroundColor = 'red';
        }
    } else if (property == 'gutters') {
        var grid = document.querySelector('.grid');

        grid.style.backgroundColor = 'rgba(255,0,0,0.15)';
    }
}

/**
 * Resets the grid style
 * 
 * @param {string} property : 'columns' | 'gutters'
 */
function initStyleGrid(property) {
    if (property == 'columns') {
        var columns = document.querySelectorAll('.grid__col');

        for (var i = 0; i < columns.length; i++) {
            columns[i].style.backgroundColor = '#000000';
        }
    } else if (property == 'gutters') {
        var grid = document.querySelector('.grid');

        grid.style.backgroundColor = 'initial';
    }
}

function setFullWidthGrid() {
    var grid = document.querySelector('.grid');

    if (this.checked) {
        grid.classList.add('grid--fullWidth');
    } else {
        grid.classList.remove('grid--fullWidth');
    }
}