let displayDiv = document.getElementById('display')


const blankSpot = '⬜'
const obstacle = '⬛'
const triedOnce = '🟧'
const triedTwice = '🟪'
const targetIcon = '⏬'
const foundPath = '🟩'


const map = Array.from({ length: 100 }, (_, i) => Array.from({ length: 100 }, (_, j) =>
  Math.random() < .5 ? obstacle :
    blankSpot))
map.forEach((e, i) => {
  let innerDiv = document.createElement('div')
  e.forEach((el, j) => {
    let elem = document.createElement('p')
    elem.id = `${i}_${j}`
    elem.innerText = el
    innerDiv.append(elem)
  })
  displayDiv.append(innerDiv)
}
)





const updateElem = (j, i, change) => document.getElementById(`${j}_${i}`).innerText = change

let startY = Math.floor(Math.random() * map.length)
let startX = Math.floor(Math.random() * map[0].length)

let start = map[startY][startX]
map[startY][startX] = '🟢'
updateElem(startY, startX, '🟢')




let targetY = Math.floor(Math.random() * map.length)
let targetX = Math.floor(Math.random() * map[0].length)
let target = map[targetY][targetX]
map[targetY][targetX] = targetIcon
updateElem(targetY, targetX, targetIcon)

document.getElementById(`${startY}_${startX}`).classList.add('flash')
document.getElementById(`${targetY}_${targetX}`).classList.add('flash')


let tileSize = 1



