const jump = require('./jumpGenerator')
const stream = require('./streamGenerator')
const { clipboard } = require('electron')

const streambutton = document.getElementById('stream')
const jumpbutton = document.getElementById('jump')
const jumpStepbutton = document.getElementById('jumpStep')
const triplebutton = document.getElementById('triple')
const copyToClipboard = document.getElementById('copyToClipboard')
let canvas = document.querySelector("canvas");
let context = document.querySelector("canvas").getContext("2d");

function getOptions() {
    var numMeasures = document.getElementById("numMeasures");
    var canRepeatPattern = document.getElementById("canRepeatPattern");
    var spacingSelection = document.getElementById("spacing");
    var startWithEmpty = document.getElementById("startWithEmpty");
    return { m: numMeasures.value, c: canRepeatPattern.checked, s: spacingSelection.options[spacingSelection.selectedIndex].value, e: startWithEmpty.checked }
}

const arrows = {
    'right': [{ x: 40, y: 20 }, { x: 20, y: 40 }, { x: 20, y: 35 }, { x: 30, y: 25 }, { x: 0, y: 25 }, { x: 0, y: 15 }, { x: 30, y: 15 }, { x: 20, y: 5 }, { x: 20, y: 0 }, { x: 40, y: 20 }],
    'left': [{ x: 0, y: 20 }, { x: 20, y: 40 }, { x: 20, y: 35 }, { x: 10, y: 25 }, { x: 40, y: 25 }, { x: 40, y: 15 }, { x: 10, y: 15 }, { x: 20, y: 5 }, { x: 20, y: 0 }, { x: 0, y: 20 }],
    'up': [{ x: 20, y: 0 }, { x: 40, y: 20 }, { x: 35, y: 20 }, { x: 25, y: 10 }, { x: 25, y: 40 }, { x: 15, y: 40 }, { x: 15, y: 10 }, { x: 5, y: 20 }, { x: 0, y: 20 }, { x: 20, y: 0 }],
    'down': [{ x: 20, y: 40 }, { x: 40, y: 20 }, { x: 35, y: 20 }, { x: 25, y: 30 }, { x: 25, y: 0 }, { x: 15, y: 0 }, { x: 15, y: 30 }, { x: 5, y: 20 }, { x: 0, y: 20 }, { x: 20, y: 40 }]
}

function createArrow(arrowCanvas, row, x, y, color) {
    arrowCanvas.beginPath()
    arrowCanvas.lineWidth = 3
    arrowCanvas.strokeStyle = color
    var arrow = arrows[row]
    arrowCanvas.moveTo((arrow[0].x + x) / 2, (arrow[0].y + y) / 2)
    for (var i = 1; i < arrow.length; i++) {
        arrowCanvas.lineTo((arrow[i].x + x) / 2, (arrow[i].y + y) / 2)
    }
    arrowCanvas.stroke()
}

function createLine(arrowCanvas, y, color) {
    arrowCanvas.beginPath()
    arrowCanvas.lineWidth = 1
    arrowCanvas.strokeStyle = color
    arrowCanvas.moveTo(0, y / 2 )
        arrowCanvas.lineTo(0, y / 2 )
        arrowCanvas.lineTo(100, y / 2)
    arrowCanvas.stroke()
}

function detectColor(index, spacing) {
    switch (spacing) {
        case '4':
            return 'orange'
        case '8':
            switch (index % 2) {
                case 0:
                    return 'orange'
                case 1:
                    return 'blue'
            }
        case '12':
            switch (index % 3) {
                case 0:
                    return 'orange'
                case 1:
                    return 'violet'
                case 2:
                    return 'violet'
            }
        case '16':
            switch (index % 4) {
                case 0:
                    return 'orange'
                case 1:
                    return 'green'
                case 2:
                    return 'blue'
                case 3:
                    return 'green'
            }
        case '20':
            switch (index % 5) {
                case 0:
                    return 'orange'
                case 1:
                    return 'azure'
                case 2:
                    return 'blue'
                case 3:
                    return 'azure'
                case 3:
                    return 'blue'
            }
        case '24':
            switch (index % 6) {
                case 0:
                    return 'orange'
                case 1:
                    return 'violet'
                case 2:
                    return 'violet'
                case 3:
                    return 'blue'
                case 4:
                    return 'violet'
                case 5:
                    return 'violet'
            }
        case '32':
        switch (index % 8) {
            case 0:
                return 'orange'
            case 1:
                return 'yellow'
            case 2:
                return 'green'
            case 3:
                return 'blue'
            case 4:
                return 'yellow'
            case 5:
                return 'green'
            case 6:
                return 'blue'
            case 7:
                return 'yellow'
        }
        case '64':
        switch (index % 10) {
            case 0:
                return 'orange'
            case 1:
                return 'pink'
            case 2:
                return 'yellow'
            case 3:
                return 'green'
            case 4:
                return 'blue'
            case 5:
                return 'pink'
            case 6:
                return 'yellow'
            case 7:
                return 'green'
            case 8:
                return 'blue'
            case 9:
                return 'pink'
        }
    }
}

streambutton.addEventListener('click', () => {
    var options = getOptions()
    var streamRes = stream.generate(options.m, options.s, options.c)
    document.getElementById('content').value = streamRes
    var streamSplit = streamRes.replace(/,\n/g, '').split('\n');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = streamSplit.length * 50/2
    for (var i = 0; i < streamSplit.length; i++) {
        if (streamSplit.length > 2) {
            if(i % options.s === 0){
                createLine(context, i*50, 'black')
            }
            if (streamSplit[i][0] === '1') {
                createArrow(context, 'left', 0, i * 50, detectColor(i,options.s))
            }
            if (streamSplit[i][1] === '1') {
                createArrow(context, 'down', 50, i * 50, detectColor(i,options.s))
            }
            if (streamSplit[i][2] === '1') {
                createArrow(context, 'up', 100, i * 50, detectColor(i,options.s))
            }
            if (streamSplit[i][3] === '1') {
                createArrow(context, 'right', 150, i * 50, detectColor(i,options.s))
            }
        }
    }
})

jumpbutton.addEventListener('click', () => {
    var options = getOptions()
    document.getElementById('content').value = jump.generateSimple(options.m, options.s, options.c)
})

jumpStepbutton.addEventListener('click', () => {
    var options = getOptions()
    document.getElementById('content').value = jump.generateSimpleJumpStep(options.m, options.s, options.c)
})

triplebutton.addEventListener('click', () => {
    var options = getOptions()
    document.getElementById('content').value = stream.generateTriple(options.m, options.s, options.c, options.e)
})

copyToClipboard.addEventListener('click', () => {
    clipboard.writeText(document.getElementById('content').value)
})
