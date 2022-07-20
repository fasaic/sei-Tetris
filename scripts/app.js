/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
function init() {
  // ! MAKE GRID ---------------------------------------------------------------------------------
  const wrapperGrid = document.querySelector('#grid-wrapper')
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
  const randomHist = []
  function randomizeShape() {
    let random = Math.floor(Math.random() * 7 + 1)
    if (randomHist.length < 2) {
      randomHist.push(random)
    } else if (randomHist.length < 5) {
      while (randomHist.some(item => item === random)) {
        random = Math.floor(Math.random() * 7 + 1)
        console.log('looping1')
      }
      randomHist.push(random)
    } else if (randomHist.length >= 5) {
      while (randomHist.some(item => item === random)) {
        random = Math.floor(Math.random() * 7 + 1)
        console.log('looping2')
      }
      randomHist.shift()
      randomHist.push(random)
    }
    return eval(`shape${random}`)
  }


  // ! CALL SHAPE / NEXT SHAPE DISPLAY -------------------------------------------------
  let shape = null
  let nextShape = null
  let nextDisplayPos = null
  let time = 1000
  let timer = null
  let score = 0
  let lineScore = 0
  let gamePaused = true
  const playCellRows = []
  const cellsPerRow = 10
  const scoreText = document.querySelector('#scoreDisplay')
  const finalScoreText = document.querySelector('#scoreOverValue')
  const lineScoreText = document.querySelector('#linesDisplay')
  const restartButton = document.querySelector('#restart')
  const playPauseButton = document.querySelector('#playPause')
  scoreText.innerHTML = `${score}`
  lineScoreText.innerHTML = `${lineScore}`
  restartButton.disabled = true
  playPauseButton.disabled = true

  // *CREATE ARRAY OF CELL ROWS
  for (let i = 0; i < playCells.length; i += cellsPerRow) {
    const cellsGroup = playCells.slice(i, i + cellsPerRow)
    playCellRows.push(cellsGroup)
  }
  console.log('playCellRows after loop -->', playCellRows)

  // * PLAYPAUSE BUTTON
  function playPause() {
    if (gamePaused === true) {
      gamePaused = false
      setTimeout(drop, time)
      playPauseButton.innerHTML = 'II'
    } else {
      gamePaused = true
      clearInterval(timer)
      playPauseButton.innerHTML = 'PLAY'
    }
  }

  function drop() {
    // Check if it hits buttom or cells with landed shape
    gamePaused = false
    if (playCells.some(cell => cell.className.includes('moving'))) {
      // console.log('there is a moving shape!')
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        console.log('REACHED THE ENDD --> WAITING FOR NEXT SHAPE')
        remove()
        inactive()
        checkClearedRow()
        shape = nextShape
      } else {
        remove()
        moveDown()
      }
      timer = setTimeout(drop, time)

      // THERE IS NO ACTIVE SHAPE
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
        // moveDown()
        gameOver()
        return
      }
      moveDown()
      timer = setTimeout(drop, time)
    }
  }
  // ! ----------- FUNCTIONS ------------------
  function gameOver() {
    document.querySelector('#gameOver').style.display = 'flex'
    document.querySelector('#playGrid').style.position = 'absolute'
    finalScoreText.innerHTML = `${score}`
    clearInterval(timer)
  }


  function remove() {
    shape.currentPos.forEach(index => playCells[index].classList.remove(shape.moving))
  }

  function moveDown() {
    shape.currentPos.forEach(index => playCells[index + 10].classList.add(shape.moving))
    shape.currentPos = shape.currentPos.map(index => index + 10)
  }

  function inactive() {
    shape.currentPos.forEach(index => playCells[index].classList.add(shape.landed))
    shape.currentPos.forEach(index => playCells[index].classList.remove(shape.moving))
  }


  function nextShapeDisplay() {
    nextDisplayPos = nextShape.startPos.map(cell => cell + 20)
    nextDisplayPos = nextDisplayPos.map(cell => {
      if (cell <= 6) {
        console.log('if 1')
        return cell -= 3
      } else if (cell <= 16) {
        console.log('if 2')
        return cell -= 9
      } else if (cell <= 26) {
        console.log('if 3')
        return cell -= 15
      } else if (cell <= 36) {
        console.log('if 4')
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

  function nextShapeRemove() {
    nextDisplayPos.forEach(index => nextCells[index].classList.remove(shape.moving))
  }




  // !---------------ROTATE------------------------------------------------------
  let r = 0
  function rotate() {
    // soundClick.play()
    r++
    if (r > 3) {
      r = 0
    }
    // console.log('r before rot', r)
    const rot = Object.values(shape.rot)[r]
    // console.log('rotation offset -->', rot)
    // console.log('shape.currentPos Before-->', shape.currentPos)
    for (let i = 0; i < 4; i++) {
      remove()
      shape.currentPos[i] = shape.currentPos[i] + parseFloat(rot[i])

    }
    // console.log('Test Current after loop', shape.currentPos)
    // PREVENT OVERFLOW LEFT
    if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[3] % playWidth === 2) && (shape.currentPos[0] % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 1)
      console.log('if 1')
    } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 8) && (shape.currentPos[3] % playWidth === 1)) {
      shape.currentPos.forEach(index => playCells[index + 2].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 2)
      console.log('if 2')
    } else if ((r === 1 || r === 3) && (shape.currentPos[0] === shape.currentPos[3] - 30) && (shape.currentPos[0] < 0)) {
      shape.currentPos.forEach(index => playCells[index + 30].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 30)
      console.log('if start')
    } else if (shape.currentPos.every(item => item % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      console.log('if 3')
    } else if ((r === 2) && shape.currentPos.some(item => item % playWidth === 2)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 4')

      // PREVENT OVERFLOW RIGHT
    } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 6) && (shape.currentPos[3] % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      // shape.currentPos = shape.currentPos.map(index => index - 1 )
      console.log('if 6')
    } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 7) /*&& (shape.currentPos[3] % playWidth === 0)*/) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      console.log('if 7')
    } else if ((r === 2) && (shape.currentPos[0] % playWidth === 8) && (shape.currentPos[3] % playWidth === 0)) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      console.log('if 5?')
    } else if ((r === 2) && shape.currentPos.some(item => item % playWidth === 0)) {
      shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 1)
      console.log('if 5')
    } else if ((r === 0) && (shape.currentPos[0] % playWidth === 0) && (shape.currentPos[3] % playWidth === 0)) {
      shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 1)
      console.log('if 5?')
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
      console.log('if 12')
    } else if ((r === 1 | r === 3) && shape.currentPos.some(item => item >= 170) && shape.currentPos.some(item => item < 180)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 11')
    } else if ((r === 1 | r === 3) && shape.currentPos.some(item => item >= playCellCount - 10)) {
      shape.currentPos.forEach(index => playCells[index - 10].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 10)

    } else {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 13')
    }
    // console.log('After IF', shape.currentPos)
  }

  // !------------LINE CLEARED ----------------------------------

  let clearedRow = []
  let clearedRowCount = 0
  let landedCells = []
  let landedClass = null



  function checkClearedRow() {
    clearedRowCount = 0
    clearedRow = []

    
    // for (let i = 0; i <= 19; i++) {
    for (let i = 19; i >= 0; i--) {

      if (playCellRows[i].every(item => item.className.includes('landed'))) {
        clearedRow.push(i)
        clearedRowCount += 1
        for (let c = 0; c < clearedRow.length; c++) {
        // for (let c = clearedRow.length - 1; c >= 0; c--) {
          console.log('LAST ITEM OF CLEARED ROW , FIRST LOOOOP ->', c)
          // select that certain row, save in new variable
          const row = playCellRows[clearedRow[c]]
          // remove class from that row
          row.forEach(cell => playCells[parseFloat(cell.dataset.index)].className = '')
          // saved all rows to be shifted down in new variable, choose only landed cells on top of removed row
          if (c === clearedRow.length - 1){
            landedCells = playCells.filter(cell => cell.dataset.index < (clearedRow[c] * 10))
          } else {
            landedCells = playCells.filter(cell => cell.dataset.index < (clearedRow[c] * 10) && cell.dataset.index > (clearedRow[c] * 10) - 19 )
          }
          // landedCells = playCells.filter(cell => cell.dataset.index < (clearedRow[i] * 10))
          landedCells = landedCells.filter(cell => cell.className.includes('landed'))
          console.log('filtered landed loop', c, ' --> ', landedCells)
          console.log('Removed Row loop', c, ' --> ', playCellRows[clearedRow[c]])
          
          // iterate through every landedCells 
          for (let b = landedCells.length - 1; b >= 0; b--) {
            console.log('SHIFT CELLLLSSSS ROW -->', b)
            // save class name of that cell in variable before remove
            landedClass = landedCells[b].className
            // landedClass = 'preview'
            // console.log('loop.no -->', i)
            console.log('landed class-->', landedClass)
  
            // // * Remove Class
            landedCells[b].classList.remove(landedClass)
            // // console.log('cell to be removed -->', landedCells[i])
            // // landedCells[i].className = ''
            // // console.log('removed class ', landedClass, 'from ', landedCells[i])
  
            // // * Add saved class, one cell lower
            console.log(parseFloat(landedCells[b].dataset.index) + playWidth)
            playCells[parseFloat(landedCells[b].dataset.index) + playWidth].classList.add(landedClass)
            console.log('Added', landedClass, ' to-->', playCells[parseFloat(landedCells[b].dataset.index) + 10])
            
            
          }
        }

      }
      // console.log('check -->', playCellRows[19].every(item => item.className.includes('landed')))
      console.log('Cleared Row Array -->', clearedRow)
      console.log('Cleared Row Count -->', clearedRowCount)
    }

    // console.log('AfterLoop', landedCells)

    lineScore = lineScore + clearedRowCount
    score = score + (500 * clearedRowCount)
    lineScoreText.innerHTML = `${lineScore}`
    scoreText.innerHTML = `${score}`
  }




  // !---------- ARROW KEYS -------------------------------------
  const soundClick = new Audio('./audio/rotate2.wav')
  soundClick.volume = 0.1
  function handleMovement(event) {
    // soundClick.play()
    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32
    const enter = 13
    const keyCode = event.keyCode
    // event.preventDefault()
    event.target.blur()

    if (up === keyCode) {
      console.log('Clicked up')
      if (shape.currentPos.some(item => item >= (playCellCount - playWidth)) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        // console.log('Clicked up end')
      } else {
        soundClick.play()
        rotate()
      }
    } else if (down === keyCode) {
      event.preventDefault()
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        // console.log('Clicked down end')
        inactive()
        r = 0
        checkClearedRow()
      } else {
        soundClick.play()
        remove()
        moveDown()
      }
    } else if (left === keyCode) {
      event.preventDefault()
      if (shape.currentPos.some(item => (item % playWidth === 0)) || shape.currentPos.some(index => playCells[index - 1].className.includes('landed'))) {
        // console.log('Clicked left End')
      } else {
        soundClick.play()
        remove()
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)

      }
    } else if (right === keyCode) {
      event.preventDefault()
      if (shape.currentPos.some(item => (item % playWidth === 9)) || shape.currentPos.some(index => playCells[index + 1].className.includes('landed'))) {
        // console.log('Clicked right End')
      } else {
        soundClick.play()
        remove()
        shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index + 1)
      }
    } else if (space === keyCode) {
      event.preventDefault()
      if (gamePaused === true) {
        console.log('space paused')
      } else {
        while (!(shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed')))) {
          remove()
          moveDown()
        }
        score += 5
        scoreText.innerHTML = `${score}`
        inactive()
        checkClearedRow()
        r = 0
      }
    } else if (enter === keyCode) {
      if (document.querySelector('#gameOver').style.display === 'flex') {
        document.querySelector('#gameOver').style.display = 'none'
        document.querySelector('#playGrid').style.position = 'relative'
        // document.querySelector('#playGrid div').classList.remove('landed')
        console.log('GAME OVER ENTER')
        playCells.forEach(item => item.className = '')
        nextCells.forEach(item => item.className = '')
        score = 0
        lineScore = 0
        scoreText.innerHTML = `${score}`
        restartButton.disabled = false
        playPauseButton.disabled = false
        // playCells.map(index => playCells[index].classList.remove('landed'))
        drop()
      } else {
        document.querySelector('#startGame').style.display = 'none'
        document.querySelector('#playGrid').style.position = 'relative'
        gamePaused = false
        restartButton.disabled = false
        playPauseButton.disabled = false
        drop()
      }
    }
  }

  playPauseButton.addEventListener('click', playPause)
  restartButton.addEventListener('click', gameOver)
  document.addEventListener('keydown', handleMovement)
}



window.addEventListener('DOMContentLoaded', init)