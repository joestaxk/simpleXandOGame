

var state = {
    randomPlayer: () => ['x','o'][Math.floor(Math.random()*2)],
    setPlayer: null,
    nextplayer: null,
    game_structure: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ]
}

export default class XOstate {
    static set setState(value = {nextplayer: 'x'}){
        value = typeof value === "object" ? value : null;
        if(value) {
            if(!state.hasOwnProperty("nextplayer")) throw Error("ERROR IN OBJECT");
            return state.nextplayer = value;
        }
    }

    static get getState() {
        return state.nextplayer || {nextplayer: 'x'}
    }

    static set setGame(value) {
        value = typeof value === "object" ? value : null;
        if(value) {
            if(!value.hasOwnProperty("x")&&!value.hasOwnProperty("o")) throw Error("ERROR IN OBJECT");
            return state.game_structure[value.y][value.x] = XOstate.getState.nextplayer;
        }
    }

    static get getGame() {
        return state.game_structure
    }

    static get getRandomPlayer() {
        return state.setPlayer=== null?state.randomPlayer():''
    }
}
