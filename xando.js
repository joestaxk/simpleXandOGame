import XOstate from "./xando_state.js";
import startLearning, { destroyxandolearningprocess } from "./xandolearningprocess.js";
import Gamepad from "./gamepad.js";
import XOIntro from "./xando_intro.js";
// import Gamepad from "./gamepad.js";
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
        this.pend = false
    }

    get pending() {
        return this.pend
    }

    set setpending(value) {
        this.pend = value
    }


    initialize() {
        // set game pending
        this.setpending = false
        var tiles = 9
        for(var i=0; i<tiles; i++) {
            const createTiles = document.createElement("div");
            createTiles.className = "cell";
            createTiles.dataset.tile = i
            this.game_board.append(createTiles)
        }
        // When the game start, 
        // we want to set a default/random player 
        XOstate.setState = {nextplayer: this.startPlayer}
        const player = XOstate.getState.nextplayer;
        document.querySelector(`.${player}`).classList.add("active")

        // create select id
        const select = document.createElement("div");
        select.id = "select"
        this.game_board.append(select)

        this.selectDOM = document.getElementById("select");
        this.selectDOM.textContent = player
        this.setpending = true

        this.createPerson() // players
    }

    createPerson() {
        const leftSidePlayer = document.getElementById("playerx")
        const rightSidePlayer = document.getElementById("playero")

    
        leftSidePlayer.textContent = XOstate.getUserInfo.userX.username;
        rightSidePlayer.textContent = XOstate.getUserInfo.userO.username;
        this.updateRounds()
    }

    updateRounds() {
        // activate versus
        const versus = document.querySelector(".versus")
        const round = document.querySelector("#rounds")
        versus.style.cssText = "color: #ccc";
        round.textContent = `Round ${XOstate.getCurrentRound}`
    }
}



export class PlotXandO extends Xando {
    constructor(x,y) {
        super();
        this.x = x;
        this.y = y;
        this.colorset = false;
        this.selectDOM = document.getElementById("select");
        this.getCellId = [] // ex: 123456789
    }

    Handle_Game_structure() {
        // responsible for adding x and o in the array
        XOstate.setGame = {x:this.x,y:this.y};
        startLearning(this.x, this.y);
    }

    switchTurns() { // switching turns from initial player to nextplayer
        return XOstate.getState.nextplayer === "x" ? XOstate.setState = {nextplayer: "o"} : XOstate.setState = {nextplayer: "x"}
    }

    useTouchAndPlay() {
        const elementPos = XOstate.getGameBoarrd[this.y][this.x];

        const select =  document.getElementById("select");

        if(typeof elementPos !== "number") { // check from the game structure if the column is empty or not
            select.textContent = ""
            return
        }
           select.textContent = XOstate.getState.nextplayer
    }

