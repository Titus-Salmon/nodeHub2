module.exports = {
  clcRsFrmInputs: function clcRsFrmInputs(postBodyData, formInputsObj) {
    formInputsObj.deptFilterArr = [{
        '54': {
          'name': 'Beer & Alcohol',
          'dfltMrg': '20'
        }
      },
      {
        '152': {
          'name': 'Body Care',
          'dfltMrg': '45'
        }
      },
      {
        '9': {
          'name': 'Books',
          'dfltMrg': '40'
        }
      },
      {
        '19': {
          'name': 'Bulk',
          'dfltMrg': '45'
        }
      },
      {
        '30': {
          'name': 'Bulk & Herb Prepack',
          'dfltMrg': '45'
        }
      },
      {
        '175': {
          'name': 'CBD - Grocery',
          'dfltMrg': '45'
        }
      },
      {
        '176': {
          'name': 'CBD - Supplements',
          'dfltMrg': '50'
        }
      },
      {
        '177': {
          'name': 'CBD - Topicals',
          'dfltMrg': '45'
        }
      },
      {
        '148': {
          'name': 'Consignments',
          'dfltMrg': '20'
        }
      },
      {
        '150': {
          'name': 'General Merchandise',
          'dfltMrg': '38'
        }
      },
      {
        '13': {
          'name': 'Gift Items',
          'dfltMrg': '50'
        }
      },
      {
        '62': {
          'name': 'Grab & Go',
          'dfltMrg': '33'
        }
      },
      {
        '25': {
          'name': 'Grocery',
          'dfltMrg': '38'
        }
      },
      {
        '179': {
          'name': 'Grocery - Local',
          'dfltMrg': '33'
        }
      },
      {
        '38': {
          'name': 'Grocery - Local Meat',
          'dfltMrg': '25'
        }
      },
      {
        '12': {
          'name': 'HBA',
          'dfltMrg': '45'
        }
      },
      {
        '158': {
          'name': 'Herbs & Homeopathic',
          'dfltMrg': '40'
        }
      },
      {
        '80': {
          'name': 'LifeBar',
          'dfltMrg': '0'
        }
      },
      {
        '151': {
          'name': 'Other',
          'dfltMrg': '45'
        }
      },
      {
        '155': {
          'name': 'Refrigerated',
          'dfltMrg': '33'
        }
      },
      {
        '157': {
          'name': 'Vitamins & Supplements',
          'dfltMrg': '40'
        }
      }
    ]

    console.log(`Object.keys(formInputsObj.deptFilterArr[0])==> ${Object.keys(formInputsObj.deptFilterArr[0])}`)
    console.log(`formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])]==> ${formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])]}`)
    console.log(`formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])]['dfltMrg']==> ${formInputsObj.deptFilterArr[0][Object.keys(formInputsObj.deptFilterArr[0])]['dfltMrg']}`)

    console.log('calcResults says: postBodyData==>', postBodyData)
    console.log('calcResults says: postBodyData[\'fldArrToPostPost\']==>', postBodyData['fldArrToPostPost'])
    console.log('calcResults says: postBodyData[\'fldArrToPostPost\'][0]==>', postBodyData['fldArrToPostPost'][0])

    //v//create variables for form POST data from #retailCalcUniversal form ('Search Loaded Table')
    let formInput0 = Object.values(postBodyData)[0] = loadedSqlTbl = postBodyData['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)
    formInputsObj.formInputObj0 = formInput0
    let formInput1 = Object.values(postBodyData)[1] //fldArrToPostPost
    let formInput2 = Object.values(postBodyData)[2] = beerAlcMargin = postBodyData['beerAlcMargPost'] //beerAlcMargPost
    let formInput3 = Object.values(postBodyData)[3] = bodyCareMargin = postBodyData['bodyCareMargPost'] //bodyCareMargPost
    let formInput4 = Object.values(postBodyData)[4] = booksMargin = postBodyData['booksMargPost'] //booksMargPost
    let formInput5 = Object.values(postBodyData)[5] = bulkMargin = postBodyData['bulkMargPost'] //bulkMargPost
    let formInput6 = Object.values(postBodyData)[6] = bulkHrbPrpkMargin = postBodyData['bulkHrbPrpkMargPost'] //bulkHrbPrpkMargPost
    let formInput7 = Object.values(postBodyData)[7] = cbdGrocMargin = postBodyData['cbdGrocMargPost'] //cbdGrocMargPost
    let formInput8 = Object.values(postBodyData)[8] = cbdSuppMargin = postBodyData['cbdSuppMargPost'] //cbdSuppMargPost
    let formInput9 = Object.values(postBodyData)[9] = cbdTopMargin = postBodyData['cbdTopMargPost'] //cbdTopMargPost
    let formInput10 = Object.values(postBodyData)[10] = consignMargin = postBodyData['consignMargPost'] //consignMargPost
    let formInput11 = Object.values(postBodyData)[11] = frozenMargin = postBodyData['frozenMargPost'] //frozenMargPost
    let formInput12 = Object.values(postBodyData)[12] = genMerchMargin = postBodyData['genMerchMargPost'] //genMerchMargPost
    let formInput13 = Object.values(postBodyData)[13] = giftMargin = postBodyData['giftMargPost'] //giftMargPost
    let formInput14 = Object.values(postBodyData)[14] = grabGoMargin = postBodyData['grabGoMargPost'] //grabGoMargPost
    let formInput15 = Object.values(postBodyData)[15] = grocMargin = postBodyData['grocMargPost'] //grocMargPost
    let formInput16 = Object.values(postBodyData)[16] = grocLocMargin = postBodyData['grocLocMargPost'] //grocLocMargPost
    let formInput17 = Object.values(postBodyData)[17] = grocLcMtMargin = postBodyData['grocLcMtMargPost'] //grocLcMtMargPost
    let formInput18 = Object.values(postBodyData)[18] = hbaMargin = postBodyData['hbaMargPost'] //hbaMargPost
    let formInput19 = Object.values(postBodyData)[19] = herbsHomeoMargin = postBodyData['herbsHomeoMargPost'] //herbsHomeoMargPost
    let formInput20 = Object.values(postBodyData)[20] = lfBrMargin = postBodyData['lfBrMargPost'] //lfBrMargPost
    let formInput21 = Object.values(postBodyData)[21] = otherMargin = postBodyData['otherMargPost'] //otherMargPost
    let formInput22 = Object.values(postBodyData)[22] = refrigMargin = postBodyData['refrigMargPost'] //refrigMargPost
    let formInput23 = Object.values(postBodyData)[23] = vitSuppMargin = postBodyData['vitSuppMargPost'] //vitSuppMargPost
    let formInput24 = Object.values(postBodyData)[24] = globalMargin = postBodyData['globalMargPost'] //globalMargPost

    let formInput25 = Object.values(postBodyData)[25] = lowerCutRqdRtlAndrea = postBodyData['lowerCutRqdRtlAndreaPost'] //lowerCutRqdRtlAndreaPost
    let formInput26 = Object.values(postBodyData)[26] = lowerCutRqdRtlBrad = postBodyData['lowerCutRqdRtlBradPost'] //lowerCutRqdRtlBradPost

    let formInput27 = Object.values(postBodyData)[27] = lowerCutoffCharm1Andrea = postBodyData['lowerCutoffCharm1AndreaPost'] //lowerCutoffCharm1AndreaPost
    let formInput28 = Object.values(postBodyData)[28] = lowerCutoffCharm1Brad = postBodyData['lowerCutoffCharm1BradPost'] //lowerCutoffCharm1BradPost

    let formInput29 = Object.values(postBodyData)[29] = lowerCutoffCharm2Andrea = postBodyData['lowerCutoffCharm2AndreaPost'] //lowerCutoffCharm2AndreaPost
    let formInput30 = Object.values(postBodyData)[30] = lowerCutoffCharm2Brad = postBodyData['lowerCutoffCharm2BradPost'] //lowerCutoffCharm2BradPost

    let formInput31 = Object.values(postBodyData)[31] = lowerCutoffCharm3Andrea = postBodyData['lowerCutoffCharm3AndreaPost'] //lowerCutoffCharm3AndreaPost
    let formInput32 = Object.values(postBodyData)[32] = lowerCutoffCharm3Brad = postBodyData['lowerCutoffCharm3BradPost'] //lowerCutoffCharm3BradPost

    let formInput33 = Object.values(postBodyData)[33] = lowerCutoffCharm4Andrea = postBodyData['lowerCutoffCharm4AndreaPost'] //lowerCutoffCharm4AndreaPost
    let formInput34 = Object.values(postBodyData)[34] = lowerCutoffCharm4Brad = postBodyData['lowerCutoffCharm4BradPost'] //lowerCutoffCharm4BradPost

    let formInput35 = Object.values(postBodyData)[35] = lowerCutoffCharm5Andrea = postBodyData['lowerCutoffCharm5AndreaPost'] //lowerCutoffCharm5AndreaPost
    let formInput36 = Object.values(postBodyData)[36] = lowerCutoffCharm5Brad = postBodyData['lowerCutoffCharm5BradPost'] //lowerCutoffCharm5BradPost

    let formInput37 = Object.values(postBodyData)[37] = lowerCutoffCharm6Andrea = postBodyData['lowerCutoffCharm6AndreaPost'] //lowerCutoffCharm6AndreaPost
    let formInput38 = Object.values(postBodyData)[38] = lowerCutoffCharm6Brad = postBodyData['lowerCutoffCharm6BradPost'] //lowerCutoffCharm6BradPost

    let formInput39 = Object.values(postBodyData)[39] = lowerCutoffCharm7Andrea = postBodyData['lowerCutoffCharm7AndreaPost'] //lowerCutoffCharm7AndreaPost
    let formInput40 = Object.values(postBodyData)[40] = lowerCutoffCharm7Brad = postBodyData['lowerCutoffCharm7BradPost'] //lowerCutoffCharm7BradPost

    let formInput41 = Object.values(postBodyData)[41] = upperCharmRqdRtlAndrea = postBodyData['upperCharmRqdRtlAndreaPost'] //upperCharmRqdRtlAndreaPost
    let formInput42 = Object.values(postBodyData)[42] = upperCharmRqdRtlBrad = postBodyData['upperCharmRqdRtlBradPost'] //upperCharmRqdRtlBradPost

    let formInput43 = Object.values(postBodyData)[43] = defaultCharm1Andrea = postBodyData['defaultCharm1AndreaPost'] //defaultCharm1AndreaPost
    let formInput44 = Object.values(postBodyData)[44] = defaultCharm1Brad = postBodyData['defaultCharm1BradPost'] //defaultCharm1BradPost

    let formInput45 = Object.values(postBodyData)[45] = defaultCharm2Andrea = postBodyData['defaultCharm2AndreaPost'] //defaultCharm2AndreaPost
    let formInput46 = Object.values(postBodyData)[46] = defaultCharm2Brad = postBodyData['defaultCharm2BradPost'] //defaultCharm2BradPost

    let formInput47 = Object.values(postBodyData)[47] = defaultCharm3Andrea = postBodyData['defaultCharm3AndreaPost'] //defaultCharm3AndreaPost
    let formInput48 = Object.values(postBodyData)[48] = defaultCharm3Brad = postBodyData['defaultCharm3BradPost'] //defaultCharm3BradPost

    let formInput49 = Object.values(postBodyData)[49] = defaultCharm4Andrea = postBodyData['defaultCharm4AndreaPost'] //defaultCharm4AndreaPost
    let formInput50 = Object.values(postBodyData)[50] = defaultCharm4Brad = postBodyData['defaultCharm4BradPost'] //defaultCharm4BradPost

    let formInput51 = Object.values(postBodyData)[51] = discountToApply = postBodyData['discountToApplyPost'] //discountToApplyPost
    console.log(`typeof discountToApply==> ${typeof discountToApply}`)
    console.log(`discountToApply==> ${discountToApply}`)
    console.log(`discountToApply * 5==> ${discountToApply * 5}`)
    let formInput52 = Object.values(postBodyData)[52] = edlpDisco = postBodyData['edlpDiscoPost'] //edlpDiscoPost

    // let formInput53 = Object.values(postBodyData)[53] //wsDiffResultsPost

    let formInput53 = typeOfIMW = Object.values(postBodyData)[53] //typeOfIMWPost
    console.log('typeOfIMW==>', typeOfIMW)
    let formInput54 = skuOveride = Object.values(postBodyData)[54] //skuOveridePost
    console.log('skuOveride==>', skuOveride)
    let formInput55 = deptFilter = Object.values(postBodyData)[55] //deptFilterPost
    console.log('deptFilter==>', deptFilter)
    formInputsObj.deptFilter = deptFilter
    let formInput56 = edlpSwitch = Object.values(postBodyData)[56] //edlpSwitchPost
    console.log('edlpSwitch==>', edlpSwitch)
    let formInput57 = skuToggle = Object.values(postBodyData)[57] //skuTogglePost
    console.log('skuToggle==>', skuToggle)
    let formInput58 = ediTblName = Object.values(postBodyData)[58] //ediTblNamePost
    console.log('ediTblName==>', ediTblName)
    let formInput59 = skuMismatchOption = Object.values(postBodyData)[59] //skuMismatchOptionPost
    console.log('skuMismatchOption==>', skuMismatchOption)

    formInputsObj.deptFilterToApply = null

    for (let k = 0; k < formInputsObj.deptFilterArr.length; k++) {
      console.log(`Object.keys(formInputsObj.deptFilterArr[${k}]==> ${Object.keys(formInputsObj.deptFilterArr[k])}`)
      if (Object.keys(formInputsObj.deptFilterArr[k]) == formInputsObj.deptFilter) {
        formInputsObj.deptFilterToApply = formInputsObj.deptFilter
      }
    }

    console.log(`formInputsObj.deptFilterToApply==> ${formInputsObj.deptFilterToApply}`)
  }
}