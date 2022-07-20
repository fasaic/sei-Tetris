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
  const scoreText = document.querySelector('#scoreDisplay')
  const finalScoreText = document.querySelector('#scoreOverValue')
  const lineScoreText = document.querySelector('#linesDisplay')
  scoreText.innerHTML = `${score}`
  lineScoreText.innerHTML = `${lineScore}`
  const restartButton = document.querySelector('#restart')
  restartButton.disabled = true

  function drop() {
    // Check if it hits buttom or cells with landed shape
    if (playCells.some(cell => cell.className.includes('moving'))) {
      console.log('there is a moving shape!')
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
      if (shape.startPos.some(index => playCells[index + 10].className.includes('landed')) || shape.currentPos.some(index => playCells[index - 10] < 10)) {
        moveDown()
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
  const playCellRows = []
  const cellsPerRow = 10
  let clearedRow = []
  let clearedRowCount = 0
  let landedCells = []
  let landedClass = null
  for (let i = 0; i < playCells.length; i += cellsPerRow) {
    const cellsGroup = playCells.slice(i, i + cellsPerRow)
    playCellRows.push(cellsGroup)
  }

  console.log('playCellRows after loop -->', playCellRows)

  function checkClearedRow() {
    clearedRowCount = 0
    clearedRow = []

    for (let i = 0; i <= 19; i++) {
      if (playCellRows[i].every(item => item.className.includes('landed'))) {
        clearedRow.push(i)
        clearedRowCount += 1
        for (let i = 0; i < clearedRow.length; i++) {
          let row = playCellRows[clearedRow[i]]
          console.log(row[0])
          row.forEach(cell => playCells[parseFloat(cell.dataset.index)].className = '')
          // landedCells = playCells.filter(cell => cell.className.includes('landed'))
          // landedCells = landedCells.filter(cell => cell.dataset.index < (clearedRow[i] * 10))
          // console.log('filtered landed', landedCells)

          landedCells = playCells.filter(cell => cell.dataset.index < (clearedRow[i] * 10))
          landedCells = landedCells.filter(cell => cell.className.includes('landed'))
          console.log('filtered landed', landedCells)
          // for (let i = 0; i < landedCells.length; i++){
          //   landedClass =
          // }
          for (let i = 0; i < landedCells.length; i++) {
            landedClass = landedCells[i].className
            console.log('loop.no -->', i)
            console.log('landed class-->', landedClass)
            // console.log('cells-->', playCells[parseFloat(landedCells[i].dataset.index)])
            // landedCells[i].className = ''
            // landedCells[i].removeAttribute('class')
            // playCells[parseFloat(landedCells[i].dataset.index)].className = ''
            // playCells[landedCells[i].dataset.index].className = ''
            console.log('removed', landedCells[i])
            console.log(landedCells[i].dataset.index)
            playCells[parseFloat(landedCells[i].dataset.index) + 10].className = 'preview'

            // playCells[parseFloat(landedCells[i].dataset.index)].className = landedClass
            console.log('cell to be removed -->', playCells[(parseFloat(landedCells[i].dataset.index))])
            let toBeRemoved = playCells[(parseFloat(landedCells[i].dataset.index))]
            // toBeRemoved.className = 'preview'

            // playCells[(parseFloat(landedCells[i].dataset.index) + 10)].className = landedClass
          
            
            // playCells[(parseFloat(landedCells[i].dataset.index))].className = ''
            // playCells[parseFloat(landedCells[i].dataset.index) + 10].classList.add(`${landedClass}`)
            console.log('Added', landedClass, ' to-->', playCells[parseFloat(landedCells[i].dataset.index) + 10])
          }
          landedCells.forEach(item => item.className = '')
        }
      }
    }








    // console.log('AfterLoop', landedCells)



    lineScore = lineScore + clearedRowCount
    score = score + (500 * clearedRowCount)
    lineScoreText.innerHTML = `${lineScore}`
    scoreText.innerHTML = `${score}`
    console.log('check -->', playCellRows[19].every(item => item.className.includes('landed')))
    console.log('Cleared Row Array -->', clearedRow)
    console.log('Cleared Row Count -->', clearedRowCount)
  }




  // !---------- ARROW KEYS -------------------------------------
  const soundClick = new Audio('./audio/rotate2.wav')
  function handleMovement(event) {
    // soundClick.play()
    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32
    const enter = 13
    const keyCode = event.keyCode

    if (up === keyCode) {
      console.log('Clicked up')
      if (shape.currentPos.some(item => item >= (playCellCount - playWidth)) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        // console.log('Clicked up end')
      } else {
        rotate()
      }
    } else if (down === keyCode) {
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        // console.log('Clicked down end')
        inactive()
        r = 0
      } else {
        remove()
        moveDown()
      }
    } else if (left === keyCode) {
      if (shape.currentPos.some(item => (item % playWidth === 0)) || shape.currentPos.some(index => playCells[index - 1].className.includes('landed'))) {
        // console.log('Clicked left End')
      } else {
        remove()
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index - 1)

      }
    } else if (right === keyCode) {
      if (shape.currentPos.some(item => (item % playWidth === 9)) || shape.currentPos.some(index => playCells[index + 1].className.includes('landed'))) {
        // console.log('Clicked right End')
      } else {
        remove()
        shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
        shape.currentPos = shape.currentPos.map(index => index + 1)
      }
    } else if (space === keyCode) {
      while (!(shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed')))) {
        remove()
        moveDown()
      }

      score += 5
      scoreText.innerHTML = `${score}`
      inactive()
      checkClearedRow()
      r = 0
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
        // playCells.map(index => playCells[index].classList.remove('landed'))
        drop()
      } else {
        document.querySelector('#startGame').style.display = 'none'
        document.querySelector('#playGrid').style.position = 'relative'
        restartButton.disabled = false
        drop()
      }
    }
  }

  restartButton.addEventListener('click', gameOver)
  document.addEventListener('keydown', handleMovement)
}



window.addEventListener('DOMContentLoaded', init)