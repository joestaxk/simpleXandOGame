import XOIntro from "./xando_intro.js";
const beforeUnloadListener = (e) => {
    e.preventDefault();
    return e.returnValue = "Are you sure you want to exit?"
};

window.addEventListener("beforeunload", beforeUnloadListener, {once:true})

const intro_board = document.querySelector("#intro")
const intro =  new XOIntro(intro_board)

intro.initiate()