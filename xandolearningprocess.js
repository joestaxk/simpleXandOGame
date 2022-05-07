

//  Xando Have to understand how the game works 
//  * The rules:
//  * X and O 
//  * has 7 winning pattern like and asteris *
//  * and apart from these patter other winning are invalid or Draw.
//  * 
//  * XandO will be built to understand when and how to win the game
//  * XandO will know when the game is invalid
//  * XandO will know when a player wants to win
//  * 
//  * Learning process
//  * 
//  * Since we have X axis and Y axis we have to study all the axis and also the winning axis
//  * 
//  * these axis are as follow
//  * 
//  * (X, Y) // use book and pen to map first
//  * this is how you map it:
/** 
                          |            |
                    [0,0] |   [1, 0]   | [2,0]
                  --------|------------|--------
                   [0,1]  |   [1,1]    |  [2,1]
                  --------|------------|----------
                   [0,2]  |   [1,2]    |  [2,2]
                          |            | 
**/

/** Top winning
 * [0 0], [1, 0], [2,0]
 * Lefty End wining
 * [0,0] [0, 1] [0, 2]
 * Bottom winning
 * [0, 2] [1, 2] [2, 2]
 * RightY winning
 * [2,2] [2,1], [2,0]
 * middlex winning
 * [0,1] [1,1] [2,1]
 * middley winning
 * [1,0] [1,1] [1,2]
 * topright Diagonal
 * [0, 2] [1,1], [2,0]
 * topleft DIagonal
 * [2,2] [1,1], [0,0]
 *
 * 
 * these are all the point needed to detect a winning
 * 
 * we will use a fast and simple search factor for all these
 * 
 * Let's code
 */

import { PlotXandO } from "./xando.js";
import XOstate from "./xando_state.js";

// Converting to strings works better because we need to compare arrays to get index ['[1,2]'].indexOf('[1,23]') 
// Count the Allpoint each to use the index to trace wherepointrepeat
  const allPointEach = [
      '[0,0]','[1,0]','[2,0]',
      '[0,1]','[0,2]','[1,2]',
      '[2,2]','[2,1]','[1,1]'
  ]

  const wherePointRepeat = {
      0: ['topwinning','leftwinning','tldiagonal'],
      1: ['topwinning','middleywinning'],
      2: ['topwinning','rightwinning','trdiagonal'],
      3: ['leftwinning','middlexwinning'],
      4: ['bottomwinning','leftwinning','trdiagonal'],
      5: ['bottomwinning','middleywinning'],
      6: ['tldiagonal','rightwinning','bottomwinning'],
      7: ['middlexwinning','rightwinning'],
      8: ['middlexwinning','middleywinning','tldiagonal','trdiagonal']
  }

  /**
   * Why are we creating an Id?
   * We want to make sure each "where point repeat" has an id so we know when the oponnet cancels it
   * 
   * example:
   * if topid which means all point for top [0 0], [1, 0], [2,0], is no longer availaible remove top from win section
   * 
   * with the id we can just send only index and then check if index is inside the id
   * code explains better
   */
    var xplay = [] // get three arrays then check update
    var oplay = []
  export default function startLearning(x,y) {
    //   x and y
    const joinBothPoint = [x,y];
    const index = allPointEach.indexOf(JSON.stringify(joinBothPoint));


    const initialPlayer =  XOstate.getState.nextplayer; // next player means initialplayer
    if(initialPlayer === "x") {
      xplay.push(...wherePointRepeat[index])
      XOstate.setChancesForX = wherePointRepeat[index] // adding this here , gets first push
    }else if(initialPlayer === "o") {
        oplay.push(...wherePointRepeat[index])
        XOstate.setChancesForO = wherePointRepeat[index]
    }

    if(oplay.length > 6 || xplay.length > 6) {
      // this works because, we check each time a player plays, 
      // this can also keep track of the winner too
      const startWith = initialPlayer === "o" ? oplay : xplay;
      const g5 = groupInThree(startWith.sort())
      if(g5){
         XOstate.setPlayerThatWin = initialPlayer;
         StopTheGame(g5)
      }
    }
    // At the end of the function we want to check if there's an update in  chances array
    cleanUpandUpdateChances()

  }

  function groupInThree(startWith) {
    var result;
    for(var i = 0, j = startWith.length; i < j; i++) {
      startWith[i] === startWith[i+2]?result = startWith[i]:"not look"
    }
    return result
  }


//   Whenever we push an Array, we include duplicates, we want to remove it
  const AlreadyOccuredPointForBothXandO = []
  const removeDuplicateOccurance = new Set()

  // things here are not stable
  async function cleanUpandUpdateChances() {
    //   check if x and o array is has something;
    try{
        const xArray = XOstate.getChancesForX; // [t\,b]
        const oArray = XOstate.getChancesForO; // [r,t\,m]
    
        if(!xArray.length||!oArray.length) return;

            xArray.filter(value => {
                const i = oArray.indexOf(value); // 1
                
                if(i !== -1) {
                  removeDuplicateOccurance.add(value) // t -- get similar points on x and o
                }
            })
            removeDuplicateOccurance.forEach(item => AlreadyOccuredPointForBothXandO.push(item))
            XOstate.setTrashChances = AlreadyOccuredPointForBothXandO
    
            // clear previous trash cans
            removeDuplicateOccurance.clear()
            AlreadyOccuredPointForBothXandO.splice(0, AlreadyOccuredPointForBothXandO.length)
      
    }catch(E) {
      throw E
    }
    // not ready
  }

    //  Lets list out all possible winnings

    const possibleWinning = {
      top: [[0,0], [1,0], [2,0]],
      left: [[0,0], [0, 1], [0, 2]],
      bottom:[ [0, 2], [1, 2],[2,2]],
      right: [[2,2], [2,1], [2,0]],
      middlex: [[0,1], [1,1], [2,1]],
      middley: [[1,0], [1,1], [1,2]],
      leftdiagonal: [[2,2], [1,1], [0,0]],
      rightdiagonal: [[0, 2], [1,1], [2,0]]
    }

    const winings = ['topwinning','leftwinning','bottomwinning', 'rightwinning','middlexwinning', 'middleywinning', 'tldiagonal', 'trdiagonal']

    function StopTheGame(g5) {
      const getPointer = Object.keys(possibleWinning)[winings.indexOf(g5)];
      const point = possibleWinning[getPointer]
      const updateUi = new PlotXandO()
      updateUi.ShouldUpdateWinner(point)
    }

    export function destroyxandolearningprocess(){
      xplay = [];
      oplay = [];
      // SET FOR NEXT ROUND + WINNING
      XOstate.setWinner = []
      XOstate.setPlayerThatWin = ""
      XOstate.setTrashChances = []
      XOstate.setChancesForO = []
      XOstate.setChancesForX = []
    }