const drawingBoard = document.getElementById('drawing-board');
const colorPickInput = document.getElementById('color-pick-input');
const lineWidthInput = document.getElementById('line-width-input');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const colorList = document.getElementById('color-list');
const toolsList = document.getElementById('tools-list');

const ctx = drawingBoard.getContext('2d');

const board_width = drawingBoard.width = 600;
const board_height = drawingBoard.height = 500;

let lineWidth = lineWidthInput.value;
let currentColor = colorPickInput.value;
let isDrawing = false;

const colors = ["black", "red", "green", "blue", "orange", "yellow"];
const tools = {
    brush: "b",
    rectangle: "r",
    line: "l",
};
let currentTool = tools.brush; 
let prevMouseX = null;
let prevMouseY = null;
let snapshot = null;

// 1. ГЕНЕРАЦИЯ ПАЛИТРЫ ЦВЕТОВ
colors.forEach(color => {
    const li = document.createElement('li');
    li.style.backgroundColor = color;
    li.classList.add('color-circle');
    li.addEventListener('click', () => {
        currentColor = color;
        colorPickInput.value = (color === 'black') ? '#000000' : color; 
    });
    colorList.appendChild(li);
});

colorPickInput.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// 2. ГЕНЕРАЦИЯ ИНСТРУМЕНТОВ
Object.keys(tools).forEach(toolName => {
    const li = document.createElement('li');
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'tool-selection';
    radio.id = `tool-${toolName}`;
    radio.value = tools[toolName];
    if (tools[toolName] === currentTool) radio.checked = true;

    const label = document.createElement('label');
    label.htmlFor = `tool-${toolName}`;
    label.textContent = ` ${toolName} `;

    radio.addEventListener('change', (e) => {
        currentTool = e.target.value;
    });

    li.appendChild(label);
    label.appendChild(radio);
    toolsList.appendChild(li);
});

lineWidthInput.addEventListener('input', (e) => {
    lineWidth = e.target.value;
});

// 3. УНИВЕРСАЛЬНЫЕ КООРДИНАТЫ (ПК + СМАРТФОН)
function getCoordinates(event) {
    if (event.touches && event.touches.length > 0) {
        const rect = drawingBoard.getBoundingClientRect();
        // Рассчитываем touch-координаты с учетом масштабирования canvas на мобилках
        return {
            x: (event.touches[0].clientX - rect.left) * (board_width / rect.width),
            y: (event.touches[0].clientY - rect.top) * (board_height / rect.height)
        };
    } else {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }
}

// 4. ЛОГИКА РИСОВАНИЯ
function startDrawing(event) {
    isDrawing = true;
    const coords = getCoordinates(event);
    prevMouseX = coords.x;
    prevMouseY = coords.y;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    
    ctx.beginPath();
    if (currentTool === tools.brush) {
        ctx.moveTo(prevMouseX, prevMouseY);
    }
    snapshot = ctx.getImageData(0, 0, board_width, board_height);
}

function draw(event) {
    if (!isDrawing) return;
    
    // Блокируем скролл страницы пальцем во время рисования
    if (event.type === 'touchmove') event.preventDefault();

    const coords = getCoordinates(event);

    if (currentTool === tools.brush) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    } else if (currentTool === tools.rectangle) {
        ctx.putImageData(snapshot, 0, 0);
        ctx.strokeRect(prevMouseX, prevMouseY, coords.x - prevMouseX, coords.y - prevMouseY);
    } else if (currentTool === tools.line) {
        ctx.putImageData(snapshot, 0, 0);
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    }
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

function clearBoard() {
    ctx.clearRect(0, 0, board_width, board_height);
}


drawingBoard.addEventListener("mousedown", startDrawing);
drawingBoard.addEventListener("mousemove", draw);
window.addEventListener("mouseup", stopDrawing);

// Для телефонов (Сенсор)
drawingBoard.addEventListener("touchstart", startDrawing, { passive: false });
drawingBoard.addEventListener("touchmove", draw, { passive: false });
window.addEventListener("touchend", stopDrawing);

// Кнопка очистки
clearBtn.addEventListener('click', clearBoard);