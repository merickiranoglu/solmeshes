import Axios from 'axios'
import { getNft } from './splFunctions'
import getWalletTokenAcounts, {
  getWalletBalance,
  getMintedTokens,
} from '@/store/solana'
import { getMintAddresses } from './splFunctions'

export const state = () => ({
  loading: false,
  error: false,
  isPhantomInstalled: false,
  isWalletConnected: false,
  isWalletActionRequested: false,
  allMeshesFetched: false,
  connectedWalletPublicKey: null,
  baseurl: 'https://solmeshes.com',
  walletStatus: 'Connect Wallet',
  selectedMesh: '',
  solBalance: '',
  ownedTokenCount: 0,
  candyMachineId: 'HxrX3nN3JA8iKDJUcS4psDNe6PNeiRw7qJ3WhedDjTbR',
  smCollectionAddresses: [
    'BqxWSSLnqY1UkS1kFFrzsMA3x3Z7NLLFgYbASstYxQpZ',
    '8JzzBpDzyTA5QQb6N26bsYoHmEGijixMGoGpMm9mo1BN',
    '9WT8639Moytue6T7cry27YoU3v8YSjNY97idLMZHZqyB',
    'FL3A6LspdKGqU1Z73MtX4Fyj3fY2TzT7wURxqmg6Q3qQ',
    'HMYJf8auZuy5YTvKEB5YkJwCoCBUD9ACfJeswbjLmeG1',
    'CmPTsBxc3hvKey2LfWfrRHrk3hN3zo1jB2bHseCsgu6Z',
    'EJuzYi2BJ6VMyoM4VM4K83FqAbEka2bsNjGQ4M4LaqhK',
    'D51vr47hgevUNy29XqAf89ErwoQQ2pqmELq1gvqSZpCY',
    '6q4if9SWTXQFzUyaLsGZ6GwG37YvcrM9XdeZEJ8tp4q',
    '8c51gJtWrP4Yy3noNfEeAnqb6wCzoAX77c2VAb6a5ery',
    '8uZac5vCcxVbd2g9P5ir32RmNKygjP5k1HNJZy4QEhyB',
    'AFcNNPbQ79xCHUgL7EounQcgK9WmTdLXgLA3QMkjMm92',
    '7ScuJhzDekPtdTAcgo2qCcudJWquZv6qHpifc5wuPYv8',
    'CrdrRsBtcb7CncbxcQJgVUQpg49Rqkx7Q82BXFbCYiRU',
    'A2z6ojsWAVtxBdprMUb4JsGzPyfoaNJruDkXnELKTAgv',
    'DomeJgEVS1PHjPVxEP7o8ACCeaCYocaHnFbuPUd96fs9',
    '7A7WwUFwCU8qk4tqDgE55TKAJVwr3zSb46k9ZofYruGW',
    '7PFRWLpaQ4N1fyybxaHnRAsrfUT97B4CYeTff5Pgyifz',
    '14eLKqDsoUtHvm6v4ychhqfjMnp4CDedH7FgYMxqDYXu',
    '4jM1nqYuf5mPtyLy1Fa7Z455CwGNvhJMDEvTURZxrt2L',
    'Cu5sci3k6b8Z99cSBrAtcmRnUzbBreLZNmDXwyQLgrwT',
    '2hSDrh58LCJqM3JjVBmGhP739fxnDBGjjPs7bUeognjv',
  ],
  icons: [
    { mdiString: 'mdi-twitter', link: 'https://twitter.com/solmeshes' },
    { mdiString: 'mdi-discord', link: 'https://discord.gg/GKUSwm2xF6' },
  ],
  meshes: []
})

export const mutations = {
  updateWalletPublicKey: (state, val) => {
    state.connectedWalletPublicKey = val
  },
  updateWalletStatus: (state, val) => {
    state.walletStatus = val
  },
  updatePhantomInstalledState: (state, val) => {
    state.isPhantomInstalled = val
  },
  updateIsWalletConnected: (state, val) => {
    state.isWalletConnected = val
  },
  updateisWalletActionRequested: (state, val) => {
    state.isWalletActionRequested = val
  },
  updateSolBalance: (state, val) => {
    state.solBalance = val
  },
  updateOwnedTokenCount: (state, val) => {
    state.ownedTokenCount = val
  },
  updateSelectedMesh: (state, val) => {
    state.selectedMesh = val
  },
  addMeshToList: (state, val) => {
    state.meshes.push(val)
  },
  clearMeshes: (state, val) => {
    state.meshes = []
  },
  updateAllMeshesFetched: (state, val) => {
    state.allMeshesFetched = val
  },
}

export const actions = {
  disconnectWallet: (store) => {
    if (window.solana) {
      window.solana.request({ method: 'disconnect' })
    }
    if (window.solflare) {
      window.solflare.request({ method: 'disconnect' })
    }

    store.commit('updateIsWalletConnected', false)
    store.commit('updateisWalletActionRequested', false)
    store.commit('updateWalletStatus', 'Connect Wallet')
  },
  getMeshes: async (store) => {
    store.commit('clearMeshes')
    for (let i = 0; i < store.state.smCollectionAddresses.length; i++) {
      let address = store.state.smCollectionAddresses[i]
      await new Promise((resolved) => {
        getNft(address)
        .then((mesh) => {
          store.commit('addMeshToList', mesh)
          resolved()
        })
      })
    }
  },
  startSolMeshesSvg: (store, svgParameters) => {
    prepareSvg(
      store.state,
      svgParameters.draw,
      svgParameters.width,
      svgParameters.height,
      svgParameters.scale,
      svgParameters.animateColors,
      svgParameters.startColor,
      svgParameters.outlineWidth
    )
  },
  startCollectionPreviewSvg: (store, parameters) => {
    return prepareCollectionPreview(
      parameters.shapeName,
      parameters.voidName,
      parameters.draw,
      parameters.width,
      parameters.height,
      parameters.scale,
      parameters.color
    )
  },
  getWalletInfo: (store, smCollectibleAdresses) => {
    getWalletBalance(store.state.connectedWalletPublicKey).then((res) => {
      store.commit('updateSolBalance', (res / Math.pow(10, 9)).toPrecision(3))
    })
    if (store.state.connectedWalletPublicKey != null) {
      getWalletTokenAcounts(
        store.state.connectedWalletPublicKey,
        smCollectibleAdresses
      ).then((tokensOwned) => {
        store.commit('updateOwnedTokenCount', tokensOwned.length)
      })
    }
  },
}

export const getters = {
  allDataFetched: (state) => {
    return state.allDataFetched
  },
}

async function animateToColor(draw, color1, color2, color3) {
  await new Promise((coloranimated) => {
    for (let i = 0; i < draw.node.children.length; i++) {
      var line = SVG.wrap(draw.node.children[i])
      line.animate(1000, 250, 'now').attr({ stroke: color1 })
    }
    setTimeout(() => {
      coloranimated()
    }, 1250)
  })

  animateToColor(draw, color2, color3, color1)
}

SVG.wrap = function (node) {
  /* Wrap an existing node in an SVG.js element. This is a slight hack
   * because svg.js does not (in general) provide a way to create an
   * Element of a specific type (eg SVG.Ellipse, SVG.G, ...) from an
   * existing node and still call the Element's constructor.
   *
   * So instead, we call the Element's constructor and delete the node
   * it created (actually, just leaving it to garbage collection, since it
   * hasn't been inserted into the doc yet), replacing it with the given node.
   *
   * Returns the newly created SVG.Element instance.
   */
  if (node.length) node = node[0] // Allow using with or without jQuery selections
  var element_class = capitalize(node.nodeName)
  try {
    var element = new SVG[element_class]()
  } catch (e) {
    throw "No such SVG type '" + element_class + "'"
  }
  element.node = node
  return element
}

function capitalize(string) {
  if (!string) return string
  return string[0].toUpperCase() + string.slice(1)
}

async function animateOneLetter(
  draw,
  width,
  height,
  scale,
  characterArray,
  offset,
  duration,
  startColor
) {
  await new Promise((resolved) => {
    setTimeout(() => {
      for (let i = 0; i < characterArray.length; i++) {
        var line = characterArray[i]
        var startPt = line.startPt
        var endPt = line.endPt
        var edge = draw
          .line(
            (startPt.x + offset) * scale,
            height - startPt.y * scale,
            (startPt.x + offset) * scale,
            height - startPt.y * scale
          )
          .stroke({ width: 0.5, color: startColor })

        edge.animate(duration).plot([
          [(startPt.x + offset) * scale, height - startPt.y * scale],
          [(endPt.x + offset) * scale, height - endPt.y * scale],
        ])
      }
      resolved()
    }, duration)
  })
}

async function outlineOneLetter(
  draw,
  height,
  scale,
  CharacterPts,
  offset,
  startColor,
  outlineWidth
) {
  for (let i = 0; i < CharacterPts.length; i++) {
    var pt = CharacterPts[i]
    var nextPt =
      i < CharacterPts.length - 1 ? CharacterPts[i + 1] : CharacterPts[0]
    var edge = draw
      .line(
        pt.x * scale + offset * scale,
        height - pt.y * scale,
        nextPt.x * scale + offset * scale,
        height - nextPt.y * scale
      )
      .stroke({ width: outlineWidth, color: startColor })
  }
}

async function prepareCollectionPreview(
  state,
  shapeName,
  voidName,
  draw,
  width,
  height,
  scale,
  color
) {
  return new Promise((animationCompleted, animationFailed) => {
    return Axios.post(state.baseurl + '/collectionPreview', {
      shapeName: shapeName,
      voidName: voidName,
      index: 0,
    })
      .then(async (response) => {
        var outerShape = response.data.outerShapePtArray
        var voidItems = response.data.voidsArray
        var meshes = response.data.meshes

        outerShape.reverse()

        var shapeLines = await drawOuterShape(
          draw,
          width,
          height,
          scale,
          color,
          outerShape
        )
        var voids = await drawVoids(
          draw,
          width,
          height,
          scale,
          color,
          voidItems
        )
        // setTimeout(() => {
        //   for (let i = 0; i < voids.length; i++) {
        //     voids[i].remove()
        //   }
        // }, 2000)

        var meshLines = await drawMeshes(
          draw,
          width,
          height,
          scale,
          color,
          meshes
        )
        // for (let i = 0; i < meshLines.length; i++) {
        //   meshLines[i].remove()
        // }

        animationCompleted('done')
      })
      .catch((err) => {
      })
  })
}

async function drawOuterShape(draw, width, height, scale, color, outerShape) {
  var shapeLines = []
  await new Promise((resolved) => {
    for (let i = 0; i < outerShape.length; i++) {
      var pt = outerShape[i]
      var ptX = pt[0] * scale + width / 2
      var ptY = pt[1] * scale + height / 2
      var nextPt = i < outerShape.length - 1 ? outerShape[i + 1] : outerShape[0]
      var nextPtX = nextPt[0] * scale + width / 2
      var nextPtY = nextPt[1] * scale + height / 2
      var line = draw
        .line(ptX, ptY, nextPtX, nextPtY)
        .stroke({ width: 1, color: color })
      shapeLines.push(line)
    }
    setTimeout(() => {
      resolved()
    }, 500)
  })
  return shapeLines
}

async function drawVoids(draw, width, height, scale, color, voidItems) {
  var voidLines = []
  await new Promise((resolved) => {
    for (let v = 0; v < voidItems.length; v++) {
      var voidPts = voidItems[v]
      for (let i = 0; i < voidPts.length; i++) {
        var voidPt = voidPts[i]
        var voidPtX = voidPt[0] * scale + width / 2
        var voidPtY = voidPt[1] * scale + height / 2
        var nextVoidPt = i < voidPts.length - 1 ? voidPts[i + 1] : voidPts[0]
        var nextVoidPtX = nextVoidPt[0] * scale + width / 2
        var nextVoidPtY = nextVoidPt[1] * scale + height / 2
        var line = draw
          .line(voidPtX, voidPtY, nextVoidPtX, nextVoidPtY)
          .stroke({ width: 1, color: color })
        voidLines.push(line)
      }
    }
    setTimeout(() => {
      resolved()
    }, 500)
  })
  return voidLines
}
async function drawMeshes(draw, width, height, scale, color, meshes) {
  var meshLines = []
  var dotPts = []
  await new Promise(async (resolved) => {
    for (let i = 0; i < meshes.length; i++) {
      var meshLine = meshes[i]
      var startPtX = meshLine[0] * scale + width / 2
      var startPtY = meshLine[1] * scale + height / 2
      var endPtX = meshLine[2] * scale + width / 2
      var endPtY = meshLine[3] * scale + height / 2
      var line4 = [startPtX, startPtY, endPtX, endPtY]
      meshLines.push(line4)
      dotPts.push([startPtX, startPtY])
      dotPts.push([endPtX, endPtY])
    }

    for (let i = 0; i < meshLines.length; i++) {
      setTimeout(() => {
        var meshLine = meshLines[i]
        var line = draw
          .line(meshLine[0], meshLine[1], meshLine[2], meshLine[3])
          .stroke({ width: 0.5, color: color })
      }, i / 5)
    }

    setTimeout(() => {
      for (let i = 0; i < dotPts.length; i++) {
        var dotPt = dotPts[i]
        var dot1 = draw
          .circle(0.5)
          .dmove(dotPt[0], dotPt[1])
          .fill({ color: '#00FFA3' })
        // dot1.animate(1000, 0, 'now').attr({ r: 0.25 })
      }
    }, meshLines.length / 5)

    setTimeout(() => {
      resolved()
    }, meshLines.length / 5 + 500)
  })
  return meshLines
}
async function prepareSvg(
  state,
  draw,
  width,
  height,
  scale,
  animateColors,
  startColor,
  outlineWidth
) {
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.bigSCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.bigOCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.bigOInnerCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.bigLCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.bigMCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.eCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.eInnerCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.sCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.hCharacterPts,
    0,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.eCharacterPts,
    65,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.eInnerCharacterPts,
    65,
    startColor,
    outlineWidth
  )
  await outlineOneLetter(
    draw,
    height,
    scale,
    obj2.sCharacterPts,
    65,
    startColor,
    outlineWidth
  )

  await new Promise((resolved) => {
    setTimeout(() => {
      resolved()
    }, 500)
  })

  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.bigSCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.bigOCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.bigLCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.bigMCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.eCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.sCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.hCharacterLines,
    0,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.eCharacterLines,
    65,
    200,
    startColor
  )
  await animateOneLetter(
    draw,
    width,
    height,
    scale,
    obj2.sCharacterLines,
    65,
    200,
    startColor
  )
  if (animateColors) {
    await animateToColor(draw, '#00FFA3', '#03E1FF', '#DC1FFF')
  }
}

