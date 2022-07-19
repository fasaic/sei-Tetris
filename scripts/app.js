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

  // function createWrapperGrid() {
  //   for (let i = 0; i < playCellCount; i++) {
  //     const playCell = document.createElement('div')
  //     playCell.innerText = i
  //     playCell.style.fontSize = '0.6rem'
  //     playCell.dataset.index = i
  //     playCells.push(playCell)
  //     wrapperGrid.appendChild(playCell)
  //   }
  //   console.log(playCells)
  // }
  createPlayGrid()
  createNextGrid()
  // createWrapperGrid()


  // ! MAKE SHAPES -------------------------------------------------------------------------------

  class Shape {
    constructor(shape, startPos, rot) {
      this.shape = shape
      this.startPos = startPos
      this.currentPos = startPos
      this.nextPos = this.currentPos
      this.rot = rot
      // this.moving = `moving${shape}`
      this.moving = 'moving' + shape
      // this.landed = `landed${shape}`
      this.landed = 'landed' + shape
      this.stopped = `stopped${shape}`
    }
  }


  const shape1 = new Shape('O', [4, 5, 14, 15], {
    one: [0, 0, 0, 0],
    two: [0, 0, 0, 0],
    three: [0, 0, 0, 0],
    four: [0, 0, 0, 0]
  })

  const shape2 = new Shape('I', [3, 4, 5, 6], {
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
  const randomHist = []
  function randomizeShape() {
    // const randomHist = []
    // let random = Math.floor(Math.random() * 7 + 1)
    // if (randomHist.length > 3){
    //   randomHist.shift()
    // } else {
    //   while(randomHist.some(item => item === random)){
    //   random = Math.floor(Math.random() * 7 + 1)
    // }
    // randomHist.push(random)
    // return eval(`shape${random}`)
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


  // callShape()
  // nextShapeDisplay()
  // console.log('shape.currentpos???', shape.currentPos)


  // drop()
  function drop() {
    // Check if it hits buttom or cells with landed shape
    if (playCells.some(cell => cell.className.includes('moving'))) {
      console.log('there is a moving shape!')
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        console.log('REACHED THE ENDD --> WAITING FOR NEXT SHAPE')
        time = 1000
        remove()
        inactive()
        shape = nextShape
      } else {
        remove()
        moveDown()
        // while (!(shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed')))){
        //   shape.currentPos.some(index => playCells[index].classList.add('overlay'))
        // }
        time = 1000
      }
      timer = setTimeout(drop, time)

    } else {
      timer = 1000
      console.log('NextShape', nextShape)
      console.log('No active shape', nextShape)
      if (nextShape === null) {
        console.log('nextShape = null')
        shape = randomizeShape()
      } else {
        console.log('there is next shape')
        shape = nextShape
        shape.currentPos = shape.startPos
        console.log(`newShape ${shape.shape} must equale next shape ${nextShape.shape}`)
        r = 0
        nextShapeRemove()
        console.log(shape.currentPos)
        console.log(shape.startPos)
        console.log('after equal start -->', shape.currentPos)

      }
      nextShape = randomizeShape()
      nextShapeDisplay()
      // for (let i = 0; i < 20; i++){
      //   if (playCells[index].classList.) {
      //     shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      //     clearInterval(timer)
      //     gameOver()
      //   }
      // }
     
      moveDown()
      timer = setTimeout(drop, time)
    }
  }

  function gameOver() {
    document.querySelector('#gameOver').style.display = 'block'
    document.querySelector('#playGrid').style.position = 'absolute'
  }
  function remove() {
    shape.currentPos.forEach(index => playCells[index].classList.remove(shape.moving))
    console.log('MOVING REMOVED')
  }


  function nextShapeDisplay() {
    console.log('NEXT SHAPE DISPLAY ACTIVATED')
    // nextShape.currentPos = nextShape.startPos
    if (nextShape.shape === 'Z' || nextShape.shape === 'S') {
      nextDisplayPos = nextShape.startPos.map(cell => cell)
    } else {
      nextDisplayPos = nextShape.startPos.map(cell => cell + 10)
    }
    console.log('Next current Position', nextShape.startPos)
    console.log('Next Display Position', nextDisplayPos)
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
    console.log('NEXTDISPLAYPOS', nextDisplayPos)
  }

  function nextShapeRemove() {
    console.log('next remove class -->', nextShape.moving)
    nextDisplayPos.forEach(index => nextCells[index].classList.remove(shape.moving))
    // nextCells.forEach(index => nextCells[index].classList.remove(shape.moving))
    console.log('NxtRemove')
  }

  function moveDown() {
    console.log('moveDown')
    shape.currentPos.forEach(index => playCells[index + 10].classList.add(shape.moving))
    shape.currentPos = shape.currentPos.map(index => index + 10)

  }

  function inactive() {
    shape.currentPos.forEach(index => playCells[index].classList.add(shape.landed))
    shape.currentPos.forEach(index => playCells[index].classList.remove(shape.moving))
  }


  // !---------------ROTATE------------------------------------------------------
  let r = 0
  function rotate() {
    soundClick.play()
    r++
    if (r > 3) {
      r = 0
    }
    console.log('r before rot', r)
    const rot = Object.values(shape.rot)[r]
    console.log('rotation offset -->', rot)
    console.log('shape.currentPos Before-->', shape.currentPos)
    for (let i = 0; i < 4; i++) {
      remove()
      shape.currentPos[i] = shape.currentPos[i] + parseFloat(rot[i])
    }
    console.log('Test Current after loop', shape.currentPos)
    // PREVENT OVERFLOW LEFT
    if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[3] % playWidth === 2) && (shape.currentPos[0] % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 1)
      shape.nextPos = shape.currentPos
      console.log('if 1')
    } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 8) && (shape.currentPos[3] % playWidth === 1)) {
      shape.currentPos.forEach(index => playCells[index + 2].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 2)
      shape.nextPos = shape.currentPos
      console.log('if 2')
    } else if ((r === 1 || r === 3) && (shape.currentPos[0] === shape.currentPos[3] - 30) && (shape.currentPos[0] < 0)) {
      shape.currentPos.forEach(index => playCells[index + 30].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 30)
      shape.nextPos = shape.currentPos
      console.log('if start')
    } else if (shape.currentPos.every(item => item % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      shape.nextPos = shape.currentPos
      console.log('if 3')
    } else if ((r === 2) && shape.currentPos.some(item => item % playWidth === 2)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 4')

      // PREVENT OVERFLOW RIGHT
    } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 6) && (shape.currentPos[3] % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      // shape.currentPos = shape.currentPos.map(index => index - 1 )
      // shape.nextPos = shape.currentPos
      console.log('if 6')
    } else if ((r === 2 || r === 0) && (shape.currentPos[0] === shape.currentPos[3] - 3) && (shape.currentPos[0] % playWidth === 7) /*&& (shape.currentPos[3] % playWidth === 0)*/) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      shape.nextPos = shape.currentPos
      console.log('if 7')
    } else if ((r === 2) && (shape.currentPos[0] % playWidth === 8) && (shape.currentPos[3] % playWidth === 0)) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      shape.nextPos = shape.currentPos
      console.log('if 5?')
    } else if ((r === 2) && shape.currentPos.some(item => item % playWidth === 0)) {
      shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 1)
      shape.nextPos = shape.currentPos
      console.log('if 5')
    } else if ((r === 0) && (shape.currentPos[0] % playWidth === 0) && (shape.currentPos[3] % playWidth === 0)) {
      shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index + 1)
      shape.nextPos = shape.currentPos
      console.log('if 5?')
    } else if ((r === 0) && shape.currentPos.some(item => item % playWidth === 7)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 9')
    } else if ((r === 0) && shape.currentPos.some(item => item % playWidth === 9)) {
      shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 1)
      shape.nextPos = shape.currentPos
      console.log('if 10')


      // PREVENT OVERFLOW BOTTOM
    } else if ((r === 1 | r === 3) && (shape.currentPos[0] === shape.currentPos[3] - 30) && shape.currentPos.some(item => item >= 200)) {
      shape.currentPos.forEach(index => playCells[index - 10].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 10)
      shape.nextPos = shape.currentPos
      console.log('if 12')
    } else if ((r === 1 | r === 3) && shape.currentPos.some(item => item >= 170) && shape.currentPos.some(item => item < 180)) {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 11')
    } else if ((r === 1 | r === 3) && shape.currentPos.some(item => item >= playCellCount - 10)) {
      shape.currentPos.forEach(index => playCells[index - 10].classList.add(shape.moving))
      shape.currentPos = shape.currentPos.map(index => index - 10)
      shape.nextPos = shape.currentPos

    } else {
      shape.currentPos.forEach(index => playCells[index].classList.add(shape.moving))
      console.log('if 13')
    }
    console.log('After IF', shape.currentPos)
  }


  const soundClick = new Audio('./audio/rotate2.wav')
  function handleMovement(event) {
    soundClick.play()
    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32
    const enter = 13
    const keyCode = event.keyCode

    if (up === keyCode) {
      console.log('Clicked up')
      // remove()
      console.log(shape.currentPos)
      console.log(shape.nextPos)
      if (shape.currentPos.some(item => item >= (playCellCount - playWidth)) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        console.log('Clicked up end')
      } else {
        rotate()
      }
    } else if (down === keyCode) {
      if (shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed'))) {
        console.log('Clicked down end')
        inactive()
        r = 0
      } else {
        remove()
        // shape.currentPos = shape.nextPos
        // moveDown()
        moveDown()
      }
    } else if (left === keyCode) {
      if (shape.currentPos.some(item => (item % playWidth === 0)) || shape.currentPos.some(index => playCells[index - 1].className.includes('landed'))) {
        console.log('Clicked left End')
      } else {

        remove()
        shape.currentPos.forEach(index => playCells[index - 1].classList.add(shape.moving))
        shape.nextPos = shape.currentPos.map(index => index - 1)
        shape.currentPos = shape.nextPos

      }
    } else if (right === keyCode) {
      const audio = document.getElementById('audio')
      if (shape.currentPos.some(item => (item % playWidth === 9)) || shape.currentPos.some(index => playCells[index + 1].className.includes('landed'))) {
        console.log('Clicked right End')
      } else {
        remove()
        console.log('Clicked right')
        shape.currentPos.forEach(index => playCells[index + 1].classList.add(shape.moving))
        shape.nextPos = shape.currentPos.map(index => index + 1)
        shape.currentPos = shape.nextPos
      }
    } else if (space === keyCode) {
      while (!(shape.currentPos.some(index => (index + playWidth) >= playCellCount) || shape.currentPos.some(index => playCells[index + playWidth].className.includes('landed')))) {
        remove()
        moveDown()
      }
      inactive()
      r = 0
      console.log('space')
    } else if (enter === keyCode) {
      document.querySelector('#startGame').style.display = 'none'
      document.querySelector('#playGrid').style.position = 'relative'
      drop()
    }
  }



  document.addEventListener('keydown', handleMovement)
}



window.addEventListener('DOMContentLoaded', init)