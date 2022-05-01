import { PlotXandO  } from "./xando.js";

// New array
const randomPos = () => Math.floor(Math.random() * 3)
const [x,y] = [randomPos(),randomPos()]
var axis_ = [x,y]; // [x, y]

export default class Gamepad {
    #x = axis_[0];
    #y = axis_[1];
    constructor(select) {
        this.select = select;
    }
    set x(value) {
        return this.#x = value;
    }
    set y(value) {
        return this.#y = value;
    }

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }

    initialize() {
        this.select.style.setProperty("--x", this.x)
        this.select.style.setProperty("--y", this.y)

    }

    controls(ev) {
        ev = ev;
        var acceptableKeys= ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]

        if(acceptableKeys.some(key => key === ev.key)) {
            switch(ev.key) {
                case "ArrowUp":
                    ArrowUp();
                    break;
                case "ArrowDown": 
                    ArrowDown();
                    break;
                case "ArrowLeft": 
                    ArrowLeft();
                    break;
                case "ArrowRight": 
                    ArrowRight();
                    break;
                default:
                    this.initialize()
            }
        }
        if(ev.key.toLowerCase() === "enter") {
            const X = axis_[0];
            const Y = axis_[1]
            const plot = new PlotXandO(X,Y)
            // Plot Will also return where not to go.
            plot.plot()
        }
    }

}

/**
 * 
 * @param {Number} axis 
 * @param {Number} point 
 * 
 * axis is X:0||Y:1
 * point is the movement
 */
function controlHelper(axis,point=0) {
    const limit = 2;

    // initialize
    const select = document.getElementById('select');
    const gamepad = new Gamepad(select);
    
    if(point > -1 && point <= limit && axis < axis_.length) {
        const start = axis;
        const end   = start+1;

        axis_.fill(point, start, end)
        
        gamepad.x = axis_[0]
        gamepad.y = axis_[1]
    }

    gamepad.initialize()

}

const X = 0
const Y = 1;
// AXIS Y
function ArrowUp() {
    return controlHelper(Y, axis_[Y]-1) // add up along y axis
}

// AXIS Y
function ArrowDown() {
    return controlHelper(Y, axis_[Y]+1) // add up along y axis
}

// AXIS X
function ArrowLeft() {
    return controlHelper(X, axis_[X]-1) // add up along y axis
}

// AXIS X
function ArrowRight() {
    return controlHelper(X, axis_[X]+1) // add up along y axis
}