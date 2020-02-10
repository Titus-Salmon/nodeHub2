module.exports = {

  itemListObjs: {
    imwProductValObj: {},
    imwProductArr: [],
    objectifiedImwProdArr: []
  },


  itmLstAccSntzr: function (postBodyData) {

    var itemListAccumulator = postBodyData['itemListAccumulatorPost']
    var itemsToAdd = postBody['productArrayPost']

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

    module.exports.itmLstAccSntzr(postBodyData)

    var itemID = postBodyData['itemIDPost']
    var suppUnitID = postBodyData['suppUnitIDPost']

    if (module.exports.itmLstAccSntzr.itemListAccumulator !== undefined) {
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
      let splitRegex1 = /(?<=}),(?={)/g
      let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
      for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
        module.exports.itemListObjs.imwProductArr.push(sanitizedItemListAccSPLIT[i])
      }
    }
    module.exports.itemListObjs.imwProductValObj['itemID'] = itemID
    module.exports.itemListObjs.imwProductValObj['suppUnitID'] = suppUnitID
    let stringifiedImwProductValObj = JSON.stringify(module.exports.itemListObjs.imwProductValObj)
    module.exports.itemListObjs.imwProductArr.push(stringifiedImwProductValObj)
  },

  objctfyImwPrdctArr: function () {
    module.exports.itemListObjs.objectifiedImwProdArr = []
    for (let i = 0; i < module.exports.itemListObjs.imwProductArr.length; i++) {
      let objectifiedImwProd = JSON.parse(module.exports.itemListObjs.imwProductArr[i])
      module.exports.itemListObjs.objectifiedImwProdArr.push(objectifiedImwProd)
    }
  }


}