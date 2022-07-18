function init(){

  // ! ELEMENTS TO BE CREATED / CHANGED BY JS
  // *------ GENERATE GRIDS-------
  // ? There are two (maybe 3) grids to create: playGrid, nextGrid, and holdGrid
  // playWidth = 10 playHeight = 20 playCellCount = playWidth * playHeight grid
  // nextWidth = 4 nextHeight = 4 nextCellCount = nextWidth * nextHeight
  // holdWidth = 4 holdWidth = 4 holdCellCount = holdWidth * holdHeight
  
  // *------- GENERATE SHAPES ------- 
  // ? must create 7 tetrominos (call it shape for easier understanding)
  // there are 7 shapes to generate (add color class to cell)
  // each shape has an initial start array
  // each shape has a name -> o, i, l ,j, z, s, t
  // What does the program has to know from each shape?
      // - ch


  // *------- BUTTONS ------- 
  // ? PLAY/PAUSE --> pause/play the game
  // ? AUDIO CHECK --> toggle SFX on/off
  // ? RESTART

  // *------ DISPLAYS -------
  // ? levelDisplay / levelValue
  // ? levelProgress -> depends on levelValue
  // ? linesClearedDisplay / linesClearedValue
  // ? scoreDisplay / scoreValue 
  // ? highScoreDisplay / highScoreValue

  // *-------AUDIO --------
  // ? arrowkeysAudio
  // ? spacebarAudio
  // ? linesClearedAudio
  // ? startgameAudio
  // ? endPositionAudio

  // *------ OTHERS ------
  // ? gameActive = true / false
  

  // ! ---------------------- EXECUTIONS ---------------

  // TODO-------- GAME STATUS CONTROLS (USER INTERACTION) ----------

  // *----- START GAME -----------
  // ? when player press "ENTER" on keyboard on page load
  // show playGrid div on main
  // call shapeSpawn function 
  // play startAudio effect`
  // gameActive = true

  // *------ PLAY/PAUSE GAME -------------
  // ? pause/play the shapeSpawn function
  // CHECK if not paused (gameActive = true)
  // ----- clearInterval for shapeSpawn (or stop it somehow)
  // ----- if true, startPosition = currentPosition from shapeSpawn function
  // ----- gameActive = false
  // CHECK if paused (gameActive =false)
  // ----- gameActive = true to resume game

  // *------ RESTART GAME ----------------
  // ? restart the game
  // jump to gameOVER page

  // TODO ------ GAME INTERNAL CONTROLS ----------

  // *----- NEXT SHAPE ---------------
  // ? Generate random shape, store in const
  // Generate random shape

  // *----- NEXT SHAPE DISPLAY --------
  // ? display Next shape in the nextGrid
  
  // *----- SHAPE SPAWN / MOVE DOWN --------------- 
  // ? "drop" shape from top of playGrid
  // Inorder for the shape to move: 
  /*
      1. CHECK IF the next position has shape (check if (current.position + playWidth) includes color class (active, shape)) or inactive
      2. each shape's next position is contains shape
      3. i

  // gameActive = true
  // AT THE START: generate randomShape() (select from list of 7 shapes)
  // DURING GAME: generate randomShape() (once the currentshape reaches the bottom) -> display in nextGrid , store in nextArray
  // ------------ get value from nextShape = currentShape 
  // ------------ CHECK if the next position is empty --> moves down
  // ------------ movedown with current shape
  // MOVEMENT: offset position down (playCell-index increase by playWidth(10) from array(rotation1/2/3/4) [4, 13, 14, 15] -> [14, 23, 24, 15])
  // ------------ each time it moves down --> addColorClass to new position --> removeColorClass from current
  // ------------ STOP when the shape reaches endPosition(check index of cell with color class - shapeArrayOffset)
  // ------------ STOP when player press pause
  // ------------ STOP when it reaches the top of the grid (if playCell with index 0-9 includes color class)
  // ------------ STOP when it reaches bottom of the grid (can still move left/right with a timeOut?)
  
  // once it reaches the bottom, generate next random shape

  // *------ MOVEMENTS ----- 
  // ? MOVE LEFT
  // shift currentPosition Array to the left (-1)
  // shift continously when hold
  // ? MOVE RIGHT
  // Shift currentPosition Arry to the right (+1)
  // shift continously when hold
  // ? INSTANT DOWN
  // move shape to end position
  // remove currentPosition colorClass from cell
  // add colorClass instantly to endPosition ()
  // play sound effect
  // add score + 5
  // ? ROTATE
  // rotate 90degrees to the right
  // default rotate array with common axis?
  // shift horizontal / vertical to offset the shape back to center 



  // *---------END POSITION -------
  // ? check the end position
  // use cells that has color class but inactive as an offset from the bottom
  // add inactive class to the shape with colorClass 


  // *------ LINE CLEARED ---
  // ? check If line is complete (check every cellRow in tens, 0-9, 10-19, 20-20 etc. has colorClass
  // create cellRows --> check which rows are cleared
  // check if all cells in the row contains color --> removed
  // always check if the next line is empty, if yes, move the whole block down
  // removeLine effect plays on the line
  // removeLineAudio plays
  // add number of linesCleared to linesCount
  // add score + 200


  // ! EVENTS
  // ? (keypress)ENTER --> start game when page loads // restart game in gameOver page
  // ? (keypress)LEFT --> moveLeft // shift the shape one space left --> shift continuously when hold
  // ? (keypress)RIGHT --> moveRight // shift the shape one space right --> shift continuously when hold
  // ? (keypress)DOWN --> moveDown // shift the shape one space down --> shift continously when hold
  // ? (keypress)SPACE --> instantDown // move shape instantly to endPosition 
  
  





























}
window.addEventListener('DOMContentLoaded', init)