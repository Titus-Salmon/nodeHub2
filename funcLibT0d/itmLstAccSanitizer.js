module.exports = {


  itemListObjs: {
    // itemID: this.itemID,
    // suppUnitID: this.suppUnitID,
    // itemListAccumulator: this.itemListAccumulator,
    // itemID: postBody['itemIDPost'],
    // suppUnitID: postBody['suppUnitIDPost'],
    // itemListAccumulator: postBody['itemListAccumulatorPost'],
    imwProductValObj: {},
    imwProductArr: [],
    objectifiedImwProdArr: []
  },

  itmLstAccSntzr: function (postBodyData) {

    let itemListAccumulator = postBodyData['itemListAccumulatorPost']

    console.log(`itemListAccumulator from itmLstAccSntzr==> ${itemListAccumulator}`)

    if (itemListAccumulator !== undefined) {
      let sanitizerRegex1 = /(\\)|(\[)|(\])/g
      let sanitizerRegex2 = /("")/g
      let sanitizerRegex3 = /("{)/g
      let sanitizerRegex4 = /(}")/g
      sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "")
        .replace(sanitizerRegex2, `"`).replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
      console.log(`sanitizedItemListAcc from itmLstAccSntzr==> ${sanitizedItemListAcc}`)
    }
  },

  sntzdItmLstObjGen: function (postBodyData) {

    let itemID = postBodyData['itemIDPost']
    let suppUnitID = postBodyData['suppUnitIDPost']
    let itemListAccumulator = postBodyData['itemListAccumulatorPost']
    console.log(`itemID from sntzdItmLstObjGen1==> ${itemID}`)

    console.log(`itemListAccumulator from sntzdItmLstObjGen==> ${itemListAccumulator}`)

    if (itemListAccumulator !== undefined) {
      console.log(`itemID from sntzdItmLstObjGen2==> ${itemID}`)
      module.exports.itmLstAccSntzr(postBodyData)
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
      let splitRegex1 = /(?<=}),(?={)/g
      console.log(`sanitizedItemListAcc from sntzdItmLstObjGen==> ${sanitizedItemListAcc}`)
      let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
      for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
        module.exports.itemListObjs.imwProductArr.push(sanitizedItemListAccSPLIT[i])
      }
    }
    console.log(`module.exports.itemListObjs.imwProductArr from sntzdItmLstObjGen==> ${module.exports.itemListObjs.imwProductArr}`)
    module.exports.itemListObjs.imwProductValObj['itemID'] = itemID
    module.exports.itemListObjs.imwProductValObj['suppUnitID'] = suppUnitID
    let stringifiedImwProductValObj = JSON.stringify(module.exports.itemListObjs.imwProductValObj)
    module.exports.itemListObjs.imwProductArr.push(stringifiedImwProductValObj)
  },

  objctfyImwPrdctArr: function () {
    // let objectifiedImwProdArr = []
    for (let i = 0; i < module.exports.itemListObjs.imwProductArr.length; i++) {
      let objectifiedImwProd = JSON.parse(module.exports.itemListObjs.imwProductArr[i])
      module.exports.itemListObjs.objectifiedImwProdArr.push(objectifiedImwProd)
      console.log(`JSON.stringify(module.exports.itemListObjs.objectifiedImwProdArr)==> ${JSON.stringify(module.exports.itemListObjs.objectifiedImwProdArr)}`)
    }
  }


}