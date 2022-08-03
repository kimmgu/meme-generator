import './style.css'

document.querySelector('#app').innerHTML = `
<canvas></canvas>
<input id="line-width" type="range" min="1" max="10" value="3" step="0.5" />
<div class="palette">
  <input id="color" type="color" />
  <div class="color-option" style="background-color: #55efc4" data-color="#55efc4"></div>
  <div class="color-option" style="background-color: #81ecec" data-color="#81ecec"></div>
  <div class="color-option" style="background-color: #74b9ff" data-color="#74b9ff"></div>
  <div class="color-option" style="background-color: #a29bfe" data-color="#a29bfe"></div>
  <div class="color-option" style="background-color: #dfe6e9" data-color="#dfe6e9"></div>
  <div class="color-option" style="background-color: #00b894" data-color="#00b894"></div>
  <div class="color-option" style="background-color: #00cec9" data-color="#00cec9"></div>
  <div class="color-option" style="background-color: #0984e3" data-color="#0984e3"></div>
  <div class="color-option" style="background-color: #6c5ce7" data-color="#6c5ce7"></div>
  <div class="color-option" style="background-color: #b2bec3" data-color="#b2bec3"></div>
  <div class="color-option" style="background-color: #ffeaa7" data-color="#ffeaa7"></div>
  <div class="color-option" style="background-color: #fab1a0" data-color="#fab1a0"></div>
  <div class="color-option" style="background-color: #ff7675" data-color="#ff7675"></div>
  <div class="color-option" style="background-color: #fd79a8" data-color="#fd79a8"></div>
  <div class="color-option" style="background-color: #636e72" data-color="#636e72"></div>
  <div class="color-option" style="background-color: #fdcb6e" data-color="#fdcb6e"></div>
  <div class="color-option" style="background-color: #e17055" data-color="#e17055"></div>
  <div class="color-option" style="background-color: #d63031" data-color="#d63031"></div>
  <div class="color-option" style="background-color: #e84393" data-color="#e84393"></div>
  <div class="color-option" style="background-color: #2d3436" data-color="#2d3436"></div>
</div>
<div class="btns">
  <button id='mode-btn'>Fill</button>
  <button id='eraser-btn'>Eraser</button>
  <button id='clear-btn'>Clear</button>
  <label for="file"> Open
    <input type="file" accept="image/*" id="file" />
  </label>
  <input type="text" placeholder="Double-click to write text" id="text" />
  <button id='save-btn'>Save</button>
</div>
`

const saveBtn = document.getElementById('save-btn')
const textInput = document.getElementById('text')
const fileInput = document.getElementById('file')
const modeBtn = document.getElementById('mode-btn')
const eraserBtn = document.getElementById('eraser-btn')
const clearBtn = document.getElementById('clear-btn')
const colorOptions = Array.from(document.getElementsByClassName('color-option'))
const color = document.getElementById('color')
const lineWidth = document.getElementById('line-width')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = canvas.height = 800
ctx.lineWidth = lineWidth.value
ctx.lineCap = 'round'
let isPainting = false
let isFilling = false

function onMove(e) {
  if (isPainting) {
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
    return
  }
  ctx.beginPath()
  ctx.moveTo(e.offsetX, e.offsetY)
}
function startPainting() {
  isPainting = true
}
function cancelPainting() {
  isPainting = false
}
function onLineWidthChange(e) {
  ctx.lineWidth = e.target.value
}
function onColorChange(e) {
  ctx.strokeStyle = e.target.value
  ctx.fillStyle = e.target.value
}
function onColorClick(e) {
  const colorValue = e.target.dataset.color
  ctx.strokeStyle = colorValue
  ctx.fillStyle = colorValue
  color.value = colorValue
}
function onModeClick() {
  if (isFilling) {
    isFilling = false
    modeBtn.innerText = 'Fill'
  } else {
    isFilling = true
    modeBtn.innerText = 'Brushes'
  }
}
function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}
function onEraserClick() {
  ctx.strokeStyle = 'snow'
  isFilling = false
  modeBtn.innerText = 'Fill'
}
function onClearClick() {
  ctx.fillStyle = 'snow'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
function onFileChange(e) {
  const file = e.target.files[0]
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.src = url
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    fileInput.value = null
  }
}
function onDoubleClick(e) {
  const text = textInput.value
  if (text !== '') {
    ctx.save()
    ctx.lineWidth = 1
    ctx.font = '32px Verdana'
    ctx.fillText(text, e.offsetX, e.offsetY)
    ctx.restore()
  }
}
function onSaveClick() {
  const url = canvas.toDataURL()
  const a = document.createElement('a')
  a.href = url
  a.download = 'canvas.png'
  a.click()
}

canvas.addEventListener('dblclick', onDoubleClick)
canvas.addEventListener('mousemove', onMove)
canvas.addEventListener('mousedown', startPainting)
canvas.addEventListener('mouseup', cancelPainting)
canvas.addEventListener('mouseleave', cancelPainting)
canvas.addEventListener('click', onCanvasClick)

lineWidth.addEventListener('change', onLineWidthChange)
color.addEventListener('change', onColorChange)

colorOptions.forEach((color) => color.addEventListener('click', onColorClick))

modeBtn.addEventListener('click', onModeClick)
eraserBtn.addEventListener('click', onEraserClick)
clearBtn.addEventListener('click', onClearClick)

fileInput.addEventListener('change', onFileChange)

saveBtn.addEventListener('click', onSaveClick)
