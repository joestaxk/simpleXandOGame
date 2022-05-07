import XOstate from "./xando_state.js";
import Xando from "./xando.js";
import Gamepad from "./gamepad.js";

    let isPreviousValid = false; // default
    var nextSlide = 0
    const show_stage = [
        `<div data-id="0" class="slide mode">
        <div class="">
            <input type="radio" name="mode" id="mode" value="computer" disabled autocomplete="off"> <label for="mode">Vs Computer (coming soon)</label>
        </div>
        <div class="">
            <input type="radio" name="mode" id="mode" value="opponent" autocomplete="off"> <label for="mode">Vs friend</label>
        </div>
        </div>`,
        `<div data-id="1" class="slide selection">
        <p id="message"></p>
        <div class="select_player">
            <button class="select_" id="select_tool" data-value="X">X</button>
            <button class="select_" id="select_tool" data-value="O">O</button>
        </div>
        <div class="inputs">
            <label for="">choose name For <span id="select_name"></span></label>
            <input type="text" class="input_field" id="select_user" placeholder="type name" autocomplete="off"/>
        </div>
        </div>`,
        `<div data-id="2" class="slide">
            <p id="message">Set Game round</p>
        <div class="add_round" id="increment">
            0
        </div>
        <div class="">
            <button class="select_round" id="roundup" data-inc="+1">&UpArrow;</button>
            <button class="select_round" id="rounddown" data-inc="-1">&DownArrow;</button>
        </div>
        </div>`,
        `<div data-id="3" class="slide">
            <div class="overview">
                <div class="player">X</div>
                <div class="name" id="x"></div>
            </div>
            and
            <div class="overview">
                <div class="player">O</div>
                <div class="name" id="o"></div>
            </div>
        </div> `,
        `<div data-id="4" class="slide">
        <p id='message'></p>
    </div> `
    ]
    const intro_board = document.querySelector("#intro");
export default class XOIntro {
    constructor(introboard) {
        const navigate = document.getElementById("navigate")
        this.introboard = introboard;
    }

    initiate() {
        // add event to the navigator
        navigate.addEventListener("click", Navigate)
        // push in our first intro
        this.introboard.insertAdjacentHTML('afterbegin', show_stage[nextSlide])
        //first, add events to all coming intro
        futureEventListener(nextSlide)
    }
    static shouldUpdate(){
        // remove prev element
        const oldEvent = document.querySelector(`[data-id="${nextSlide-1}"]`)
        oldEvent.remove();
        // add new slide
        intro_board.insertAdjacentHTML('afterbegin', show_stage[nextSlide])
        const newEvent = document.querySelector(`[data-id="${nextSlide}"]`)
        newEvent.animate([
            {opacity:0},
            {opacity:1}
        ],1000)
        // set previousValid to false
        isPreviousValid = false;
        // futureEventListener
        futureEventListener(nextSlide)
    }
}



function Navigate() {

    // checks on current stuff
    if(isPreviousValid) {
        XOIntro.shouldUpdate()
        return;
    }
    intro_board.animate([
        {transform: 'translateX(10px)'},
        {transform: 'translateX(-10px)'}
    ],150)
}

function futureEventListener(stage) {
    if(stage > show_stage.length) return;
    switch(stage) {
        case 0:
            modeEventListener();
        break;
        case 1:
            userSelectEventListener();
        break;
        case 2:
            setRoundEventListener();
        break;
        case 3:
            overviewEventListener();
        break;
        case 4:
            startGame();
        break;
    }
}