    plot() {
        const elementPos = this.game_structure[this.y][this.x];
        const elementCopy = XOstate.getGameBoarrd[this.y][this.x];


        const cell = document.querySelector(`[data-tile="${elementPos}"]`)
        // CHECK IF TILE IS AVAILABLE FOR CLICK EVEN AFTER REMOVING THE TEXT FROM CONSOLE 
        // THIS PART HELPS INCASE SOMETHING IS IN THE TILE YOU CAN'T CHANGE IT
        if(typeof elementCopy === "string"){
            return this.useTouchAndPlay()
        }

        this.Handle_Game_structure(elementPos)
    
        this.PlotXandOUI(cell)
        this.switchTurns();

        // lets keep checking for draw here /----no stress
        this.checkForDraw()
    }
    checkForDraw() {
        // the reason am doing this here is because i want to get a good update when ever the game structure is filled
        if(!XOstate.getFilledTiles) return;
        // end game as draw
        this.restructureGameBuild()

    }
    PlotXandOUI(cell) {
        var o = document.querySelector('#playero');
        var x = document.querySelector('#playerx');
        var select = document.getElementById("select");

        if(XOstate.getState.nextplayer === "x") {
            o.classList.add("active")
            x.classList.remove("active")
        }else if(XOstate.getState.nextplayer === "o") {
            o.classList.remove("active")
            x.classList.add("active")
        }
        // making sure the select next player matches 
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
            if(player === "x") {
                cell.style.cssText= `background:${colorPlate_x}`
            }else if(player === "o") {
                cell.style.cssText= `background:${colorPlate_y}`
            }
        }
    }

    ShouldUpdateWinner(plot) {
        // Plot:multidimentional array is based on 3 group item
        // [0,1],[1,1],[2,1]
        if(plot.length >= 3) {
           for(var i = 0; i < 3; i++) {
            //    this is how we get the cell id
               const x = plot[i][1];
               const y = plot[i][0]
               this.getCellId.push(this.game_structure[x][y])
           }
           XOstate.setWinner = this.getCellId;

           setTimeout(()=>this.plotWinningColor(),0) // apply our color last
        }
    }

    plotWinningColor() {
        const winner = XOstate.getWinner;
        if(winner.length) {
            winner.forEach(elementPos => {
                const cell = document.querySelector(`[data-tile="${elementPos}"]`)
                cell.style.cssText = "background:   rgb(42,141,46);color:#fff"
            })
            setTimeout(() => {
                this.restructureGameBuild()
            },500)
        }
    }

    restructureGameBuild() {
        // remove listener from controller, disable our pad
        // define the winner at the top
        // update winning table
        // show button for reset
        // reset game and remove rounds

        const totalRound = XOstate.getUserInfoRound  // 3
        const currentRound = XOstate.getCurrentRound; // 1
        // making certain variables available for this helper
        let getCellId = this.getCellId;
        let game_structure = this.game_structure
        let update_round = this.updateRounds // function

        if(totalRound >= currentRound && XOstate.getWinner.length) { // win
            // Update table
            this.leaderBoard()
            restructureGameBuildHelper()
        }
        else if(totalRound >= currentRound && !XOstate.getWinner.length){  // draw
            this.leaderBoard()
            restructureGameBuildHelper()
            // game still continue
        }
        function restructureGameBuildHelper() {
            const totalRound = XOstate.getUserInfoRound  // 3
            const currentRound = XOstate.getCurrentRound; // 1
            // remove the event from the select tile
            const select_pad = document.getElementById("select");
              
            const game_pad = new Gamepad(select_pad);
            if(currentRound >= totalRound) {
                return cancelGame()
            } // increment 
            
            function cancelGame() {
                const intro = document.querySelector(".intro")
                const intro_b = document.querySelector("#intro")
                // We want to disaable the gamepad
                window.removeEventListener('keydown', game_pad.controls)
                // reset round
                XOstate.setCurrentRound = 0
                XOstate.addBetAmount = {x: 0, o: 0, perstake: 0};
                intro.style.cssText="display:flex";
                const new_intro = new  XOIntro(intro_b, 4)
                new_intro.initiate()
            }

            // game still continue
            if(currentRound < totalRound) {
                // this is where the game permanently ends
                XOstate.setCurrentRound = 1;
            } // increment round
            // reset game:
            getCellId = []

            // If there's bet
            if(XOstate.isThereBet) {
                const betAmountX = document.querySelector("#amountX")
                const betAmountO = document.querySelector("#amountO")

                const getWinner = XOstate.getPlayerThatWin;
                const userInfo = XOstate.getUserInfo

                if(parseInt(userInfo.userX.betAmount) < userInfo.perstake || parseInt(userInfo.userO.betAmount) < userInfo.perstake){
                    alert("you guys ran out of money");
                    cancelGame()
                    return;
                }
                
                // top winner's amount, reduce loser's own
                if(getWinner === "x"){
                    const deduct   = parseInt(userInfo.userO.betAmount) - parseInt(userInfo.perstake);
                    const increase = parseInt(userInfo.userX.betAmount) + parseInt(userInfo.perstake);

                    XOstate.addBetAmount = {x: increase, o: deduct}
                    betAmountX.textContent = `$${userInfo.userX.betAmount}`;
                    betAmountO.textContent = `$${userInfo.userO.betAmount}`;
                }else if(getWinner === "o") {
                    const deduct   = parseInt(userInfo.userX.betAmount) - parseInt(userInfo.perstake);
                    const increase = parseInt(userInfo.userO.betAmount) + parseInt(userInfo.perstake);
                    XOstate.addBetAmount = {x: deduct, o: increase}
                    betAmountX.textContent = `$${userInfo.userX.betAmount}`;
                    betAmountO.textContent = `$${userInfo.userO.betAmount}`;
                }
            }
            // Destroy process learning
            destroyxandolearningprocess()
            XOstate.resetBoard =  game_structure;
            update_round()     
            document.querySelectorAll(".cell").forEach(e => {e.textContent="";e.style.cssText = "background: #ccc;"});
            // Restote the select listener
            window.addEventListener('keydown', game_pad.controls)
            // KEEP chances clean
            const chancesX = Array.from(document.querySelectorAll("#chanceX")) // Nodelist        
            const chancesO = Array.from(document.querySelectorAll("#chanceO")) // Nodelist
            const BGTransparent = `background: transparent;transition:.5s all`
            chancesO.forEach(E => E.style.cssText = BGTransparent); // REMOVE ALL LAST AND SET CURRENT
            chancesX.forEach(E => E.style.cssText = BGTransparent); // REMOVE ALL LAST AND SET CURRENT

        }
    }
    totalGamDestroy(){
        this.restructureGameBuild();
    
    }
    leaderBoard() {
        const getwinner = XOstate.getPlayerThatWin;
        const boardMarkup = `
            <tr class="tr">
                <td class=${getwinner === "x"&&"win"} class="">${getwinner === "x"?"5":"0"}</td>
                <td class=${getwinner === "o"&&"win rt-border"}>${getwinner === "o"?"5":"0"}</td>
            </tr>
        `

        const table = document.querySelector("#leaderboard");
        table.insertAdjacentHTML("beforeend", boardMarkup);
        table.animate([
            {opacity:1},
            {opacity: 0.4}
        ],1000)
        const eval_ = document.querySelector("#eval");
        if(XOstate.getTotalPlayerPoint) {
                eval_.innerHTML = `
                <span class="playerW">${getwinner}</span> wins <sup>+${XOstate.getTotalPlayerPoint}pts</sup>`
        }
    }
}