var obj2 = {
  bigSCharacterLines: [
    {
      startPt: { x: 20.82649282, y: 30.61004252 },
      endPt: { x: 23.2746, y: 29.42585 },
    },
    { startPt: { x: 23.2746, y: 29.42585 }, endPt: { x: 23.2746, y: 31.3853 } },
    {
      startPt: { x: 23.2746, y: 31.3853 },
      endPt: { x: 20.82649282, y: 30.61004252 },
    },
    {
      startPt: { x: 35.93843333, y: 15.56026782 },
      endPt: { x: 38.7027, y: 14.597 },
    },
    { startPt: { x: 38.7027, y: 14.597 }, endPt: { x: 38.7027, y: 18.3494 } },
    {
      startPt: { x: 38.7027, y: 18.3494 },
      endPt: { x: 35.93843333, y: 15.56026782 },
    },
    {
      startPt: { x: 22.98960278, y: 26.20153045 },
      endPt: { x: 23.2746, y: 27.4664 },
    },
    {
      startPt: { x: 23.2746, y: 27.4664 },
      endPt: { x: 21.15432526, y: 27.788002 },
    },
    {
      startPt: { x: 21.15432526, y: 27.788002 },
      endPt: { x: 22.98960278, y: 26.20153045 },
    },
    {
      startPt: { x: 21.89933772, y: 17.10688689 },
      endPt: { x: 23.1985, y: 16.0809 },
    },
    { startPt: { x: 23.1985, y: 16.0809 }, endPt: { x: 23.1985, y: 17.208 } },
    {
      startPt: { x: 23.1985, y: 17.208 },
      endPt: { x: 21.89933772, y: 17.10688689 },
    },
    {
      startPt: { x: 29.48287774, y: 12.61740891 },
      endPt: { x: 28.36815, y: 10.4118 },
    },
    {
      startPt: { x: 28.36815, y: 10.4118 },
      endPt: { x: 31.447575, y: 10.4118 },
    },
    {
      startPt: { x: 31.447575, y: 10.4118 },
      endPt: { x: 29.48287774, y: 12.61740891 },
    },
    {
      startPt: { x: 29.98314034, y: 34.85803492 },
      endPt: { x: 31.29535, y: 37.0543 },
    },
    { startPt: { x: 31.29535, y: 37.0543 }, endPt: { x: 28.292, y: 37.0543 } },
    {
      startPt: { x: 28.292, y: 37.0543 },
      endPt: { x: 29.98314034, y: 34.85803492 },
    },
    {
      startPt: { x: 23.03133325, y: 32.88809325 },
      endPt: { x: 23.2746, y: 31.3853 },
    },
    { startPt: { x: 23.2746, y: 31.3853 }, endPt: { x: 23.90235, y: 32.0131 } },
    {
      startPt: { x: 23.90235, y: 32.0131 },
      endPt: { x: 23.03133325, y: 32.88809325 },
    },
    { startPt: { x: 23.1985, y: 17.208 }, endPt: { x: 23.1985, y: 18.3351 } },
    {
      startPt: { x: 23.1985, y: 18.3351 },
      endPt: { x: 21.89933772, y: 17.10688689 },
    },
    {
      startPt: { x: 31.10802365, y: 23.81916249 },
      endPt: { x: 32.08485, y: 26.2109 },
    },
    { startPt: { x: 32.08485, y: 26.2109 }, endPt: { x: 29.5666, y: 26.2109 } },
    {
      startPt: { x: 29.5666, y: 26.2109 },
      endPt: { x: 31.10802365, y: 23.81916249 },
    },
    { startPt: { x: 28.4442, y: 24.00415 }, endPt: { x: 29.5666, y: 26.2109 } },
    { startPt: { x: 29.5666, y: 26.2109 }, endPt: { x: 27.04835, y: 26.2109 } },
    {
      startPt: { x: 27.04835, y: 26.2109 },
      endPt: { x: 28.4442, y: 24.00415 },
    },
    {
      startPt: { x: 25.78037325, y: 24.18914284 },
      endPt: { x: 24.5301, y: 26.2109 },
    },
    {
      startPt: { x: 24.5301, y: 26.2109 },
      endPt: { x: 23.24991402, y: 24.16917221 },
    },
    {
      startPt: { x: 23.24991402, y: 24.16917221 },
      endPt: { x: 25.78037325, y: 24.18914284 },
    },
    { startPt: { x: 28.4442, y: 24.00415 }, endPt: { x: 27.3218, y: 21.7974 } },
    { startPt: { x: 27.3218, y: 21.7974 }, endPt: { x: 29.84005, y: 21.7974 } },
    {
      startPt: { x: 29.84005, y: 21.7974 },
      endPt: { x: 28.4442, y: 24.00415 },
    },
    {
      startPt: { x: 36.94306407, y: 31.01871717 },
      endPt: { x: 38.3983, y: 29.1025 },
    },
    { startPt: { x: 38.3983, y: 29.1025 }, endPt: { x: 38.3983, y: 31.02385 } },
    {
      startPt: { x: 38.3983, y: 31.02385 },
      endPt: { x: 36.94306407, y: 31.01871717 },
    },
    {
      startPt: { x: 27.17428994, y: 12.64172321 },
      endPt: { x: 28.38715, y: 14.8253 },
    },
    {
      startPt: { x: 28.38715, y: 14.8253 },
      endPt: { x: 26.420575, y: 14.8253 },
    },
    {
      startPt: { x: 26.420575, y: 14.8253 },
      endPt: { x: 27.17428994, y: 12.64172321 },
    },
    {
      startPt: { x: 20.82649282, y: 30.61004252 },
      endPt: { x: 18.1763, y: 32.9452 },
    },
    { startPt: { x: 18.1763, y: 32.9452 }, endPt: { x: 18.1763, y: 29.42585 } },
    {
      startPt: { x: 18.1763, y: 29.42585 },
      endPt: { x: 20.82649282, y: 30.61004252 },
    },
    {
      startPt: { x: 22.98960278, y: 26.20153045 },
      endPt: { x: 23.90235, y: 26.83865 },
    },
    {
      startPt: { x: 23.90235, y: 26.83865 },
      endPt: { x: 23.2746, y: 27.4664 },
    },
    {
      startPt: { x: 33.76635939, y: 14.67792502 },
      endPt: { x: 32.9671, y: 15.4721 },
    },
    { startPt: { x: 32.9671, y: 15.4721 }, endPt: { x: 32.3203, y: 14.8253 } },
    {
      startPt: { x: 32.3203, y: 14.8253 },
      endPt: { x: 33.76635939, y: 14.67792502 },
    },
    {
      startPt: { x: 21.47658987, y: 32.89392901 },
      endPt: { x: 23.2746, y: 31.3853 },
    },
    {
      startPt: { x: 23.03133325, y: 32.88809325 },
      endPt: { x: 21.47658987, y: 32.89392901 },
    },
    {
      startPt: { x: 23.22041526, y: 12.77929601 },
      endPt: { x: 20.15475, y: 12.46635 },
    },
    {
      startPt: { x: 20.15475, y: 12.46635 },
      endPt: { x: 22.2093, y: 10.4118 },
    },
    {
      startPt: { x: 22.2093, y: 10.4118 },
      endPt: { x: 23.22041526, y: 12.77929601 },
    },
    {
      startPt: { x: 23.07530799, y: 14.75944598 },
      endPt: { x: 23.82625, y: 15.4531 },
    },
    { startPt: { x: 23.82625, y: 15.4531 }, endPt: { x: 23.1985, y: 16.0809 } },
    {
      startPt: { x: 23.1985, y: 16.0809 },
      endPt: { x: 23.07530799, y: 14.75944598 },
    },
    {
      startPt: { x: 22.2093, y: 10.4118 },
      endPt: { x: 25.288725, y: 10.4118 },
    },
    {
      startPt: { x: 25.288725, y: 10.4118 },
      endPt: { x: 23.22041526, y: 12.77929601 },
    },
    {
      startPt: { x: 27.17428994, y: 12.64172321 },
      endPt: { x: 25.288725, y: 10.4118 },
    },
    {
      startPt: { x: 25.288725, y: 10.4118 },
      endPt: { x: 28.36815, y: 10.4118 },
    },
    {
      startPt: { x: 28.36815, y: 10.4118 },
      endPt: { x: 27.17428994, y: 12.64172321 },
    },
    {
      startPt: { x: 21.58660505, y: 15.74875542 },
      endPt: { x: 19.88767803, y: 15.05865465 },
    },
    {
      startPt: { x: 19.88767803, y: 15.05865465 },
      endPt: { x: 21.50135035, y: 14.34265258 },
    },
    {
      startPt: { x: 21.50135035, y: 14.34265258 },
      endPt: { x: 21.58660505, y: 15.74875542 },
    },
    {
      startPt: { x: 31.10802365, y: 23.81916249 },
      endPt: { x: 29.84005, y: 21.7974 },
    },
    { startPt: { x: 29.84005, y: 21.7974 }, endPt: { x: 32.3583, y: 21.7974 } },
    {
      startPt: { x: 32.3583, y: 21.7974 },
      endPt: { x: 31.10802365, y: 23.81916249 },
    },
    {
      startPt: { x: 35.85980843, y: 18.05104915 },
      endPt: { x: 35.79812713, y: 20.36209438 },
    },
    {
      startPt: { x: 35.79812713, y: 20.36209438 },
      endPt: { x: 33.6139, y: 18.3304 },
    },
    {
      startPt: { x: 33.6139, y: 18.3304 },
      endPt: { x: 35.85980843, y: 18.05104915 },
    },
    {
      startPt: { x: 34.35847194, y: 30.34037493 },
      endPt: { x: 33.3095, y: 29.1025 },
    },
    { startPt: { x: 33.3095, y: 29.1025 }, endPt: { x: 35.8539, y: 29.1025 } },
    {
      startPt: { x: 35.8539, y: 29.1025 },
      endPt: { x: 34.35847194, y: 30.34037493 },
    },
    {
      startPt: { x: 19.86314394, y: 16.81618111 },
      endPt: { x: 18.1002, y: 18.3351 },
    },
    { startPt: { x: 18.1002, y: 18.3351 }, endPt: { x: 18.1002, y: 16.428 } },
    {
      startPt: { x: 18.1002, y: 16.428 },
      endPt: { x: 19.86314394, y: 16.81618111 },
    },
    {
      startPt: { x: 33.60989431, y: 32.87089157 },
      endPt: { x: 32.6817, y: 32.0131 },
    },
    { startPt: { x: 32.6817, y: 32.0131 }, endPt: { x: 33.3095, y: 31.3853 } },
    {
      startPt: { x: 33.3095, y: 31.3853 },
      endPt: { x: 33.60989431, y: 32.87089157 },
    },
    {
      startPt: { x: 36.94306407, y: 31.01871717 },
      endPt: { x: 35.8539, y: 29.1025 },
    },
    { startPt: { x: 35.8539, y: 29.1025 }, endPt: { x: 38.3983, y: 29.1025 } },
    {
      startPt: { x: 35.43186179, y: 30.99287242 },
      endPt: { x: 35.8539, y: 29.1025 },
    },
    {
      startPt: { x: 36.94306407, y: 31.01871717 },
      endPt: { x: 35.43186179, y: 30.99287242 },
    },
    {
      startPt: { x: 29.98314034, y: 34.85803492 },
      endPt: { x: 28.292, y: 32.6409 },
    },
    { startPt: { x: 28.292, y: 32.6409 }, endPt: { x: 32.0539, y: 32.6409 } },
    {
      startPt: { x: 32.0539, y: 32.6409 },
      endPt: { x: 29.98314034, y: 34.85803492 },
    },
    {
      startPt: { x: 19.88767803, y: 15.05865465 },
      endPt: { x: 18.1002, y: 14.5209 },
    },
    {
      startPt: { x: 18.1002, y: 14.5209 },
      endPt: { x: 20.15475, y: 12.46635 },
    },
    {
      startPt: { x: 20.15475, y: 12.46635 },
      endPt: { x: 19.88767803, y: 15.05865465 },
    },
    {
      startPt: { x: 34.35847194, y: 30.34037493 },
      endPt: { x: 33.3095, y: 30.2439 },
    },
    { startPt: { x: 33.3095, y: 30.2439 }, endPt: { x: 33.3095, y: 29.1025 } },
    {
      startPt: { x: 33.49426882, y: 34.64111184 },
      endPt: { x: 34.2987, y: 37.0543 },
    },
    { startPt: { x: 34.2987, y: 37.0543 }, endPt: { x: 31.29535, y: 37.0543 } },
    {
      startPt: { x: 31.29535, y: 37.0543 },
      endPt: { x: 33.49426882, y: 34.64111184 },
    },
    {
      startPt: { x: 23.24991402, y: 24.16917221 },
      endPt: { x: 22.2853, y: 21.7974 },
    },
    { startPt: { x: 22.2853, y: 21.7974 }, endPt: { x: 24.80355, y: 21.7974 } },
    {
      startPt: { x: 24.80355, y: 21.7974 },
      endPt: { x: 23.24991402, y: 24.16917221 },
    },
    { startPt: { x: 38.3983, y: 31.02385 }, endPt: { x: 38.3983, y: 32.9452 } },
    {
      startPt: { x: 38.3983, y: 32.9452 },
      endPt: { x: 36.94306407, y: 31.01871717 },
    },
    {
      startPt: { x: 35.79812713, y: 20.36209438 },
      endPt: { x: 33.85599723, y: 21.95542832 },
    },
    {
      startPt: { x: 33.85599723, y: 21.95542832 },
      endPt: { x: 33.6139, y: 20.5419 },
    },
    {
      startPt: { x: 33.6139, y: 20.5419 },
      endPt: { x: 35.79812713, y: 20.36209438 },
    },
    {
      startPt: { x: 31.34562174, y: 13.20862375 },
      endPt: { x: 33.04088224, y: 12.70603002 },
    },
    {
      startPt: { x: 33.04088224, y: 12.70603002 },
      endPt: { x: 32.3203, y: 14.8253 },
    },
    {
      startPt: { x: 32.3203, y: 14.8253 },
      endPt: { x: 31.34562174, y: 13.20862375 },
    },
    {
      startPt: { x: 32.3203, y: 14.8253 },
      endPt: { x: 30.353725, y: 14.8253 },
    },
    {
      startPt: { x: 30.353725, y: 14.8253 },
      endPt: { x: 31.34562174, y: 13.20862375 },
    },
    {
      startPt: { x: 21.15432526, y: 27.788002 },
      endPt: { x: 18.1763, y: 29.42585 },
    },
    { startPt: { x: 18.1763, y: 29.42585 }, endPt: { x: 18.1763, y: 25.9065 } },
    {
      startPt: { x: 18.1763, y: 25.9065 },
      endPt: { x: 21.15432526, y: 27.788002 },
    },
    { startPt: { x: 33.6139, y: 20.5419 }, endPt: { x: 33.6139, y: 18.3304 } },
    {
      startPt: { x: 35.79812713, y: 20.36209438 },
      endPt: { x: 38.7027, y: 18.3494 },
    },
    { startPt: { x: 38.7027, y: 18.3494 }, endPt: { x: 38.7027, y: 22.1018 } },
    {
      startPt: { x: 38.7027, y: 22.1018 },
      endPt: { x: 35.79812713, y: 20.36209438 },
    },
    {
      startPt: { x: 23.24991402, y: 24.16917221 },
      endPt: { x: 20.2308, y: 23.85195 },
    },
    { startPt: { x: 20.2308, y: 23.85195 }, endPt: { x: 22.2853, y: 21.7974 } },
    {
      startPt: { x: 19.88767803, y: 15.05865465 },
      endPt: { x: 18.1002, y: 16.428 },
    },
    { startPt: { x: 18.1002, y: 16.428 }, endPt: { x: 18.1002, y: 14.5209 } },
    {
      startPt: { x: 19.88767803, y: 15.05865465 },
      endPt: { x: 19.86314394, y: 16.81618111 },
    },
    {
      startPt: { x: 23.22617864, y: 34.69068627 },
      endPt: { x: 22.2853, y: 37.0543 },
    },
    { startPt: { x: 22.2853, y: 37.0543 }, endPt: { x: 20.2308, y: 34.99975 } },
    {
      startPt: { x: 20.2308, y: 34.99975 },
      endPt: { x: 23.22617864, y: 34.69068627 },
    },
    { startPt: { x: 23.90235, y: 32.0131 }, endPt: { x: 24.5301, y: 32.6409 } },
    {
      startPt: { x: 24.5301, y: 32.6409 },
      endPt: { x: 23.03133325, y: 32.88809325 },
    },
    {
      startPt: { x: 33.49426882, y: 34.64111184 },
      endPt: { x: 32.0539, y: 32.6409 },
    },
    {
      startPt: { x: 32.0539, y: 32.6409 },
      endPt: { x: 33.60989431, y: 32.87089157 },
    },
    {
      startPt: { x: 33.60989431, y: 32.87089157 },
      endPt: { x: 33.49426882, y: 34.64111184 },
    },
    { startPt: { x: 32.0539, y: 32.6409 }, endPt: { x: 32.6817, y: 32.0131 } },
    {
      startPt: { x: 33.85599723, y: 21.95542832 },
      endPt: { x: 32.9861, y: 21.16965 },
    },
    { startPt: { x: 32.9861, y: 21.16965 }, endPt: { x: 33.6139, y: 20.5419 } },
    {
      startPt: { x: 33.69597469, y: 23.84583446 },
      endPt: { x: 34.6031, y: 26.2109 },
    },
    { startPt: { x: 34.6031, y: 26.2109 }, endPt: { x: 32.08485, y: 26.2109 } },
    {
      startPt: { x: 32.08485, y: 26.2109 },
      endPt: { x: 33.69597469, y: 23.84583446 },
    },
    {
      startPt: { x: 29.98314034, y: 34.85803492 },
      endPt: { x: 33.49426882, y: 34.64111184 },
    },
    {
      startPt: { x: 26.57473256, y: 34.876339 },
      endPt: { x: 24.5301, y: 32.6409 },
    },
    { startPt: { x: 24.5301, y: 32.6409 }, endPt: { x: 28.292, y: 32.6409 } },
    {
      startPt: { x: 28.292, y: 32.6409 },
      endPt: { x: 26.57473256, y: 34.876339 },
    },
    {
      startPt: { x: 19.86314394, y: 16.81618111 },
      endPt: { x: 20.64935, y: 18.3351 },
    },
    { startPt: { x: 20.64935, y: 18.3351 }, endPt: { x: 18.1002, y: 18.3351 } },
    {
      startPt: { x: 28.4442, y: 24.00415 },
      endPt: { x: 31.10802365, y: 23.81916249 },
    },
    {
      startPt: { x: 25.78037325, y: 24.18914284 },
      endPt: { x: 27.04835, y: 26.2109 },
    },
    { startPt: { x: 27.04835, y: 26.2109 }, endPt: { x: 24.5301, y: 26.2109 } },
    {
      startPt: { x: 34.66295837, y: 17.01698783 },
      endPt: { x: 35.93843333, y: 15.56026782 },
    },
    {
      startPt: { x: 35.93843333, y: 15.56026782 },
      endPt: { x: 35.85980843, y: 18.05104915 },
    },
    {
      startPt: { x: 35.85980843, y: 18.05104915 },
      endPt: { x: 34.66295837, y: 17.01698783 },
    },
    {
      startPt: { x: 35.93843333, y: 15.56026782 },
      endPt: { x: 36.61485, y: 12.5044 },
    },
    { startPt: { x: 36.61485, y: 12.5044 }, endPt: { x: 38.7027, y: 14.597 } },
    {
      startPt: { x: 36.61485, y: 12.5044 },
      endPt: { x: 34.75021925, y: 13.18878238 },
    },
    {
      startPt: { x: 34.75021925, y: 13.18878238 },
      endPt: { x: 34.527, y: 10.4118 },
    },
    { startPt: { x: 34.527, y: 10.4118 }, endPt: { x: 36.61485, y: 12.5044 } },
    {
      startPt: { x: 33.04088224, y: 12.70603002 },
      endPt: { x: 31.447575, y: 10.4118 },
    },
    { startPt: { x: 31.447575, y: 10.4118 }, endPt: { x: 34.527, y: 10.4118 } },
    {
      startPt: { x: 34.527, y: 10.4118 },
      endPt: { x: 33.04088224, y: 12.70603002 },
    },
    {
      startPt: { x: 33.69597469, y: 23.84583446 },
      endPt: { x: 36.6529, y: 24.15635 },
    },
    { startPt: { x: 36.6529, y: 24.15635 }, endPt: { x: 34.6031, y: 26.2109 } },
    {
      startPt: { x: 26.57473256, y: 34.876339 },
      endPt: { x: 28.292, y: 37.0543 },
    },
    { startPt: { x: 28.292, y: 37.0543 }, endPt: { x: 25.28865, y: 37.0543 } },
    {
      startPt: { x: 25.28865, y: 37.0543 },
      endPt: { x: 26.57473256, y: 34.876339 },
    },
    {
      startPt: { x: 23.22617864, y: 34.69068627 },
      endPt: { x: 25.28865, y: 37.0543 },
    },
    { startPt: { x: 25.28865, y: 37.0543 }, endPt: { x: 22.2853, y: 37.0543 } },
    {
      startPt: { x: 34.66295837, y: 17.01698783 },
      endPt: { x: 33.6139, y: 16.1189 },
    },
    {
      startPt: { x: 33.6139, y: 16.1189 },
      endPt: { x: 35.93843333, y: 15.56026782 },
    },
    {
      startPt: { x: 35.46467911, y: 22.48778145 },
      endPt: { x: 36.6529, y: 24.15635 },
    },
    {
      startPt: { x: 33.69597469, y: 23.84583446 },
      endPt: { x: 35.46467911, y: 22.48778145 },
    },
    {
      startPt: { x: 21.15432526, y: 27.788002 },
      endPt: { x: 20.82649282, y: 30.61004252 },
    },
    {
      startPt: { x: 21.41458163, y: 25.65730402 },
      endPt: { x: 23.24991402, y: 24.16917221 },
    },
    {
      startPt: { x: 23.24991402, y: 24.16917221 },
      endPt: { x: 22.98960278, y: 26.20153045 },
    },
    {
      startPt: { x: 22.98960278, y: 26.20153045 },
      endPt: { x: 21.41458163, y: 25.65730402 },
    },
    {
      startPt: { x: 20.15475, y: 12.46635 },
      endPt: { x: 21.50135035, y: 14.34265258 },
    },
    {
      startPt: { x: 23.22041526, y: 12.77929601 },
      endPt: { x: 21.50135035, y: 14.34265258 },
    },
    {
      startPt: { x: 25.21847478, y: 13.06291131 },
      endPt: { x: 23.22041526, y: 12.77929601 },
    },
    {
      startPt: { x: 25.288725, y: 10.4118 },
      endPt: { x: 25.21847478, y: 13.06291131 },
    },
    {
      startPt: { x: 29.48287774, y: 12.61740891 },
      endPt: { x: 30.353725, y: 14.8253 },
    },
    {
      startPt: { x: 30.353725, y: 14.8253 },
      endPt: { x: 28.38715, y: 14.8253 },
    },
    {
      startPt: { x: 28.38715, y: 14.8253 },
      endPt: { x: 29.48287774, y: 12.61740891 },
    },
    {
      startPt: { x: 21.41458163, y: 25.65730402 },
      endPt: { x: 20.2308, y: 23.85195 },
    },
    {
      startPt: { x: 21.89933772, y: 17.10688689 },
      endPt: { x: 20.64935, y: 18.3351 },
    },
    {
      startPt: { x: 19.86314394, y: 16.81618111 },
      endPt: { x: 21.89933772, y: 17.10688689 },
    },
    { startPt: { x: 23.1985, y: 18.3351 }, endPt: { x: 20.64935, y: 18.3351 } },
    {
      startPt: { x: 35.67847991, y: 32.83430452 },
      endPt: { x: 38.3983, y: 32.9452 },
    },
    { startPt: { x: 38.3983, y: 32.9452 }, endPt: { x: 36.3485, y: 34.99975 } },
    {
      startPt: { x: 36.3485, y: 34.99975 },
      endPt: { x: 35.67847991, y: 32.83430452 },
    },
    {
      startPt: { x: 27.17428994, y: 12.64172321 },
      endPt: { x: 25.21847478, y: 13.06291131 },
    },
    {
      startPt: { x: 25.21847478, y: 13.06291131 },
      endPt: { x: 24.454, y: 14.8253 },
    },
    {
      startPt: { x: 24.454, y: 14.8253 },
      endPt: { x: 23.22041526, y: 12.77929601 },
    },
    {
      startPt: { x: 32.3583, y: 21.7974 },
      endPt: { x: 33.69597469, y: 23.84583446 },
    },
    {
      startPt: { x: 33.69597469, y: 23.84583446 },
      endPt: { x: 31.10802365, y: 23.81916249 },
    },
    {
      startPt: { x: 27.17428994, y: 12.64172321 },
      endPt: { x: 29.48287774, y: 12.61740891 },
    },
    {
      startPt: { x: 29.48287774, y: 12.61740891 },
      endPt: { x: 31.34562174, y: 13.20862375 },
    },
    {
      startPt: { x: 33.76635939, y: 14.67792502 },
      endPt: { x: 35.93843333, y: 15.56026782 },
    },
    {
      startPt: { x: 33.6139, y: 16.1189 },
      endPt: { x: 33.76635939, y: 14.67792502 },
    },
    {
      startPt: { x: 33.04088224, y: 12.70603002 },
      endPt: { x: 33.76635939, y: 14.67792502 },
    },
    { startPt: { x: 33.6139, y: 16.1189 }, endPt: { x: 32.9671, y: 15.4721 } },
    {
      startPt: { x: 23.22041526, y: 12.77929601 },
      endPt: { x: 23.07530799, y: 14.75944598 },
    },
    {
      startPt: { x: 23.07530799, y: 14.75944598 },
      endPt: { x: 21.50135035, y: 14.34265258 },
    },
    {
      startPt: { x: 21.58660505, y: 15.74875542 },
      endPt: { x: 19.86314394, y: 16.81618111 },
    },
    {
      startPt: { x: 35.93843333, y: 15.56026782 },
      endPt: { x: 34.75021925, y: 13.18878238 },
    },
    {
      startPt: { x: 33.76635939, y: 14.67792502 },
      endPt: { x: 34.75021925, y: 13.18878238 },
    },
    {
      startPt: { x: 24.80355, y: 21.7974 },
      endPt: { x: 25.78037325, y: 24.18914284 },
    },
    {
      startPt: { x: 25.78037325, y: 24.18914284 },
      endPt: { x: 28.4442, y: 24.00415 },
    },
    { startPt: { x: 24.80355, y: 21.7974 }, endPt: { x: 27.3218, y: 21.7974 } },
    {
      startPt: { x: 27.3218, y: 21.7974 },
      endPt: { x: 25.78037325, y: 24.18914284 },
    },
    {
      startPt: { x: 23.07530799, y: 14.75944598 },
      endPt: { x: 24.454, y: 14.8253 },
    },
    { startPt: { x: 24.454, y: 14.8253 }, endPt: { x: 23.82625, y: 15.4531 } },
    {
      startPt: { x: 21.47658987, y: 32.89392901 },
      endPt: { x: 20.82649282, y: 30.61004252 },
    },
    {
      startPt: { x: 23.22617864, y: 34.69068627 },
      endPt: { x: 26.57473256, y: 34.876339 },
    },
    {
      startPt: { x: 34.35847194, y: 30.34037493 },
      endPt: { x: 33.3095, y: 31.3853 },
    },
    { startPt: { x: 33.3095, y: 31.3853 }, endPt: { x: 33.3095, y: 30.2439 } },
    {
      startPt: { x: 35.43186179, y: 30.99287242 },
      endPt: { x: 34.43010123, y: 31.69069819 },
    },
    {
      startPt: { x: 34.43010123, y: 31.69069819 },
      endPt: { x: 34.35847194, y: 30.34037493 },
    },
    {
      startPt: { x: 34.35847194, y: 30.34037493 },
      endPt: { x: 35.43186179, y: 30.99287242 },
    },
    {
      startPt: { x: 35.67847991, y: 32.83430452 },
      endPt: { x: 36.94306407, y: 31.01871717 },
    },
    {
      startPt: { x: 33.85599723, y: 21.95542832 },
      endPt: { x: 32.3583, y: 21.7974 },
    },
    { startPt: { x: 32.3583, y: 21.7974 }, endPt: { x: 32.9861, y: 21.16965 } },
    {
      startPt: { x: 33.85599723, y: 21.95542832 },
      endPt: { x: 33.69597469, y: 23.84583446 },
    },
    {
      startPt: { x: 22.98960278, y: 26.20153045 },
      endPt: { x: 24.5301, y: 26.2109 },
    },
    {
      startPt: { x: 24.5301, y: 26.2109 },
      endPt: { x: 23.90235, y: 26.83865 },
    },
    {
      startPt: { x: 33.85599723, y: 21.95542832 },
      endPt: { x: 35.46467911, y: 22.48778145 },
    },
    {
      startPt: { x: 35.79812713, y: 20.36209438 },
      endPt: { x: 35.46467911, y: 22.48778145 },
    },
    { startPt: { x: 23.2746, y: 27.4664 }, endPt: { x: 23.2746, y: 29.42585 } },
    {
      startPt: { x: 23.2746, y: 29.42585 },
      endPt: { x: 21.15432526, y: 27.788002 },
    },
    {
      startPt: { x: 33.49426882, y: 34.64111184 },
      endPt: { x: 36.3485, y: 34.99975 },
    },
    { startPt: { x: 36.3485, y: 34.99975 }, endPt: { x: 34.2987, y: 37.0543 } },
    {
      startPt: { x: 35.67847991, y: 32.83430452 },
      endPt: { x: 33.60989431, y: 32.87089157 },
    },
    {
      startPt: { x: 33.60989431, y: 32.87089157 },
      endPt: { x: 34.43010123, y: 31.69069819 },
    },
    {
      startPt: { x: 34.43010123, y: 31.69069819 },
      endPt: { x: 35.67847991, y: 32.83430452 },
    },
    {
      startPt: { x: 23.22617864, y: 34.69068627 },
      endPt: { x: 23.03133325, y: 32.88809325 },
    },
    {
      startPt: { x: 24.5301, y: 32.6409 },
      endPt: { x: 23.22617864, y: 34.69068627 },
    },
    {
      startPt: { x: 26.57473256, y: 34.876339 },
      endPt: { x: 29.98314034, y: 34.85803492 },
    },
    {
      startPt: { x: 38.7027, y: 18.3494 },
      endPt: { x: 35.85980843, y: 18.05104915 },
    },
    {
      startPt: { x: 35.46467911, y: 22.48778145 },
      endPt: { x: 38.7027, y: 22.1018 },
    },
    {
      startPt: { x: 38.7027, y: 22.1018 },
      endPt: { x: 36.6529, y: 24.15635 },
    },
    {
      startPt: { x: 21.58660505, y: 15.74875542 },
      endPt: { x: 21.89933772, y: 17.10688689 },
    },
    {
      startPt: { x: 21.58660505, y: 15.74875542 },
      endPt: { x: 23.1985, y: 16.0809 },
    },
    {
      startPt: { x: 21.58660505, y: 15.74875542 },
      endPt: { x: 23.07530799, y: 14.75944598 },
    },
    {
      startPt: { x: 31.447575, y: 10.4118 },
      endPt: { x: 31.34562174, y: 13.20862375 },
    },
    {
      startPt: { x: 33.3095, y: 31.3853 },
      endPt: { x: 34.43010123, y: 31.69069819 },
    },
    {
      startPt: { x: 33.49426882, y: 34.64111184 },
      endPt: { x: 35.67847991, y: 32.83430452 },
    },
    {
      startPt: { x: 21.41458163, y: 25.65730402 },
      endPt: { x: 18.1763, y: 25.9065 },
    },
    { startPt: { x: 18.1763, y: 25.9065 }, endPt: { x: 20.2308, y: 23.85195 } },
    {
      startPt: { x: 21.41458163, y: 25.65730402 },
      endPt: { x: 21.15432526, y: 27.788002 },
    },
    {
      startPt: { x: 34.75021925, y: 13.18878238 },
      endPt: { x: 33.04088224, y: 12.70603002 },
    },
    {
      startPt: { x: 21.47658987, y: 32.89392901 },
      endPt: { x: 20.2308, y: 34.99975 },
    },
    { startPt: { x: 20.2308, y: 34.99975 }, endPt: { x: 18.1763, y: 32.9452 } },
    {
      startPt: { x: 18.1763, y: 32.9452 },
      endPt: { x: 21.47658987, y: 32.89392901 },
    },
    {
      startPt: { x: 35.67847991, y: 32.83430452 },
      endPt: { x: 35.43186179, y: 30.99287242 },
    },
    {
      startPt: { x: 21.47658987, y: 32.89392901 },
      endPt: { x: 23.22617864, y: 34.69068627 },
    },
    {
      startPt: { x: 25.21847478, y: 13.06291131 },
      endPt: { x: 26.420575, y: 14.8253 },
    },
    { startPt: { x: 26.420575, y: 14.8253 }, endPt: { x: 24.454, y: 14.8253 } },
    {
      startPt: { x: 34.66295837, y: 17.01698783 },
      endPt: { x: 33.6139, y: 18.3304 },
    },
    { startPt: { x: 33.6139, y: 18.3304 }, endPt: { x: 33.6139, y: 16.1189 } },
  ],
  bigOCharacterLines: [
    {
      startPt: { x: 48.68833565, y: 27.18082566 },
      endPt: { x: 46.61858621, y: 26.78804441 },
    },
    {
      startPt: { x: 46.61858621, y: 26.78804441 },
      endPt: { x: 48.671, y: 25.1836 },
    },
    {
      startPt: { x: 48.671, y: 25.1836 },
      endPt: { x: 48.68833565, y: 27.18082566 },
    },
    {
      startPt: { x: 53.21503762, y: 27.31011269 },
      endPt: { x: 54.389925, y: 29.3688 },
    },
    {
      startPt: { x: 54.389925, y: 29.3688 },
      endPt: { x: 51.67195, y: 29.3688 },
    },
    {
      startPt: { x: 51.67195, y: 29.3688 },
      endPt: { x: 53.21503762, y: 27.31011269 },
    },
    {
      startPt: { x: 50.99432769, y: 27.28598684 },
      endPt: { x: 52.67226667, y: 25.1836 },
    },
    {
      startPt: { x: 52.67226667, y: 25.1836 },
      endPt: { x: 53.21503762, y: 27.31011269 },
    },
    {
      startPt: { x: 53.21503762, y: 27.31011269 },
      endPt: { x: 50.99432769, y: 27.28598684 },
    },
    {
      startPt: { x: 44.76601176, y: 20.55756223 },
      endPt: { x: 42.3171, y: 22.6511 },
    },
    { startPt: { x: 42.3171, y: 22.6511 }, endPt: { x: 42.3171, y: 19.8903 } },
    {
      startPt: { x: 42.3171, y: 19.8903 },
      endPt: { x: 44.76601176, y: 20.55756223 },
    },
    {
      startPt: { x: 55.12546011, y: 27.57714657 },
      endPt: { x: 54.6729, y: 25.1836 },
    },
    {
      startPt: { x: 54.6729, y: 25.1836 },
      endPt: { x: 56.69767231, y: 26.50949927 },
    },
    {
      startPt: { x: 56.69767231, y: 26.50949927 },
      endPt: { x: 55.12546011, y: 27.57714657 },
    },
    {
      startPt: { x: 58.75699459, y: 15.21843275 },
      endPt: { x: 59.0626, y: 12.39025 },
    },
    { startPt: { x: 59.0626, y: 12.39025 }, endPt: { x: 61.0173, y: 14.3687 } },
    {
      startPt: { x: 61.0173, y: 14.3687 },
      endPt: { x: 58.75699459, y: 15.21843275 },
    },
    {
      startPt: { x: 58.55348472, y: 23.14647643 },
      endPt: { x: 61.0173, y: 22.6511 },
    },
    { startPt: { x: 61.0173, y: 22.6511 }, endPt: { x: 61.0173, y: 25.4119 } },
    {
      startPt: { x: 61.0173, y: 25.4119 },
      endPt: { x: 58.55348472, y: 23.14647643 },
    },
    { startPt: { x: 61.0173, y: 14.3687 }, endPt: { x: 61.0173, y: 17.1295 } },
    {
      startPt: { x: 61.0173, y: 17.1295 },
      endPt: { x: 58.75699459, y: 15.21843275 },
    },
    {
      startPt: { x: 58.63205159, y: 20.54044254 },
      endPt: { x: 58.55348472, y: 23.14647643 },
    },
    {
      startPt: { x: 58.55348472, y: 23.14647643 },
      endPt: { x: 56.0046, y: 21.2109 },
    },
    {
      startPt: { x: 56.0046, y: 21.2109 },
      endPt: { x: 58.63205159, y: 20.54044254 },
    },
    {
      startPt: { x: 46.61858621, y: 26.78804441 },
      endPt: { x: 46.236, y: 29.3688 },
    },
    { startPt: { x: 46.236, y: 29.3688 }, endPt: { x: 44.27655, y: 27.39035 } },
    {
      startPt: { x: 44.27655, y: 27.39035 },
      endPt: { x: 46.61858621, y: 26.78804441 },
    },
    {
      startPt: { x: 48.68833565, y: 27.18082566 },
      endPt: { x: 46.236, y: 29.3688 },
    },
    {
      startPt: { x: 51.67195, y: 29.3688 },
      endPt: { x: 50.99432769, y: 27.28598684 },
    },
    {
      startPt: { x: 58.63205159, y: 20.54044254 },
      endPt: { x: 61.0173, y: 19.8903 },
    },
    { startPt: { x: 61.0173, y: 19.8903 }, endPt: { x: 61.0173, y: 22.6511 } },
    {
      startPt: { x: 61.0173, y: 22.6511 },
      endPt: { x: 58.63205159, y: 20.54044254 },
    },
    {
      startPt: { x: 44.81059031, y: 23.23117418 },
      endPt: { x: 42.3171, y: 22.6511 },
    },
    {
      startPt: { x: 44.76601176, y: 20.55756223 },
      endPt: { x: 44.81059031, y: 23.23117418 },
    },
    {
      startPt: { x: 44.58159222, y: 15.21841033 },
      endPt: { x: 42.3171, y: 14.3687 },
    },
    {
      startPt: { x: 42.3171, y: 14.3687 },
      endPt: { x: 44.27655, y: 12.39025 },
    },
    {
      startPt: { x: 44.27655, y: 12.39025 },
      endPt: { x: 44.58159222, y: 15.21841033 },
    },
    {
      startPt: { x: 50.91710598, y: 12.5780764 },
      endPt: { x: 51.67195, y: 10.4118 },
    },
    {
      startPt: { x: 51.67195, y: 10.4118 },
      endPt: { x: 52.80960803, y: 12.1719283 },
    },
    {
      startPt: { x: 52.80960803, y: 12.1719283 },
      endPt: { x: 50.91710598, y: 12.5780764 },
    },
    {
      startPt: { x: 58.57372984, y: 17.85580678 },
      endPt: { x: 58.75699459, y: 15.21843275 },
    },
    {
      startPt: { x: 61.0173, y: 17.1295 },
      endPt: { x: 58.57372984, y: 17.85580678 },
    },
    {
      startPt: { x: 56.8651901, y: 13.59956683 },
      endPt: { x: 56.0046, y: 15.9287 },
    },
    { startPt: { x: 56.0046, y: 15.9287 }, endPt: { x: 54.6729, y: 14.597 } },
    {
      startPt: { x: 54.6729, y: 14.597 },
      endPt: { x: 56.8651901, y: 13.59956683 },
    },
    {
      startPt: { x: 50.91710598, y: 12.5780764 },
      endPt: { x: 48.953975, y: 10.4118 },
    },
    {
      startPt: { x: 48.953975, y: 10.4118 },
      endPt: { x: 51.67195, y: 10.4118 },
    },
    {
      startPt: { x: 47.3394, y: 23.852 },
      endPt: { x: 44.81059031, y: 23.23117418 },
    },
    {
      startPt: { x: 44.81059031, y: 23.23117418 },
      endPt: { x: 47.3394, y: 21.2109 },
    },
    { startPt: { x: 47.3394, y: 21.2109 }, endPt: { x: 47.3394, y: 23.852 } },
    {
      startPt: { x: 44.76601176, y: 20.55756223 },
      endPt: { x: 47.3394, y: 21.2109 },
    },
    {
      startPt: { x: 44.81059031, y: 23.23117418 },
      endPt: { x: 42.3171, y: 25.4119 },
    },
    { startPt: { x: 42.3171, y: 25.4119 }, endPt: { x: 42.3171, y: 22.6511 } },
    {
      startPt: { x: 56.8651901, y: 13.59956683 },
      endPt: { x: 57.1079, y: 10.4118 },
    },
    { startPt: { x: 57.1079, y: 10.4118 }, endPt: { x: 59.0626, y: 12.39025 } },
    {
      startPt: { x: 59.0626, y: 12.39025 },
      endPt: { x: 56.8651901, y: 13.59956683 },
    },
    {
      startPt: { x: 50.99432769, y: 27.28598684 },
      endPt: { x: 50.67163333, y: 25.1836 },
    },
    {
      startPt: { x: 50.67163333, y: 25.1836 },
      endPt: { x: 52.67226667, y: 25.1836 },
    },
    {
      startPt: { x: 51.67195, y: 29.3688 },
      endPt: { x: 48.953975, y: 29.3688 },
    },
    {
      startPt: { x: 48.953975, y: 29.3688 },
      endPt: { x: 50.99432769, y: 27.28598684 },
    },
    { startPt: { x: 61.0173, y: 17.1295 }, endPt: { x: 61.0173, y: 19.8903 } },
    {
      startPt: { x: 61.0173, y: 19.8903 },
      endPt: { x: 58.57372984, y: 17.85580678 },
    },
    {
      startPt: { x: 58.57372984, y: 17.85580678 },
      endPt: { x: 58.63205159, y: 20.54044254 },
    },
    {
      startPt: { x: 58.63205159, y: 20.54044254 },
      endPt: { x: 56.0046, y: 18.5698 },
    },
    {
      startPt: { x: 56.0046, y: 18.5698 },
      endPt: { x: 58.57372984, y: 17.85580678 },
    },
    {
      startPt: { x: 46.47712931, y: 13.5998641 },
      endPt: { x: 44.27655, y: 12.39025 },
    },
    { startPt: { x: 44.27655, y: 12.39025 }, endPt: { x: 46.236, y: 10.4118 } },
    {
      startPt: { x: 46.236, y: 10.4118 },
      endPt: { x: 46.47712931, y: 13.5998641 },
    },
    {
      startPt: { x: 44.58159222, y: 15.21841033 },
      endPt: { x: 44.77974069, y: 17.86114946 },
    },
    {
      startPt: { x: 44.77974069, y: 17.86114946 },
      endPt: { x: 42.3171, y: 17.1295 },
    },
    {
      startPt: { x: 42.3171, y: 17.1295 },
      endPt: { x: 44.58159222, y: 15.21841033 },
    },
    { startPt: { x: 56.0046, y: 23.852 }, endPt: { x: 56.0046, y: 21.2109 } },
    {
      startPt: { x: 58.55348472, y: 23.14647643 },
      endPt: { x: 56.0046, y: 23.852 },
    },
    {
      startPt: { x: 48.79055109, y: 12.90051523 },
      endPt: { x: 48.671, y: 14.597 },
    },
    {
      startPt: { x: 48.671, y: 14.597 },
      endPt: { x: 46.47712931, y: 13.5998641 },
    },
    {
      startPt: { x: 46.47712931, y: 13.5998641 },
      endPt: { x: 48.79055109, y: 12.90051523 },
    },
    {
      startPt: { x: 48.953975, y: 10.4118 },
      endPt: { x: 48.79055109, y: 12.90051523 },
    },
    {
      startPt: { x: 48.79055109, y: 12.90051523 },
      endPt: { x: 46.236, y: 10.4118 },
    },
    { startPt: { x: 46.236, y: 10.4118 }, endPt: { x: 48.953975, y: 10.4118 } },
    {
      startPt: { x: 46.47712931, y: 13.5998641 },
      endPt: { x: 47.3394, y: 15.9287 },
    },
    {
      startPt: { x: 47.3394, y: 15.9287 },
      endPt: { x: 44.58159222, y: 15.21841033 },
    },
    {
      startPt: { x: 44.58159222, y: 15.21841033 },
      endPt: { x: 46.47712931, y: 13.5998641 },
    },
    {
      startPt: { x: 51.67195, y: 10.4118 },
      endPt: { x: 54.389925, y: 10.4118 },
    },
    {
      startPt: { x: 54.389925, y: 10.4118 },
      endPt: { x: 52.80960803, y: 12.1719283 },
    },
    { startPt: { x: 42.3171, y: 17.1295 }, endPt: { x: 42.3171, y: 14.3687 } },
    { startPt: { x: 54.6729, y: 25.1836 }, endPt: { x: 56.0046, y: 23.852 } },
    {
      startPt: { x: 56.0046, y: 23.852 },
      endPt: { x: 56.69767231, y: 26.50949927 },
    },
    {
      startPt: { x: 44.77974069, y: 17.86114946 },
      endPt: { x: 42.3171, y: 19.8903 },
    },
    { startPt: { x: 42.3171, y: 19.8903 }, endPt: { x: 42.3171, y: 17.1295 } },
    {
      startPt: { x: 44.77974069, y: 17.86114946 },
      endPt: { x: 44.76601176, y: 20.55756223 },
    },
    {
      startPt: { x: 56.69767231, y: 26.50949927 },
      endPt: { x: 59.0626, y: 27.39035 },
    },
    { startPt: { x: 59.0626, y: 27.39035 }, endPt: { x: 57.1079, y: 29.3688 } },
    {
      startPt: { x: 57.1079, y: 29.3688 },
      endPt: { x: 56.69767231, y: 26.50949927 },
    },
    {
      startPt: { x: 54.389925, y: 29.3688 },
      endPt: { x: 55.12546011, y: 27.57714657 },
    },
    {
      startPt: { x: 55.12546011, y: 27.57714657 },
      endPt: { x: 57.1079, y: 29.3688 },
    },
    {
      startPt: { x: 57.1079, y: 29.3688 },
      endPt: { x: 54.389925, y: 29.3688 },
    },
    {
      startPt: { x: 58.14659965, y: 25.24494738 },
      endPt: { x: 56.69767231, y: 26.50949927 },
    },
    {
      startPt: { x: 56.0046, y: 23.852 },
      endPt: { x: 58.14659965, y: 25.24494738 },
    },
    {
      startPt: { x: 54.55302353, y: 12.90001559 },
      endPt: { x: 56.8651901, y: 13.59956683 },
    },
    {
      startPt: { x: 54.6729, y: 14.597 },
      endPt: { x: 54.55302353, y: 12.90001559 },
    },
    {
      startPt: { x: 54.55302353, y: 12.90001559 },
      endPt: { x: 57.1079, y: 10.4118 },
    },
    { startPt: { x: 56.0046, y: 21.2109 }, endPt: { x: 56.0046, y: 18.5698 } },
    {
      startPt: { x: 53.21503762, y: 27.31011269 },
      endPt: { x: 55.12546011, y: 27.57714657 },
    },
    {
      startPt: { x: 54.389925, y: 10.4118 },
      endPt: { x: 57.1079, y: 10.4118 },
    },
    {
      startPt: { x: 54.55302353, y: 12.90001559 },
      endPt: { x: 54.389925, y: 10.4118 },
    },
    {
      startPt: { x: 54.55302353, y: 12.90001559 },
      endPt: { x: 52.80960803, y: 12.1719283 },
    },
    {
      startPt: { x: 45.74724971, y: 25.25954532 },
      endPt: { x: 47.3394, y: 23.852 },
    },
    { startPt: { x: 47.3394, y: 23.852 }, endPt: { x: 48.671, y: 25.1836 } },
    {
      startPt: { x: 48.671, y: 25.1836 },
      endPt: { x: 45.74724971, y: 25.25954532 },
    },
    {
      startPt: { x: 46.61858621, y: 26.78804441 },
      endPt: { x: 45.74724971, y: 25.25954532 },
    },
    {
      startPt: { x: 44.77974069, y: 17.86114946 },
      endPt: { x: 47.3394, y: 15.9287 },
    },
    { startPt: { x: 47.3394, y: 15.9287 }, endPt: { x: 47.3394, y: 18.5698 } },
    {
      startPt: { x: 47.3394, y: 18.5698 },
      endPt: { x: 44.77974069, y: 17.86114946 },
    },
    {
      startPt: { x: 50.91710598, y: 12.5780764 },
      endPt: { x: 52.67226667, y: 14.597 },
    },
    {
      startPt: { x: 52.67226667, y: 14.597 },
      endPt: { x: 50.67163333, y: 14.597 },
    },
    {
      startPt: { x: 50.67163333, y: 14.597 },
      endPt: { x: 50.91710598, y: 12.5780764 },
    },
    {
      startPt: { x: 52.80960803, y: 12.1719283 },
      endPt: { x: 52.67226667, y: 14.597 },
    },
    {
      startPt: { x: 58.75699459, y: 15.21843275 },
      endPt: { x: 56.0046, y: 15.9287 },
    },
    {
      startPt: { x: 56.8651901, y: 13.59956683 },
      endPt: { x: 58.75699459, y: 15.21843275 },
    },
    { startPt: { x: 48.953975, y: 29.3688 }, endPt: { x: 46.236, y: 29.3688 } },
    {
      startPt: { x: 48.68833565, y: 27.18082566 },
      endPt: { x: 48.953975, y: 29.3688 },
    },
    {
      startPt: { x: 48.68833565, y: 27.18082566 },
      endPt: { x: 50.99432769, y: 27.28598684 },
    },
    {
      startPt: { x: 44.76601176, y: 20.55756223 },
      endPt: { x: 47.3394, y: 18.5698 },
    },
    { startPt: { x: 47.3394, y: 18.5698 }, endPt: { x: 47.3394, y: 21.2109 } },
    { startPt: { x: 56.0046, y: 18.5698 }, endPt: { x: 56.0046, y: 15.9287 } },
    {
      startPt: { x: 56.0046, y: 15.9287 },
      endPt: { x: 58.57372984, y: 17.85580678 },
    },
    {
      startPt: { x: 58.14659965, y: 25.24494738 },
      endPt: { x: 59.0626, y: 27.39035 },
    },
    {
      startPt: { x: 58.55348472, y: 23.14647643 },
      endPt: { x: 58.14659965, y: 25.24494738 },
    },
    { startPt: { x: 48.671, y: 14.597 }, endPt: { x: 47.3394, y: 15.9287 } },
    {
      startPt: { x: 45.74724971, y: 25.25954532 },
      endPt: { x: 44.81059031, y: 23.23117418 },
    },
    {
      startPt: { x: 44.27655, y: 27.39035 },
      endPt: { x: 45.74724971, y: 25.25954532 },
    },
    {
      startPt: { x: 50.91710598, y: 12.5780764 },
      endPt: { x: 48.79055109, y: 12.90051523 },
    },
    {
      startPt: { x: 48.79055109, y: 12.90051523 },
      endPt: { x: 50.67163333, y: 14.597 },
    },
    { startPt: { x: 50.67163333, y: 14.597 }, endPt: { x: 48.671, y: 14.597 } },
    {
      startPt: { x: 48.671, y: 25.1836 },
      endPt: { x: 50.67163333, y: 25.1836 },
    },
    {
      startPt: { x: 50.67163333, y: 25.1836 },
      endPt: { x: 48.68833565, y: 27.18082566 },
    },
    {
      startPt: { x: 54.6729, y: 14.597 },
      endPt: { x: 52.67226667, y: 14.597 },
    },
    {
      startPt: { x: 52.67226667, y: 14.597 },
      endPt: { x: 54.55302353, y: 12.90001559 },
    },
    {
      startPt: { x: 53.21503762, y: 27.31011269 },
      endPt: { x: 54.6729, y: 25.1836 },
    },
    {
      startPt: { x: 52.67226667, y: 25.1836 },
      endPt: { x: 54.6729, y: 25.1836 },
    },
    {
      startPt: { x: 44.27655, y: 27.39035 },
      endPt: { x: 42.3171, y: 25.4119 },
    },
    {
      startPt: { x: 42.3171, y: 25.4119 },
      endPt: { x: 45.74724971, y: 25.25954532 },
    },
    {
      startPt: { x: 58.14659965, y: 25.24494738 },
      endPt: { x: 61.0173, y: 25.4119 },
    },
    { startPt: { x: 61.0173, y: 25.4119 }, endPt: { x: 59.0626, y: 27.39035 } },
  ],
  bigLCharacterLines: [
    {
      startPt: { x: 67.9038, y: 30.76364181 },
      endPt: { x: 67.9038, y: 28.07568 },
    },
    {
      startPt: { x: 67.9038, y: 28.07568 },
      endPt: { x: 70.4149, y: 29.43444 },
    },
    {
      startPt: { x: 70.4149, y: 29.43444 },
      endPt: { x: 67.9038, y: 30.76364181 },
    },
    {
      startPt: { x: 67.9038, y: 35.58910742 },
      endPt: { x: 65.3927, y: 34.86948 },
    },
    {
      startPt: { x: 65.3927, y: 34.86948 },
      endPt: { x: 67.9038, y: 33.34265749 },
    },
    {
      startPt: { x: 67.9038, y: 33.34265749 },
      endPt: { x: 67.9038, y: 35.58910742 },
    },
    {
      startPt: { x: 67.9038, y: 17.23515819 },
      endPt: { x: 70.4149, y: 15.84684 },
    },
    {
      startPt: { x: 70.4149, y: 15.84684 },
      endPt: { x: 70.4149, y: 18.56436 },
    },
    {
      startPt: { x: 70.4149, y: 18.56436 },
      endPt: { x: 67.9038, y: 17.23515819 },
    },
    {
      startPt: { x: 67.9038, y: 17.23515819 },
      endPt: { x: 67.9038, y: 14.65614251 },
    },
    {
      startPt: { x: 67.9038, y: 14.65614251 },
      endPt: { x: 70.4149, y: 15.84684 },
    },
    {
      startPt: { x: 67.9038, y: 30.76364181 },
      endPt: { x: 65.3927, y: 32.15196 },
    },
    {
      startPt: { x: 65.3927, y: 32.15196 },
      endPt: { x: 65.3927, y: 29.43444 },
    },
    {
      startPt: { x: 65.3927, y: 29.43444 },
      endPt: { x: 67.9038, y: 30.76364181 },
    },
    {
      startPt: { x: 67.9038, y: 17.23515819 },
      endPt: { x: 65.3927, y: 15.84684 },
    },
    {
      startPt: { x: 65.3927, y: 15.84684 },
      endPt: { x: 67.9038, y: 14.65614251 },
    },
    {
      startPt: { x: 67.9038, y: 12.40969258 },
      endPt: { x: 65.3927, y: 13.12932 },
    },
    { startPt: { x: 65.3927, y: 13.12932 }, endPt: { x: 65.3927, y: 10.4118 } },
    {
      startPt: { x: 65.3927, y: 10.4118 },
      endPt: { x: 67.9038, y: 12.40969258 },
    },
    {
      startPt: { x: 67.9038, y: 35.58910742 },
      endPt: { x: 67.9038, y: 37.587 },
    },
    { startPt: { x: 67.9038, y: 37.587 }, endPt: { x: 65.3927, y: 37.587 } },
    {
      startPt: { x: 65.3927, y: 37.587 },
      endPt: { x: 67.9038, y: 35.58910742 },
    },
    { startPt: { x: 65.3927, y: 37.587 }, endPt: { x: 65.3927, y: 34.86948 } },
    {
      startPt: { x: 67.9038, y: 17.23515819 },
      endPt: { x: 65.3927, y: 18.56436 },
    },
    {
      startPt: { x: 65.3927, y: 18.56436 },
      endPt: { x: 65.3927, y: 15.84684 },
    },
    {
      startPt: { x: 67.9038, y: 19.92312 },
      endPt: { x: 67.9038, y: 17.23515819 },
    },
    {
      startPt: { x: 70.4149, y: 18.56436 },
      endPt: { x: 67.9038, y: 19.92312 },
    },
    {
      startPt: { x: 67.9038, y: 19.92312 },
      endPt: { x: 65.3927, y: 21.28188 },
    },
    {
      startPt: { x: 65.3927, y: 21.28188 },
      endPt: { x: 65.3927, y: 18.56436 },
    },
    {
      startPt: { x: 65.3927, y: 18.56436 },
      endPt: { x: 67.9038, y: 19.92312 },
    },
    {
      startPt: { x: 67.9038, y: 22.64064 },
      endPt: { x: 67.9038, y: 19.92312 },
    },
    {
      startPt: { x: 67.9038, y: 19.92312 },
      endPt: { x: 70.4149, y: 21.28188 },
    },
    {
      startPt: { x: 70.4149, y: 21.28188 },
      endPt: { x: 67.9038, y: 22.64064 },
    },
    { startPt: { x: 67.9038, y: 22.64064 }, endPt: { x: 65.3927, y: 23.9994 } },
    { startPt: { x: 65.3927, y: 23.9994 }, endPt: { x: 65.3927, y: 21.28188 } },
    {
      startPt: { x: 65.3927, y: 21.28188 },
      endPt: { x: 67.9038, y: 22.64064 },
    },
    { startPt: { x: 65.3927, y: 10.4118 }, endPt: { x: 67.9038, y: 10.4118 } },
    {
      startPt: { x: 67.9038, y: 10.4118 },
      endPt: { x: 67.9038, y: 12.40969258 },
    },
    {
      startPt: { x: 65.3927, y: 15.84684 },
      endPt: { x: 65.3927, y: 13.12932 },
    },
    {
      startPt: { x: 65.3927, y: 13.12932 },
      endPt: { x: 67.9038, y: 14.65614251 },
    },
    {
      startPt: { x: 67.9038, y: 14.65614251 },
      endPt: { x: 70.4149, y: 13.12932 },
    },
    {
      startPt: { x: 70.4149, y: 13.12932 },
      endPt: { x: 70.4149, y: 15.84684 },
    },
    {
      startPt: { x: 67.9038, y: 25.35816 },
      endPt: { x: 65.3927, y: 26.71692 },
    },
    { startPt: { x: 65.3927, y: 26.71692 }, endPt: { x: 65.3927, y: 23.9994 } },
    { startPt: { x: 65.3927, y: 23.9994 }, endPt: { x: 67.9038, y: 25.35816 } },
    {
      startPt: { x: 67.9038, y: 25.35816 },
      endPt: { x: 67.9038, y: 22.64064 },
    },
    { startPt: { x: 67.9038, y: 22.64064 }, endPt: { x: 70.4149, y: 23.9994 } },
    { startPt: { x: 70.4149, y: 23.9994 }, endPt: { x: 67.9038, y: 25.35816 } },
    {
      startPt: { x: 67.9038, y: 28.07568 },
      endPt: { x: 67.9038, y: 25.35816 },
    },
    {
      startPt: { x: 67.9038, y: 25.35816 },
      endPt: { x: 70.4149, y: 26.71692 },
    },
    {
      startPt: { x: 70.4149, y: 26.71692 },
      endPt: { x: 67.9038, y: 28.07568 },
    },
    {
      startPt: { x: 67.9038, y: 28.07568 },
      endPt: { x: 65.3927, y: 29.43444 },
    },
    {
      startPt: { x: 65.3927, y: 29.43444 },
      endPt: { x: 65.3927, y: 26.71692 },
    },
    {
      startPt: { x: 65.3927, y: 26.71692 },
      endPt: { x: 67.9038, y: 28.07568 },
    },
    {
      startPt: { x: 67.9038, y: 12.40969258 },
      endPt: { x: 70.4149, y: 13.12932 },
    },
    {
      startPt: { x: 67.9038, y: 14.65614251 },
      endPt: { x: 67.9038, y: 12.40969258 },
    },
    {
      startPt: { x: 70.4149, y: 18.56436 },
      endPt: { x: 70.4149, y: 21.28188 },
    },
    { startPt: { x: 70.4149, y: 21.28188 }, endPt: { x: 70.4149, y: 23.9994 } },
    { startPt: { x: 70.4149, y: 23.9994 }, endPt: { x: 70.4149, y: 26.71692 } },
    {
      startPt: { x: 70.4149, y: 26.71692 },
      endPt: { x: 70.4149, y: 29.43444 },
    },
    {
      startPt: { x: 70.4149, y: 29.43444 },
      endPt: { x: 70.4149, y: 32.15196 },
    },
    {
      startPt: { x: 70.4149, y: 32.15196 },
      endPt: { x: 67.9038, y: 30.76364181 },
    },
    {
      startPt: { x: 67.9038, y: 33.34265749 },
      endPt: { x: 65.3927, y: 32.15196 },
    },
    {
      startPt: { x: 67.9038, y: 30.76364181 },
      endPt: { x: 67.9038, y: 33.34265749 },
    },
    {
      startPt: { x: 67.9038, y: 33.34265749 },
      endPt: { x: 70.4149, y: 34.86948 },
    },
    {
      startPt: { x: 70.4149, y: 34.86948 },
      endPt: { x: 67.9038, y: 35.58910742 },
    },
    {
      startPt: { x: 65.3927, y: 34.86948 },
      endPt: { x: 65.3927, y: 32.15196 },
    },
    {
      startPt: { x: 67.9038, y: 33.34265749 },
      endPt: { x: 70.4149, y: 32.15196 },
    },
    {
      startPt: { x: 70.4149, y: 32.15196 },
      endPt: { x: 70.4149, y: 34.86948 },
    },
    { startPt: { x: 67.9038, y: 10.4118 }, endPt: { x: 70.4149, y: 10.4118 } },
    {
      startPt: { x: 70.4149, y: 10.4118 },
      endPt: { x: 67.9038, y: 12.40969258 },
    },
    { startPt: { x: 70.4149, y: 10.4118 }, endPt: { x: 70.4149, y: 13.12932 } },
    { startPt: { x: 70.4149, y: 34.86948 }, endPt: { x: 70.4149, y: 37.587 } },
    {
      startPt: { x: 70.4149, y: 37.587 },
      endPt: { x: 67.9038, y: 35.58910742 },
    },
    { startPt: { x: 70.4149, y: 37.587 }, endPt: { x: 67.9038, y: 37.587 } },
  ],
  bigMCharacterLines: [
    {
      startPt: { x: 77.42838197, y: 27.76129856 },
      endPt: { x: 75.3515, y: 29.06155 },
    },
    { startPt: { x: 75.3515, y: 29.06155 }, endPt: { x: 75.3515, y: 26.3973 } },
    {
      startPt: { x: 75.3515, y: 26.3973 },
      endPt: { x: 77.42838197, y: 27.76129856 },
    },
    {
      startPt: { x: 88.78496772, y: 15.42270915 },
      endPt: { x: 88.0878, y: 14.1405 },
    },
    { startPt: { x: 88.0878, y: 14.1405 }, endPt: { x: 89.6858, y: 14.1405 } },
    {
      startPt: { x: 89.6858, y: 14.1405 },
      endPt: { x: 88.78496772, y: 15.42270915 },
    },
    {
      startPt: { x: 98.25314436, y: 35.13206514 },
      endPt: { x: 96.0681, y: 37.0543 },
    },
    {
      startPt: { x: 96.0681, y: 37.0543 },
      endPt: { x: 95.0753125, y: 34.9046375 },
    },
    {
      startPt: { x: 95.0753125, y: 34.9046375 },
      endPt: { x: 98.25314436, y: 35.13206514 },
    },
    {
      startPt: { x: 98.7694572, y: 27.77690247 },
      endPt: { x: 100.8621, y: 26.3973 },
    },
    {
      startPt: { x: 100.8621, y: 26.3973 },
      endPt: { x: 100.8621, y: 29.06155 },
    },
    {
      startPt: { x: 100.8621, y: 29.06155 },
      endPt: { x: 98.7694572, y: 27.77690247 },
    },
    {
      startPt: { x: 79.52583777, y: 28.68542648 },
      endPt: { x: 81.58618679, y: 28.72788903 },
    },
    {
      startPt: { x: 81.58618679, y: 28.72788903 },
      endPt: { x: 80.6146172, y: 30.6928486 },
    },
    {
      startPt: { x: 80.6146172, y: 30.6928486 },
      endPt: { x: 79.52583777, y: 28.68542648 },
    },
    {
      startPt: { x: 96.66762417, y: 32.77441726 },
      endPt: { x: 95.0753125, y: 34.9046375 },
    },
    {
      startPt: { x: 95.0753125, y: 34.9046375 },
      endPt: { x: 94.082525, y: 32.754975 },
    },
    {
      startPt: { x: 94.082525, y: 32.754975 },
      endPt: { x: 96.66762417, y: 32.77441726 },
    },
    {
      startPt: { x: 77.83843437, y: 14.60335579 },
      endPt: { x: 80.3357, y: 13.11473333 },
    },
    {
      startPt: { x: 80.3357, y: 13.11473333 },
      endPt: { x: 80.3357, y: 15.81766667 },
    },
    {
      startPt: { x: 80.3357, y: 15.81766667 },
      endPt: { x: 77.83843437, y: 14.60335579 },
    },
    {
      startPt: { x: 77.86723248, y: 30.49841054 },
      endPt: { x: 75.3515, y: 29.06155 },
    },
    {
      startPt: { x: 77.42838197, y: 27.76129856 },
      endPt: { x: 77.86723248, y: 30.49841054 },
    },
    {
      startPt: { x: 77.82684963, y: 22.4879625 },
      endPt: { x: 75.3515, y: 23.73305 },
    },
    { startPt: { x: 75.3515, y: 23.73305 }, endPt: { x: 75.3515, y: 21.0688 } },
    {
      startPt: { x: 75.3515, y: 21.0688 },
      endPt: { x: 77.82684963, y: 22.4879625 },
    },
    {
      startPt: { x: 77.82684963, y: 17.12077917 },
      endPt: { x: 75.3515, y: 18.40455 },
    },
    { startPt: { x: 75.3515, y: 18.40455 }, endPt: { x: 75.3515, y: 15.7403 } },
    {
      startPt: { x: 75.3515, y: 15.7403 },
      endPt: { x: 77.82684963, y: 17.12077917 },
    },
    {
      startPt: { x: 94.84857709, y: 27.62252151 },
      endPt: { x: 95.54680349, y: 30.36695933 },
    },
    {
      startPt: { x: 95.54680349, y: 30.36695933 },
      endPt: { x: 93.0897375, y: 30.6053125 },
    },
    {
      startPt: { x: 93.0897375, y: 30.6053125 },
      endPt: { x: 94.84857709, y: 27.62252151 },
    },
    {
      startPt: { x: 90.25462369, y: 20.39589336 },
      endPt: { x: 89.1185875, y: 22.0066625 },
    },
    {
      startPt: { x: 89.1185875, y: 22.0066625 },
      endPt: { x: 88.1258, y: 19.857 },
    },
    {
      startPt: { x: 88.1258, y: 19.857 },
      endPt: { x: 90.25462369, y: 20.39589336 },
    },
    {
      startPt: { x: 85.92111536, y: 20.39422434 },
      endPt: { x: 84.4638, y: 18.30346667 },
    },
    {
      startPt: { x: 84.4638, y: 18.30346667 },
      endPt: { x: 87.04319368, y: 19.11953918 },
    },
    {
      startPt: { x: 87.04319368, y: 19.11953918 },
      endPt: { x: 85.92111536, y: 20.39422434 },
    },
    {
      startPt: { x: 77.8353797, y: 12.38727227 },
      endPt: { x: 75.3515, y: 13.07605 },
    },
    { startPt: { x: 75.3515, y: 13.07605 }, endPt: { x: 75.3515, y: 10.4118 } },
    {
      startPt: { x: 75.3515, y: 10.4118 },
      endPt: { x: 77.8353797, y: 12.38727227 },
    },
    {
      startPt: { x: 89.6858, y: 14.1405 },
      endPt: { x: 90.70671667, y: 16.22198333 },
    },
    {
      startPt: { x: 90.70671667, y: 16.22198333 },
      endPt: { x: 88.78496772, y: 15.42270915 },
    },
    {
      startPt: { x: 83.53511974, y: 24.56227691 },
      endPt: { x: 86.073625, y: 24.156325 },
    },
    {
      startPt: { x: 86.073625, y: 24.156325 },
      endPt: { x: 85.0855875, y: 26.3059875 },
    },
    {
      startPt: { x: 85.0855875, y: 26.3059875 },
      endPt: { x: 83.53511974, y: 24.56227691 },
    },
    {
      startPt: { x: 79.15204702, y: 27.05004419 },
      endPt: { x: 77.42838197, y: 27.76129856 },
    },
    {
      startPt: { x: 77.42838197, y: 27.76129856 },
      endPt: { x: 78.17342983, y: 25.40412301 },
    },
    {
      startPt: { x: 78.17342983, y: 25.40412301 },
      endPt: { x: 79.15204702, y: 27.05004419 },
    },
    {
      startPt: { x: 80.37811335, y: 27.00963712 },
      endPt: { x: 80.37375, y: 26.6294 },
    },
    { startPt: { x: 80.37375, y: 26.6294 }, endPt: { x: 80.4118, y: 26.6294 } },
    {
      startPt: { x: 80.4118, y: 26.6294 },
      endPt: { x: 80.37811335, y: 27.00963712 },
    },
    {
      startPt: { x: 84.72644943, y: 22.26440179 },
      endPt: { x: 86.073625, y: 24.156325 },
    },
    {
      startPt: { x: 83.53511974, y: 24.56227691 },
      endPt: { x: 84.72644943, y: 22.26440179 },
    },
    {
      startPt: { x: 91.46651724, y: 22.26577299 },
      endPt: { x: 92.74855, y: 20.38495 },
    },
    {
      startPt: { x: 92.74855, y: 20.38495 },
      endPt: { x: 93.76946667, y: 22.46643333 },
    },
    {
      startPt: { x: 93.76946667, y: 22.46643333 },
      endPt: { x: 91.46651724, y: 22.26577299 },
    },
    {
      startPt: { x: 84.4638, y: 18.30346667 },
      endPt: { x: 85.4768, y: 16.22198333 },
    },
    {
      startPt: { x: 85.4768, y: 16.22198333 },
      endPt: { x: 87.04319368, y: 19.11953918 },
    },
    {
      startPt: { x: 77.82684963, y: 17.12077917 },
      endPt: { x: 80.3357, y: 15.81766667 },
    },
    {
      startPt: { x: 80.3357, y: 15.81766667 },
      endPt: { x: 80.3357, y: 18.5206 },
    },
    {
      startPt: { x: 80.3357, y: 18.5206 },
      endPt: { x: 77.82684963, y: 17.12077917 },
    },
    {
      startPt: { x: 88.1258, y: 19.857 },
      endPt: { x: 89.154587, y: 19.1547223 },
    },
    {
      startPt: { x: 89.154587, y: 19.1547223 },
      endPt: { x: 90.25462369, y: 20.39589336 },
    },
    {
      startPt: { x: 85.92111536, y: 20.39422434 },
      endPt: { x: 83.4508, y: 20.38495 },
    },
    {
      startPt: { x: 83.4508, y: 20.38495 },
      endPt: { x: 84.4638, y: 18.30346667 },
    },
    {
      startPt: { x: 83.53511974, y: 24.56227691 },
      endPt: { x: 82.4378, y: 22.46643333 },
    },
    {
      startPt: { x: 82.4378, y: 22.46643333 },
      endPt: { x: 84.72644943, y: 22.26440179 },
    },
    {
      startPt: { x: 96.66762417, y: 32.77441726 },
      endPt: { x: 98.25314436, y: 35.13206514 },
    },
    {
      startPt: { x: 77.82684963, y: 19.80437083 },
      endPt: { x: 80.3357, y: 18.5206 },
    },
    {
      startPt: { x: 80.3357, y: 18.5206 },
      endPt: { x: 80.3357, y: 21.22353333 },
    },
    {
      startPt: { x: 80.3357, y: 21.22353333 },
      endPt: { x: 77.82684963, y: 19.80437083 },
    },
    {
      startPt: { x: 98.39150037, y: 19.80437083 },
      endPt: { x: 95.8874, y: 21.22353333 },
    },
    {
      startPt: { x: 95.8874, y: 21.22353333 },
      endPt: { x: 95.8874, y: 18.5206 },
    },
    {
      startPt: { x: 95.8874, y: 18.5206 },
      endPt: { x: 98.39150037, y: 19.80437083 },
    },
    {
      startPt: { x: 81.71354734, y: 26.81264628 },
      endPt: { x: 85.0855875, y: 26.3059875 },
    },
    {
      startPt: { x: 85.0855875, y: 26.3059875 },
      endPt: { x: 84.09755, y: 28.45565 },
    },
    {
      startPt: { x: 84.09755, y: 28.45565 },
      endPt: { x: 81.71354734, y: 26.81264628 },
    },
    {
      startPt: { x: 83.53511974, y: 24.56227691 },
      endPt: { x: 81.4248, y: 24.54791667 },
    },
    {
      startPt: { x: 81.4248, y: 24.54791667 },
      endPt: { x: 82.4378, y: 22.46643333 },
    },
    {
      startPt: { x: 98.39150037, y: 22.4879625 },
      endPt: { x: 95.8874, y: 21.22353333 },
    },
    {
      startPt: { x: 98.39150037, y: 19.80437083 },
      endPt: { x: 98.39150037, y: 22.4879625 },
    },
    {
      startPt: { x: 98.39150037, y: 19.80437083 },
      endPt: { x: 100.8621, y: 18.40455 },
    },
    {
      startPt: { x: 100.8621, y: 18.40455 },
      endPt: { x: 100.8621, y: 21.0688 },
    },
    {
      startPt: { x: 100.8621, y: 21.0688 },
      endPt: { x: 98.39150037, y: 19.80437083 },
    },
    {
      startPt: { x: 79.50917255, y: 32.8359966 },
      endPt: { x: 77.95820261, y: 35.1491453 },
    },
    {
      startPt: { x: 77.95820261, y: 35.1491453 },
      endPt: { x: 77.21659193, y: 32.91338788 },
    },
    {
      startPt: { x: 77.21659193, y: 32.91338788 },
      endPt: { x: 79.50917255, y: 32.8359966 },
    },
    {
      startPt: { x: 95.85993013, y: 27.13319515 },
      endPt: { x: 95.84935, y: 26.6294 },
    },
    { startPt: { x: 95.84935, y: 26.6294 }, endPt: { x: 95.8874, y: 26.6294 } },
    {
      startPt: { x: 95.8874, y: 26.6294 },
      endPt: { x: 95.85993013, y: 27.13319515 },
    },
    {
      startPt: { x: 87.35257794, y: 15.45702132 },
      endPt: { x: 88.0878, y: 14.1405 },
    },
    {
      startPt: { x: 88.78496772, y: 15.42270915 },
      endPt: { x: 87.35257794, y: 15.45702132 },
    },
    {
      startPt: { x: 93.62375144, y: 26.47590712 },
      endPt: { x: 92.09695, y: 28.45565 },
    },
    {
      startPt: { x: 92.09695, y: 28.45565 },
      endPt: { x: 91.1041625, y: 26.3059875 },
    },
    {
      startPt: { x: 91.1041625, y: 26.3059875 },
      endPt: { x: 93.62375144, y: 26.47590712 },
    },
    {
      startPt: { x: 98.38296631, y: 12.38631268 },
      endPt: { x: 95.8874, y: 13.11473333 },
    },
    {
      startPt: { x: 95.8874, y: 13.11473333 },
      endPt: { x: 95.8874, y: 10.4118 },
    },
    {
      startPt: { x: 95.8874, y: 10.4118 },
      endPt: { x: 98.38296631, y: 12.38631268 },
    },
    {
      startPt: { x: 80.6146172, y: 30.6928486 },
      endPt: { x: 77.86723248, y: 30.49841054 },
    },
    {
      startPt: { x: 77.86723248, y: 30.49841054 },
      endPt: { x: 79.52583777, y: 28.68542648 },
    },
    { startPt: { x: 95.8874, y: 10.4118 }, endPt: { x: 98.37475, y: 10.4118 } },
    {
      startPt: { x: 98.37475, y: 10.4118 },
      endPt: { x: 98.38296631, y: 12.38631268 },
    },
    {
      startPt: { x: 98.25314436, y: 35.13206514 },
      endPt: { x: 100.8621, y: 37.0543 },
    },
    { startPt: { x: 100.8621, y: 37.0543 }, endPt: { x: 98.4651, y: 37.0543 } },
    {
      startPt: { x: 98.4651, y: 37.0543 },
      endPt: { x: 98.25314436, y: 35.13206514 },
    },
    { startPt: { x: 98.4651, y: 37.0543 }, endPt: { x: 96.0681, y: 37.0543 } },
    {
      startPt: { x: 89.154587, y: 19.1547223 },
      endPt: { x: 91.72763333, y: 18.30346667 },
    },
    {
      startPt: { x: 91.72763333, y: 18.30346667 },
      endPt: { x: 90.25462369, y: 20.39589336 },
    },
    {
      startPt: { x: 82.4378, y: 22.46643333 },
      endPt: { x: 83.4508, y: 20.38495 },
    },
    {
      startPt: { x: 83.4508, y: 20.38495 },
      endPt: { x: 84.72644943, y: 22.26440179 },
    },
    {
      startPt: { x: 84.72644943, y: 22.26440179 },
      endPt: { x: 87.0616625, y: 22.0066625 },
    },
    {
      startPt: { x: 87.0616625, y: 22.0066625 },
      endPt: { x: 86.073625, y: 24.156325 },
    },
    {
      startPt: { x: 96.66762417, y: 32.77441726 },
      endPt: { x: 95.54680349, y: 30.36695933 },
    },
    {
      startPt: { x: 95.54680349, y: 30.36695933 },
      endPt: { x: 98.29132233, y: 30.45133794 },
    },
    {
      startPt: { x: 98.29132233, y: 30.45133794 },
      endPt: { x: 96.66762417, y: 32.77441726 },
    },
    {
      startPt: { x: 98.04422622, y: 25.40265452 },
      endPt: { x: 95.8874, y: 26.6294 },
    },
    {
      startPt: { x: 95.8874, y: 26.6294 },
      endPt: { x: 95.8874, y: 23.92646667 },
    },
    {
      startPt: { x: 95.8874, y: 23.92646667 },
      endPt: { x: 98.04422622, y: 25.40265452 },
    },
    {
      startPt: { x: 91.46651724, y: 22.26577299 },
      endPt: { x: 90.111375, y: 24.156325 },
    },
    {
      startPt: { x: 90.111375, y: 24.156325 },
      endPt: { x: 89.1185875, y: 22.0066625 },
    },
    {
      startPt: { x: 89.1185875, y: 22.0066625 },
      endPt: { x: 91.46651724, y: 22.26577299 },
    },
    {
      startPt: { x: 95.85993013, y: 27.13319515 },
      endPt: { x: 95.8113, y: 26.6294 },
    },
    { startPt: { x: 95.8113, y: 26.6294 }, endPt: { x: 95.84935, y: 26.6294 } },
    {
      startPt: { x: 98.39150037, y: 17.12077917 },
      endPt: { x: 95.8874, y: 18.5206 },
    },
    {
      startPt: { x: 95.8874, y: 18.5206 },
      endPt: { x: 95.8874, y: 15.81766667 },
    },
    {
      startPt: { x: 95.8874, y: 15.81766667 },
      endPt: { x: 98.39150037, y: 17.12077917 },
    },
    {
      startPt: { x: 98.38296631, y: 12.38631268 },
      endPt: { x: 98.37991616, y: 14.60270732 },
    },
    {
      startPt: { x: 98.37991616, y: 14.60270732 },
      endPt: { x: 95.8874, y: 13.11473333 },
    },
    {
      startPt: { x: 98.25314436, y: 35.13206514 },
      endPt: { x: 100.8621, y: 34.39005 },
    },
    {
      startPt: { x: 100.8621, y: 34.39005 },
      endPt: { x: 100.8621, y: 37.0543 },
    },
    {
      startPt: { x: 79.50917255, y: 32.8359966 },
      endPt: { x: 82.121475, y: 32.754975 },
    },
    {
      startPt: { x: 82.121475, y: 32.754975 },
      endPt: { x: 81.1334375, y: 34.9046375 },
    },
    {
      startPt: { x: 81.1334375, y: 34.9046375 },
      endPt: { x: 79.50917255, y: 32.8359966 },
    },
    {
      startPt: { x: 77.21659193, y: 32.91338788 },
      endPt: { x: 75.3515, y: 34.39005 },
    },
    { startPt: { x: 75.3515, y: 34.39005 }, endPt: { x: 75.3515, y: 31.7258 } },
    {
      startPt: { x: 75.3515, y: 31.7258 },
      endPt: { x: 77.21659193, y: 32.91338788 },
    },
    {
      startPt: { x: 77.95820261, y: 35.1491453 },
      endPt: { x: 75.3515, y: 34.39005 },
    },
    { startPt: { x: 75.3515, y: 10.4118 }, endPt: { x: 77.8436, y: 10.4118 } },
    {
      startPt: { x: 77.8436, y: 10.4118 },
      endPt: { x: 77.8353797, y: 12.38727227 },
    },
    {
      startPt: { x: 77.82684963, y: 19.80437083 },
      endPt: { x: 77.82684963, y: 17.12077917 },
    },
    {
      startPt: { x: 77.82684963, y: 19.80437083 },
      endPt: { x: 75.3515, y: 21.0688 },
    },
    { startPt: { x: 75.3515, y: 21.0688 }, endPt: { x: 75.3515, y: 18.40455 } },
    {
      startPt: { x: 75.3515, y: 18.40455 },
      endPt: { x: 77.82684963, y: 19.80437083 },
    },
    {
      startPt: { x: 77.95820261, y: 35.1491453 },
      endPt: { x: 80.1454, y: 37.0543 },
    },
    { startPt: { x: 80.1454, y: 37.0543 }, endPt: { x: 77.74845, y: 37.0543 } },
    {
      startPt: { x: 77.74845, y: 37.0543 },
      endPt: { x: 77.95820261, y: 35.1491453 },
    },
    {
      startPt: { x: 78.17342983, y: 25.40412301 },
      endPt: { x: 80.3357, y: 26.6294 },
    },
    {
      startPt: { x: 80.3357, y: 26.6294 },
      endPt: { x: 79.15204702, y: 27.05004419 },
    },
    {
      startPt: { x: 92.47336932, y: 24.38134591 },
      endPt: { x: 93.76946667, y: 22.46643333 },
    },
    {
      startPt: { x: 93.76946667, y: 22.46643333 },
      endPt: { x: 94.79038333, y: 24.54791667 },
    },
    {
      startPt: { x: 94.79038333, y: 24.54791667 },
      endPt: { x: 92.47336932, y: 24.38134591 },
    },
    {
      startPt: { x: 92.47336932, y: 24.38134591 },
      endPt: { x: 91.1041625, y: 26.3059875 },
    },
    {
      startPt: { x: 91.1041625, y: 26.3059875 },
      endPt: { x: 90.111375, y: 24.156325 },
    },
    {
      startPt: { x: 90.111375, y: 24.156325 },
      endPt: { x: 92.47336932, y: 24.38134591 },
    },
    {
      startPt: { x: 98.39150037, y: 17.12077917 },
      endPt: { x: 98.39150037, y: 19.80437083 },
    },
    {
      startPt: { x: 98.39150037, y: 17.12077917 },
      endPt: { x: 100.8621, y: 15.7403 },
    },
    {
      startPt: { x: 100.8621, y: 15.7403 },
      endPt: { x: 100.8621, y: 18.40455 },
    },
    {
      startPt: { x: 100.8621, y: 18.40455 },
      endPt: { x: 98.39150037, y: 17.12077917 },
    },
    {
      startPt: { x: 91.72763333, y: 18.30346667 },
      endPt: { x: 92.74855, y: 20.38495 },
    },
    {
      startPt: { x: 92.74855, y: 20.38495 },
      endPt: { x: 90.25462369, y: 20.39589336 },
    },
    {
      startPt: { x: 96.60133872, y: 28.58376634 },
      endPt: { x: 98.7694572, y: 27.77690247 },
    },
    {
      startPt: { x: 98.7694572, y: 27.77690247 },
      endPt: { x: 98.29132233, y: 30.45133794 },
    },
    {
      startPt: { x: 98.29132233, y: 30.45133794 },
      endPt: { x: 96.60133872, y: 28.58376634 },
    },
    {
      startPt: { x: 95.54680349, y: 30.36695933 },
      endPt: { x: 94.082525, y: 32.754975 },
    },
    {
      startPt: { x: 94.082525, y: 32.754975 },
      endPt: { x: 93.0897375, y: 30.6053125 },
    },
    {
      startPt: { x: 88.08846046, y: 19.61309278 },
      endPt: { x: 88.08775, y: 19.857 },
    },
    { startPt: { x: 88.08775, y: 19.857 }, endPt: { x: 88.0497, y: 19.857 } },
    {
      startPt: { x: 88.0497, y: 19.857 },
      endPt: { x: 88.08846046, y: 19.61309278 },
    },
    {
      startPt: { x: 89.154587, y: 19.1547223 },
      endPt: { x: 90.70671667, y: 16.22198333 },
    },
    {
      startPt: { x: 90.70671667, y: 16.22198333 },
      endPt: { x: 91.72763333, y: 18.30346667 },
    },
    {
      startPt: { x: 81.1334375, y: 34.9046375 },
      endPt: { x: 77.95820261, y: 35.1491453 },
    },
    {
      startPt: { x: 81.1334375, y: 34.9046375 },
      endPt: { x: 80.1454, y: 37.0543 },
    },
    {
      startPt: { x: 98.39150037, y: 22.4879625 },
      endPt: { x: 100.8621, y: 21.0688 },
    },
    {
      startPt: { x: 100.8621, y: 21.0688 },
      endPt: { x: 100.8621, y: 23.73305 },
    },
    {
      startPt: { x: 100.8621, y: 23.73305 },
      endPt: { x: 98.39150037, y: 22.4879625 },
    },
    {
      startPt: { x: 95.8874, y: 23.92646667 },
      endPt: { x: 98.39150037, y: 22.4879625 },
    },
    {
      startPt: { x: 98.39150037, y: 22.4879625 },
      endPt: { x: 98.04422622, y: 25.40265452 },
    },
    {
      startPt: { x: 77.8353797, y: 12.38727227 },
      endPt: { x: 77.83843437, y: 14.60335579 },
    },
    {
      startPt: { x: 77.83843437, y: 14.60335579 },
      endPt: { x: 75.3515, y: 13.07605 },
    },
    {
      startPt: { x: 93.0897375, y: 30.6053125 },
      endPt: { x: 92.09695, y: 28.45565 },
    },
    {
      startPt: { x: 92.09695, y: 28.45565 },
      endPt: { x: 94.84857709, y: 27.62252151 },
    },
    {
      startPt: { x: 93.62375144, y: 26.47590712 },
      endPt: { x: 94.84857709, y: 27.62252151 },
    },
    {
      startPt: { x: 98.97462133, y: 32.89330623 },
      endPt: { x: 100.8621, y: 31.7258 },
    },
    {
      startPt: { x: 100.8621, y: 31.7258 },
      endPt: { x: 100.8621, y: 34.39005 },
    },
    {
      startPt: { x: 100.8621, y: 34.39005 },
      endPt: { x: 98.97462133, y: 32.89330623 },
    },
    {
      startPt: { x: 78.17342983, y: 25.40412301 },
      endPt: { x: 75.3515, y: 26.3973 },
    },
    { startPt: { x: 75.3515, y: 26.3973 }, endPt: { x: 75.3515, y: 23.73305 } },
    {
      startPt: { x: 75.3515, y: 23.73305 },
      endPt: { x: 78.17342983, y: 25.40412301 },
    },
    {
      startPt: { x: 77.82684963, y: 22.4879625 },
      endPt: { x: 78.17342983, y: 25.40412301 },
    },
    {
      startPt: { x: 95.8874, y: 23.92646667 },
      endPt: { x: 95.8874, y: 21.22353333 },
    },
    {
      startPt: { x: 97.19018389, y: 27.04786238 },
      endPt: { x: 98.04422622, y: 25.40265452 },
    },
    {
      startPt: { x: 98.04422622, y: 25.40265452 },
      endPt: { x: 98.7694572, y: 27.77690247 },
    },
    {
      startPt: { x: 98.7694572, y: 27.77690247 },
      endPt: { x: 97.19018389, y: 27.04786238 },
    },
    {
      startPt: { x: 95.85993013, y: 27.13319515 },
      endPt: { x: 94.84857709, y: 27.62252151 },
    },
    {
      startPt: { x: 94.84857709, y: 27.62252151 },
      endPt: { x: 95.8113, y: 26.6294 },
    },
    {
      startPt: { x: 98.29132233, y: 30.45133794 },
      endPt: { x: 100.8621, y: 29.06155 },
    },
    {
      startPt: { x: 100.8621, y: 29.06155 },
      endPt: { x: 100.8621, y: 31.7258 },
    },
    {
      startPt: { x: 100.8621, y: 31.7258 },
      endPt: { x: 98.29132233, y: 30.45133794 },
    },
    {
      startPt: { x: 98.97462133, y: 32.89330623 },
      endPt: { x: 98.25314436, y: 35.13206514 },
    },
    {
      startPt: { x: 96.66762417, y: 32.77441726 },
      endPt: { x: 98.97462133, y: 32.89330623 },
    },
    {
      startPt: { x: 81.58618679, y: 28.72788903 },
      endPt: { x: 84.09755, y: 28.45565 },
    },
    {
      startPt: { x: 84.09755, y: 28.45565 },
      endPt: { x: 83.1095125, y: 30.6053125 },
    },
    {
      startPt: { x: 83.1095125, y: 30.6053125 },
      endPt: { x: 81.58618679, y: 28.72788903 },
    },
    {
      startPt: { x: 81.58618679, y: 28.72788903 },
      endPt: { x: 81.71354734, y: 26.81264628 },
    },
    {
      startPt: { x: 81.71354734, y: 26.81264628 },
      endPt: { x: 83.53511974, y: 24.56227691 },
    },
    {
      startPt: { x: 98.37991616, y: 14.60270732 },
      endPt: { x: 100.8621, y: 15.7403 },
    },
    {
      startPt: { x: 98.39150037, y: 17.12077917 },
      endPt: { x: 98.37991616, y: 14.60270732 },
    },
    {
      startPt: { x: 77.42838197, y: 27.76129856 },
      endPt: { x: 79.52583777, y: 28.68542648 },
    },
    {
      startPt: { x: 77.21659193, y: 32.91338788 },
      endPt: { x: 77.86723248, y: 30.49841054 },
    },
    {
      startPt: { x: 77.86723248, y: 30.49841054 },
      endPt: { x: 79.50917255, y: 32.8359966 },
    },
    {
      startPt: { x: 87.35257794, y: 15.45702132 },
      endPt: { x: 85.4768, y: 16.22198333 },
    },
    {
      startPt: { x: 85.4768, y: 16.22198333 },
      endPt: { x: 86.4898, y: 14.1405 },
    },
    {
      startPt: { x: 86.4898, y: 14.1405 },
      endPt: { x: 87.35257794, y: 15.45702132 },
    },
    { startPt: { x: 86.4898, y: 14.1405 }, endPt: { x: 88.0878, y: 14.1405 } },
    {
      startPt: { x: 92.47336932, y: 24.38134591 },
      endPt: { x: 93.62375144, y: 26.47590712 },
    },
    {
      startPt: { x: 93.62375144, y: 26.47590712 },
      endPt: { x: 95.8113, y: 26.6294 },
    },
    {
      startPt: { x: 93.62375144, y: 26.47590712 },
      endPt: { x: 94.79038333, y: 24.54791667 },
    },
    {
      startPt: { x: 94.79038333, y: 24.54791667 },
      endPt: { x: 95.8113, y: 26.6294 },
    },
    {
      startPt: { x: 77.86723248, y: 30.49841054 },
      endPt: { x: 75.3515, y: 31.7258 },
    },
    { startPt: { x: 75.3515, y: 31.7258 }, endPt: { x: 75.3515, y: 29.06155 } },
    {
      startPt: { x: 90.70671667, y: 16.22198333 },
      endPt: { x: 88.08510877, y: 17.41277302 },
    },
    {
      startPt: { x: 88.08510877, y: 17.41277302 },
      endPt: { x: 88.78496772, y: 15.42270915 },
    },
    {
      startPt: { x: 89.154587, y: 19.1547223 },
      endPt: { x: 88.08510877, y: 17.41277302 },
    },
    {
      startPt: { x: 77.95820261, y: 35.1491453 },
      endPt: { x: 75.3515, y: 37.0543 },
    },
    { startPt: { x: 75.3515, y: 37.0543 }, endPt: { x: 75.3515, y: 34.39005 } },
    { startPt: { x: 77.74845, y: 37.0543 }, endPt: { x: 75.3515, y: 37.0543 } },
    {
      startPt: { x: 78.17342983, y: 25.40412301 },
      endPt: { x: 80.3357, y: 23.92646667 },
    },
    {
      startPt: { x: 80.3357, y: 23.92646667 },
      endPt: { x: 80.3357, y: 26.6294 },
    },
    {
      startPt: { x: 77.82684963, y: 17.12077917 },
      endPt: { x: 77.83843437, y: 14.60335579 },
    },
    {
      startPt: { x: 77.8353797, y: 12.38727227 },
      endPt: { x: 80.3357, y: 13.11473333 },
    },
    {
      startPt: { x: 85.4768, y: 16.22198333 },
      endPt: { x: 88.08510877, y: 17.41277302 },
    },
    {
      startPt: { x: 88.08510877, y: 17.41277302 },
      endPt: { x: 87.04319368, y: 19.11953918 },
    },
    {
      startPt: { x: 87.35257794, y: 15.45702132 },
      endPt: { x: 88.08510877, y: 17.41277302 },
    },
    {
      startPt: { x: 77.83843437, y: 14.60335579 },
      endPt: { x: 75.3515, y: 15.7403 },
    },
    { startPt: { x: 75.3515, y: 15.7403 }, endPt: { x: 75.3515, y: 13.07605 } },
    {
      startPt: { x: 92.47336932, y: 24.38134591 },
      endPt: { x: 91.46651724, y: 22.26577299 },
    },
    {
      startPt: { x: 83.1095125, y: 30.6053125 },
      endPt: { x: 80.6146172, y: 30.6928486 },
    },
    {
      startPt: { x: 80.6146172, y: 30.6928486 },
      endPt: { x: 79.50917255, y: 32.8359966 },
    },
    {
      startPt: { x: 98.04422622, y: 25.40265452 },
      endPt: { x: 100.8621, y: 26.3973 },
    },
    {
      startPt: { x: 97.19018389, y: 27.04786238 },
      endPt: { x: 95.8874, y: 26.6294 },
    },
    {
      startPt: { x: 88.08846046, y: 19.61309278 },
      endPt: { x: 88.08510877, y: 17.41277302 },
    },
    {
      startPt: { x: 89.154587, y: 19.1547223 },
      endPt: { x: 88.08846046, y: 19.61309278 },
    },
    {
      startPt: { x: 77.82684963, y: 22.4879625 },
      endPt: { x: 77.82684963, y: 19.80437083 },
    },
    {
      startPt: { x: 80.3357, y: 21.22353333 },
      endPt: { x: 77.82684963, y: 22.4879625 },
    },
    {
      startPt: { x: 85.92111536, y: 20.39422434 },
      endPt: { x: 88.0497, y: 19.857 },
    },
    {
      startPt: { x: 88.0497, y: 19.857 },
      endPt: { x: 87.0616625, y: 22.0066625 },
    },
    {
      startPt: { x: 87.0616625, y: 22.0066625 },
      endPt: { x: 85.92111536, y: 20.39422434 },
    },
    {
      startPt: { x: 87.04319368, y: 19.11953918 },
      endPt: { x: 88.0497, y: 19.857 },
    },
    {
      startPt: { x: 98.97462133, y: 32.89330623 },
      endPt: { x: 98.29132233, y: 30.45133794 },
    },
    {
      startPt: { x: 85.92111536, y: 20.39422434 },
      endPt: { x: 84.72644943, y: 22.26440179 },
    },
    {
      startPt: { x: 98.04422622, y: 25.40265452 },
      endPt: { x: 100.8621, y: 23.73305 },
    },
    {
      startPt: { x: 100.8621, y: 23.73305 },
      endPt: { x: 100.8621, y: 26.3973 },
    },
    {
      startPt: { x: 80.4118, y: 26.6294 },
      endPt: { x: 81.4248, y: 24.54791667 },
    },
    {
      startPt: { x: 81.4248, y: 24.54791667 },
      endPt: { x: 81.71354734, y: 26.81264628 },
    },
    {
      startPt: { x: 81.71354734, y: 26.81264628 },
      endPt: { x: 80.4118, y: 26.6294 },
    },
    {
      startPt: { x: 80.3357, y: 21.22353333 },
      endPt: { x: 80.3357, y: 23.92646667 },
    },
    {
      startPt: { x: 80.3357, y: 23.92646667 },
      endPt: { x: 77.82684963, y: 22.4879625 },
    },
    {
      startPt: { x: 83.1095125, y: 30.6053125 },
      endPt: { x: 82.121475, y: 32.754975 },
    },
    {
      startPt: { x: 82.121475, y: 32.754975 },
      endPt: { x: 80.6146172, y: 30.6928486 },
    },
    {
      startPt: { x: 98.37991616, y: 14.60270732 },
      endPt: { x: 100.8621, y: 13.07605 },
    },
    {
      startPt: { x: 100.8621, y: 13.07605 },
      endPt: { x: 100.8621, y: 15.7403 },
    },
    {
      startPt: { x: 98.38296631, y: 12.38631268 },
      endPt: { x: 100.8621, y: 13.07605 },
    },
    {
      startPt: { x: 91.46651724, y: 22.26577299 },
      endPt: { x: 90.25462369, y: 20.39589336 },
    },
    {
      startPt: { x: 98.37991616, y: 14.60270732 },
      endPt: { x: 95.8874, y: 15.81766667 },
    },
    {
      startPt: { x: 95.8874, y: 15.81766667 },
      endPt: { x: 95.8874, y: 13.11473333 },
    },
    {
      startPt: { x: 96.60133872, y: 28.58376634 },
      endPt: { x: 95.54680349, y: 30.36695933 },
    },
    {
      startPt: { x: 94.84857709, y: 27.62252151 },
      endPt: { x: 96.60133872, y: 28.58376634 },
    },
    {
      startPt: { x: 88.08846046, y: 19.61309278 },
      endPt: { x: 88.1258, y: 19.857 },
    },
    { startPt: { x: 88.1258, y: 19.857 }, endPt: { x: 88.08775, y: 19.857 } },
    {
      startPt: { x: 80.37811335, y: 27.00963712 },
      endPt: { x: 81.58618679, y: 28.72788903 },
    },
    {
      startPt: { x: 79.52583777, y: 28.68542648 },
      endPt: { x: 80.37811335, y: 27.00963712 },
    },
    {
      startPt: { x: 80.37811335, y: 27.00963712 },
      endPt: { x: 81.71354734, y: 26.81264628 },
    },
    {
      startPt: { x: 87.04319368, y: 19.11953918 },
      endPt: { x: 88.08846046, y: 19.61309278 },
    },
    {
      startPt: { x: 80.37811335, y: 27.00963712 },
      endPt: { x: 80.3357, y: 26.6294 },
    },
    { startPt: { x: 80.3357, y: 26.6294 }, endPt: { x: 80.37375, y: 26.6294 } },
    {
      startPt: { x: 79.15204702, y: 27.05004419 },
      endPt: { x: 79.52583777, y: 28.68542648 },
    },
    {
      startPt: { x: 95.85993013, y: 27.13319515 },
      endPt: { x: 96.60133872, y: 28.58376634 },
    },
    {
      startPt: { x: 97.19018389, y: 27.04786238 },
      endPt: { x: 95.85993013, y: 27.13319515 },
    },
    {
      startPt: { x: 97.19018389, y: 27.04786238 },
      endPt: { x: 96.60133872, y: 28.58376634 },
    },
    {
      startPt: { x: 79.15204702, y: 27.05004419 },
      endPt: { x: 80.37811335, y: 27.00963712 },
    },
    {
      startPt: { x: 98.37475, y: 10.4118 },
      endPt: { x: 100.8621, y: 10.4118 },
    },
    {
      startPt: { x: 100.8621, y: 10.4118 },
      endPt: { x: 98.38296631, y: 12.38631268 },
    },
    {
      startPt: { x: 100.8621, y: 10.4118 },
      endPt: { x: 100.8621, y: 13.07605 },
    },
    { startPt: { x: 77.8436, y: 10.4118 }, endPt: { x: 80.3357, y: 10.4118 } },
    {
      startPt: { x: 80.3357, y: 10.4118 },
      endPt: { x: 77.8353797, y: 12.38727227 },
    },
    {
      startPt: { x: 80.3357, y: 10.4118 },
      endPt: { x: 80.3357, y: 13.11473333 },
    },
  ],
  eCharacterLines: [
    {
      startPt: { x: 119.2108944, y: 27.07712466 },
      endPt: { x: 121.807, y: 27.39035 },
    },
    {
      startPt: { x: 121.807, y: 27.39035 },
      endPt: { x: 119.8286, y: 29.3688 },
    },
    {
      startPt: { x: 119.8286, y: 29.3688 },
      endPt: { x: 119.2108944, y: 27.07712466 },
    },
    {
      startPt: { x: 120.6852836, y: 25.64687755 },
      endPt: { x: 123.7854, y: 25.4119 },
    },
    {
      startPt: { x: 123.7854, y: 25.4119 },
      endPt: { x: 121.807, y: 27.39035 },
    },
    {
      startPt: { x: 121.807, y: 27.39035 },
      endPt: { x: 120.6852836, y: 25.64687755 },
    },
    {
      startPt: { x: 113.467859, y: 27.68155551 },
      endPt: { x: 114.4877, y: 29.3688 },
    },
    {
      startPt: { x: 114.4877, y: 29.3688 },
      endPt: { x: 111.81725, y: 29.3688 },
    },
    {
      startPt: { x: 111.81725, y: 29.3688 },
      endPt: { x: 113.467859, y: 27.68155551 },
    },
    {
      startPt: { x: 119.2108944, y: 27.07712466 },
      endPt: { x: 120.6852836, y: 25.64687755 },
    },
    {
      startPt: { x: 113.1321734, y: 12.47847685 },
      endPt: { x: 111.7982, y: 10.4118 },
    },
    {
      startPt: { x: 111.7982, y: 10.4118 },
      endPt: { x: 114.5257, y: 10.4118 },
    },
    {
      startPt: { x: 114.5257, y: 10.4118 },
      endPt: { x: 113.1321734, y: 12.47847685 },
    },
    {
      startPt: { x: 109.0338833, y: 23.76339188 },
      endPt: { x: 107.6496706, y: 22.83446102 },
    },
    {
      startPt: { x: 107.6496706, y: 22.83446102 },
      endPt: { x: 109.1657736, y: 22.53057245 },
    },
    {
      startPt: { x: 109.1657736, y: 22.53057245 },
      endPt: { x: 109.0338833, y: 23.76339188 },
    },
    {
      startPt: { x: 111.4586523, y: 19.99992273 },
      endPt: { x: 113.634, y: 18.221 },
    },
    {
      startPt: { x: 113.634, y: 18.221 },
      endPt: { x: 113.0878667, y: 21.7213 },
    },
    {
      startPt: { x: 113.0878667, y: 21.7213 },
      endPt: { x: 111.4586523, y: 19.99992273 },
    },
    {
      startPt: { x: 111.8253613, y: 27.01983838 },
      endPt: { x: 110.0596662, y: 27.23386077 },
    },
    {
      startPt: { x: 110.0596662, y: 27.23386077 },
      endPt: { x: 111.5438, y: 25.2597 },
    },
    {
      startPt: { x: 111.5438, y: 25.2597 },
      endPt: { x: 111.8253613, y: 27.01983838 },
    },
    {
      startPt: { x: 110.0596662, y: 27.23386077 },
      endPt: { x: 111.81725, y: 29.3688 },
    },
    {
      startPt: { x: 111.81725, y: 29.3688 },
      endPt: { x: 109.1468, y: 29.3688 },
    },
    {
      startPt: { x: 109.1468, y: 29.3688 },
      endPt: { x: 110.0596662, y: 27.23386077 },
    },
    {
      startPt: { x: 120.5412868, y: 13.66416801 },
      endPt: { x: 119.6209924, y: 15.91443576 },
    },
    {
      startPt: { x: 119.6209924, y: 15.91443576 },
      endPt: { x: 119.1054614, y: 14.39297052 },
    },
    {
      startPt: { x: 119.1054614, y: 14.39297052 },
      endPt: { x: 120.5412868, y: 13.66416801 },
    },
    {
      startPt: { x: 121.0630111, y: 23.85875432 },
      endPt: { x: 119.332845, y: 25.04960931 },
    },
    {
      startPt: { x: 119.332845, y: 25.04960931 },
      endPt: { x: 118.7632, y: 23.9281 },
    },
    {
      startPt: { x: 118.7632, y: 23.9281 },
      endPt: { x: 121.0630111, y: 23.85875432 },
    },
    {
      startPt: { x: 115.9255333, y: 21.7213 },
      endPt: { x: 113.0878667, y: 21.7213 },
    },
    {
      startPt: { x: 113.634, y: 18.221 },
      endPt: { x: 115.9255333, y: 21.7213 },
    },
    {
      startPt: { x: 119.1054614, y: 14.39297052 },
      endPt: { x: 118.8013, y: 15.7004 },
    },
    {
      startPt: { x: 118.8013, y: 15.7004 },
      endPt: { x: 118.2306, y: 15.11065 },
    },
    {
      startPt: { x: 118.2306, y: 15.11065 },
      endPt: { x: 119.1054614, y: 14.39297052 },
    },
    {
      startPt: { x: 121.86405, y: 12.3142 },
      endPt: { x: 120.5412868, y: 13.66416801 },
    },
    {
      startPt: { x: 120.5412868, y: 13.66416801 },
      endPt: { x: 119.9807, y: 10.4118 },
    },
    {
      startPt: { x: 119.9807, y: 10.4118 },
      endPt: { x: 121.86405, y: 12.3142 },
    },
    {
      startPt: { x: 117.0178, y: 18.221 },
      endPt: { x: 115.9255333, y: 21.7213 },
    },
    { startPt: { x: 113.634, y: 18.221 }, endPt: { x: 117.0178, y: 18.221 } },
    {
      startPt: { x: 113.1321734, y: 12.47847685 },
      endPt: { x: 114.5638, y: 14.5209 },
    },
    {
      startPt: { x: 114.5638, y: 14.5209 },
      endPt: { x: 111.4677, y: 14.5209 },
    },
    {
      startPt: { x: 111.4677, y: 14.5209 },
      endPt: { x: 113.1321734, y: 12.47847685 },
    },
    {
      startPt: { x: 115.2657606, y: 27.20408158 },
      endPt: { x: 113.5190667, y: 25.2597 },
    },
    {
      startPt: { x: 113.5190667, y: 25.2597 },
      endPt: { x: 115.4943333, y: 25.2597 },
    },
    {
      startPt: { x: 115.4943333, y: 25.2597 },
      endPt: { x: 115.2657606, y: 27.20408158 },
    },
    {
      startPt: { x: 109.5124799, y: 19.80128656 },
      endPt: { x: 110.2502, y: 18.221 },
    },
    {
      startPt: { x: 110.2502, y: 18.221 },
      endPt: { x: 111.4586523, y: 19.99992273 },
    },
    {
      startPt: { x: 111.4586523, y: 19.99992273 },
      endPt: { x: 109.5124799, y: 19.80128656 },
    },
    {
      startPt: { x: 118.2306, y: 15.11065 },
      endPt: { x: 117.6599, y: 14.5209 },
    },
    {
      startPt: { x: 117.6599, y: 14.5209 },
      endPt: { x: 119.1054614, y: 14.39297052 },
    },
    {
      startPt: { x: 115.9458145, y: 12.47769843 },
      endPt: { x: 117.6599, y: 14.5209 },
    },
    {
      startPt: { x: 117.6599, y: 14.5209 },
      endPt: { x: 114.5638, y: 14.5209 },
    },
    {
      startPt: { x: 114.5638, y: 14.5209 },
      endPt: { x: 115.9458145, y: 12.47769843 },
    },
    {
      startPt: { x: 119.6209924, y: 15.91443576 },
      endPt: { x: 118.8013, y: 16.6991 },
    },
    {
      startPt: { x: 118.8013, y: 16.6991 },
      endPt: { x: 118.8013, y: 16.19975 },
    },
    {
      startPt: { x: 118.8013, y: 16.19975 },
      endPt: { x: 119.6209924, y: 15.91443576 },
    },
    {
      startPt: { x: 122.2532775, y: 15.18959795 },
      endPt: { x: 121.86405, y: 12.3142 },
    },
    {
      startPt: { x: 121.86405, y: 12.3142 },
      endPt: { x: 123.7474, y: 14.2166 },
    },
    {
      startPt: { x: 123.7474, y: 14.2166 },
      endPt: { x: 122.2532775, y: 15.18959795 },
    },
    {
      startPt: { x: 119.332845, y: 25.04960931 },
      endPt: { x: 118.332, y: 24.37196667 },
    },
    {
      startPt: { x: 118.332, y: 24.37196667 },
      endPt: { x: 118.7632, y: 23.9281 },
    },
    {
      startPt: { x: 111.4677, y: 14.5209 },
      endPt: { x: 110.1440492, y: 12.6008075 },
    },
    {
      startPt: { x: 110.1440492, y: 12.6008075 },
      endPt: { x: 113.1321734, y: 12.47847685 },
    },
    {
      startPt: { x: 109.0146865, y: 15.87428178 },
      endPt: { x: 110.2502, y: 15.7765 },
    },
    {
      startPt: { x: 110.2502, y: 15.7765 },
      endPt: { x: 110.2502, y: 16.99875 },
    },
    {
      startPt: { x: 110.2502, y: 16.99875 },
      endPt: { x: 109.0146865, y: 15.87428178 },
    },
    {
      startPt: { x: 117.1853081, y: 26.74006979 },
      endPt: { x: 117.4696, y: 25.2597 },
    },
    {
      startPt: { x: 117.4696, y: 25.2597 },
      endPt: { x: 118.3621851, y: 25.5816443 },
    },
    {
      startPt: { x: 118.3621851, y: 25.5816443 },
      endPt: { x: 117.1853081, y: 26.74006979 },
    },
    {
      startPt: { x: 119.6209924, y: 15.91443576 },
      endPt: { x: 118.8013, y: 15.7004 },
    },
    { startPt: { x: 117.0178, y: 18.221 }, endPt: { x: 118.7632, y: 21.7213 } },
    {
      startPt: { x: 118.7632, y: 21.7213 },
      endPt: { x: 115.9255333, y: 21.7213 },
    },
    {
      startPt: { x: 108.0201816, y: 17.91835439 },
      endPt: { x: 105.228, y: 19.85225 },
    },
    {
      startPt: { x: 105.228, y: 19.85225 },
      endPt: { x: 105.228, y: 17.072425 },
    },
    {
      startPt: { x: 105.228, y: 17.072425 },
      endPt: { x: 108.0201816, y: 17.91835439 },
    },
    {
      startPt: { x: 110.1440492, y: 12.6008075 },
      endPt: { x: 109.0707, y: 10.4118 },
    },
    {
      startPt: { x: 109.0707, y: 10.4118 },
      endPt: { x: 111.7982, y: 10.4118 },
    },
    {
      startPt: { x: 111.7982, y: 10.4118 },
      endPt: { x: 110.1440492, y: 12.6008075 },
    },
    {
      startPt: { x: 110.1440492, y: 12.6008075 },
      endPt: { x: 107.14935, y: 12.3522 },
    },
    {
      startPt: { x: 107.14935, y: 12.3522 },
      endPt: { x: 109.0707, y: 10.4118 },
    },
    {
      startPt: { x: 119.6209924, y: 15.91443576 },
      endPt: { x: 121.27435, y: 16.6991 },
    },
    {
      startPt: { x: 121.27435, y: 16.6991 },
      endPt: { x: 118.8013, y: 16.6991 },
    },
    {
      startPt: { x: 119.8286, y: 29.3688 },
      endPt: { x: 117.15815, y: 29.3688 },
    },
    {
      startPt: { x: 117.15815, y: 29.3688 },
      endPt: { x: 119.2108944, y: 27.07712466 },
    },
    {
      startPt: { x: 117.4696, y: 25.2597 },
      endPt: { x: 117.9008, y: 24.81583333 },
    },
    {
      startPt: { x: 117.9008, y: 24.81583333 },
      endPt: { x: 118.3621851, y: 25.5816443 },
    },
    {
      startPt: { x: 111.4586523, y: 19.99992273 },
      endPt: { x: 110.2502, y: 21.7213 },
    },
    {
      startPt: { x: 110.2502, y: 21.7213 },
      endPt: { x: 109.5124799, y: 19.80128656 },
    },
    {
      startPt: { x: 109.1657736, y: 22.53057245 },
      endPt: { x: 110.2502, y: 22.4569 },
    },
    {
      startPt: { x: 110.2502, y: 22.4569 },
      endPt: { x: 110.2502, y: 23.1925 },
    },
    {
      startPt: { x: 110.2502, y: 23.1925 },
      endPt: { x: 109.1657736, y: 22.53057245 },
    },
    {
      startPt: { x: 107.8163575, y: 20.93267272 },
      endPt: { x: 105.228, y: 22.632075 },
    },
    {
      startPt: { x: 105.228, y: 22.632075 },
      endPt: { x: 105.228, y: 19.85225 },
    },
    {
      startPt: { x: 105.228, y: 19.85225 },
      endPt: { x: 107.8163575, y: 20.93267272 },
    },
    {
      startPt: { x: 110.2502, y: 21.7213 },
      endPt: { x: 107.8163575, y: 20.93267272 },
    },
    {
      startPt: { x: 107.8163575, y: 20.93267272 },
      endPt: { x: 109.5124799, y: 19.80128656 },
    },
    {
      startPt: { x: 109.1468, y: 29.3688 },
      endPt: { x: 107.1874, y: 27.39035 },
    },
    {
      startPt: { x: 107.1874, y: 27.39035 },
      endPt: { x: 110.0596662, y: 27.23386077 },
    },
    {
      startPt: { x: 109.1988966, y: 25.3995607 },
      endPt: { x: 110.2502, y: 23.9281 },
    },
    {
      startPt: { x: 110.2502, y: 23.9281 },
      endPt: { x: 111.5438, y: 25.2597 },
    },
    {
      startPt: { x: 111.5438, y: 25.2597 },
      endPt: { x: 109.1988966, y: 25.3995607 },
    },
    {
      startPt: { x: 108.0201816, y: 17.91835439 },
      endPt: { x: 107.8163575, y: 20.93267272 },
    },
    {
      startPt: { x: 108.0201816, y: 17.91835439 },
      endPt: { x: 110.2502, y: 16.99875 },
    },
    {
      startPt: { x: 110.2502, y: 16.99875 },
      endPt: { x: 110.2502, y: 18.221 },
    },
    {
      startPt: { x: 110.2502, y: 18.221 },
      endPt: { x: 108.0201816, y: 17.91835439 },
    },
    { startPt: { x: 117.0178, y: 18.221 }, endPt: { x: 120.4016, y: 18.221 } },
    { startPt: { x: 120.4016, y: 18.221 }, endPt: { x: 118.7632, y: 21.7213 } },
    {
      startPt: { x: 111.8253613, y: 27.01983838 },
      endPt: { x: 113.467859, y: 27.68155551 },
    },
    {
      startPt: { x: 111.81725, y: 29.3688 },
      endPt: { x: 111.8253613, y: 27.01983838 },
    },
    {
      startPt: { x: 107.1778313, y: 24.62356989 },
      endPt: { x: 105.228, y: 25.4119 },
    },
    {
      startPt: { x: 105.228, y: 25.4119 },
      endPt: { x: 105.228, y: 22.632075 },
    },
    {
      startPt: { x: 105.228, y: 22.632075 },
      endPt: { x: 107.1778313, y: 24.62356989 },
    },
    {
      startPt: { x: 121.2652627, y: 21.25713431 },
      endPt: { x: 121.0630111, y: 23.85875432 },
    },
    {
      startPt: { x: 121.0630111, y: 23.85875432 },
      endPt: { x: 118.7632, y: 21.7213 },
    },
    {
      startPt: { x: 118.7632, y: 21.7213 },
      endPt: { x: 121.2652627, y: 21.25713431 },
    },
    {
      startPt: { x: 120.4016, y: 18.221 },
      endPt: { x: 121.2652627, y: 21.25713431 },
    },
    {
      startPt: { x: 107.1090334, y: 15.2801697 },
      endPt: { x: 105.228, y: 14.2926 },
    },
    {
      startPt: { x: 105.228, y: 14.2926 },
      endPt: { x: 107.14935, y: 12.3522 },
    },
    {
      startPt: { x: 107.14935, y: 12.3522 },
      endPt: { x: 107.1090334, y: 15.2801697 },
    },
    {
      startPt: { x: 108.7416224, y: 13.99885661 },
      endPt: { x: 107.1090334, y: 15.2801697 },
    },
    {
      startPt: { x: 107.14935, y: 12.3522 },
      endPt: { x: 108.7416224, y: 13.99885661 },
    },
    {
      startPt: { x: 115.2657606, y: 27.20408158 },
      endPt: { x: 117.15815, y: 29.3688 },
    },
    {
      startPt: { x: 117.15815, y: 29.3688 },
      endPt: { x: 114.4877, y: 29.3688 },
    },
    {
      startPt: { x: 114.4877, y: 29.3688 },
      endPt: { x: 115.2657606, y: 27.20408158 },
    },
    {
      startPt: { x: 122.2532775, y: 15.18959795 },
      endPt: { x: 120.5412868, y: 13.66416801 },
    },
    {
      startPt: { x: 123.7474, y: 14.2166 },
      endPt: { x: 123.7474, y: 15.45785 },
    },
    {
      startPt: { x: 123.7474, y: 15.45785 },
      endPt: { x: 122.2532775, y: 15.18959795 },
    },
    {
      startPt: { x: 109.0338833, y: 23.76339188 },
      endPt: { x: 107.1778313, y: 24.62356989 },
    },
    {
      startPt: { x: 107.1778313, y: 24.62356989 },
      endPt: { x: 107.6496706, y: 22.83446102 },
    },
    {
      startPt: { x: 107.1778313, y: 24.62356989 },
      endPt: { x: 107.1874, y: 27.39035 },
    },
    {
      startPt: { x: 107.1874, y: 27.39035 },
      endPt: { x: 105.228, y: 25.4119 },
    },
    {
      startPt: { x: 122.2532775, y: 15.18959795 },
      endPt: { x: 123.7474, y: 16.6991 },
    },
    {
      startPt: { x: 123.7474, y: 16.6991 },
      endPt: { x: 121.27435, y: 16.6991 },
    },
    {
      startPt: { x: 121.27435, y: 16.6991 },
      endPt: { x: 122.2532775, y: 15.18959795 },
    },
    {
      startPt: { x: 123.7474, y: 15.45785 },
      endPt: { x: 123.7474, y: 16.6991 },
    },
    {
      startPt: { x: 117.1853081, y: 26.74006979 },
      endPt: { x: 115.2657606, y: 27.20408158 },
    },
    {
      startPt: { x: 115.4943333, y: 25.2597 },
      endPt: { x: 117.1853081, y: 26.74006979 },
    },
    {
      startPt: { x: 120.6852836, y: 25.64687755 },
      endPt: { x: 121.0630111, y: 23.85875432 },
    },
    {
      startPt: { x: 121.0630111, y: 23.85875432 },
      endPt: { x: 123.7854, y: 25.4119 },
    },
    {
      startPt: { x: 120.6852836, y: 25.64687755 },
      endPt: { x: 119.332845, y: 25.04960931 },
    },
    {
      startPt: { x: 121.0630111, y: 23.85875432 },
      endPt: { x: 123.7854, y: 21.81645 },
    },
    {
      startPt: { x: 123.7854, y: 21.81645 },
      endPt: { x: 123.7854, y: 25.4119 },
    },
    {
      startPt: { x: 115.9458145, y: 12.47769843 },
      endPt: { x: 114.5257, y: 10.4118 },
    },
    {
      startPt: { x: 114.5257, y: 10.4118 },
      endPt: { x: 117.2532, y: 10.4118 },
    },
    {
      startPt: { x: 117.2532, y: 10.4118 },
      endPt: { x: 115.9458145, y: 12.47769843 },
    },
    {
      startPt: { x: 113.467859, y: 27.68155551 },
      endPt: { x: 113.5190667, y: 25.2597 },
    },
    {
      startPt: { x: 115.2657606, y: 27.20408158 },
      endPt: { x: 113.467859, y: 27.68155551 },
    },
    { startPt: { x: 110.2502, y: 18.221 }, endPt: { x: 113.634, y: 18.221 } },
    {
      startPt: { x: 113.0878667, y: 21.7213 },
      endPt: { x: 110.2502, y: 21.7213 },
    },
    {
      startPt: { x: 110.2502, y: 23.9281 },
      endPt: { x: 109.0338833, y: 23.76339188 },
    },
    {
      startPt: { x: 109.0338833, y: 23.76339188 },
      endPt: { x: 110.2502, y: 23.1925 },
    },
    {
      startPt: { x: 110.2502, y: 23.1925 },
      endPt: { x: 110.2502, y: 23.9281 },
    },
    {
      startPt: { x: 107.6496706, y: 22.83446102 },
      endPt: { x: 107.8163575, y: 20.93267272 },
    },
    {
      startPt: { x: 107.8163575, y: 20.93267272 },
      endPt: { x: 109.1657736, y: 22.53057245 },
    },
    {
      startPt: { x: 110.0422638, y: 14.44949788 },
      endPt: { x: 110.85895, y: 15.1487 },
    },
    {
      startPt: { x: 110.85895, y: 15.1487 },
      endPt: { x: 110.2502, y: 15.7765 },
    },
    {
      startPt: { x: 110.2502, y: 15.7765 },
      endPt: { x: 110.0422638, y: 14.44949788 },
    },
    {
      startPt: { x: 107.1090334, y: 15.2801697 },
      endPt: { x: 108.0201816, y: 17.91835439 },
    },
    {
      startPt: { x: 105.228, y: 17.072425 },
      endPt: { x: 107.1090334, y: 15.2801697 },
    },
    {
      startPt: { x: 110.0596662, y: 27.23386077 },
      endPt: { x: 109.1988966, y: 25.3995607 },
    },
    {
      startPt: { x: 109.0338833, y: 23.76339188 },
      endPt: { x: 109.1988966, y: 25.3995607 },
    },
    {
      startPt: { x: 109.1988966, y: 25.3995607 },
      endPt: { x: 107.1778313, y: 24.62356989 },
    },
    {
      startPt: { x: 118.7632, y: 23.9281 },
      endPt: { x: 118.7632, y: 21.7213 },
    },
    {
      startPt: { x: 121.2652627, y: 21.25713431 },
      endPt: { x: 123.7854, y: 21.81645 },
    },
    {
      startPt: { x: 118.5389903, y: 12.59729617 },
      endPt: { x: 117.2532, y: 10.4118 },
    },
    {
      startPt: { x: 117.2532, y: 10.4118 },
      endPt: { x: 119.9807, y: 10.4118 },
    },
    {
      startPt: { x: 119.9807, y: 10.4118 },
      endPt: { x: 118.5389903, y: 12.59729617 },
    },
    {
      startPt: { x: 122.2532775, y: 15.18959795 },
      endPt: { x: 119.6209924, y: 15.91443576 },
    },
    {
      startPt: { x: 118.5389903, y: 12.59729617 },
      endPt: { x: 115.9458145, y: 12.47769843 },
    },
    {
      startPt: { x: 115.9458145, y: 12.47769843 },
      endPt: { x: 113.1321734, y: 12.47847685 },
    },
    {
      startPt: { x: 109.1657736, y: 22.53057245 },
      endPt: { x: 110.2502, y: 21.7213 },
    },
    {
      startPt: { x: 110.2502, y: 21.7213 },
      endPt: { x: 110.2502, y: 22.4569 },
    },
    {
      startPt: { x: 105.228, y: 17.072425 },
      endPt: { x: 105.228, y: 14.2926 },
    },
    {
      startPt: { x: 109.0146865, y: 15.87428178 },
      endPt: { x: 108.0201816, y: 17.91835439 },
    },
    {
      startPt: { x: 107.1090334, y: 15.2801697 },
      endPt: { x: 109.0146865, y: 15.87428178 },
    },
    {
      startPt: { x: 110.1440492, y: 12.6008075 },
      endPt: { x: 108.7416224, y: 13.99885661 },
    },
    {
      startPt: { x: 110.1440492, y: 12.6008075 },
      endPt: { x: 110.0422638, y: 14.44949788 },
    },
    {
      startPt: { x: 110.0422638, y: 14.44949788 },
      endPt: { x: 108.7416224, y: 13.99885661 },
    },
    {
      startPt: { x: 117.9008, y: 24.81583333 },
      endPt: { x: 118.332, y: 24.37196667 },
    },
    {
      startPt: { x: 118.332, y: 24.37196667 },
      endPt: { x: 118.3621851, y: 25.5816443 },
    },
    {
      startPt: { x: 119.332845, y: 25.04960931 },
      endPt: { x: 118.3621851, y: 25.5816443 },
    },
    {
      startPt: { x: 110.0422638, y: 14.44949788 },
      endPt: { x: 111.4677, y: 14.5209 },
    },
    {
      startPt: { x: 111.4677, y: 14.5209 },
      endPt: { x: 110.85895, y: 15.1487 },
    },
    {
      startPt: { x: 118.3621851, y: 25.5816443 },
      endPt: { x: 119.2108944, y: 27.07712466 },
    },
    {
      startPt: { x: 119.2108944, y: 27.07712466 },
      endPt: { x: 117.1853081, y: 26.74006979 },
    },
    {
      startPt: { x: 115.4943333, y: 25.2597 },
      endPt: { x: 117.4696, y: 25.2597 },
    },
    {
      startPt: { x: 119.2108944, y: 27.07712466 },
      endPt: { x: 119.332845, y: 25.04960931 },
    },
    {
      startPt: { x: 117.1853081, y: 26.74006979 },
      endPt: { x: 117.15815, y: 29.3688 },
    },
    {
      startPt: { x: 108.0201816, y: 17.91835439 },
      endPt: { x: 109.5124799, y: 19.80128656 },
    },
    {
      startPt: { x: 107.6496706, y: 22.83446102 },
      endPt: { x: 105.228, y: 22.632075 },
    },
    {
      startPt: { x: 108.7416224, y: 13.99885661 },
      endPt: { x: 109.0146865, y: 15.87428178 },
    },
    {
      startPt: { x: 109.0146865, y: 15.87428178 },
      endPt: { x: 110.0422638, y: 14.44949788 },
    },
    {
      startPt: { x: 118.5389903, y: 12.59729617 },
      endPt: { x: 117.6599, y: 14.5209 },
    },
    {
      startPt: { x: 118.5389903, y: 12.59729617 },
      endPt: { x: 119.1054614, y: 14.39297052 },
    },
    {
      startPt: { x: 118.8013, y: 16.19975 },
      endPt: { x: 118.8013, y: 15.7004 },
    },
    {
      startPt: { x: 109.1988966, y: 25.3995607 },
      endPt: { x: 107.1874, y: 27.39035 },
    },
    {
      startPt: { x: 121.2652627, y: 21.25713431 },
      endPt: { x: 123.7854, y: 18.221 },
    },
    {
      startPt: { x: 123.7854, y: 18.221 },
      endPt: { x: 123.7854, y: 21.81645 },
    },
    { startPt: { x: 120.4016, y: 18.221 }, endPt: { x: 123.7854, y: 18.221 } },
    {
      startPt: { x: 118.5389903, y: 12.59729617 },
      endPt: { x: 120.5412868, y: 13.66416801 },
    },
    {
      startPt: { x: 111.5438, y: 25.2597 },
      endPt: { x: 113.5190667, y: 25.2597 },
    },
    {
      startPt: { x: 113.5190667, y: 25.2597 },
      endPt: { x: 111.8253613, y: 27.01983838 },
    },
  ],
  hCharacterLines: [
    {
      startPt: { x: 150.5080414, y: 22.64064 },
      endPt: { x: 148.1546, y: 21.28188 },
    },
    {
      startPt: { x: 148.1546, y: 21.28188 },
      endPt: { x: 150.6553957, y: 19.99886 },
    },
    {
      startPt: { x: 150.6553957, y: 19.99886 },
      endPt: { x: 150.5080414, y: 22.64064 },
    },
    {
      startPt: { x: 150.6356359, y: 30.7064125 },
      endPt: { x: 148.1546, y: 32.15196 },
    },
    {
      startPt: { x: 148.1546, y: 32.15196 },
      endPt: { x: 148.1546, y: 29.43444 },
    },
    {
      startPt: { x: 148.1546, y: 29.43444 },
      endPt: { x: 150.6356359, y: 30.7064125 },
    },
    {
      startPt: { x: 163.838564, y: 20.83319776 },
      endPt: { x: 161.3474, y: 21.54855 },
    },
    {
      startPt: { x: 161.3474, y: 21.54855 },
      endPt: { x: 161.3474, y: 19.3212 },
    },
    {
      startPt: { x: 161.3474, y: 19.3212 },
      endPt: { x: 163.838564, y: 20.83319776 },
    },
    {
      startPt: { x: 161.8397307, y: 25.4594734 },
      endPt: { x: 160.7006, y: 24.4417 },
    },
    {
      startPt: { x: 160.7006, y: 24.4417 },
      endPt: { x: 161.3474, y: 23.7759 },
    },
    {
      startPt: { x: 161.3474, y: 23.7759 },
      endPt: { x: 161.8397307, y: 25.4594734 },
    },
    {
      startPt: { x: 150.6553957, y: 19.99886 },
      endPt: { x: 153.1768, y: 18.6942 },
    },
    { startPt: { x: 153.1768, y: 18.6942 }, endPt: { x: 153.1768, y: 21.455 } },
    {
      startPt: { x: 153.1768, y: 21.455 },
      endPt: { x: 150.6553957, y: 19.99886 },
    },
    {
      startPt: { x: 163.8659998, y: 16.23631223 },
      endPt: { x: 166.3601, y: 15.32306667 },
    },
    {
      startPt: { x: 166.3601, y: 15.32306667 },
      endPt: { x: 166.3601, y: 17.7787 },
    },
    {
      startPt: { x: 166.3601, y: 17.7787 },
      endPt: { x: 163.8659998, y: 16.23631223 },
    },
    {
      startPt: { x: 163.838564, y: 20.83319776 },
      endPt: { x: 166.3601, y: 20.23433333 },
    },
    {
      startPt: { x: 166.3601, y: 20.23433333 },
      endPt: { x: 166.3601, y: 22.68996667 },
    },
    {
      startPt: { x: 166.3601, y: 22.68996667 },
      endPt: { x: 163.838564, y: 20.83319776 },
    },
    {
      startPt: { x: 163.4096172, y: 22.71751989 },
      endPt: { x: 161.3474, y: 23.7759 },
    },
    {
      startPt: { x: 161.3474, y: 23.7759 },
      endPt: { x: 161.3474, y: 21.54855 },
    },
    {
      startPt: { x: 161.3474, y: 21.54855 },
      endPt: { x: 163.4096172, y: 22.71751989 },
    },
    {
      startPt: { x: 157.141506, y: 27.11377349 },
      endPt: { x: 156.0969, y: 29.3688 },
    },
    {
      startPt: { x: 156.0969, y: 29.3688 },
      endPt: { x: 154.63685, y: 27.904 },
    },
    {
      startPt: { x: 154.63685, y: 27.904 },
      endPt: { x: 157.141506, y: 27.11377349 },
    },
    {
      startPt: { x: 154.9611031, y: 25.70819143 },
      endPt: { x: 154.63685, y: 27.904 },
    },
    {
      startPt: { x: 154.63685, y: 27.904 },
      endPt: { x: 153.1768, y: 26.4392 },
    },
    {
      startPt: { x: 153.1768, y: 26.4392 },
      endPt: { x: 154.9611031, y: 25.70819143 },
    },
    {
      startPt: { x: 150.7081353, y: 27.90348746 },
      endPt: { x: 153.1768, y: 26.4392 },
    },
    {
      startPt: { x: 153.1768, y: 26.4392 },
      endPt: { x: 153.1768, y: 29.22615 },
    },
    {
      startPt: { x: 153.1768, y: 29.22615 },
      endPt: { x: 150.7081353, y: 27.90348746 },
    },
    {
      startPt: { x: 150.4781828, y: 25.35816 },
      endPt: { x: 148.1546, y: 23.9994 },
    },
    {
      startPt: { x: 148.1546, y: 23.9994 },
      endPt: { x: 150.5080414, y: 22.64064 },
    },
    {
      startPt: { x: 150.5080414, y: 22.64064 },
      endPt: { x: 150.4781828, y: 25.35816 },
    },
    {
      startPt: { x: 153.1768, y: 26.4392 },
      endPt: { x: 152.8795869, y: 24.14781181 },
    },
    {
      startPt: { x: 152.8795869, y: 24.14781181 },
      endPt: { x: 154.9611031, y: 25.70819143 },
    },
    {
      startPt: { x: 150.6565331, y: 12.42156049 },
      endPt: { x: 150.6657, y: 10.4118 },
    },
    {
      startPt: { x: 150.6657, y: 10.4118 },
      endPt: { x: 153.1768, y: 10.4118 },
    },
    {
      startPt: { x: 153.1768, y: 10.4118 },
      endPt: { x: 150.6565331, y: 12.42156049 },
    },
    {
      startPt: { x: 163.0009002, y: 11.85044744 },
      endPt: { x: 164.717221, y: 11.8712176 },
    },
    {
      startPt: { x: 164.717221, y: 11.8712176 },
      endPt: { x: 163.8348174, y: 13.87344654 },
    },
    {
      startPt: { x: 163.8348174, y: 13.87344654 },
      endPt: { x: 163.0009002, y: 11.85044744 },
    },
    {
      startPt: { x: 150.6356359, y: 30.7064125 },
      endPt: { x: 153.1768, y: 29.22615 },
    },
    {
      startPt: { x: 153.1768, y: 29.22615 },
      endPt: { x: 153.1768, y: 32.0131 },
    },
    {
      startPt: { x: 153.1768, y: 32.0131 },
      endPt: { x: 150.6356359, y: 30.7064125 },
    },
    {
      startPt: { x: 163.8706985, y: 24.57849486 },
      endPt: { x: 166.3601, y: 25.1456 },
    },
    {
      startPt: { x: 166.3601, y: 25.1456 },
      endPt: { x: 164.25325, y: 27.2572 },
    },
    {
      startPt: { x: 164.25325, y: 27.2572 },
      endPt: { x: 163.8706985, y: 24.57849486 },
    },
    {
      startPt: { x: 153.1768, y: 10.4118 },
      endPt: { x: 153.1768, y: 13.1726 },
    },
    {
      startPt: { x: 153.1768, y: 13.1726 },
      endPt: { x: 150.6565331, y: 12.42156049 },
    },
    {
      startPt: { x: 150.6565331, y: 12.42156049 },
      endPt: { x: 150.6599264, y: 14.68558977 },
    },
    {
      startPt: { x: 150.6599264, y: 14.68558977 },
      endPt: { x: 148.1546, y: 13.12932 },
    },
    {
      startPt: { x: 148.1546, y: 13.12932 },
      endPt: { x: 150.6565331, y: 12.42156049 },
    },
    {
      startPt: { x: 161.180563, y: 27.33072035 },
      endPt: { x: 161.8397307, y: 25.4594734 },
    },
    {
      startPt: { x: 161.8397307, y: 25.4594734 },
      endPt: { x: 164.25325, y: 27.2572 },
    },
    {
      startPt: { x: 164.25325, y: 27.2572 },
      endPt: { x: 161.180563, y: 27.33072035 },
    },
    {
      startPt: { x: 161.180563, y: 27.33072035 },
      endPt: { x: 162.1464, y: 29.3688 },
    },
    {
      startPt: { x: 162.1464, y: 29.3688 },
      endPt: { x: 159.12165, y: 29.3688 },
    },
    {
      startPt: { x: 159.12165, y: 29.3688 },
      endPt: { x: 161.180563, y: 27.33072035 },
    },
    {
      startPt: { x: 150.6510119, y: 35.57005489 },
      endPt: { x: 148.1546, y: 37.587 },
    },
    {
      startPt: { x: 148.1546, y: 37.587 },
      endPt: { x: 148.1546, y: 34.86948 },
    },
    {
      startPt: { x: 148.1546, y: 34.86948 },
      endPt: { x: 150.6510119, y: 35.57005489 },
    },
    {
      startPt: { x: 164.717221, y: 11.8712176 },
      endPt: { x: 163.85375, y: 10.4118 },
    },
    {
      startPt: { x: 163.85375, y: 10.4118 },
      endPt: { x: 166.3601, y: 10.4118 },
    },
    {
      startPt: { x: 166.3601, y: 10.4118 },
      endPt: { x: 164.717221, y: 11.8712176 },
    },
    {
      startPt: { x: 157.141506, y: 27.11377349 },
      endPt: { x: 156.7818, y: 25.1075 },
    },
    {
      startPt: { x: 156.7818, y: 25.1075 },
      endPt: { x: 158.4178, y: 25.1075 },
    },
    {
      startPt: { x: 158.4178, y: 25.1075 },
      endPt: { x: 157.141506, y: 27.11377349 },
    },
    {
      startPt: { x: 150.6469592, y: 17.2597 },
      endPt: { x: 150.6599264, y: 14.68558977 },
    },
    {
      startPt: { x: 150.6599264, y: 14.68558977 },
      endPt: { x: 153.1768, y: 15.9334 },
    },
    {
      startPt: { x: 153.1768, y: 15.9334 },
      endPt: { x: 150.6469592, y: 17.2597 },
    },
    {
      startPt: { x: 164.717221, y: 11.8712176 },
      endPt: { x: 166.3601, y: 12.86743333 },
    },
    {
      startPt: { x: 166.3601, y: 12.86743333 },
      endPt: { x: 163.8348174, y: 13.87344654 },
    },
    {
      startPt: { x: 163.8659998, y: 16.23631223 },
      endPt: { x: 161.3474, y: 17.09385 },
    },
    {
      startPt: { x: 161.3474, y: 17.09385 },
      endPt: { x: 161.3474, y: 14.8665 },
    },
    {
      startPt: { x: 161.3474, y: 14.8665 },
      endPt: { x: 163.8659998, y: 16.23631223 },
    },
    {
      startPt: { x: 148.1546, y: 21.28188 },
      endPt: { x: 148.1546, y: 18.56436 },
    },
    {
      startPt: { x: 148.1546, y: 18.56436 },
      endPt: { x: 150.6553957, y: 19.99886 },
    },
    {
      startPt: { x: 153.1768, y: 21.455 },
      endPt: { x: 150.5080414, y: 22.64064 },
    },
    {
      startPt: { x: 148.1546, y: 23.9994 },
      endPt: { x: 148.1546, y: 21.28188 },
    },
    {
      startPt: { x: 166.3601, y: 12.86743333 },
      endPt: { x: 166.3601, y: 15.32306667 },
    },
    {
      startPt: { x: 166.3601, y: 15.32306667 },
      endPt: { x: 163.8348174, y: 13.87344654 },
    },
    {
      startPt: { x: 163.8607205, y: 18.57391487 },
      endPt: { x: 161.3474, y: 17.09385 },
    },
    {
      startPt: { x: 163.8659998, y: 16.23631223 },
      endPt: { x: 163.8607205, y: 18.57391487 },
    },
    {
      startPt: { x: 154.9611031, y: 25.70819143 },
      endPt: { x: 154.9793, y: 23.28125 },
    },
    {
      startPt: { x: 154.9793, y: 23.28125 },
      endPt: { x: 156.7818, y: 25.1075 },
    },
    {
      startPt: { x: 156.7818, y: 25.1075 },
      endPt: { x: 154.9611031, y: 25.70819143 },
    },
    {
      startPt: { x: 157.141506, y: 27.11377349 },
      endPt: { x: 159.12165, y: 29.3688 },
    },
    {
      startPt: { x: 159.12165, y: 29.3688 },
      endPt: { x: 156.0969, y: 29.3688 },
    },
    {
      startPt: { x: 152.8795869, y: 24.14781181 },
      endPt: { x: 154.9793, y: 23.28125 },
    },
    {
      startPt: { x: 152.8795869, y: 24.14781181 },
      endPt: { x: 150.4781828, y: 25.35816 },
    },
    {
      startPt: { x: 150.5080414, y: 22.64064 },
      endPt: { x: 152.8795869, y: 24.14781181 },
    },
    {
      startPt: { x: 163.4096172, y: 22.71751989 },
      endPt: { x: 163.8706985, y: 24.57849486 },
    },
    {
      startPt: { x: 163.8706985, y: 24.57849486 },
      endPt: { x: 161.3474, y: 23.7759 },
    },
    {
      startPt: { x: 163.8607205, y: 18.57391487 },
      endPt: { x: 161.3474, y: 19.3212 },
    },
    {
      startPt: { x: 161.3474, y: 19.3212 },
      endPt: { x: 161.3474, y: 17.09385 },
    },
    {
      startPt: { x: 150.7081353, y: 27.90348746 },
      endPt: { x: 150.4781828, y: 25.35816 },
    },
    {
      startPt: { x: 150.4781828, y: 25.35816 },
      endPt: { x: 153.1768, y: 26.4392 },
    },
    {
      startPt: { x: 150.6510119, y: 35.57005489 },
      endPt: { x: 150.6657, y: 37.587 },
    },
    { startPt: { x: 150.6657, y: 37.587 }, endPt: { x: 148.1546, y: 37.587 } },
    {
      startPt: { x: 150.6599264, y: 14.68558977 },
      endPt: { x: 153.1768, y: 13.1726 },
    },
    {
      startPt: { x: 153.1768, y: 13.1726 },
      endPt: { x: 153.1768, y: 15.9334 },
    },
    {
      startPt: { x: 150.6599264, y: 14.68558977 },
      endPt: { x: 148.1546, y: 15.84684 },
    },
    {
      startPt: { x: 148.1546, y: 15.84684 },
      endPt: { x: 148.1546, y: 13.12932 },
    },
    {
      startPt: { x: 163.8706985, y: 24.57849486 },
      endPt: { x: 166.3601, y: 22.68996667 },
    },
    {
      startPt: { x: 166.3601, y: 22.68996667 },
      endPt: { x: 166.3601, y: 25.1456 },
    },
    {
      startPt: { x: 163.838564, y: 20.83319776 },
      endPt: { x: 163.4096172, y: 22.71751989 },
    },
    {
      startPt: { x: 150.6565376, y: 33.29534665 },
      endPt: { x: 148.1546, y: 32.15196 },
    },
    {
      startPt: { x: 150.6356359, y: 30.7064125 },
      endPt: { x: 150.6565376, y: 33.29534665 },
    },
    {
      startPt: { x: 148.1546, y: 34.86948 },
      endPt: { x: 150.6565376, y: 33.29534665 },
    },
    {
      startPt: { x: 150.6565376, y: 33.29534665 },
      endPt: { x: 150.6510119, y: 35.57005489 },
    },
    {
      startPt: { x: 150.6469592, y: 17.2597 },
      endPt: { x: 148.1546, y: 15.84684 },
    },
    {
      startPt: { x: 166.3601, y: 10.4118 },
      endPt: { x: 166.3601, y: 12.86743333 },
    },
    {
      startPt: { x: 163.8659998, y: 16.23631223 },
      endPt: { x: 163.8348174, y: 13.87344654 },
    },
    {
      startPt: { x: 150.6469592, y: 17.2597 },
      endPt: { x: 148.1546, y: 18.56436 },
    },
    {
      startPt: { x: 148.1546, y: 18.56436 },
      endPt: { x: 148.1546, y: 15.84684 },
    },
    {
      startPt: { x: 150.6469592, y: 17.2597 },
      endPt: { x: 150.6553957, y: 19.99886 },
    },
    {
      startPt: { x: 159.1121876, y: 26.74962067 },
      endPt: { x: 157.141506, y: 27.11377349 },
    },
    {
      startPt: { x: 158.4178, y: 25.1075 },
      endPt: { x: 159.1121876, y: 26.74962067 },
    },
    {
      startPt: { x: 164.25325, y: 27.2572 },
      endPt: { x: 162.1464, y: 29.3688 },
    },
    {
      startPt: { x: 158.4178, y: 25.1075 },
      endPt: { x: 160.0538, y: 25.1075 },
    },
    {
      startPt: { x: 160.0538, y: 25.1075 },
      endPt: { x: 159.1121876, y: 26.74962067 },
    },
    {
      startPt: { x: 160.0538, y: 25.1075 },
      endPt: { x: 161.180563, y: 27.33072035 },
    },
    {
      startPt: { x: 161.180563, y: 27.33072035 },
      endPt: { x: 159.1121876, y: 26.74962067 },
    },
    {
      startPt: { x: 163.8607205, y: 18.57391487 },
      endPt: { x: 163.838564, y: 20.83319776 },
    },
    {
      startPt: { x: 166.3601, y: 17.7787 },
      endPt: { x: 163.8607205, y: 18.57391487 },
    },
    {
      startPt: { x: 153.1768, y: 15.9334 },
      endPt: { x: 153.1768, y: 18.6942 },
    },
    {
      startPt: { x: 153.1768, y: 18.6942 },
      endPt: { x: 150.6469592, y: 17.2597 },
    },
    {
      startPt: { x: 163.8348174, y: 13.87344654 },
      endPt: { x: 161.3474, y: 14.8665 },
    },
    {
      startPt: { x: 161.3474, y: 14.8665 },
      endPt: { x: 161.3474, y: 12.63915 },
    },
    {
      startPt: { x: 161.3474, y: 12.63915 },
      endPt: { x: 163.8348174, y: 13.87344654 },
    },
    {
      startPt: { x: 150.4781828, y: 25.35816 },
      endPt: { x: 148.1546, y: 26.71692 },
    },
    {
      startPt: { x: 148.1546, y: 26.71692 },
      endPt: { x: 148.1546, y: 23.9994 },
    },
    {
      startPt: { x: 150.6356359, y: 30.7064125 },
      endPt: { x: 150.7081353, y: 27.90348746 },
    },
    {
      startPt: { x: 150.7081353, y: 27.90348746 },
      endPt: { x: 148.1546, y: 26.71692 },
    },
    {
      startPt: { x: 166.3601, y: 17.7787 },
      endPt: { x: 166.3601, y: 20.23433333 },
    },
    {
      startPt: { x: 166.3601, y: 20.23433333 },
      endPt: { x: 163.8607205, y: 18.57391487 },
    },
    {
      startPt: { x: 161.8397307, y: 25.4594734 },
      endPt: { x: 163.8706985, y: 24.57849486 },
    },
    {
      startPt: { x: 163.0009002, y: 11.85044744 },
      endPt: { x: 163.85375, y: 10.4118 },
    },
    {
      startPt: { x: 161.3474, y: 12.63915 },
      endPt: { x: 163.0009002, y: 11.85044744 },
    },
    {
      startPt: { x: 161.8397307, y: 25.4594734 },
      endPt: { x: 160.0538, y: 25.1075 },
    },
    {
      startPt: { x: 160.0538, y: 25.1075 },
      endPt: { x: 160.7006, y: 24.4417 },
    },
    {
      startPt: { x: 152.8795869, y: 24.14781181 },
      endPt: { x: 153.1768, y: 21.455 },
    },
    {
      startPt: { x: 153.1768, y: 21.455 },
      endPt: { x: 154.9793, y: 23.28125 },
    },
    {
      startPt: { x: 157.141506, y: 27.11377349 },
      endPt: { x: 154.9611031, y: 25.70819143 },
    },
    {
      startPt: { x: 163.4096172, y: 22.71751989 },
      endPt: { x: 166.3601, y: 22.68996667 },
    },
    {
      startPt: { x: 150.6565376, y: 33.29534665 },
      endPt: { x: 153.1768, y: 34.80005 },
    },
    {
      startPt: { x: 153.1768, y: 34.80005 },
      endPt: { x: 150.6510119, y: 35.57005489 },
    },
    {
      startPt: { x: 148.1546, y: 34.86948 },
      endPt: { x: 148.1546, y: 32.15196 },
    },
    {
      startPt: { x: 150.7081353, y: 27.90348746 },
      endPt: { x: 148.1546, y: 29.43444 },
    },
    {
      startPt: { x: 148.1546, y: 29.43444 },
      endPt: { x: 148.1546, y: 26.71692 },
    },
    {
      startPt: { x: 159.1121876, y: 26.74962067 },
      endPt: { x: 159.12165, y: 29.3688 },
    },
    {
      startPt: { x: 150.6565376, y: 33.29534665 },
      endPt: { x: 153.1768, y: 32.0131 },
    },
    {
      startPt: { x: 153.1768, y: 32.0131 },
      endPt: { x: 153.1768, y: 34.80005 },
    },
    {
      startPt: { x: 150.6510119, y: 35.57005489 },
      endPt: { x: 153.1768, y: 37.587 },
    },
    { startPt: { x: 153.1768, y: 37.587 }, endPt: { x: 150.6657, y: 37.587 } },
    {
      startPt: { x: 153.1768, y: 34.80005 },
      endPt: { x: 153.1768, y: 37.587 },
    },
    {
      startPt: { x: 150.6565331, y: 12.42156049 },
      endPt: { x: 148.1546, y: 10.4118 },
    },
    {
      startPt: { x: 148.1546, y: 10.4118 },
      endPt: { x: 150.6657, y: 10.4118 },
    },
    {
      startPt: { x: 148.1546, y: 13.12932 },
      endPt: { x: 148.1546, y: 10.4118 },
    },
    {
      startPt: { x: 161.3474, y: 12.63915 },
      endPt: { x: 161.3474, y: 10.4118 },
    },
    {
      startPt: { x: 161.3474, y: 10.4118 },
      endPt: { x: 163.0009002, y: 11.85044744 },
    },
    {
      startPt: { x: 161.3474, y: 10.4118 },
      endPt: { x: 163.85375, y: 10.4118 },
    },
  ],
  sCharacterLines: [
    {
      startPt: { x: 138.776682, y: 27.51564817 },
      endPt: { x: 138.386, y: 25.2597 },
    },
    {
      startPt: { x: 138.386, y: 25.2597 },
      endPt: { x: 140.7350226, y: 26.33642069 },
    },
    {
      startPt: { x: 140.7350226, y: 26.33642069 },
      endPt: { x: 138.776682, y: 27.51564817 },
    },
    {
      startPt: { x: 140.7657369, y: 18.63550343 },
      endPt: { x: 141.4306896, y: 16.21726606 },
    },
    {
      startPt: { x: 141.4306896, y: 16.21726606 },
      endPt: { x: 144.5401, y: 18.3732 },
    },
    {
      startPt: { x: 144.5401, y: 18.3732 },
      endPt: { x: 140.7657369, y: 18.63550343 },
    },
    {
      startPt: { x: 132.489025, y: 19.77161598 },
      endPt: { x: 130.5578, y: 17.9547 },
    },
    {
      startPt: { x: 130.5578, y: 17.9547 },
      endPt: { x: 133.2813333, y: 17.9547 },
    },
    {
      startPt: { x: 133.2813333, y: 17.9547 },
      endPt: { x: 132.489025, y: 19.77161598 },
    },
    {
      startPt: { x: 136.9278605, y: 20.00192976 },
      endPt: { x: 136.0048667, y: 17.9547 },
    },
    {
      startPt: { x: 136.0048667, y: 17.9547 },
      endPt: { x: 138.7284, y: 17.9547 },
    },
    {
      startPt: { x: 138.7284, y: 17.9547 },
      endPt: { x: 136.9278605, y: 20.00192976 },
    },
    {
      startPt: { x: 138.776682, y: 27.51564817 },
      endPt: { x: 135.5547624, y: 27.47985342 },
    },
    {
      startPt: { x: 135.5547624, y: 27.47985342 },
      endPt: { x: 138.386, y: 25.2597 },
    },
    {
      startPt: { x: 135.5547624, y: 27.47985342 },
      endPt: { x: 138.007925, y: 29.3688 },
    },
    {
      startPt: { x: 138.007925, y: 29.3688 },
      endPt: { x: 135.53725, y: 29.3688 },
    },
    {
      startPt: { x: 135.53725, y: 29.3688 },
      endPt: { x: 135.5547624, y: 27.47985342 },
    },
    {
      startPt: { x: 135.7092716, y: 12.21954334 },
      endPt: { x: 135.7275, y: 10.4118 },
    },
    {
      startPt: { x: 135.7275, y: 10.4118 },
      endPt: { x: 138.33135, y: 10.4118 },
    },
    {
      startPt: { x: 138.33135, y: 10.4118 },
      endPt: { x: 135.7092716, y: 12.21954334 },
    },
    {
      startPt: { x: 141.4306896, y: 16.21726606 },
      endPt: { x: 144.5401, y: 14.0644 },
    },
    {
      startPt: { x: 144.5401, y: 14.0644 },
      endPt: { x: 144.5401, y: 18.3732 },
    },
    {
      startPt: { x: 140.7657369, y: 18.63550343 },
      endPt: { x: 138.7284, y: 17.9547 },
    },
    {
      startPt: { x: 138.7284, y: 17.9547 },
      endPt: { x: 139.6035, y: 17.0415 },
    },
    {
      startPt: { x: 139.6035, y: 17.0415 },
      endPt: { x: 140.7657369, y: 18.63550343 },
    },
    {
      startPt: { x: 134.5198736, y: 19.96289549 },
      endPt: { x: 135.5198, y: 21.9877 },
    },
    {
      startPt: { x: 135.5198, y: 21.9877 },
      endPt: { x: 132.7931, y: 21.9877 },
    },
    {
      startPt: { x: 132.7931, y: 21.9877 },
      endPt: { x: 134.5198736, y: 19.96289549 },
    },
    {
      startPt: { x: 135.53725, y: 29.3688 },
      endPt: { x: 133.066575, y: 29.3688 },
    },
    {
      startPt: { x: 133.066575, y: 29.3688 },
      endPt: { x: 135.5547624, y: 27.47985342 },
    },
    {
      startPt: { x: 130.7627987, y: 21.29127935 },
      endPt: { x: 129.8100675, y: 23.61606837 },
    },
    {
      startPt: { x: 129.8100675, y: 23.61606837 },
      endPt: { x: 126.9814, y: 21.5692 },
    },
    {
      startPt: { x: 126.9814, y: 21.5692 },
      endPt: { x: 130.7627987, y: 21.29127935 },
    },
    {
      startPt: { x: 138.776682, y: 27.51564817 },
      endPt: { x: 138.007925, y: 29.3688 },
    },
    {
      startPt: { x: 139.0270909, y: 20.17208247 },
      endPt: { x: 140.9732, y: 21.9877 },
    },
    {
      startPt: { x: 140.9732, y: 21.9877 },
      endPt: { x: 138.2465, y: 21.9877 },
    },
    {
      startPt: { x: 138.2465, y: 21.9877 },
      endPt: { x: 139.0270909, y: 20.17208247 },
    },
    {
      startPt: { x: 138.33135, y: 10.4118 },
      endPt: { x: 138.7665, y: 14.5209 },
    },
    {
      startPt: { x: 138.7665, y: 14.5209 },
      endPt: { x: 135.7092716, y: 12.21954334 },
    },
    {
      startPt: { x: 140.7350226, y: 26.33642069 },
      endPt: { x: 139.223, y: 24.3846 },
    },
    {
      startPt: { x: 139.223, y: 24.3846 },
      endPt: { x: 141.4780725, y: 24.84211045 },
    },
    {
      startPt: { x: 141.4780725, y: 24.84211045 },
      endPt: { x: 140.7350226, y: 26.33642069 },
    },
    {
      startPt: { x: 140.9653135, y: 13.63128518 },
      endPt: { x: 139.6035, y: 15.396 },
    },
    { startPt: { x: 139.6035, y: 15.396 }, endPt: { x: 138.7665, y: 14.5209 } },
    {
      startPt: { x: 138.7665, y: 14.5209 },
      endPt: { x: 140.9653135, y: 13.63128518 },
    },
    {
      startPt: { x: 130.5524208, y: 25.98917737 },
      endPt: { x: 131.918, y: 24.3846 },
    },
    { startPt: { x: 131.918, y: 24.3846 }, endPt: { x: 132.755, y: 25.2597 } },
    {
      startPt: { x: 132.755, y: 25.2597 },
      endPt: { x: 130.5524208, y: 25.98917737 },
    },
    {
      startPt: { x: 139.6035, y: 17.0415 },
      endPt: { x: 141.4306896, y: 16.21726606 },
    },
    {
      startPt: { x: 144.5401, y: 18.3732 },
      endPt: { x: 140.9732, y: 21.9877 },
    },
    {
      startPt: { x: 140.9732, y: 21.9877 },
      endPt: { x: 140.7657369, y: 18.63550343 },
    },
    {
      startPt: { x: 130.5440609, y: 13.25575032 },
      endPt: { x: 129.4878544, y: 15.00308975 },
    },
    {
      startPt: { x: 129.4878544, y: 15.00308975 },
      endPt: { x: 126.8292, y: 14.1405 },
    },
    {
      startPt: { x: 126.8292, y: 14.1405 },
      endPt: { x: 130.5440609, y: 13.25575032 },
    },
    {
      startPt: { x: 130.5440609, y: 13.25575032 },
      endPt: { x: 133.12365, y: 10.4118 },
    },
    {
      startPt: { x: 133.12365, y: 10.4118 },
      endPt: { x: 132.6029, y: 14.5209 },
    },
    {
      startPt: { x: 132.6029, y: 14.5209 },
      endPt: { x: 130.5440609, y: 13.25575032 },
    },
    { startPt: { x: 139.223, y: 24.3846 }, endPt: { x: 139.223, y: 23.3193 } },
    {
      startPt: { x: 139.223, y: 23.3193 },
      endPt: { x: 141.4780725, y: 24.84211045 },
    },
    {
      startPt: { x: 141.4780725, y: 24.84211045 },
      endPt: { x: 144.1597, y: 23.3193 },
    },
    {
      startPt: { x: 144.1597, y: 23.3193 },
      endPt: { x: 144.1597, y: 25.6402 },
    },
    {
      startPt: { x: 144.1597, y: 25.6402 },
      endPt: { x: 141.4780725, y: 24.84211045 },
    },
    {
      startPt: { x: 135.7092716, y: 12.21954334 },
      endPt: { x: 132.6029, y: 14.5209 },
    },
    {
      startPt: { x: 133.12365, y: 10.4118 },
      endPt: { x: 135.7092716, y: 12.21954334 },
    },
    {
      startPt: { x: 130.5440609, y: 13.25575032 },
      endPt: { x: 130.5198, y: 10.4118 },
    },
    {
      startPt: { x: 130.5198, y: 10.4118 },
      endPt: { x: 133.12365, y: 10.4118 },
    },
    {
      startPt: { x: 130.7627987, y: 21.29127935 },
      endPt: { x: 132.7931, y: 21.9877 },
    },
    { startPt: { x: 132.7931, y: 21.9877 }, endPt: { x: 131.918, y: 22.9008 } },
    {
      startPt: { x: 131.918, y: 22.9008 },
      endPt: { x: 130.7627987, y: 21.29127935 },
    },
    {
      startPt: { x: 130.5524208, y: 25.98917737 },
      endPt: { x: 130.5959, y: 29.3688 },
    },
    {
      startPt: { x: 130.5959, y: 29.3688 },
      endPt: { x: 126.9814, y: 25.7163 },
    },
    {
      startPt: { x: 126.9814, y: 25.7163 },
      endPt: { x: 130.5524208, y: 25.98917737 },
    },
    {
      startPt: { x: 129.8100675, y: 23.61606837 },
      endPt: { x: 126.9814, y: 25.7163 },
    },
    {
      startPt: { x: 126.9814, y: 25.7163 },
      endPt: { x: 126.9814, y: 21.5692 },
    },
    {
      startPt: { x: 129.8100675, y: 23.61606837 },
      endPt: { x: 131.918, y: 22.9008 },
    },
    { startPt: { x: 131.918, y: 22.9008 }, endPt: { x: 131.918, y: 24.3846 } },
    {
      startPt: { x: 131.918, y: 24.3846 },
      endPt: { x: 129.8100675, y: 23.61606837 },
    },
    {
      startPt: { x: 140.9653135, y: 13.63128518 },
      endPt: { x: 141.4306896, y: 16.21726606 },
    },
    {
      startPt: { x: 141.4306896, y: 16.21726606 },
      endPt: { x: 139.6035, y: 15.396 },
    },
    { startPt: { x: 139.6035, y: 17.0415 }, endPt: { x: 139.6035, y: 15.396 } },
    {
      startPt: { x: 129.8100675, y: 23.61606837 },
      endPt: { x: 130.5524208, y: 25.98917737 },
    },
    {
      startPt: { x: 129.4878544, y: 15.00308975 },
      endPt: { x: 126.8292, y: 16.4613 },
    },
    {
      startPt: { x: 126.8292, y: 16.4613 },
      endPt: { x: 126.8292, y: 14.1405 },
    },
    {
      startPt: { x: 129.4878544, y: 15.00308975 },
      endPt: { x: 131.7658, y: 15.396 },
    },
    { startPt: { x: 131.7658, y: 15.396 }, endPt: { x: 131.7658, y: 16.4613 } },
    {
      startPt: { x: 131.7658, y: 16.4613 },
      endPt: { x: 129.4878544, y: 15.00308975 },
    },
    {
      startPt: { x: 132.4366995, y: 27.48835522 },
      endPt: { x: 132.755, y: 25.2597 },
    },
    {
      startPt: { x: 132.755, y: 25.2597 },
      endPt: { x: 135.5547624, y: 27.47985342 },
    },
    {
      startPt: { x: 135.5547624, y: 27.47985342 },
      endPt: { x: 132.4366995, y: 27.48835522 },
    },
    { startPt: { x: 132.755, y: 25.2597 }, endPt: { x: 138.386, y: 25.2597 } },
    {
      startPt: { x: 126.8292, y: 14.1405 },
      endPt: { x: 130.5198, y: 10.4118 },
    },
    {
      startPt: { x: 131.7658, y: 16.4613 },
      endPt: { x: 126.8292, y: 16.4613 },
    },
    {
      startPt: { x: 136.9278605, y: 20.00192976 },
      endPt: { x: 138.2465, y: 21.9877 },
    },
    {
      startPt: { x: 138.2465, y: 21.9877 },
      endPt: { x: 135.5198, y: 21.9877 },
    },
    {
      startPt: { x: 135.5198, y: 21.9877 },
      endPt: { x: 136.9278605, y: 20.00192976 },
    },
    {
      startPt: { x: 134.5198736, y: 19.96289549 },
      endPt: { x: 133.2813333, y: 17.9547 },
    },
    {
      startPt: { x: 133.2813333, y: 17.9547 },
      endPt: { x: 136.0048667, y: 17.9547 },
    },
    {
      startPt: { x: 136.0048667, y: 17.9547 },
      endPt: { x: 134.5198736, y: 19.96289549 },
    },
    {
      startPt: { x: 133.12365, y: 10.4118 },
      endPt: { x: 135.7275, y: 10.4118 },
    },
    {
      startPt: { x: 138.7665, y: 14.5209 },
      endPt: { x: 132.6029, y: 14.5209 },
    },
    { startPt: { x: 138.386, y: 25.2597 }, endPt: { x: 139.223, y: 24.3846 } },
    { startPt: { x: 139.223, y: 23.3193 }, endPt: { x: 144.1597, y: 23.3193 } },
    {
      startPt: { x: 140.7350226, y: 26.33642069 },
      endPt: { x: 144.1597, y: 25.6402 },
    },
    {
      startPt: { x: 144.1597, y: 25.6402 },
      endPt: { x: 140.4786, y: 29.3688 },
    },
    {
      startPt: { x: 140.4786, y: 29.3688 },
      endPt: { x: 140.7350226, y: 26.33642069 },
    },
    {
      startPt: { x: 140.9653135, y: 13.63128518 },
      endPt: { x: 144.5401, y: 14.0644 },
    },
    {
      startPt: { x: 140.9653135, y: 13.63128518 },
      endPt: { x: 140.9352, y: 10.4118 },
    },
    {
      startPt: { x: 140.9352, y: 10.4118 },
      endPt: { x: 144.5401, y: 14.0644 },
    },
    {
      startPt: { x: 126.9814, y: 21.5692 },
      endPt: { x: 130.5578, y: 17.9547 },
    },
    {
      startPt: { x: 130.5578, y: 17.9547 },
      endPt: { x: 130.7627987, y: 21.29127935 },
    },
    {
      startPt: { x: 136.9278605, y: 20.00192976 },
      endPt: { x: 134.5198736, y: 19.96289549 },
    },
    {
      startPt: { x: 132.489025, y: 19.77161598 },
      endPt: { x: 130.7627987, y: 21.29127935 },
    },
    {
      startPt: { x: 134.5198736, y: 19.96289549 },
      endPt: { x: 132.489025, y: 19.77161598 },
    },
    {
      startPt: { x: 139.0270909, y: 20.17208247 },
      endPt: { x: 140.7657369, y: 18.63550343 },
    },
    {
      startPt: { x: 136.9278605, y: 20.00192976 },
      endPt: { x: 139.0270909, y: 20.17208247 },
    },
    {
      startPt: { x: 138.33135, y: 10.4118 },
      endPt: { x: 140.9653135, y: 13.63128518 },
    },
    {
      startPt: { x: 138.33135, y: 10.4118 },
      endPt: { x: 140.9352, y: 10.4118 },
    },
    {
      startPt: { x: 138.7284, y: 17.9547 },
      endPt: { x: 139.0270909, y: 20.17208247 },
    },
    {
      startPt: { x: 132.4366995, y: 27.48835522 },
      endPt: { x: 130.5524208, y: 25.98917737 },
    },
    {
      startPt: { x: 133.066575, y: 29.3688 },
      endPt: { x: 132.4366995, y: 27.48835522 },
    },
    {
      startPt: { x: 138.776682, y: 27.51564817 },
      endPt: { x: 140.4786, y: 29.3688 },
    },
    {
      startPt: { x: 140.4786, y: 29.3688 },
      endPt: { x: 138.007925, y: 29.3688 },
    },
    {
      startPt: { x: 132.7931, y: 21.9877 },
      endPt: { x: 132.489025, y: 19.77161598 },
    },
    {
      startPt: { x: 133.066575, y: 29.3688 },
      endPt: { x: 130.5959, y: 29.3688 },
    },
    {
      startPt: { x: 130.5959, y: 29.3688 },
      endPt: { x: 132.4366995, y: 27.48835522 },
    },
    { startPt: { x: 132.6029, y: 14.5209 }, endPt: { x: 131.7658, y: 15.396 } },
    {
      startPt: { x: 131.7658, y: 15.396 },
      endPt: { x: 130.5440609, y: 13.25575032 },
    },
  ],
  bigSCharacterPts: [
    { x: 18.1763, y: 32.9452 },
    { x: 18.1763, y: 25.9065 },
    { x: 22.2853, y: 21.7974 },
    { x: 32.3583, y: 21.7974 },
    { x: 33.6139, y: 20.5419 },
    { x: 33.6139, y: 16.1189 },
    { x: 32.3203, y: 14.8253 },
    { x: 24.454, y: 14.8253 },
    { x: 23.1985, y: 16.0809 },
    { x: 23.1985, y: 18.3351 },
    { x: 18.1002, y: 18.3351 },
    { x: 18.1002, y: 14.5209 },
    { x: 22.2093, y: 10.4118 },
    { x: 34.527, y: 10.4118 },
    { x: 38.7027, y: 14.597 },
    { x: 38.7027, y: 22.1018 },
    { x: 34.6031, y: 26.2109 },
    { x: 24.5301, y: 26.2109 },
    { x: 23.2746, y: 27.4664 },
    { x: 23.2746, y: 31.3853 },
    { x: 24.5301, y: 32.6409 },
    { x: 32.0539, y: 32.6409 },
    { x: 33.3095, y: 31.3853 },
    { x: 33.3095, y: 29.1025 },
    { x: 38.3983, y: 29.1025 },
    { x: 38.3983, y: 32.9452 },
    { x: 34.2987, y: 37.0543 },
    { x: 22.2853, y: 37.0543 },
  ],
  bigOCharacterPts: [
    { x: 46.236, y: 29.3688 },
    { x: 42.3171, y: 25.4119 },
    { x: 42.3171, y: 14.3687 },
    { x: 46.236, y: 10.4118 },
    { x: 57.1079, y: 10.4118 },
    { x: 61.0173, y: 14.3687 },
    { x: 61.0173, y: 25.4119 },
    { x: 57.1079, y: 29.3688 },
  ],
  bigOInnerCharacterPts: [
    { x: 47.3394, y: 15.9287 },
    { x: 47.3394, y: 23.852 },
    { x: 48.671, y: 25.1836 },
    { x: 54.6729, y: 25.1836 },
    { x: 56.0046, y: 23.852 },
    { x: 56.0046, y: 15.9287 },
    { x: 54.6729, y: 14.597 },
    { x: 48.671, y: 14.597 },
  ],
  bigLCharacterPts: [
    { x: 65.3927, y: 37.587 },
    { x: 65.3927, y: 10.4118 },
    { x: 70.4149, y: 10.4118 },
    { x: 70.4149, y: 37.587 },
  ],
  bigMCharacterPts: [
    { x: 88.0497, y: 19.857 },
    { x: 80.1454, y: 37.0543 },
    { x: 75.3515, y: 37.0543 },
    { x: 75.3515, y: 10.4118 },
    { x: 80.3357, y: 10.4118 },
    { x: 80.3357, y: 26.6294 },
    { x: 80.4118, y: 26.6294 },
    { x: 86.4898, y: 14.1405 },
    { x: 89.6858, y: 14.1405 },
    { x: 95.8113, y: 26.6294 },
    { x: 95.8874, y: 26.6294 },
    { x: 95.8874, y: 10.4118 },
    { x: 100.8621, y: 10.411 },
    { x: 100.8621, y: 37.054 },
    { x: 96.0681, y: 37.0543 },
    { x: 88.1258, y: 19.857 },
  ],
  eCharacterPts: [
    { x: 109.0707, y: 10.4118 },
    { x: 119.9807, y: 10.4118 },
    { x: 123.7474, y: 14.2166 },
    { x: 123.7474, y: 16.6991 },
    { x: 118.8013, y: 16.6991 },
    { x: 118.8013, y: 15.7004 },
    { x: 117.6599, y: 14.5209 },
    { x: 111.4677, y: 14.5209 },
    { x: 110.2502, y: 15.7765 },
    { x: 110.2502, y: 18.221 },
    { x: 123.7854, y: 18.221 },
    { x: 123.7854, y: 25.4119 },
    { x: 119.8286, y: 29.3688 },
    { x: 109.1468, y: 29.3688 },
    { x: 105.228, y: 25.4119 },
    { x: 105.228, y: 14.2926 },
  ],
  eInnerCharacterPts: [
    { x: 110.2502, y: 23.9281 },
    { x: 111.5438, y: 25.2597 },
    { x: 117.4696, y: 25.2597 },
    { x: 118.7632, y: 23.9281 },
    { x: 118.7632, y: 21.7213 },
    { x: 110.2502, y: 21.7213 },
  ],
  sCharacterPts: [
    { x: 126.9814, y: 25.7163 },
    { x: 126.9814, y: 21.5692 },
    { x: 130.5578, y: 17.9547 },
    { x: 138.7284, y: 17.9547 },
    { x: 139.6035, y: 17.0415 },
    { x: 139.6035, y: 15.396 },
    { x: 138.7665, y: 14.5209 },
    { x: 132.6029, y: 14.5209 },
    { x: 131.7658, y: 15.396 },
    { x: 131.7658, y: 16.4613 },
    { x: 126.8292, y: 16.4613 },
    { x: 126.8292, y: 14.1405 },
    { x: 130.5198, y: 10.4118 },
    { x: 140.9352, y: 10.4118 },
    { x: 144.5401, y: 14.0644 },
    { x: 144.5401, y: 18.3732 },
    { x: 140.9732, y: 21.9877 },
    { x: 132.7931, y: 21.9877 },
    { x: 131.918, y: 22.9008 },
    { x: 131.918, y: 24.3846 },
    { x: 132.755, y: 25.2597 },
    { x: 138.386, y: 25.2597 },
    { x: 139.223, y: 24.3846 },
    { x: 139.223, y: 23.3193 },
    { x: 144.1597, y: 23.3193 },
    { x: 144.1597, y: 25.6402 },
    { x: 140.4786, y: 29.3688 },
    { x: 130.5959, y: 29.3688 },
  ],
  hCharacterPts: [
    { x: 161.3474, y: 23.7759 },
    { x: 161.3474, y: 10.4118 },
    { x: 166.3601, y: 10.4118 },
    { x: 166.3601, y: 25.1456 },
    { x: 162.1464, y: 29.3688 },
    { x: 156.0969, y: 29.3688 },
    { x: 153.1768, y: 26.4392 },
    { x: 153.1768, y: 37.587 },
    { x: 148.1546, y: 37.587 },
    { x: 148.1546, y: 10.4118 },
    { x: 153.1768, y: 10.4118 },
    { x: 153.1768, y: 21.455 },
    { x: 156.7818, y: 25.1075 },
    { x: 160.0538, y: 25.1075 },
  ],
  oldsCharacterPts: [
    { x: 192.099, y: 25.7163 },
    { x: 192.099, y: 21.5692 },
    { x: 195.6754, y: 17.9547 },
    { x: 203.846, y: 17.9547 },
    { x: 204.7211, y: 17.0415 },
    { x: 204.7211, y: 15.396 },
    { x: 203.8841, y: 14.5209 },
    { x: 197.7299, y: 14.5209 },
    { x: 196.8929, y: 15.396 },
    { x: 196.8929, y: 16.4613 },
    { x: 191.9468, y: 16.4613 },
    { x: 191.9468, y: 14.1405 },
    { x: 195.6374, y: 10.4118 },
    { x: 206.0527, y: 10.4118 },
    { x: 209.6672, y: 14.0644 },
    { x: 209.6672, y: 18.3732 },
    { x: 206.0908, y: 21.9877 },
    { x: 197.9202, y: 21.9877 },
    { x: 197.0451, y: 22.9008 },
    { x: 197.0451, y: 24.3846 },
    { x: 197.8821, y: 25.2597 },
    { x: 203.5036, y: 25.2597 },
    { x: 204.3406, y: 24.3846 },
    { x: 204.3406, y: 23.3193 },
    { x: 209.2867, y: 23.3193 },
    { x: 209.2867, y: 25.6402 },
    { x: 205.5962, y: 29.3688 },
    { x: 195.7135, y: 29.3688 },
  ],
}
