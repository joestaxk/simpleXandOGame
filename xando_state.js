

var state = {
    randomPlayer: () => ['x','o'][Math.floor(Math.random()*2)],
    setPlayer: null,
    nextplayer: null,
    game_structure: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ],
    Xchances: [],
    Ochances: [],
    trashChances: [],
    winnerLine: [],
    theWinnerIs:"",
    currentRound: 1,
    userInfo: {
        userX:{
            username:"",
            betAmount: 0
        },
        userO: {
            username:"",
            betAmount: 0
        },
        round: 0,
        perstake: 0,
    },
    intro: false,
    owinningPoint: 0,
    xwinningPoint: 0,
    perPoint: 5,
    isThereBet: false,
}

export default class XOstate {
    static set setState(value = {nextplayer: 'x'}){
        value = typeof value === "object" ? value : null;
        if(value) {
            if(!state.hasOwnProperty("nextplayer")) throw Error("ERROR IN OBJECT");
            return state.nextplayer = value;
        }
    }

    static set addBetAmount(value) {
        state.userInfo.userX.betAmount = value.x;
        state.userInfo.userO.betAmount = value.o;
        state.userInfo.perstake = value.perstake?value.perstake:state.userInfo.perstake
        return state.isThereBet = true
    }
    static get isThereBet() {
        return state.isThereBet
    }


    static set setCurrentRound(value) {
        state.currentRound += value ;
    }
    static get getCurrentRound() {
        return state.currentRound
    }

    static set setUserInfo(value) {
        const whichSide = value.choose === "x" ? state.userInfo.userX : state.userInfo.userO;
        whichSide.username = value.user ;
    }

    static get getUserInfo() {
        return state.userInfo;
    }

    static set setUserInfoRound(value) {
        state.userInfo.round = value ;
    }
    static get getIntroState() {
        return state.intro;
    }
    static set setIntroState(value) {
        state.intro = value
    }
    static get getUserInfoRound() {
        return state.userInfo.round 
    }
    static get getState() {
        return state.nextplayer;
    }

    static set setGame(value) {
        value = typeof value === "object" ? value : null;
        if(value) {
            if(!value.hasOwnProperty("x")&&!value.hasOwnProperty("o")) throw Error("ERROR IN OBJECT");
            return state.game_structure[value.y][value.x] = XOstate.getState.nextplayer;
        }
    }

    static set resetBoard(value) {
        state.game_structure = value
    }

    static get getGameBoarrd() {
        return state.game_structure
    }

    static get getGame() {
        return state.game_structure
    }

    static get getRandomPlayer() {
        return state.setPlayer=== null?state.randomPlayer():''
    }
    static set setStartingPlayer(value){
        state.setPlayer = value;
    }

     // XANDO LEARNING PROCESS AREA
    static set setChancesForX(value) {
        // VALUE IS ARRAY
        if(state.Xchances.length) {
            return value.filter(newvalue => {
                const i = state.Xchances.indexOf(newvalue);
                if(i !== -1) {
                    state.Xchances.splice(i, 1)
                }
                state.Xchances.push(newvalue)
            })
        }
        // check previous before pushing
        XOstate.setTrashChances = state.Xchances
        state.Xchances.push(...value)
    }

    // XANDO LEARNING PROCESS AREA
    static set setChancesForO(value) {
        // VALUE IS ARRAY
        if(state.Ochances.length) {
            return value.filter(newvalue => {
                const i = state.Ochances.indexOf(newvalue);
                if(i !== -1) {
                    state.Ochances.splice(i, 1)
                }
                state.Ochances.push(newvalue)
            })
        }
        // check previous before pushing
        XOstate.setTrashChances = state.Ochances
        state.Ochances.push(...value)
    }

    static set setTrashChances(value) {
        // VALUE IS ARRAY
        // check trash before you add anything, if value contain trash delete in state of x and o immediately;
        if(!state.Ochances.length&&!state.Xchances.length) return;
        var avoiddDup = new Set();
        var trash = []

        value.filter(trashvalue => {
            const trashO = state.Ochances.indexOf(trashvalue); // 1
            const trashX = state.Xchances.indexOf(trashvalue); // 1
            
            if(trashO !== -1 || trashX !== -1) {
                avoiddDup.add(trashvalue)
                state.Ochances.splice(trashO, 1) // remove similarities
                state.Xchances.splice(trashX, 1) // ''     ''
            }
        })
        
        avoiddDup.forEach(item => trash.push(item))
        state.trashChances.push(...trash)
    }

    static get getTrashChances(){
        return state.trashChances
    }

    // No stress here
    static set setNewChancesForX(value) {
        // Delete previous chances
        state.Xchances.push(...value)
    }

    // XANDO LEARNING PROCESS AREA
    static set setNewChancesForO(value) {
        // Delete previous chances
        state.Ochances.push(...value)
    }

    static get getChancesForX() {
        // RETURN AN ARRAY
        return state.Xchances;
    }

    static get getChancesForO(){
        // RETURN AN ARRAY
        return state.Ochances;
    }

    static get getWinner(){
        return state.winnerLine
    }

    // No stress here
    static set setWinner(value) {
        // Delete previous chances
        state.winnerLine = value
    }

    static get getPlayerThatWin(){ // X|O
        return state.theWinnerIs
    }

    // No stress here
    static set setPlayerThatWin(value) {
        // calculate total point as well
        if(value === "x") {
            // Add count for x
            state.xwinningPoint = state.xwinningPoint  += state.perPoint
        }else if(value === "o") {
            // Add count for x
            state.owinningPoint = state.owinningPoint  += state.perPoint
        }
        // get the wimmer
        state.theWinnerIs = value
    }

    static get getTotalPlayerPointEach(){
        return {xScore: state.xwinningPoint, oScore: state.owinningPoint}
    }

    static get getTotalPlayerPoint() {
        // get player point
        
        const getTheWinner = XOstate.getPlayerThatWin;
        let winpoint;

        if(getTheWinner === "x") {
            winpoint = state.xwinningPoint
        }else if(getTheWinner === "o"){
            winpoint = state.owinningPoint
        }else if(getTheWinner === "") {
            winpoint = ""
        }
        return winpoint
    }
    static get getTotalRoundWinner() {
        // get player point
        
        let winpoint;
        
        if(state.xwinningPoint > state.owinningPoint) {
           winpoint = "x"
        }else if(state.owinningPoint > state.xwinningPoint){
            winpoint = "o"
        }else if(state.owinningPoint === state.xwinningPoint) {
            winpoint = "draw"
        }
        return winpoint
    }

    static get getFilledTiles() {
        const checkALlTile = state.game_structure.flatMap(e => {return e}).every(e => typeof e === "string")
        return checkALlTile;
    }
}
