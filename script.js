const drawingBoard = document.getElementById('drawing-board');
const colorPickInput = document.getElementById('color-pick-input');
const lineWidthInput = document.getElementById('line-width-input');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const colorList = document.getElementById('color-list');
const toolsList = document.getElementById('tools-list');

const ctx = drawingBoard.getContext('2d');


const board_width = drawingBoard.width = 600
const board_height = drawingBoard.height = 500

let lineWidth = lineWidthInput.value
let currentColor = colorPickInput.value
let isDrawing = false


const colors = ["black", "red", "green", "blue", "orange", "yellow"]
const tools = {
    brush: "b",
    rectangle: "r",
    line: "l",
}
let currentTool = tools.rectangle
let prevMouseX = null
let prevMouseY = null
let snapshat = null


function drawBrush(event){
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineTo(event.offsetX, event.offsetY)
    ctx.stroke()
}


function draw(event){
    if(!isDrawing) return
    if(currentTool === tools.brush){
        drawBrush(event)
    }else if(currentTool === tools.rectangle){
        drawRect(event)
    }else if(currentTool === tools.line){
      
    }
}




function startDrawing(event){
    isDrawing = true
    // ctx.strokeStyle = currentColor
    // ctx.strokeStyle = lineWidth
    // ctx.beginPath()

    prevMouseX = event.offsetX
    prevMouseY = event.offsetY
    ctx.strokeStyle = currentColor
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    snapshat = ctx.getImageData(0, 0, board_width, board_height)
}

function stopDrawing(){
isDrawing = false
ctx.closePath()
}

function drawRect(event){
    ctx.putImageData(snapshat, 0, 0)
    ctx.strokeRect(prevMouseX, prevMouseY, event.offsetX, event.offsetY - prevMouseY)
}



drawingBoard.addEventListener("mousemove", draw)
window.addEventListener("mousedown", startDrawing)
window.addEventListener("mouseup", stopDrawing)