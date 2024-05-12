let RANGE = 50
const seed_lines = []
const slopes = []
const line_tips = []
let loop_started = false
let loop_counter = 0

// User input from sliders in sketch 1
let R1 = 255
let G1 = 100
let B1 = 120

// Values set randomly in sketch 2
let R1_actual = getRandomNumber(0, 255)
let G1_actual = getRandomNumber(0, 255)
let B1_actual = getRandomNumber(0, 255)

/* var range_slider = document.getElementById("rangeSlider")
range_slider.oninput = function() {
    RANGE = this.value
} */

var blue_slider = document.getElementById("blueSlider")
blue_slider.oninput = function() {
    B1 = this.value
}

var green_slider = document.getElementById("greenSlider")
green_slider.oninput = function() {
    G1 = this.value
}

var red_slider = document.getElementById("redSlider")
red_slider.oninput = function() {
    R1 = this.value
}

let isPopupVisible = false
function checkForMatch() {
    let error = 60
    if ((R1_actual - error < R1 && R1 < R1_actual + error)
        && (G1_actual - error < G1 && G1 < G1_actual + error)
        && (G1_actual - error < G1 && G1 < G1_actual + error)) {
            console.log("THERE WAS A MATCH")
            // Update the score value
            var score_element = document.getElementById("score-counter")
            var score_value = score_element.innerHTML
            score_element.innerHTML = parseInt(score_value) + 1

            // Change result text to say "Correct!"
            var result_text = document.getElementById("result-text")
            result_text.innerHTML = "Correct!"
    } else {
        console.log("NO MATCH")
        // Change result text to say "Try again"
        var result_text = document.getElementById("result-text")
        result_text.innerHTML = "Try again!"
    }

    // Update the score value
    var score_element = document.getElementById("score-counter")
    var score_value = score_element.innerHTML
    console.log(score_value) 
    
    // Show the result popup 
    var result_screen = document.getElementById("myPopup")
    console.log(result_screen.classList)
    if (!result_screen.classList.contains("show")) {
        result_screen.classList.toggle("show")
        isPopupVisible = true
    } 
}

function getNewCoordinates(seed_index, curr_line_index, slope) {
    let norm_x = line_tips[seed_index][curr_line_index][0]
    let norm_y = line_tips[seed_index][curr_line_index][1]

    let new_x = seed_index == 6 ? norm_x - getRandomNumber(slope[1] - RANGE/5, slope[1] + RANGE) : norm_x + getRandomNumber(slope[1] - RANGE/5, slope[1] + RANGE)
    let new_y = seed_index <= 6 ? norm_y - getRandomNumber(slope[0] - RANGE/5, slope[0] + RANGE) : norm_y + getRandomNumber(slope[0] - RANGE/5, slope[0] + RANGE)
    return [new_x, new_y]
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}

const sketch1 = p => {
    p.setup = function() {
        p.createCanvas(500, 500)
        p.background(220)
        for (let seed_index = 0; seed_index < 12; seed_index++) {
            let x = Math.cos(seed_index * (Math.PI/6)) 
            let y = Math.sin(seed_index * (Math.PI/6))
            let slope = [y*10, x*10]
            x += p.width
            y += p.height
            seed_lines.push([[x, y]])
            if (seed_index < 6) {
                slopes.push(slope)
            }
        }
        // console.log(`Seed lines: ${seed_lines}`)
        // console.log(`Slopes: ${slopes}`)
    }
    
    p.resetCanvas = function() {
        p.background(220)
    }
    
    p.drawShapes = function() {
        let curr_x = p.width/2
        let curr_y = p.width/2

        p.stroke(R1, G1, B1)
        for (let seed_index = 0; seed_index < 12; seed_index++) {
            let slope = slopes[seed_index % (12/2)]
            let curr_line_index = 0
            while (curr_x <= p.width && curr_y <= p.height && curr_x >= 0 && curr_y >= 0) {
                var new_coords = getNewCoordinates(seed_index, curr_line_index, slope)
                
                p.line(curr_x, curr_y, new_coords[0], new_coords[1])
    
                curr_x = new_coords[0]
                curr_y = new_coords[1]
                curr_line_index++
                if (curr_line_index > 28) {
                    break
                }
            }
            curr_x = p.width/2
            curr_y = p.width/2
            curr_line_index=0
        }
    }
    
    p.draw = function() {
        let curr_x = p.width/2
        let curr_y = p.width/2
        p.stroke(0, 0, 0)
        p.strokeWeight(4)
        if (loop_started === false) {
            loop_started = true
            for (let seed_index = 0; seed_index < 12; seed_index++) {
                let slope = slopes[seed_index % (12/2)]
                let curr_line = []
                //console.log(slope)
                while (curr_x <= p.width && curr_y <= p.height && curr_x >= 0 && curr_y >= 0) {
                    const new_x = seed_index == 6 ? curr_x - slope[1] : curr_x + slope[1]
                    const new_y = seed_index <= 6 ? curr_y - slope[0] : curr_y + slope[0]
                    p.line(curr_x, curr_y, new_x, new_y)
                    curr_line.push([new_x, new_y])
        
                    curr_x = new_x
                    curr_y = new_y
                }
                line_tips.push(curr_line)
                curr_x = p.width/2
                curr_y = p.width/2
            }
            //console.log(line_tips)
        } else {
            p.resetCanvas()
            p.drawShapes()
        }
    }
}

const sketch2 = p => {
    p.setup = function() {
        R1_actual = Math.random()*255
        B1_actual = Math.random()*255
        G1_actual = Math.random()*255
        p.createCanvas(500, 500)
        p.background(220)
        for (let seed_index = 0; seed_index < 12; seed_index++) {
            let x = Math.cos(seed_index * (Math.PI/6)) 
            let y = Math.sin(seed_index * (Math.PI/6))
            let slope = [y*10, x*10]
            x += p.width
            y += p.height
            seed_lines.push([[x, y]])
            if (seed_index < 6) {
                slopes.push(slope)
            }
        }
        // console.log(`Seed lines: ${seed_lines}`)
        console.log(`Slopes: ${slopes}`)
    }
    
    p.resetCanvas = function() {
        p.background(220)
    }
    
    p.drawShapes = function() {
        let curr_x = p.width/2
        let curr_y = p.width/2

        p.stroke(R1_actual, G1_actual, B1_actual)
        for (let seed_index = 0; seed_index < 12; seed_index++) {
            let slope = slopes[seed_index % (12/2)]
            let curr_line_index = 0
            while (curr_x <= p.width && curr_y <= p.height && curr_x >= 0 && curr_y >= 0) {
                var new_coords = getNewCoordinates(seed_index, curr_line_index, slope)

                p.line(curr_x, curr_y, new_coords[0], new_coords[1])
                
                curr_x = new_coords[0]
                curr_y = new_coords[1]
                curr_line_index++
                if (curr_line_index > 28) {
                    break
                }
            }
            curr_x = p.width/2
            curr_y = p.width/2
            curr_line_index=0
        }
    }
    
    p.draw = function() {
        p.stroke(0, 0, 0)
        p.strokeWeight(4)
        p.resetCanvas()
        p.drawShapes()
    }
}

new p5(sketch1, "sketch1")
new p5(sketch2, "sketch2")

