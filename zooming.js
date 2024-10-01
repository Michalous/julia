const canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d')
const juliaCanvas = document.getElementById('juliaCanvas')
const juliaCtx = juliaCanvas.getContext('2d')
const coordsDisplay = document.getElementById('coords');

let centerX = -0.62; // Initial center x-coordinate
let centerY = 0; // Initial center y-coordinate
let rangeX = 2.8; // Initial range for x
let rangeY = 2.5; // Initial range for y


function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function convertToNewRange(value, oldMin, oldMax, newMin, newMax) {
    return newMin + ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin);
}


// Event listener for mouse move
canvas.addEventListener('mousemove', function(evt) {
    const mousePos = getMousePos(canvas, evt);
    const newX = convertToNewRange(mousePos.x, 0, 500, centerX - rangeX / 2, centerX + rangeX / 2);
    const newY = convertToNewRange(mousePos.y, 0, 500, centerY + rangeY / 2, centerY - rangeY / 2);
    const message = 'Mouse Coordinates: (' + newX + ', ' + newY + ')';
    coordsDisplay.textContent = message;
    loopOverJuliaCanvas(newX, newY)
});

canvas.addEventListener('click', function(evt) {
    // clearCanvas()
    const mousePos = getMousePos(canvas, evt);
    // const newX = convertToNewRange(mousePos.x, 0, 500, centerX - rangeX / 2, centerX + rangeX / 2);
    // const newY = convertToNewRange(mousePos.y, 0, 500, centerY + rangeY / 2, centerY - rangeY / 2);
    const message = 'Mouse Coordinates: (' + newX + ', ' + newY + ')';
    coordsDisplay.textContent = message;

    loopOverCanvas()
    loopOverJuliaCanvas(newX, newY)
    
});

// Event listener for right click to zoom out
// canvas.addEventListener('contextmenu', function(evt) {
//     evt.preventDefault(); // Prevent the context menu from appearing
//     showZoom.textContent = zoom
//     zoomOut(evt);
// });


// Function to loop over each xy value
function loopOverCanvas() {
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const newX = convertToNewRange(x, 0, canvas.width, centerX - rangeX / 2, centerX + rangeX / 2);
            const newY = convertToNewRange(y, 0, canvas.height, centerY + rangeY / 2, centerY - rangeY / 2);
            drawDot(x, y, 0.75, divTest(newX, newY));
            
        }
    }
}

function loopOverJuliaCanvas(re, im) {
    for (let x = 0; x < juliaCanvas.width; x++) {
        for (let y = 0; y < juliaCanvas.height; y++) {
            const neX = convertToNewRange(x, 0, juliaCanvas.width, -2, 2);
            const neY = convertToNewRange(y, 0, juliaCanvas.height, 2, -2);
            drawJuliaDot(x, y, 0.75, juliaTest(neX, neY, re, im));
            
        }
    }
}

let coloursToDraw = ['rgb(66, 30, 15)', 
                    'rgb(25, 7, 26)', 
                    'rgb(9, 1, 47)', 
                    'rgb(4, 4, 73)', 
                    'rgb(0, 7, 100)', 
                    'rgb(12, 44, 138)', 
                    'rgb(24, 82, 177)', 
                    'rgb(57, 125, 209)', 
                    'rgb(134, 181, 229)', 
                    'rgb(211, 236, 248)', 
                    'rgb(241, 233, 191)', 
                    'rgb(248, 201, 95)', 
                    'rgb(255, 170, 0)', 
                    'rgb(204, 128, 0)', 
                    'rgb(153, 87, 0)', 
                    'rgb(106, 52, 3)']


// Test of divergence
function divTest(real, imaginary) {
    
    if ((real**2 + imaginary**2) > 4) {
        return 'rgb(0, 0, 0)'
    }
    let z = new Complex(real, imaginary)
    let z_it = new Complex(0, 0)
    for (var i = 0; i < 1000; i++) {
        z_it = z_it.multiply(z_it)
        z_it = z_it.add(z)
        if (z_it.re**2 + z_it.im**2 > 4) {
            return coloursToDraw[i % 16]
        } 
    }
    return 'rgb(0, 0, 0)'
}

function juliaTest(real, imaginary, re, im) {
    if ((real**2 + imaginary**2) > 4) {
        return 'rgb(0, 0, 0)'
    }
    // let c = new Complex(-0.79, 0.15)
    let c = new Complex(re, im)
    let z = new Complex(real, imaginary)
    for (var i = 0; i < 100; i++) {
        z = z.multiply(z)
        z = z.add(c)
        if (z.re**2 + z.im**2 > 4) {
            return coloursToDraw[i%16]
        }
    }
    return 'rgb(0, 0, 0)'
}

// Drawing points in canvas
function drawJuliaDot(x, y, r, color) {
    juliaCtx.beginPath()
    juliaCtx.arc(x, y, r, 0, 2 * Math.PI)
    juliaCtx.fillStyle = color
    juliaCtx.fill()
}

// Clear canvas
function clearJuliaCanvas() {
    // const juliactx = canvas.getContext('2d');
    juliaCtx.clearRect(0, 0, juliaCanvas.width, juliaCanvas.height);
}

// Define a Complex class
class Complex {
    constructor(re, im) {
    this.re = re
    this.im = im
    }

    add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
    }

    multiply(other) {
    return new Complex(
        this.re * other.re - this.im * other.im,
        this.re * other.im + this.im * other.re
    );
    }

    toString() {
    return `${this.re} + ${this.im}i`;
    }
}

// Drawing points in canvas
function drawDot(x, y, r, color) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}

// Clear canvas
function clearCanvas() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


loopOverCanvas()
loopOverJuliaCanvas(-0.62, 0)