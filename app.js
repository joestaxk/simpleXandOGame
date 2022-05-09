import XOIntro from "./xando_intro.js";
const beforeUnloadListener = (e) => {
    e.preventDefault();
    return e.returnValue = "Are you sure you want to exit?"
};

window.addEventListener("beforeunload", beforeUnloadListener, {once:true})

const intro_board = document.querySelector("#intro")
const intro =  new XOIntro(intro_board)

// detect mobile 
const isMobile = navigator.userAgentData.mobile;

if(isMobile) {
    alert("This application wasn't meant for mobile, mobile feature coming soon!!")
}

intro.initiate()