function modeEventListener(){
    const subject = document.querySelectorAll("#mode");
    if(!subject) return;
    // continue coding
    subject.forEach(e => e.addEventListener("change", setMode))

    // listen here
    function setMode(e) {
        // check if there's value
        const options = ["computer", "opponent"];
        if(options.indexOf(e.target.value) !== -1) {
            // looks good
             isPreviousValid =  true
             doNextSlide(isPreviousValid)
        }
    }
}
const navigate = document.getElementById("navigate")
const userInfo = {signXUser:"",signOUser: "",userXTool:"",userOTool:""}
function userSelectEventListener(){
    const subject_select_tool = document.querySelectorAll("#select_tool");
    const subject_select_name = document.querySelector("#select_name");
    const subject_select_user = document.querySelector("#select_user");
    const subject_message = document.querySelector("#message");

    if(!subject_select_tool&&!subject_select_name&&!subject_select_user) return;
    // continue coding
    subject_select_tool.forEach(e => e.addEventListener("click", set_select_tool))
    navigate.textContent = "Save Info"
    // disable input
    subject_select_user.setAttribute("disabled",1)
    var xActive,oActive
    // change listener
    navigate.addEventListener("click", saveInfo)
    var choose = "";
    function set_select_tool(e) {
        // check if there's value
        const data_value = e.target.dataset.value;
        const options = ["O", "X"];
        if(options.indexOf(data_value) !== -1) {
            // change name
            subject_select_name.textContent = data_value;
            // toggle activeness
             if(data_value.toLowerCase() === 'x') {
                 if(oActive) oActive.classList.remove("activate_select")
                 e.target.classList.add("activate_select")
                 xActive = e.target;
                //save info
                navigate.textContent = "Save X Info"
                //
                userInfo.userXTool = "x"
                choose = "x"
             }else if(data_value.toLowerCase() === 'o'){
                if(xActive) xActive.classList.remove("activate_select")
                e.target.classList.add("activate_select")
                oActive = e.target;
                navigate.textContent = "Save O Info"
                userInfo.userOTool = "o"
                choose="o"
             }
            // subject_select_name.textContent = ''
            //  save this
            // enable input
            subject_select_user.removeAttribute("disabled")
        }
    }

    // inside a function
    function saveInfo() {

        if(subject_select_user.value) {
            // save this
            if(choose === "x") {
                userInfo.signXUser = subject_select_user.value
            }
            if(choose === "o"){
                userInfo.signOUser = subject_select_user.value
            }
        }

        if(!userInfo.userOTool&&!userInfo.signOUser&&!userInfo.userXTool&&!userInfo.userOTool){
            // save in house
            subject_message.textContent = "Add infos"

        }
        // check the userinfo

        subject_message.textContent = "Add opponent username";
        subject_select_user.value = ""; // CLEAR INPUT

        if(userInfo.userXTool&&userInfo.signXUser) {
            if(choose === "x"){ 
                xActive.classList.remove("activate_select");
                navigate.textContent = "Save X Info"
                // Save here
                XOstate.setUserInfo = {choose: userInfo.userXTool,user:userInfo.signXUser}
                userInfo.signXUser = ""
                userInfo.userXTool = ""
            }
        }else if(userInfo.userOTool&&userInfo.signOUser){
            if(choose === "o") {
                oActive.classList.remove("activate_select");
                navigate.textContent = "Save O Info"
                XOstate.setUserInfo = {choose: userInfo.userOTool,user:userInfo.signOUser}
                userInfo.signOUser = ""
                userInfo.userOTool = ""
            }
        }
         const verifyUsers = XOstate.getUserInfo;
         if(!verifyUsers.userX.username||!verifyUsers.userO.username||verifyUsers.userX.username === verifyUsers.userO.username)return; // not verify
        //  verified!
        // remove event and change navigator text
        navigate.textContent = "Next"
        subject_message.textContent = "You guys are ready!";
        // remove Listeners and disable inputs
        navigate.removeEventListener("click",saveInfo)
        subject_select_tool.forEach(e => e.removeEventListener("click", set_select_tool))
        subject_select_user.setAttribute("disabled",1)
        // next stage
        isPreviousValid=true;
        // navigate.addEventListener("click", Navigate)
        doNextSlide(isPreviousValid)

    }
}

let round = 0
function setRoundEventListener(){
    const subject = document.querySelectorAll("#roundup,#rounddown");
    if(!subject) return;

    subject.forEach(e => e.addEventListener("click", increment))
    function increment(e){
        navigate.textContent = "Save round"
        navigate.addEventListener("click", saveUpdate)
        const whichSide = e.target.dataset.inc;
        const getModel = document.getElementById("increment");
        const options= ["+1","-1"];

        if(options.indexOf(whichSide) !== -1) {
            if(whichSide === "+1") {
                ++round
                round =  round > 10 ? 10 : round;
                getModel.textContent = round
            }else if(whichSide === "-1") {
                --round
                round = round < 0 ? 0 : round;
                getModel.textContent = round 
            }
        }
    }

    function saveUpdate(e) {
        if(round < 1) return;
        navigate.removeEventListener("click", saveUpdate)
        subject.forEach(e => e.removeEventListener("click", increment))
        // save
        XOstate.setUserInfoRound = round
        navigate.textContent = "Next"
        isPreviousValid=true;
        // navigate.addEventListener("click", Navigate)
        doNextSlide(isPreviousValid)
    }

}

function overviewEventListener(ev){
    const x = document.querySelector('#x')    
    const o = document.querySelector('#o')

    if(!x||!o)return;

    x.textContent = XOstate.getUserInfo.userX.username
    o.textContent = XOstate.getUserInfo.userO.username
    isPreviousValid=true;
    doNextSlide(isPreviousValid)
}

function startGame() {
  const message = document.querySelector("#message");
  message.textContent = "We are getting you ready"
  if(!message) return;
  const e = ["Use the Arrow key to navigate from one ceil to another", "use the alternative key AWSD, just like the arrow", "use the space or enter key to add your option", "wait loading!!!"]
  setTimeout(()=>{message.textContent= e[0];
    message.animate([
        {opacity: 0},
        {opacity:1}
        ],500) 
    }, 1000)//10s
  setTimeout(()=>{message.textContent= e[1];
    message.animate([
        {opacity: 0},
        {opacity:1}
        ],500) 
    }, 3000)
  setTimeout(()=>{message.textContent= e[2];
    message.animate([
        {opacity: 0},
        {opacity:1}
        ],500) 
    }, 6000)
  setTimeout(()=>{message.textContent= e[3];
    message.animate([
        {opacity: 0},
        {opacity:1}
        ],500);
      startGameNow()
    }, 9000)
  message.animate([
      {opacity: 0},
      {opacity:1}
      ],500);
}

function startGameNow() {
    const intro = document.querySelector(".intro")
    intro.remove();
    // start game
    XOstate.setIntroState = true;

    // xando need to start off with intro
    const game_board = document.getElementById("game_board");
    if(XOstate.getIntroState){
        const xando = new Xando(game_board);
        xando.initialize() // true | false
        if(xando.pending !== false) {
            const select_pad = document.getElementById("select");
        // if(this.setpending === true) {
            // We want to enable the gamepad
            const game_pad = new Gamepad(select_pad);
            game_pad.initialize()
            window.addEventListener('keydown', game_pad.controls)
        }
    }
}

function doNextSlide(isPreviousValid) {
    if(isPreviousValid) return nextSlide +=1
}