const findPath = (start, end) => {
  let angle = Math.atan2(start.x - end.x, start.y - end.y) * -1

  let testPoint = { ...start }
  // let overflowX = 0
  // let overflowY = 0

  let path = [[start.x, start.y]]


  let showPathfinding = true



  if (showPathfinding == false) {
    for (let i = 0; i < 100000; i++) {
      angle = Math.atan2(testPoint.x - end.x, testPoint.y - end.y) * -1

      let connectedNeighbors = map.slice(Math.max(0, testPoint.y - 1), Math.min(map.length, testPoint.y + 2)).map(e => e.slice(Math.max(0, testPoint.x - 1), Math.min(map[0].length, testPoint.x + 2)))



      let availableConnections = []

      for (let i = 0; i < connectedNeighbors.length; i++) {
        let offsetY = testPoint.y > 0 ? 1 : 0
        for (let j = 0; j < connectedNeighbors[0].length; j++) {
          let offsetX = testPoint.x > 0 ? 1 : 0
          if ((i == offsetY && j == offsetX) || connectedNeighbors[i][j] == obstacle || connectedNeighbors[i][j] == triedTwice) {
            continue;
          } else {
            availableConnections.push({
              angle: Math.atan2(offsetX - j, offsetY - i) * -1,
              cords: [testPoint.x - offsetX + j, testPoint.y - offsetY + i]
            })

          }
        }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////


      if (availableConnections.length > 0) {
        let testSmall = availableConnections.sort((a, b) => Math.abs(a.angle - angle) - Math.abs(b.angle - angle))[0].cords
        testPoint.y = testSmall[1]
        testPoint.x = testSmall[0]
        path.push([testPoint.x, testPoint.y])
      } else {
        map[testPoint.y][testPoint.x] = triedTwice
        // updateElem(testPoint.y, testPoint.x, triedTwice)

        let backTrack = path.pop()
        if (backTrack == undefined) {
          return null
        }
        testPoint.y = backTrack[1]
        testPoint.x = backTrack[0]


      }



      ///////////////////////////////////////////////////////////////////////////////////////////////////////

      if (
        // false &&
        !(testPoint.x == targetX && testPoint.y == targetY)) {
        map[testPoint.y][testPoint.x] = map[testPoint.y][testPoint.x] == triedOnce ? triedTwice : triedOnce
        // updateElem(testPoint.y, testPoint.x, map[testPoint.y][testPoint.x])
      } else {
        let forTest = path.map(e => e.join('_'))
        let setOfPath = [...new Set(forTest)]
        if (setOfPath.length < path.length) {
          for (let i = setOfPath.length - 1; i >= 0; i--) {
            let firstOf = path.findIndex(e => e.join('_') == setOfPath[i])
            let lastOf = path.findLastIndex(e => e.join('_') == setOfPath[i])
            if (firstOf !== lastOf) {
              path = [...path.slice(0, firstOf), ...path.slice(lastOf)]
            }
          }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // console.log(path)
        for (let i = path.length - 1; i >= 0; i--) {
          for (let j = 0; j < path.length; j++) {
            if (path[i] && Math.abs(i - j) > 1 && Math.abs(path[i][0] - path[j][0]) <= 1 && Math.abs(path[i][1] - path[j][1]) <= 1) {
              path = [...path.slice(0, j + 1), ...path.slice(i)]
            }
          }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        path.slice(1, -1).forEach(e => updateElem(e[1], e[0], foundPath))
        updateElem(startY, startX, '🟢')

      }
    }
  } else {
    const recursiveLoop = (i = 0) => {
      angle = Math.atan2(testPoint.x - end.x, testPoint.y - end.y) * -1
      // overflowX += Math.sin(angle)
      // overflowY -= Math.cos(angle)

      let connectedNeighbors = map.slice(Math.max(0, testPoint.y - 1), Math.min(map.length, testPoint.y + 2)).map(e => e.slice(Math.max(0, testPoint.x - 1), Math.min(map[0].length, testPoint.x + 2)))

      //no diagnals
      // .map((e, i) => i == 1 ? e : [obstacle, e[1], obstacle])
      // console.table(connectedNeighbors)


      let availableConnections = []

      for (let i = 0; i < connectedNeighbors.length; i++) {
        let offsetY = testPoint.y > 0 ? 1 : 0
        for (let j = 0; j < connectedNeighbors[0].length; j++) {
          let offsetX = testPoint.x > 0 ? 1 : 0
          if ((i == offsetY && j == offsetX) || connectedNeighbors[i][j] == obstacle || connectedNeighbors[i][j] == triedTwice) {
            continue;
          } else {
            availableConnections.push({
              angle: Math.atan2(offsetX - j, offsetY - i) * -1,
              cords: [testPoint.x - offsetX + j, testPoint.y - offsetY + i]
            })

          }
        }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////


      if (availableConnections.length > 0) {
        let testSmall = availableConnections.sort((a, b) => Math.abs(a.angle - angle) - Math.abs(b.angle - angle))[0].cords
        testPoint.y = testSmall[1]
        testPoint.x = testSmall[0]
        path.push([testPoint.x, testPoint.y])
      } else {
        map[testPoint.y][testPoint.x] = triedTwice
        updateElem(testPoint.y, testPoint.x, triedTwice)

        let backTrack = path.pop()
        if (backTrack == undefined) {
          setTimeout(() => {
            location.reload()
          }, 2000);
          return null
        }
        testPoint.y = backTrack[1]
        testPoint.x = backTrack[0]


      }



      ///////////////////////////////////////////////////////////////////////////////////////////////////////

      if (
        // false &&
        !(testPoint.x == targetX && testPoint.y == targetY)) {
        map[testPoint.y][testPoint.x] = map[testPoint.y][testPoint.x] == triedOnce ? triedTwice : triedOnce
        updateElem(testPoint.y, testPoint.x, map[testPoint.y][testPoint.x])
        setTimeout(() => {
          return recursiveLoop()
        }, 1);
      } else {
        // console.log(steps, path.map(e => e.join('_')))

        let forTest = path.map(e => e.join('_'))
        let setOfPath = [...new Set(forTest)]
        if (setOfPath.length < path.length) {
          for (let i = setOfPath.length - 1; i >= 0; i--) {
            let firstOf = path.findIndex(e => e.join('_') == setOfPath[i])
            let lastOf = path.findLastIndex(e => e.join('_') == setOfPath[i])
            if (firstOf !== lastOf) {
              path = [...path.slice(0, firstOf), ...path.slice(lastOf)]
            }
          }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // console.log(path)
        let eFlag = true
        for (let i = path.length - 1; i >= 0 && eFlag; i--) {
          for (let j = 0; j < path.length; j++) {
            try {
              if (path[i] && Math.abs(i - j) > 1 && Math.abs(path[i][0] - path[j][0]) <= 1 && Math.abs(path[i][1] - path[j][1]) <= 1) {
                path = [...path.slice(0, j + 1), ...path.slice(i)]

              }
            } catch (e) {
              // eFlag = false
              console.log({
                e, i, j,
                pathI: path[i],
                pathJ: path[j],
              })
            }
          }

        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        path.slice(1, -1).forEach(e => updateElem(e[1], e[0], foundPath))
        updateElem(startY, startX, '🟢')
        setTimeout(() => {
          location.reload()
        }, 2000);
      }
    }
    recursiveLoop()
  }





}

findPath({ x: startX, y: startY }, { x: targetX, y: targetY })
// setTimeout(() => {
//   location.reload()
// }, 2000);

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
let mapPoints = [[200, 0], [260, 0], [280, 0], [300, 0], [320, 0], [340, 0], [40, 20], [60, 20], [80, 20], [100, 20], [120, 20], [140, 20], [160, 20], [180, 20], [200, 20], [260, 20], [280, 20], [300, 20], [340, 20], [40, 40], [60, 40], [80, 40], [100, 40], [120, 40], [200, 40], [220, 40], [240, 40], [260, 40], [280, 40], [300, 40], [340, 40], [0, 60], [20, 60], [40, 60], [60, 60], [80, 60], [100, 60], [120, 60], [140, 60], [160, 60], [260, 60], [280, 60], [340, 60], [40, 80], [60, 80], [80, 80], [100, 80], [120, 80], [160, 80], [180, 80], [200, 80], [220, 80], [240, 80], [340, 80], [40, 100], [60, 100], [80, 100], [100, 100], [120, 100], [220, 100], [240, 100], [340, 100], [140, 120], [160, 120], [180, 120], [200, 120], [220, 120], [140, 140], [160, 140], [180, 140], [200, 140], [220, 140], [140, 160], [160, 160], [180, 160], [200, 160], [220, 160], [140, 180], [160, 180], [180, 180], [200, 180], [220, 180], [140, 200], [160, 200], [180, 200], [200, 200], [220, 200], [240, 200], [260, 200], [280, 200], [300, 200], [140, 220], [300, 220], [140, 240], [300, 240], [140, 260], [300, 260], [20, 280], [40, 280], [60, 280], [80, 280], [100, 280], [120, 280], [140, 280], [300, 280], [20, 300], [40, 300], [60, 300], [80, 300], [100, 300], [300, 300], [320, 300], [340, 300], [360, 300], [380, 300], [20, 320], [40, 320], [60, 320], [80, 320], [100, 320], [300, 320], [320, 320], [340, 320], [360, 320], [380, 320], [20, 340], [40, 340], [60, 340], [80, 340], [100, 340], [300, 340], [320, 340], [340, 340], [360, 340], [380, 340], [20, 360], [40, 360], [60, 360], [80, 360], [100, 360], [300, 360], [320, 360], [340, 360], [360, 360], [380, 360], [300, 380], [320, 380], [340, 380], [360, 380], [380, 380]
].map(e => [e[0] / 20, e[1] / 20])

let testMapDisplay = [...Array(20)].map(e => [...Array(20)].map(el => obstacle))

mapPoints.forEach(e =>
  testMapDisplay[e[1]][e[0]] = blankSpot
)

let testFoundPath
{
  testFoundPath = [
    [
      340,
      100
    ],
    [
      340,
      80
    ],
    [
      340,
      60
    ],
    [
      340,
      40
    ],
    [
      340,
      20
    ],
    [
      340,
      0
    ],
    [
      320,
      0
    ],
    [
      300,
      0
    ],
    [
      280,
      0
    ],
    [
      260,
      0
    ],
    [
      260,
      20
    ],
    [
      280,
      20
    ],
    [
      300,
      20
    ],
    [
      300,
      40
    ],
    [
      280,
      40
    ],
    [
      280,
      60
    ],
    [
      260,
      60
    ],
    [
      260,
      40
    ],
    [
      240,
      40
    ],
    [
      220,
      40
    ],
    [
      200,
      40
    ],
    [
      200,
      20
    ],
    [
      180,
      20
    ],
    [
      160,
      20
    ],
    [
      140,
      20
    ],
    [
      120,
      20
    ],
    [
      120,
      40
    ],
    [
      120,
      60
    ],
    [
      140,
      60
    ],
    [
      160,
      60
    ],
    [
      160,
      80
    ],
    [
      180,
      80
    ],
    [
      200,
      80
    ],
    [
      220,
      80
    ],
    [
      220,
      100
    ],
    [
      220,
      120
    ],
    [
      200,
      120
    ],
    [
      180,
      120
    ],
    [
      160,
      120
    ],
    [
      140,
      120
    ],
    [
      140,
      140
    ],
    [
      140,
      160
    ],
    [
      160,
      160
    ],
    [
      180,
      160
    ]
  ]
}
testFoundPath = testFoundPath.map(e => [e[0] / 20, e[1] / 20])

testFoundPath.forEach(e =>
  testMapDisplay[e[1]][e[0]] = foundPath
)

console.log(testMapDisplay.map(el => el.join('') + '\n').join(''))