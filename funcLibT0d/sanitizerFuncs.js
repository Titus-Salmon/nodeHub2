module.exports = {
  itemListAccSanitizer: function (itemListAccumulator) {
    if (itemListAccumulator !== undefined) {
      console.log(`itemListAccumulator pre-regex==> ${itemListAccumulator}`)
      let sanitizerRegex1 = /(\\)|(\[)|(\])/g
      let sanitizerRegex3 = /("{)/g
      let sanitizerRegex4 = /(}")/g
      sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "").replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
      console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
    }
  },

  sanitizedItemListObjGenerator: function (itemListAccumulator, itemListAccSanitizer, imwProductArr,
    imwProductValObj, itemID, suppUnitID, deptName, recptAlias, brand, itemName) {
    if (itemListAccumulator !== undefined) {
      itemListAccSanitizer(itemListAccumulator)
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
      let splitRegex1 = /(?<=}),(?={)/g
      let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
      for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
        imwProductArr.push(sanitizedItemListAccSPLIT[i])
      }
    }
    imwProductValObj['itemID'] = itemID
    imwProductValObj['suppUnitID'] = suppUnitID
    imwProductValObj['deptName'] = deptName
    imwProductValObj['recptAlias'] = recptAlias
    imwProductValObj['brand'] = brand
    imwProductValObj['itemName'] = itemName
    let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
    imwProductArr.push(stringifiedImwProductValObj)
  },

  objectifyImwProductArr: function (imwProductArr, objectifiedImwProdArr) { //this objectifies imwProductArr for easy DOM template display
    for (let i = 0; i < imwProductArr.length; i++) {
      if (imwProductArr.length > 0) {
        console.log(`typeof imwProductArr[${i}]==> ${typeof imwProductArr[i]}`)
        console.log(`imwProductArr[${i}]==> ${imwProductArr[i]}`)
        if ((imwProductArr[i]) !== '' && typeof imwProductArr[i] == 'string') {
          let objectifiedImwProd = JSON.parse(imwProductArr[i])
          objectifiedImwProdArr.push(objectifiedImwProd)
        } else {
          let objectifiedImwProd = imwProductArr[i]
          objectifiedImwProdArr.push(objectifiedImwProd)
        }
      }
    }
  },

  itemsToAddArrayGenerator: function (itemsToAdd, itemListAccSanitizer, itemsToAddArr) {
    if (itemsToAdd !== undefined) {
      // itemsToAddSanitizer()
      itemListAccSanitizer(itemsToAdd)
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/

      let splitRegex1 = /(?<=}),(?={)/g
      let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
      for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
        itemsToAddArr.push(sanitizedItemListAccSPLIT[i])
      }
    }
  }

}