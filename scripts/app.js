/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
function init() {
  // ! MAKE GRID ---------------------------------------------------------------------------------
  // const wrapperGrid = document.querySelector('#grid-wrapper')
  const playGrid = document.querySelector('#playGrid')
  const playWidth = 10
  const playHeight = 20
  const playCellCount = playWidth * playHeight
  const playCells = []

  const nextGrid = document.querySelector('#nextGrid')
  const nextWidth = 4
  const nextHeight = 4
  const nextCellCount = nextWidth * nextHeight
  const nextCells = []

  function makeGrid(cellCount, cells, gridDiv) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      // cell.innerText = i
      // cell.style.fontSize = '0.6rem'
      cell.dataset.index = i
      cells.push(cell)
      gridDiv.appendChild(cell)
    }
    console.log(cells)
  }

  makeGrid(playCellCount, playCells, playGrid)
  makeGrid(nextCellCount, nextCells, nextGrid)


  // *CREATE ARRAY OF CELL ROWS
  const playCellRows = []
  const cellsPerRow = 10
  for (let i = 0; i < playCells.length; i += cellsPerRow) {
    const cellsGroup = playCells.slice(i, i + cellsPerRow)
    playCellRows.push(cellsGroup)
  }


  // ! MAKE SHAPES -------------------------------------------------------------------------------

  class Shape {
    constructor(shape, startPos, rot) {
      this.shape = shape
      this.startPos = startPos
      this.currentPos = startPos
      this.nextPos = this.currentPos
      this.rot = rot
      this.moving = 'moving' + shape
      this.landed = 'landed' + shape
    }
  }


  const shape1 = new Shape('O', [-6, -5, 4, 5], {
    one: [0, 0, 0, 0],
    two: [0, 0, 0, 0],
    three: [0, 0, 0, 0],
    four: [0, 0, 0, 0]
  })

  const shape2 = new Shape('I', [-7, -6, -5, -4], {
    one: [18, 9, 0, -9],
    two: [2, 11, 20, 29],
    // two: [-18, -9, 0, 9],
    three: [18, 9, 0, -9],
    four: [-18, -9, 0, 9]
  })

  const shape3 = new Shape('S', [-6, -5, 3, 4], {
    one: [0, -9, -2, -11],
    two: [0, 9, 2, 11],
    three: [0, -9, -2, -11],
    four: [0, 9, 2, 11],

  })

  const shape4 = new Shape('Z', [-6, -5, 5, 6], {
    one: [-1, -9, 0, -8],
    two: [1, 9, 0, 8],
    three: [-1, -9, 0, -8],
    four: [1, 9, 0, 8],
  })

  const shape5 = new Shape('T', [-6, 3, 4, 5], {
    one: [0, 0, 0, -9],
    two: [0, 1, 1, 9],
    three: [9, 0, 0, 0],
    four: [-9, -1, -1, 0]
  })

  const shape6 = new Shape('L', [-5, 3, 4, 5], {
    one: [2, 9, 0, -9],
    two: [-1, 1, 10, 10],
    three: [9, 0, -9, -2],
    four: [-10, -10, -1, 1]
  })

  const shape7 = new Shape('J', [-6, 4, 5, 6], {
    one: [-1, -1, -9, -9],
    two: [1, -8, 0, 9],
    three: [9, 9, 1, 1],
    four: [-9, 0, 8, -1]
  })

  //! RANDOMIZE SHAPE----------------------------------------------------
  // make sure shape is really distributed, prevent shape repetition
  const randomHist = []
  function randomizeShape() {
    let random = Math.floor(Math.random() * 7 + 1)
    if (randomHist.length < 2) {
      randomHist.push(random)
    } else if (randomHist.length < 5) {
      while (randomHist.some(item => item === random)) {
        random = Math.floor(Math.random() * 7 + 1)
        // console.log('looping1')
      }
      randomHist.push(random)
    } else if (randomHist.length >= 5) {
      while (randomHist.some(item => item === random)) {
        random = Math.floor(Math.random() * 7 + 1)
        // console.log('looping2')
      }
      randomHist.shift()
      randomHist.push(random)
    }
    return eval(`shape${random}`)
  }

  // ! AUDIO -------------------------------------------------------------
  const soundClick = new Audio('./audio/movement.wav')
  const soundHardDrop = new Audio('./audio/hardDrop.m4a')
  const soundInActive = new Audio('./audio/inactive.wav')
  const soundPaused = new Audio('./audio/pause.m4a')
  const soundClear = new Audio('./audio/lineCleared.wav')
  const soundLevelUp = new Audio('./audio/levelUp.wav')
  const soundEnter = new Audio('./audio/menuConfirm.wav')
  const soundStart = new Audio('./audio/start.wav')
  const soundBackground = new Audio('./audio/background.m4a')
  const soundGameOver = new Audio('./audio/gameOver.wav')
  soundClick.volume = 0.3
  soundHardDrop.volume = 1
  soundClear.volume = 0.3
  soundBackground.volume = 0.2
  soundGameOver.volume = 0.3
  soundEnter.volume = 0.3
  soundStart.volume = 0.3
  soundBackground.loop = true

  function setAudio() {
    soundEnter.play()
    if (sfxOn === true) {
      sfxOn = false
      soundClick.volume = 0
      soundHardDrop.volume = 0
      soundClear.volume = 0
      soundBackground.volume = 0
      soundGameOver.volume = 0
      soundEnter.volume = 0
      soundStart.volume = 0
      sfxButton.innerHTML = 'SFX ON'

    } else if (sfxOn === false) {
      sfxOn = true
      soundClick.volume = 0.3
      soundHardDrop.volume = 1
      soundClear.volume = 0.3
      soundBackground.volume = 0.2
      soundGameOver.volume = 0.3
      soundEnter.volume = 0.3
      soundStart.volume = 0.3
      sfxButton.innerHTML = 'SFX OFF'
    }
  }
  // ! CALL SHAPE / NEXT SHAPE DISPLAY -------------------------------------------------
  // * set current shape / shape events
  let shape = null
  let nextShape = null
  let nextDisplayPos = null

  let r = 0
  let rot = []

  let clearedRow = []
  let clearedRowCount = 0
  let landedCells = []
  let landedClass = null
  let shiftMulti = 1
  let row = 0

  // * timing
  let time = 1000
  let timer = null

  // * Game Function
  let isGameActive = false
  let isGameOver = false
  let isGamePaused = true
  let isGameStart = true
  let sfxOn = true
  const startOverlay = document.querySelector('#startGame')
  const pauseOverlay = document.querySelector('#pauseGame')
  const gameOverOverlay = document.querySelector('#gameOver')

  // * Scores
  let score = 0
  let lineScore = 0
  let currentLevel = 1
  let nextLevel = 5
  let scoreMultiplier = 0
  let highScore = localStorage.getItem('highScore')
  // localStorage.clear()
  checkHighScore()

  // * text
  const highScoreText = document.querySelector('#highScore')
  const scoreText = document.querySelector('#scoreDisplay')
  const finalScoreText = document.querySelector('#scoreOver')
  const finalScoreValue = document.querySelector('#scoreOverValue')
  const lineScoreText = document.querySelector('#linesDisplay')
  const levelText = document.querySelector('#levelDisplay')

  scoreText.innerHTML = score
  lineScoreText.innerHTML = lineScore
  levelText.innerHTML = currentLevel
  highScoreText.innerHTML = highScore

  // * Buttons
  const sfxButton = document.querySelector('#sfx')
  const restartButton = document.querySelector('#restart')
  const playPauseButton = document.querySelector('#playPause')
  sfxButton.innerHTML = 'SFX OFF'
  restartButton.disabled = true
  playPauseButton.disabled = true
  

  // ! GAME FUNCTIONS ------------------ 



  // * PLAYPAUSE GAME

  function pauseGame() {
    soundPaused.play()
    console.log('game active?', isGameActive)
    if (isGameActive === false) {
      resumeGame()
    } else if (isGameActive === true) {
      console.log('PAUSE')
      isGameActive = false
      isGamePaused = true
      clearInterval(timer)
      playPauseButton.innerHTML = 'PLAY'
      pauseOverlay.style.display = 'flex'
      playGrid.style.position = 'absolute'
    }
  }

  // ** RESUME GAME

  function resumeGame() {
    console.log('RESUME GAME')
    isGameActive = true
    isGamePaused = false
    setTimeout(drop, time)
    playPauseButton.innerHTML = 'II'
    pauseOverlay.style.display = 'none'
    playGrid.style.position = 'relative'
  }

  // * GAME OVER

  function gameOver() {
    isGameOver = true
    isGameActive = false
    soundBackground.pause()
    soundGameOver.play()
    gameOverOverlay.style.display = 'flex'
    pauseOverlay.style.display = 'none'
    playGrid.style.position = 'absolute'
    restartButton.disabled = true
    playPauseButton.disabled = true
    finalScoreValue.innerHTML = `${score}`
    clearTimeout(timer)
    checkHighScore()
  }

  // * RESTART GAME

  function restartGame() {
    soundEnter.play()
    soundStart.play()
    soundBackground.play()
    isGameOver = false
    isGameActive = true
    gameOverOverlay.style.display = 'none'
    playGrid.style.position = 'relative'
    startOverlay.style.display = 'none'
    playCells.forEach(item => item.className = '')
    nextCells.forEach(item => item.className = '')
    score = 0
    lineScore = 0
    scoreMultiplier = 0
    time = 1000
    currentLevel = 1
    scoreText.innerHTML = `${score}`
    levelText.innerHTML = currentLevel
    restartButton.disabled = false
    playPauseButton.disabled = false
    drop()
  }

  // * CHECK HIGH SCORE

  function checkHighScore() {
    if (highScore === null) {
      highScore = 0
    } else if (score > highScore) {
      localStorage.setItem('highScore', score)
      highScore = localStorage.getItem('highScore')
      highScoreText.innerHTML = highScore
      console.log('SAVE HIGH SCORE')
      finalScoreText.innerHTML = `** NEW HIGH SCORE!!!! ** <br><br><span id="scoreOverValue">score: ${score}</span`
    }
    // console.log('highSCORE', highScore)
    // console.log('SCORE', score)
  }

  function drop() {
    playGrid.classList.remove('shake')
    // IS THERE A MOVING SHAPE IN THE GRID?
    if (playCells.some(cell => cell.className.includes('moving'))) {
      // Check if it hits buttom or cells with landed shape
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        console.log('REACHED THE ENDD --> WAITING FOR NEXT SHAPE')
        remove()
        deactivate()
        checkClearedRow()
        shape = nextShape
        // Move still valid --> continue to move
      } else {
        remove()
        moveDown()
      }
      timer = setTimeout(drop, time)

      // THERE IS NO ACTIVE SHAPE ( FIRST DROP AT START)
    } else {
      if (nextShape === null) {
        shape = randomizeShape()
      } else {
        // Shape in playGrid = nextShape that has been randomed
        shape = nextShape
        // Reset the start position of the shape (incase there is a shape already in the playGrid)
        shape.currentPos = shape.startPos
        // Reset rotation iteration
        r = 0
        // Remove the current shape displayed on nextGrid as it is now the current
        nextShapeRemove()
      }

      // Generate Random Next Shape and display on nextGrid
      nextShape = randomizeShape()
      nextShapeDisplay()
      // GAMEOVER FUNCTION, 
      if (playCellRows[0].some(item => item.className.includes('landed'))) {
        gameOver()
        return
      }
      moveDown()
      timer = setTimeout(drop, time)
      // // console.log('CURRENT SHAPE DROP', shape.shape)
    }
  }
  // ! ----------- SHAPE STATUS AND MOVEMENT  ------------------

  // * REMOVE CURRENT POSITION CLASS
  function remove() {
    shape.currentPos.forEach(index => playCells[index].classList.remove(shape.moving))
    //// console.log('removed', shape.currentPos)
  }

  // * MOVE THE SHAPE DOWN BY 1 ROW
  function moveDown() {
    shape.currentPos.forEach(index => playCells[index + 10].classList.add(shape.moving))
    shape.currentPos = shape.currentPos.map(index => index + 10)
  }

  // * DEACTIVATE SHAPE
  function deactivate() {
    soundInActive.play()
    shape.currentPos.forEach(index => playCells[index].classList.add(shape.landed))
    shape.currentPos.forEach(index => playCells[index].classList.remove(shape.moving))
  }

  //  * NEXT SHAPE GRID CONFIGURATIONS ------------------------- 

  // DISPLAY IN GRID
  function nextShapeDisplay() {
    nextDisplayPos = nextShape.startPos.map(cell => cell + 20)
    nextDisplayPos = nextDisplayPos.map(cell => {
      if (cell <= 6) {
        // console.log('if 1')
        return cell -= 3
      } else if (cell <= 16) {
        // console.log('if 2')
        return cell -= 9
      } else if (cell <= 26) {
        // console.log('if 3')
        return cell -= 15
      } else if (cell <= 36) {
        // console.log('if 4')
        console.log(cell -= 10)
        if (nextShape.shape === 'Z') {
          return cell -= 13
        } else {
          return cell -= 9
        }
      }
    })
    nextDisplayPos.forEach(index => nextCells[index].classList.add(nextShape.moving))
  }

  // REMOVE FROM GRID
  function nextShapeRemove() {
    nextDisplayPos.forEach(index => nextCells[index].classList.remove(shape.moving))
  }


  // !---------------ROTATE------------------------------------------------------
  function rotate() {
    const testRotate = []
    let didItRotate = true

    // ROTATION 
    r++
    if (r > 3) {
      r = 0
    }

    // GET ROTATION ARRAY
    if (r === 1 && shape.shape === 'I' && shape.currentPos.some(item => item > 39)) {
      rot = [-18, -9, 0, 9]
    } else {
      rot = Object.values(shape.rot)[r]
    }

    // CHECK IF IT CAN ROTATE
    for (let i = 0; i < 4; i++) {
      testRotate.push(parseFloat(shape.currentPos[i]) + parseFloat(rot[i]))
      //// console.log(testRotate)
    }
    if (shape.shape === 'I' && (r === 1 || r === 3)) {
      didItRotate = true
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
    } else if (testRotate.some(index => playCells[index].className.includes('landed'))) {
      console.log('CANNOT ROTATE')
      didItRotate = false
      r -= 1
    } else {
      didItRotate = true
    }

    console.log('current didItRotate', didItRotate)
    // ROTATE POSSIBLE:
    if (didItRotate === true) {
      for (let i = 0; i < 4; i++) {
        console.log('CURRENT POSITION', shape.currentPos)
        remove()
        shape.currentPos[i] = shape.currentPos[i] + parseFloat(rot[i])
      }

      // PREVENT OVERFLOW EDGE
      if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 8) && (shape.currentPos[3] % playWidth === 1)) {
        shape.currentPos.forEach(index => playCells[index + 2].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index + 2)
        console.log('if 1')
      } else if (shape.currentPos.every(item => item % playWidth === 9)) {
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)
        console.log('if 2')
      } else if ((r === 2) && shape.currentPos.some(item => item % playWidth === 2)) {
        shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
        console.log('if 3')
      } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 6) && (shape.currentPos[3] % playWidth === 9)) {
        shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
        console.log('if 4')
      } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 7)) {
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)
        console.log('if 5')
      } else if ((r === 2) && (shape.currentPos[0] % playWidth === 8) && (shape.currentPos[3] % playWidth === 0)) {
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)
        console.log('if 6')
      } else if ((r === 2) && shape.currentPos.some(item => item % playWidth === 0)) {
        shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index + 1)
        console.log('if 7')

      } else if ((r === 0) && shape.currentPos.some(item => item % playWidth === 7)) {
        shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
        console.log('if 9')
      } else if ((r === 0) && shape.currentPos.some(item => item % playWidth === 9)) {
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)
        console.log('if 10')

        // PREVENT OVERFLOW BOTTOM
      } else if ((r === 1 | r === 3) && (shape.currentPos[0] === shape.currentPos[3] - 30) && shape.currentPos.some(item => item >= 200)) {
        shape.currentPos.forEach(index => playCells[index - 10].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 10)
        console.log('if 11')
      } else if ((r === 1 | r === 3) && shape.currentPos.some(item => item >= 170) && shape.currentPos.some(item => item < 180)) {
        shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
        console.log('if 12')
      } else if ((r === 1 | r === 3) && shape.currentPos.some(item => item >= playCellCount - 10)) {
        shape.currentPos.forEach(index => playCells[index - 10].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 10)
      } else {
        shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
        console.log('if 13')
      }
    } else {
      console.log('DID NOT ROTE')
      // //console.log('Test Current after loop', shape.currentPos)
    }

  }

  // !------------LINE CLEARED ----------------------------------

  function checkClearedRow() {
    clearedRowCount = 0
    clearedRow = []

    for (let i = 19; i >= 0; i--) {

      if (playCellRows[i].every(item => item.className.includes('landed'))) {
        clearedRow.push(i)
        clearedRowCount += 1
        lineScore = lineScore + 1
        lineScoreText.innerHTML = `${lineScore}`
        console.log('LINE SCORE-->', lineScore)
        checkLevel()
        console.log('level checked')
        playGrid.classList.add('shake')
      }
    }
    for (let c = 0; c < clearedRow.length; c++) {
      //// console.log('LOOP NO-->', c)
      // select that certain row, save in new variable
      row = playCellRows[clearedRow[c]]
      // remove class from that row
      row.forEach(cell => playCells[parseFloat(cell.dataset.index)].className = '')

      // IF TOP ROW CLEARED
      if (c === clearedRow.length - 1) {
        soundClear.play()
        landedCells = playCells.filter(cell => cell.dataset.index < (clearedRow[c] * playWidth))
        landedCells = landedCells.filter(cell => cell.className.includes('landed'))
        // iterate through every landedCells 
        for (let b = landedCells.length - 1; b >= 0; b--) {
          // save class name of that cell in variable before remove
          landedClass = landedCells[b].className
          landedCells[b].classList.remove(landedClass)
          playCells[parseFloat(landedCells[b].dataset.index) + playWidth * clearedRow.length].classList.add(landedClass)
        }

      } else {
        // ROW NOT ON TOP
        landedCells = playCells.filter(cell => cell.dataset.index < (clearedRow[c] * playWidth) && cell.dataset.index > (clearedRow[c] * 10) - 11)
        landedCells = landedCells.filter(cell => cell.className.includes('landed'))
        // IF ROW IS EMPTY
        if (clearedRow.includes(parseFloat(landedCells[0].dataset.index) / 10)) {
          shiftMulti += 1
          //  check if bottom row ( clearedRow[c]) is empty --> how many rows empty? --> shft down that # of rows 
        } else {
          for (let b = landedCells.length - 1; b >= 0; b--) {
            // save class name of that cell in variable before remove
            landedClass = landedCells[b].className
            landedCells[b].classList.remove(landedClass)
            //  Add saved class, one cell lower + add extra shifts from empty row
            playCells[parseFloat(landedCells[b].dataset.index) + playWidth * shiftMulti].classList.add(landedClass)
            console.log('Added', landedClass, ' to-->', playCells[parseFloat(landedCells[b].dataset.index) + 10 * shiftMulti])
          }
          shiftMulti = 1
        }

      }
    }
    score = score + (500 * clearedRowCount) + scoreMultiplier
    scoreText.innerHTML = `${score}`

  }

  // * SCORES AND LEVELS
  function checkLevel() {
    if (lineScore >= nextLevel) {
      console.log('LEVEL UP')
      soundLevelUp.play()
      if (currentLevel > 9) {
        time = 100
        nextLevel = nextLevel + 10
        scoreMultiplier += 100
      } else if (currentLevel > 4) {
        time -= 100
        nextLevel = nextLevel + 10
        scoreMultiplier = 50
      } else {
        time -= 50
        nextLevel = nextLevel + 5
        scoreMultiplier = 10
      }
      console.log('time-->', time)
      currentLevel = currentLevel + 1
      levelText.innerHTML = currentLevel
    }
  }


  // !---------- ARROW KEYS -------------------------------------

  function handleMovement(event) {
    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32
    const enter = 13
    const letterP = 80
    const keyCode = event.keyCode
    event.target.blur()

    if (up === keyCode) {
      // console.log('Clicked up')

      if (shape.currentPos.some(item => item >= (playCellCount - playWidth)) ||
        shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        // console.log('Clicked up end')
      } else {
        soundClick.play()
        rotate()
      }
    } else if (down === keyCode) {
      event.preventDefault()
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        // console.log('Clicked down end')
        deactivate()
        r = 0
        checkClearedRow()
      } else {
        soundClick.play()
        remove()
        moveDown()
      }
    } else if (left === keyCode) {
      event.preventDefault()
      console.log('ON LEFT CLICK', shape.currentPos)
      if (shape.currentPos.some(item => (item % playWidth === 0)) || shape.currentPos.some(index => playCells[index - 1].className.includes('landed')) || shape.currentPos.some(index => playCells[index].className.includes('landed'))) {
        // console.log('Clicked left End')
      } else {
        soundClick.play()
        remove()
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)

      }
    } else if (right === keyCode) {
      event.preventDefault()
      if (shape.currentPos.some(item => (item % playWidth === 9)) || shape.currentPos.some(index => playCells[index + 1].className.includes('landed')) || shape.currentPos.some(index => playCells[index].className.includes('landed'))) {
        // console.log('Clicked right End')
      } else {
        soundClick.play()
        remove()
        shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index + 1)
      }
    } else if (space === keyCode) {
      event.preventDefault()

      if (isGameActive === false) {
        // console.log('space paused')
      } else {
        while (!(shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed')))) {
          remove()
          moveDown()
          soundHardDrop.play()
        }
        deactivate()
        console.log('deactivated space')
        checkClearedRow()
        r = 0
        score += 5
        scoreText.innerHTML = score
      }
    } else if (enter === keyCode) {
      if (isGameStart === true) {
        console.log('GAME START ENTER')
        soundEnter.play()
        restartGame()
        isGameStart = false
      } else if (isGameActive === false) {
        if (isGameOver === true) {
          console.log('GAME OVER ENTER')
          soundEnter.play()
          restartGame()
        } else if (isGamePaused === true) {
          console.log('GAME PAUSED ENTER')
          soundEnter.play()
          resumeGame()
        }
      } else if (isGameActive === true) {
        console.log('CANNOT ENTER, GAME IS ACTIVE')
      }
    } else if (letterP === keyCode) {
      pauseGame()
    }
  }
  playPauseButton.addEventListener('click', pauseGame)
  restartButton.addEventListener('click', gameOver)
  sfxButton.addEventListener('click', setAudio)
  document.addEventListener('keydown', handleMovement)
}



window.addEventListener('DOMContentLoaded', init)