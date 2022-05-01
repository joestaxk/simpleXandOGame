import XOstate from "./xando_state.js";
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

    changeSelectorLocation() {
        console.log(this.#x, this.y);
    }

    controls(ev) {
        ev = ev;
        var acceptableKeys= ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]
        const X = axis_[0];
        const Y = axis_[1]

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
            changeSelectorLocation(X,Y)
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
function avoidDryPrincipleOnUseTouchAndPlay(){
    const plot = new PlotXandO(axis_[0],axis_[1])
    plot.useTouchAndPlay()
}

function ArrowUp() {
    avoidDryPrincipleOnUseTouchAndPlay()
    return controlHelper(Y, axis_[Y]-1) // add up along y axis
}

// AXIS Y
function ArrowDown() {
    avoidDryPrincipleOnUseTouchAndPlay()
    return controlHelper(Y, axis_[Y]+1) // add up along y axis
}

// AXIS X
function ArrowLeft() {
    avoidDryPrincipleOnUseTouchAndPlay()
    return controlHelper(X, axis_[X]-1) // add up along y axis
}

// AXIS X
function ArrowRight() {
    avoidDryPrincipleOnUseTouchAndPlay()
    return controlHelper(X, axis_[X]+1) // add up along y axis
}


// CHECK LOCATION 
function changeSelectorLocation(x,y) {
    const YaxisLine = XOstate.getGame[y]; // use this for all side

    const firstLine = checkIfCellOccupied(YaxisLine);    
    if(firstLine.checkIfAllCellIsOccupied){
        // let getNumberOfAvailableCell =  AllLine.checkHowManyCellAvailable;
        // Check other rows and axis look for available space
        // we are going Y AXIS ONLY
        var getCellPoints = [];
        const getTheRowIndex = XOstate.getGame.indexOf(YaxisLine)
        
        var numberOfRow = 2; // counting from zero

        var findNextRow = getTheRowIndex < 1 ? 1 : getTheRowIndex >= numberOfRow ? 0 : 2;

        XOstate.getGame.forEach(rows => {
            const AllLine = checkIfCellOccupied(rows);
            let getNumberOfAvailableCell =  AllLine.checkHowManyCellAvailable;

            getNumberOfAvailableCell.filter((cell,i) => {
                if(typeof cell !== "boolean") {
                        getCellPoints.push(cell); // [1234567] position by id
                        return getCellPoints;
                }
            })
        })

        const nextFullRow = XOstate.getGame[findNextRow]


        // check the row, and get the minimum available number
        var getCheckedForX = [];
        const checkIndexForX = getCellPoints.map(num =>  nextFullRow.indexOf(num) !== -1?getCheckedForX.push(nextFullRow.indexOf(num)):-1);
        console.log(checkIndexForX, nextFullRow, getCheckedForX);

        var point_ = Math.min(...getCheckedForX)

        // If we can up or down
        controlHelper(Y,findNextRow)
        // But we need to find the particular empty cell in the x axis
        controlHelper(X, point_) 

    }

    if(firstLine.isCellAvailable) {
        let getNumberOfAvailableCell =  firstLine.checkHowManyCellAvailable;
        // we are going X AXIS ONLY
        // WHERE ARE WE MOVING? We should allow the system to decide randomely
        // change variable name; use point as ref
        var getCellPoints = [];

        getNumberOfAvailableCell.filter((cell,i) => {
            if(typeof cell !== "boolean") {
                    getCellPoints.push(i);
                    return getCellPoints;
            }
        })
        var point_ = Math.max(...getCellPoints)
        controlHelper(X,point_)
    }
}

/**
 * 
 * @param {Array} group 
 */
function checkIfCellOccupied(group) {
    return {
        checkIfAllCellIsOccupied: group.every(cell => typeof cell !== "number" ? true : false),
        checkHowManyCellAvailable: group.map((cell, i) =>  typeof cell === "number" ? cell: true),
        isCellAvailable: group.some((cell, i) =>  typeof cell === "number" ? true: false)
    }
}