import Xando from "./xando.js";
import Gamepad from "./gamepad.js";

const game_board = document.getElementById("game_board");

const xando = new Xando(game_board);

xando.initialize()

// MOVE SELECTOR

const select_pad = document.getElementById("select");

const game_pad = new Gamepad(select_pad);

game_pad.initialize()

window.addEventListener('keydown', game_pad.controls)

// select_pad.addEventListener("transitionend", () => {
//     window.addEventListener('keydown', game_pad.controls)
// })

// 