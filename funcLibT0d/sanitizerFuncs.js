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
    imwProductValObj, itemID, deptID, deptName, recptAlias, brand, itemName, size, suggRtl, lastCost, basePrice, autoDisco, discoMult, idealMarg,
    weightProf, tax1, tax2, tax3, specTndr1, specTndr2, posPrompt, location, altID, altRcptAlias, pkgQty, suppUnitID, suppID, unit, numPkgs,
    dsd, csPkMlt, ovr, category, subCtgry, prodGroup, prodFlag, rbNote, ediDefault, pwrfld7, tmpGroup, onhndQty, reorderPt, mcl, reorderQty) {
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
    imwProductValObj['deptID'] = deptID
    imwProductValObj['deptName'] = deptName
    imwProductValObj['recptAlias'] = recptAlias
    imwProductValObj['brand'] = brand
    imwProductValObj['itemName'] = itemName
    imwProductValObj['size'] = size
    imwProductValObj['suggRtl'] = suggRtl
    imwProductValObj['lastCost'] = lastCost
    imwProductValObj['basePrice'] = basePrice
    imwProductValObj['autoDisco'] = autoDisco
    imwProductValObj['discoMult'] = discoMult
    imwProductValObj['idealMarg'] = idealMarg
    imwProductValObj['weightProf'] = weightProf
    imwProductValObj['tax1'] = tax1
    imwProductValObj['tax2'] = tax2
    imwProductValObj['tax3'] = tax3
    imwProductValObj['specTndr1'] = specTndr1
    imwProductValObj['specTndr2'] = specTndr2
    imwProductValObj['posPrompt'] = posPrompt
    imwProductValObj['location'] = location
    imwProductValObj['altID'] = altID
    imwProductValObj['altRcptAlias'] = altRcptAlias
    imwProductValObj['pkgQty'] = pkgQty
    imwProductValObj['suppUnitID'] = suppUnitID
    imwProductValObj['suppID'] = suppID
    imwProductValObj['unit'] = unit
    imwProductValObj['numPkgs'] = numPkgs
    imwProductValObj['dsd'] = dsd
    imwProductValObj['csPkMlt'] = csPkMlt
    imwProductValObj['ovr'] = ovr
    imwProductValObj['category'] = category
    imwProductValObj['subCtgry'] = subCtgry
    imwProductValObj['prodGroup'] = prodGroup
    imwProductValObj['prodFlag'] = prodFlag
    imwProductValObj['rbNote'] = rbNote
    imwProductValObj['ediDefault'] = ediDefault
    imwProductValObj['pwrfld7'] = pwrfld7
    imwProductValObj['tmpGroup'] = tmpGroup
    imwProductValObj['onhndQty'] = onhndQty
    imwProductValObj['reorderPt'] = reorderPt
    imwProductValObj['mcl'] = mcl
    imwProductValObj['reorderQty'] = reorderQty
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