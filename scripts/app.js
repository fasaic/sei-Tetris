/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
function init() {
  // ! MAKE GRID ---------------------------------------------------------------------------------

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


  // function makeGrid(cellCount, cells, gridDiv) {
  //   for (let i = 0; i < cellCount; i++) {
  //     const cell = document.createElement('div')
  //     cell.innerText = i
  //     cell.style.fontSize = '0.6rem'
  //     cell.dataset.index = i
  //     cells.push(cell)
  //     gridDiv.appendChild(cell)
  //   }
  //   console.log(cells)
  // }

  // makeGrid(playCellCount, playCells, playGrid)
  // makeGrid(nextCellCount, nextCells, nextGrid)

  function createPlayGrid() {
    for (let i = 0; i < playCellCount; i++) {
      const playCell = document.createElement('div')
      playCell.innerText = i
      playCell.style.fontSize = '0.6rem'
      playCell.dataset.index = i
      playCells.push(playCell)
      playGrid.appendChild(playCell)
    }
    console.log(playCells)
  }

  function createNextGrid() {
    for (let i = 0; i < nextCellCount; i++) {
      const nextCell = document.createElement('div')
      nextCell.innerText = i
      nextCell.style.fontSize = '0.6rem'
      nextCell.dataset.index = i
      nextCells.push(nextCell)
      nextGrid.appendChild(nextCell)
    }
  }

  // function createNextGrid() {
  //   for (let i = 3; i <= 6; i++) {
  //     const nextCell = document.createElement('div')
  //     nextCell.innerText = i
  //     nextCell.style.fontSize = '0.6rem'
  //     nextCell.dataset.index = i
  //     nextCells.push(nextCell)
  //     nextGrid.appendChild(nextCell)
  //   }
  //   console.log('nextGrid loop 1', nextCells)
  //   for (let i = 13; i <= 16; i++) {
  //     const nextCell = document.createElement('div')
  //     nextCell.innerText = i
  //     nextCell.style.fontSize = '0.6rem'
  //     nextCell.dataset.index = i
  //     nextCells.push(nextCell)
  //     nextGrid.appendChild(nextCell)
  //     console.log('nextGrid loop 2', nextCells)
  //   }

  //   for (let i = 23; i <= 26; i++) {
  //     const nextCell = document.createElement('div')
  //     nextCell.innerText = i
  //     nextCell.style.fontSize = '0.6rem'
  //     nextCell.dataset.index = i
  //     nextCells.push(nextCell)
  //     nextGrid.appendChild(nextCell)
  //   }

  //   for (let i = 33; i <= 36; i++) {
  //     const nextCell = document.createElement('div')
  //     nextCell.innerText = i
  //     nextCell.style.fontSize = '0.6rem'
  //     nextCell.dataset.index = i
  //     nextCells.push(nextCell)
  //     nextGrid.appendChild(nextCell)
  //   }
  // }


  createPlayGrid()
  createNextGrid()


  // ! MAKE SHAPES -------------------------------------------------------------------------------

  class Shape {
    constructor(shape, startPos, rot) {
      this.shape = shape
      this.startPos = startPos
      this.currentPos = startPos
      this.nextPos = this.currentPos + 10
      this.rot = rot
      this.moving = `moving${shape}`
      this.landed = `landed${shape}`
      this.stopped = `stopped${shape}`
    }
  }


  const shape1 = new Shape('O', [4, 5, 14, 15], {
    one: [0, 0, 0, 0],
    two: [0, 0, 0, 0],
    three: [0, 0, 0, 0],
    four: [0, 0, 0, 0]
  })

  const shape2 = new Shape('I', [13, 14, 15, 16], {
    one: [18, 9, 0, -9],
    two: [-18, -9, 0, 9],
    three: [18, 9, 0, -9],
    four: [-18, -9, 0, 9]
  })

  const shape3 = new Shape('S', [14, 15, 23, 24], {
    one: [10, 1, 8, -1],
    two: [-10, -1, -8, 1],
    three: [10, 1, 8, -1],
    four: [-10, -1, -8, 1]
  })

  const shape4 = new Shape('Z', [14, 15, 25, 26], {
    one: [9, 1, 10, 2],
    two: [-9, -1, -10, -2],
    three: [9, 1, 10, 2],
    four: [-9, -1, -10, -2]
  })

  const shape5 = new Shape('T', [4, 13, 14, 15], {
    one: [0, 0, 0, -9],
    two: [0, 1, 1, 9],
    three: [9, 0, 0, 0],
    four: [-9, -1, -1, 0]
  })

  const shape6 = new Shape('L', [5, 13, 14, 15], {
    one: [2, 9, 0, -9],
    two: [-1, 1, 10, 10],
    three: [9, 0, -9, -2],
    four: [-10, -10, -1, 1]
  })


  const shape7 = new Shape('J', [4, 14, 15, 16], {
    one: [-1, -1, -9, -9],
    two: [1, -8, 0, 9],
    three: [9, 9, 1, 1],
    four: [-9, 0, 8, -1]
  })

  console.log(`${`shape${1}`}`)


  //! RANDOMIZE SHAPE----------------------------------------------------

  function randomizeShape() {
    const random = Math.floor(Math.random() * 7 + 1)
    return eval(`shape${random}`)
  }

  // !-----------------------------------------------------
  let shape = null
  let nextShape
  let nextDisplayPos = null

  function callShape() {
    nextShape = randomizeShape()
    console.log(nextShape)
    shape = nextShape
    shape.nextPos = shape.currentPos.map(index => index + playWidth)
  }



  function nextShapeDisplay() {
    console.log(nextShape.currentPos)
    if (nextShape.shape === 'Z' || nextShape.shape === 'S') {
      nextDisplayPos = nextShape.currentPos.map(cell => cell)
    } else {
      nextDisplayPos = nextShape.currentPos.map(cell => cell + 10)
    }
    console.log(nextDisplayPos)
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
        if (nextShape.shape === 'Z'){
          return cell -= 13
        } else {
          return cell -= 9
        }
      }
    })
    nextDisplayPos.forEach(index => nextCells[index].classList.add(nextShape.moving))
  }
  callShape()
  nextShapeDisplay()

  function remove() {
    shape.currentPos.forEach(index => playCells[index].classList.remove('t'))
    console.log('REMOVED')
  }

  // !---------------ROTATE-------------------
  let i = 0
  function rotate() {
    i++
    if (i > 3) {
      i = 0
    }
    console.log('i before rot', i)
    const rot = Object.values(testCurrent.rot)[i]
    for (let i = 0; i < 4; i++) {
      remove()
      testCurrent[i] = testCurrent[i] + parseFloat(rot[i])
    }
    console.log('Test Current after loop', testCurrent)
    // PREVENT OVERFLOW LEFT
    if ((i === 2 || i === 0) && (testCurrent[0] === testCurrent[3] - 3) && (testCurrent[3] % playWidth === 2) && (testCurrent[0] % playWidth === 9)) {
      testCurrent.forEach(index => playCells[index + 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index + 1)
      testNext = testCurrent
      console.log('if 1')
    } else if ((i === 2 || i === 0) && (testCurrent[0] === testCurrent[3] - 3) && (testCurrent[0] % playWidth === 8) && (testCurrent[3] % playWidth === 1)) {
      testCurrent.forEach(index => playCells[index + 2].classList.add('t'))
      testCurrent = testCurrent.map(index => index + 2)
      testNext = testCurrent
      console.log('if 2')
    } else if ((i === 1 || i === 3) && (testCurrent[0] === testCurrent[3] - 30) && (testCurrent[0] < 0)) {
      testCurrent.forEach(index => playCells[index + 30].classList.add('t'))
      testCurrent = testCurrent.map(index => index + 30)
      testNext = testCurrent
      console.log('if start')
    } else if (testCurrent.every(item => item % playWidth === 9)) {
      testCurrent.forEach(index => playCells[index - 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index - 1)
      testNext = testCurrent
      console.log('if 3')
    } else if ((i === 2) && testCurrent.some(item => item % playWidth === 2)) {
      testCurrent.forEach(index => playCells[index].classList.add('t'))
      console.log('if 4')

      // PREVENT OVERFLOW RIGHT
    } else if ((i === 2 || i === 0) && (testCurrent[0] === testCurrent[3] - 3) && (testCurrent[0] % playWidth === 6) && (testCurrent[3] % playWidth === 9)) {
      testCurrent.forEach(index => playCells[index].classList.add('t'))
      // testCurrent = testCurrent.map(index => index - 1 )
      // testNext = testCurrent
      console.log('if 6')
    } else if ((i === 2 || i === 0) && (testCurrent[0] === testCurrent[3] - 3) && (testCurrent[0] % playWidth === 7) /*&& (testCurrent[3] % playWidth === 0)*/) {
      testCurrent.forEach(index => playCells[index - 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index - 1)
      testNext = testCurrent
      console.log('if 7')
    } else if ((i === 2) && (testCurrent[0] % playWidth === 8) && (testCurrent[3] % playWidth === 0)) {
      testCurrent.forEach(index => playCells[index - 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index - 1)
      testNext = testCurrent
      console.log('if 5?')
    } else if ((i === 2) && testCurrent.some(item => item % playWidth === 0)) {
      testCurrent.forEach(index => playCells[index + 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index + 1)
      testNext = testCurrent
      console.log('if 5')
    } else if ((i === 0) && (testCurrent[0] % playWidth === 0) && (testCurrent[3] % playWidth === 0)) {
      testCurrent.forEach(index => playCells[index + 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index + 1)
      testNext = testCurrent
      console.log('if 5?')
    } else if ((i === 0) && testCurrent.some(item => item % playWidth === 7)) {
      testCurrent.forEach(index => playCells[index].classList.add('t'))
      console.log('if 9')
    } else if ((i === 0) && testCurrent.some(item => item % playWidth === 9)) {
      testCurrent.forEach(index => playCells[index - 1].classList.add('t'))
      testCurrent = testCurrent.map(index => index - 1)
      testNext = testCurrent
      console.log('if 10')


      // PREVENT OVERFLOW BOTTOM
    } else if ((i === 1 | i === 3) && (testCurrent[0] === testCurrent[3] - 30) && testCurrent.some(item => item >= 200)) {
      testCurrent.forEach(index => playCells[index - 10].classList.add('t'))
      testCurrent = testCurrent.map(index => index - 10)
      testNext = testCurrent
      console.log('if 12')
    } else if ((i === 1 | i === 3) && testCurrent.some(item => item >= 170) && testCurrent.some(item => item < 180)) {
      testCurrent.forEach(index => playCells[index].classList.add('t'))
      console.log('if 11')
    } else if ((i === 1 | i === 3) && testCurrent.some(item => item >= playCellCount - 10)) {
      testCurrent.forEach(index => playCells[index - 10].classList.add('t'))
      testCurrent = testCurrent.map(index => index - 10)
      testNext = testCurrent

    } else {
      testCurrent.forEach(index => playCells[index].classList.add('t'))
      console.log('if 13')
    }
    console.log('After IF', testCurrent)
  }

  function moveDown() {

    // if (testCurrent.some(item => item >= (190))) {
    //   // remove()
    //   console.log('stop timer')
    //   clearInterval(timer)
    //   setTimeout(inactive, 0)
    // } else {
    remove()
    testCurrent.forEach(index => playCells[index + 10].classList.add('t'))
    testCurrent = testCurrent.map(index => index + 10)
    // }

    // if (testCurrent.some(item => item >= (190))) {
    //   console.log('stop timer')
    //   clearInterval(timer)
    //   setTimeout(inactive, 1000)
    // }
    console.log('moveDown')
  }

  function inactive() {
    testCurrent.forEach(index => playCells[index].classList.add('t-inactive'))
    testCurrent.forEach(index => playCells[index].classList.remove('t'))
    // spawn
  }


  function handleMovement(event) {
    // soundClick.play()
    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const keyCode = event.keyCode

    if (up === keyCode) {
      console.log('Clicked up')
      // remove()
      console.log(testCurrent)
      console.log(testNext)
      rotate()
    } else if (down === keyCode) {
      if (testCurrent.some(item => item >= (playCellCount - playWidth))) {
        console.log('Clicked down end')
      } else {
        moveDown()
      }
    } else if (left === keyCode) {
      if (testCurrent.some(item => (item % playWidth === 0))) {
        console.log('Clicked left End')
      } else {

        remove()
        testCurrent.forEach(index => playCells[index - 1].classList.add('t'))
        testNext = testCurrent.map(index => index - 1)
        testCurrent = testNext

      }
    } else if (right === keyCode) {
      const audio = document.getElementById('audio')
      if (testCurrent.some(item => (item % playWidth === 9))) {
        console.log('Clicked right End')
      } else {
        remove()
        console.log('Clicked right')
        testCurrent.forEach(index => playCells[index + 1].classList.add('t'))
        testNext = testCurrent.map(index => index + 1)
        testCurrent = testNext
      }
    }
  }

  const timer = setInterval(() => {
    if (testCurrent.some(item => item >= (190))) {
      // remove()
      console.log('stop timer')
      clearInterval(timer)
      setTimeout(inactive, 0)
    } else {
      moveDown()
      console.log('timer active')
    }
  }, 1300)

  document.addEventListener('keydown', handleMovement)
}



window.addEventListener('DOMContentLoaded', init)