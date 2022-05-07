import XOIntro from "./xando_intro.js";
// import XOstate from "./xando_state.js";
// import Xando from "./xando.js";
// import Gamepad from "./gamepad.js";

const beforeUnloadListener = (e) => {
    e.preventDefault();
    return e.returnValue = "Are you sure you want to exit?"
};

window.addEventListener("beforeunload", beforeUnloadListener, {once:true})

const intro_board = document.querySelector("#intro")
const intro =  new XOIntro(intro_board)

intro.initiate()

// const game_board = document.getElementById("game_board");

//         const xando = new Xando(game_board);

//         xando.initialize() // true | false

//             const select_pad = document.getElementById("select");
//         // if(this.setpending === true) {
//             // We want to enable the gamepad
//             const game_pad = new Gamepad(select_pad);
//             game_pad.initialize()

//             window.addEventListener('keydown', game_pad.controls)