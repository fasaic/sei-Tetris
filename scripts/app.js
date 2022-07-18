/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
function init() {
  // ! CREATE GRID
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


  createPlayGrid()
  createNextGrid()

  // ! -----------------------------------------------------------------------------------
  const shapeO = [4, 5, 14, 15]
  const rotateO = {
    one: [0, 0, 0, 0],
    two: [0, 0, 0, 0],
    three: [0, 0, 0, 0],
    four: [0, 0, 0, 0],
  }
  // const shapeI = [13, 14, 15, 16]
  // const rotateI = {
  //   one: [8, -1, -10, -19],
  //   two: [-8, 1, 10, 19],
  //   three: [8, -1, -10, -19],
  //   four: [-8, 1, 10, 19],
  // }

  // const shapeI = [13, 14, 15, 16]
  // const rotateI = {
  //   one: [28, 19, 10, 1],
  //   two: [-28, -19, -10, -1],
  //   three: [28, 19, 10, 1],
  //   four: [-28, -19, -10, -1],
  // }

  const shapeI = [13, 14, 15, 16]
  const rotateI = {
    one: [18, 9, 0, -9],
    two: [-18, -9, 0, 9],
    three: [18, 9, 0, -9],
    four: [-18, -9, 0, 9],
  }

  const shapeS = [14, 15, 23, 24]
  const rotateS = {
    one: [10, 1, 8, -1],
    two: [-10, -1, -8, 1],
    three: [10, 1, 8, -1],
    four: [-10, -1, -8, 1],
  }

  const shapeZ = [14, 15, 25, 26]
  const rotateZ = {
    one: [9, 1, 10, 2],
    two: [-9, -1, -10, -2],
    three: [9, 1, 10, 2],
    four: [-9, -1, -10, -2],
  }

  const shapeT = [4, 13, 14, 15]
  const rotateT = {
    one: [0, 0, 0, -9],
    two: [0, 1, 1, 9],
    three: [9, 0, 0, 0],
    four: [-9, -1, -1, 0]
  }

  const shapeL = [5, 13, 14, 15]
  const rotateL = {
    one: [2, 9, 0, -9],
    two: [-1, 1, 10, 10],
    three: [9, 0, -9, -2],
    four: [-10, -10, -1, 1]
  }

  const shapeJ = [4, 14, 15, 16]
  const rotateJ = {
    one: [-1, -1, -9, -9],
    two: [1, -8, 0, 9],
    three: [9, 9, 1, 1],
    four: [-9, 0, 8, -1]
  }
  let testCurrent = shapeJ
  let testNext = testCurrent.map(index => index + playWidth)

  function newShape() {
    testCurrent.forEach(index => playCells[index].classList.add('t'))
  }

  newShape()

  function addDown() {
    testCurrent.forEach(index => playCells[index].classList.add('t'))
    testNext = testCurrent.map(index => index + playWidth)
  }

  function remove() {
    testCurrent.forEach(index => playCells[index].classList.remove('t'))
    console.log('REMOVED')
  }

  let i = 0
  function rotate() {
    i++
    if (i > 3) {
      i = 0
    }
    console.log('i before rot', i)
    const rot = Object.values(rotateJ)[i]
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
    
    if (testCurrent.some(item => item >= (190))) {
      // remove()
      console.log('stop timer')
      clearInterval(timer)
      setTimeout(inactive, 0)
    } else {
      remove()
      testCurrent.forEach(index => playCells[index + 10].classList.add('t'))
      testCurrent = testCurrent.map(index => index + 10)
    }
  
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
      if (testCurrent.some(item => (item % playWidth === 9))) {
        console.log('Clicked right End')
      } else {
        remove()
        console.log('Clicked right')
        testCurrent.forEach(index => playCells[index + 1].classList.add('t'))
        testNext = testCurrent.map(index => index + 1)
        testCurrent = testNext
      }
    } else {
      testCurrent = testCurrent
    }
  }

  const timer = setInterval(() => {
    moveDown()
    console.log('timer active')
  }, 1300)

  document.addEventListener('keydown', handleMovement)
}



window.addEventListener('DOMContentLoaded', init)