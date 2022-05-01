import XOstate from "./xando_state.js";
// Using enter we decide who plays next

// X = 0; Y = 1
export default class Xando {
    constructor(game_board) {
        this.game_board = game_board;
        this.game_structure = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ],
        this.startPlayer = XOstate.getRandomPlayer; 
        this.selectDOM = null;
    }
    game_rules() {
        // SOME CODES HERE
        /**
         * X represent 'x'
         * Y represent '0'
         */
    }

    initialize() {
        var tiles = 9
        for(var i=0; i<tiles; i++) {
            const createTiles = document.createElement("div");
            createTiles.className = "cell";
            createTiles.dataset.tile = i
            this.game_board.append(createTiles)
        }
        const select = document.createElement("div");
        select.id = "select";
        this.game_board.append(select)


        // When the game start, 
        // we want to set a default/random player 
        XOstate.setState = {nextplayer: this.startPlayer}
        const player = XOstate.getState.nextplayer;
        document.querySelector(`.${player}`).classList.add("active")
        this.selectDOM = document.getElementById("select");
        this.selectDOM.textContent = player
    }
}

export class PlotXandO extends Xando {
    constructor(x,y) {
        super();

        this.x = x;
        this.y = y;
        this.colorset = false;
        this.selectDOM = document.getElementById("select");
    }

    Handle_Game_structure() {
        // responsible for adding x and o in the array
        XOstate.setGame = {x:this.x,y:this.y};
    }

    switchTurns() {
        return XOstate.getState.nextplayer === "x" ? XOstate.setState = {nextplayer: "o"} : XOstate.setState = {nextplayer: "x"}
    }

    useTouchAndPlay() {
        const elementPos = this.game_structure[this.y][this.x];

        const cell = document.querySelector(`[data-tile="${elementPos}"]`)
        const select =  document.getElementById("select");

        console.log(cell.textContent === "x");
        if(cell.textContent === "x" || cell.textContent === "o") {
            console.log(select);
            select.textContent = ""
            return
        }
           select.textContent = XOstate.getState.nextplayer
    }

    plot() {
        const elementPos = this.game_structure[this.y][this.x];

        const cell = document.querySelector(`[data-tile="${elementPos}"]`)
        
        if(cell.textContent === "x" || cell.textContent === "o"){
            return this.useTouchAndPlay()
        }

        this.Handle_Game_structure(elementPos)
    
        this.PlotXandOUI(cell)
        this.switchTurns();
    }

    PlotXandOUI(cell) {
        var o = document.querySelector('.o');
        var x = document.querySelector('.x');
        var select = document.getElementById("select");

        if(XOstate.getState.nextplayer === "x") {
            o.classList.add("active")
            x.classList.remove("active")
        }else if(XOstate.getState.nextplayer === "o") {
            o.classList.remove("active")
            x.classList.add("active")
        }

        select.textContent = XOstate.getState.nextplayer==="x"?"o":"x"
        cell.textContent = XOstate.getState.nextplayer
        this.colorTab(select.textContent, cell)
    }

    colorTab(player, cell) {
        /**
         * Different color plate ex:
         * if(X) use blue
         * else if(O) use light blue
         */
        var color,saturation,hue;
        if(!this.colorset){
            color = 0
            saturation = 7
            hue = 75
        }
         
         const colorPlate_x = `hsl(${color}, ${saturation - 10}%, ${hue - 20}%);`
         const colorPlate_y = `hsl(${color}, ${saturation - 25}%, ${hue - 5}%);`

        player = typeof player === "string"?player:null;

        if(player) {
            // player = player === "x"?"x":"o";
            console.log(player, colorPlate_x);
            if(player === "x") {
                cell.style.cssText= `background:${colorPlate_x}`
            }else if(player === "o") {
                cell.style.cssText= `background:${colorPlate_y}`
            }
        }
    }
}
