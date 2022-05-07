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

    controls(ev) {
        ev = ev;
        const keycode = ev.key.toLowerCase()
        var acceptableKeys= ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"]
        if(acceptableKeys.some(key => key.toLowerCase() === keycode)) {
            // arrows
            switch(keycode) {
                case "arrowup":
                    ArrowUp();
                    break;
                case "arrowdown": 
                    ArrowDown();
                    break;
                case "arrowleft": 
                    ArrowLeft();
                    break;
                case "arrowright": 
                    ArrowRight();
                    break;
                default:
                    secondaryKeys()
            }

            function secondaryKeys() {
                // Letters
                switch(keycode) {
                    case "w":
                        ArrowUp();
                        break;
                    case "s": 
                        ArrowDown();
                        break;
                    case "a": 
                        ArrowLeft();
                        break;
                    case "d": 
                        ArrowRight();
                        break;
                    default:
                        break;
                }
            }
        }

        if(ev.key.toLowerCase() === "enter" || ev.code.toLowerCase() === "space") {
            const X = axis_[0];
            const Y = axis_[1]
            const plot = new PlotXandO(X,Y)
            // Plot Will also return where not to go.
            plot.plot()
            changeSelectorLocation(X,Y)
            Chance_of_Winning()
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


        // check the row, and get the minimum available number in the array
        var getCheckedForX = [];
        const checkIndexForX = getCellPoints.map(num =>  nextFullRow.indexOf(num) !== -1?getCheckedForX.push(nextFullRow.indexOf(num)):-1);

        var point_ = Math.min(...getCheckedForX)

        // If we can up or down
        controlHelper(Y,findNextRow)
        // we need to find the particular empty cell in the x axis
        controlHelper(X,point_) 

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


// Update chance immediately

function Chance_of_Winning(){
     // chances
    // get all elememt
    const chancesX = Array.from(document.querySelectorAll("#chanceX")) // Nodelist
    const inflowChanceX = XOstate.getChancesForX;

    const chancesO = Array.from(document.querySelectorAll("#chanceO")) // Nodelist
    const inflowChanceO = XOstate.getChancesForO;

    const BG = `background: rgba(255, 0, 0, %strength%);transition:.5s all`
    const BGTransparent = `background: transparent;transition:.5s all`

    // reverse to start from end
    let lastXC = 0;
    var lastOC = 0;
    if(inflowChanceX.length){ 
        // What we want to do here is to check if OPlayer has played before and then we want to clear the chance box
        if(lastOC) {
            chancesO.forEach(E => E.style.cssText = BGTransparent); // REMOVE ALL LAST AND SET CURRENT
            for(var K = 0, L = inflowChanceO.length; K < L; K++) {
                chancesO[K].style.cssText = BG.replace("%strength%", 0.5*(K+1)/3)//SET NEW FOR X
            }
        }

        for(var i = 0, j = inflowChanceX.length; i < j; i++) {
            // At first we need to add the first chances
            chancesX[i].style.cssText =  BG.replace("%strength%", 0.5*(i+1)/3 )//since we want to start from opacity 0.5
            // Keep the adde number of chances
            lastXC = inflowChanceO.length
        }   
    }

    // reverse to start from end
    if(inflowChanceO.length){ 
        // What we want to do here is to check if Xplayer has played before and then we want to clear the chance box
        if(lastXC) {
            chancesX.forEach(E => E.style.cssText = BGTransparent); // REMOVE ALL LAST AND SET CURRENT
            for(var K = 0, L = inflowChanceX.length; K < L; K++) {
                chancesX[K].style.cssText = BG.replace("%strength%", 0.5*(K+1)/3 )//SET NEW FOR X
            }
        }

        for(var i = 0, j = inflowChanceO.length; i < j; i++) {
            // At first we need to add the first chances
            chancesO[i].style.cssText = BG.replace("%strength%", 0.5*(i+1)/3 )//since we want to start from opacity 0.5
        } 
    } 
}