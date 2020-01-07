const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResults: router.post('/calcResults', (req, res, next) => {

    let deptFilterArr = [{
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

    console.log(`Object.keys(deptFilterArr[0])==> ${Object.keys(deptFilterArr[0])}`)
    console.log(`deptFilterArr[0][Object.keys(deptFilterArr[0])]==> ${deptFilterArr[0][Object.keys(deptFilterArr[0])]}`)
    console.log(`deptFilterArr[0][Object.keys(deptFilterArr[0])]['dfltMrg']==> ${deptFilterArr[0][Object.keys(deptFilterArr[0])]['dfltMrg']}`)


    let searchResults = [] //clear searchResults from previous search
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    csvContainer = []

    const postBody = req.body
    console.log('calcResults says: postBody==>', postBody)
    console.log('calcResults says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResults says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    //v//create variables for form POST data from #retailCalcUniversal form ('Search Loaded Table')
    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)
    let formInput1 = Object.values(postBody)[1] //fldArrToPostPost
    let formInput2 = Object.values(postBody)[2] = beerAlcMargin = postBody['beerAlcMargPost'] //beerAlcMargPost
    let formInput3 = Object.values(postBody)[3] = bodyCareMargin = postBody['bodyCareMargPost'] //bodyCareMargPost
    let formInput4 = Object.values(postBody)[4] = booksMargin = postBody['booksMargPost'] //booksMargPost
    let formInput5 = Object.values(postBody)[5] = bulkMargin = postBody['bulkMargPost'] //bulkMargPost
    let formInput6 = Object.values(postBody)[6] = bulkHrbPrpkMargin = postBody['bulkHrbPrpkMargPost'] //bulkHrbPrpkMargPost
    let formInput7 = Object.values(postBody)[7] = cbdGrocMargin = postBody['cbdGrocMargPost'] //cbdGrocMargPost
    let formInput8 = Object.values(postBody)[8] = cbdSuppMargin = postBody['cbdSuppMargPost'] //cbdSuppMargPost
    let formInput9 = Object.values(postBody)[9] = cbdTopMargin = postBody['cbdTopMargPost'] //cbdTopMargPost
    let formInput10 = Object.values(postBody)[10] = consignMargin = postBody['consignMargPost'] //consignMargPost
    let formInput11 = Object.values(postBody)[11] = frozenMargin = postBody['frozenMargPost'] //frozenMargPost
    let formInput12 = Object.values(postBody)[12] = genMerchMargin = postBody['genMerchMargPost'] //genMerchMargPost
    let formInput13 = Object.values(postBody)[13] = giftMargin = postBody['giftMargPost'] //giftMargPost
    let formInput14 = Object.values(postBody)[14] = grabGoMargin = postBody['grabGoMargPost'] //grabGoMargPost
    let formInput15 = Object.values(postBody)[15] = grocMargin = postBody['grocMargPost'] //grocMargPost
    let formInput16 = Object.values(postBody)[16] = grocLocMargin = postBody['grocLocMargPost'] //grocLocMargPost
    let formInput17 = Object.values(postBody)[17] = grocLcMtMargin = postBody['grocLcMtMargPost'] //grocLcMtMargPost
    let formInput18 = Object.values(postBody)[18] = hbaMargin = postBody['hbaMargPost'] //hbaMargPost
    let formInput19 = Object.values(postBody)[19] = herbsHomeoMargin = postBody['herbsHomeoMargPost'] //herbsHomeoMargPost
    let formInput20 = Object.values(postBody)[20] = lfBrMargin = postBody['lfBrMargPost'] //lfBrMargPost
    let formInput21 = Object.values(postBody)[21] = otherMargin = postBody['otherMargPost'] //otherMargPost
    // let formInput22 = Object.values(postBody)[22] = produceMargin = postBody['produceMargPost'] //produceMargPost
    // let formInput23 = Object.values(postBody)[23] = prodCSAMargin = postBody['prodCSAMargPost'] //prodCSAMargPost
    // let formInput24 = Object.values(postBody)[24] = prodFlorMargin = postBody['prodFlorMargPost'] //prodFlorMargPost
    // let formInput25 = Object.values(postBody)[25] = prodLocMargin = postBody['prodLocMargPost'] //prodLocMargPost
    // let formInput26 = Object.values(postBody)[26] = prodPkgMargin = postBody['prodPkgMargPost'] //prodPkgMargPost
    // let formInput27 = Object.values(postBody)[27] = prodPlantsMargin = postBody['prodPlantsMargPost'] //prodPlantsMargPost
    // let formInput28 = Object.values(postBody)[28] = prodPrepMargin = postBody['prodPrepMargPost'] //prodPrepMargPost
    // let formInput29 = Object.values(postBody)[29] = prodSldBrMargin = postBody['sldBrMargPost'] //prodSldBrMargPost
    let formInput22 = Object.values(postBody)[22] = refrigMargin = postBody['refrigMargPost'] //refrigMargPost
    let formInput23 = Object.values(postBody)[23] = vitSuppMargin = postBody['vitSuppMargPost'] //vitSuppMargPost
    // let formInput32 = Object.values(postBody)[32] = wlnsPrctTipsMargin = postBody['wlnsPrctTipsMargPost'] //wlnsPrctTipsMargPost
    // let formInput33 = Object.values(postBody)[33] = wlnsPrctMargin = postBody['wlnsPrctMargPost'] //wlnsPrctMargPost
    let formInput24 = Object.values(postBody)[24] = globalMargin = postBody['globalMargPost'] //globalMargPost

    let formInput25 = Object.values(postBody)[25] = lowerCutRqdRtlAndrea = postBody['lowerCutRqdRtlAndreaPost'] //lowerCutRqdRtlAndreaPost
    let formInput26 = Object.values(postBody)[26] = lowerCutRqdRtlBrad = postBody['lowerCutRqdRtlBradPost'] //lowerCutRqdRtlBradPost

    let formInput27 = Object.values(postBody)[27] = lowerCutoffCharm1Andrea = postBody['lowerCutoffCharm1AndreaPost'] //lowerCutoffCharm1AndreaPost
    let formInput28 = Object.values(postBody)[28] = lowerCutoffCharm1Brad = postBody['lowerCutoffCharm1BradPost'] //lowerCutoffCharm1BradPost

    let formInput29 = Object.values(postBody)[29] = lowerCutoffCharm2Andrea = postBody['lowerCutoffCharm2AndreaPost'] //lowerCutoffCharm2AndreaPost
    let formInput30 = Object.values(postBody)[30] = lowerCutoffCharm2Brad = postBody['lowerCutoffCharm2BradPost'] //lowerCutoffCharm2BradPost

    let formInput31 = Object.values(postBody)[31] = lowerCutoffCharm3Andrea = postBody['lowerCutoffCharm3AndreaPost'] //lowerCutoffCharm3AndreaPost
    let formInput32 = Object.values(postBody)[32] = lowerCutoffCharm3Brad = postBody['lowerCutoffCharm3BradPost'] //lowerCutoffCharm3BradPost

    let formInput33 = Object.values(postBody)[33] = lowerCutoffCharm4Andrea = postBody['lowerCutoffCharm4AndreaPost'] //lowerCutoffCharm4AndreaPost
    let formInput34 = Object.values(postBody)[34] = lowerCutoffCharm4Brad = postBody['lowerCutoffCharm4BradPost'] //lowerCutoffCharm4BradPost

    let formInput35 = Object.values(postBody)[35] = lowerCutoffCharm5Andrea = postBody['lowerCutoffCharm5AndreaPost'] //lowerCutoffCharm5AndreaPost
    let formInput36 = Object.values(postBody)[36] = lowerCutoffCharm5Brad = postBody['lowerCutoffCharm5BradPost'] //lowerCutoffCharm5BradPost

    let formInput37 = Object.values(postBody)[37] = lowerCutoffCharm6Andrea = postBody['lowerCutoffCharm6AndreaPost'] //lowerCutoffCharm6AndreaPost
    let formInput38 = Object.values(postBody)[38] = lowerCutoffCharm6Brad = postBody['lowerCutoffCharm6BradPost'] //lowerCutoffCharm6BradPost

    let formInput39 = Object.values(postBody)[39] = lowerCutoffCharm7Andrea = postBody['lowerCutoffCharm7AndreaPost'] //lowerCutoffCharm7AndreaPost
    let formInput40 = Object.values(postBody)[40] = lowerCutoffCharm7Brad = postBody['lowerCutoffCharm7BradPost'] //lowerCutoffCharm7BradPost

    let formInput41 = Object.values(postBody)[41] = upperCharmRqdRtlAndrea = postBody['upperCharmRqdRtlAndreaPost'] //upperCharmRqdRtlAndreaPost
    let formInput42 = Object.values(postBody)[42] = upperCharmRqdRtlBrad = postBody['upperCharmRqdRtlBradPost'] //upperCharmRqdRtlBradPost

    let formInput43 = Object.values(postBody)[43] = defaultCharm1Andrea = postBody['defaultCharm1AndreaPost'] //defaultCharm1AndreaPost
    let formInput44 = Object.values(postBody)[44] = defaultCharm1Brad = postBody['defaultCharm1BradPost'] //defaultCharm1BradPost

    let formInput45 = Object.values(postBody)[45] = defaultCharm2Andrea = postBody['defaultCharm2AndreaPost'] //defaultCharm2AndreaPost
    let formInput46 = Object.values(postBody)[46] = defaultCharm2Brad = postBody['defaultCharm2BradPost'] //defaultCharm2BradPost

    let formInput47 = Object.values(postBody)[47] = defaultCharm3Andrea = postBody['defaultCharm3AndreaPost'] //defaultCharm3AndreaPost
    let formInput48 = Object.values(postBody)[48] = defaultCharm3Brad = postBody['defaultCharm3BradPost'] //defaultCharm3BradPost

    let formInput49 = Object.values(postBody)[49] = defaultCharm4Andrea = postBody['defaultCharm4AndreaPost'] //defaultCharm4AndreaPost
    let formInput50 = Object.values(postBody)[50] = defaultCharm4Brad = postBody['defaultCharm4BradPost'] //defaultCharm4BradPost

    let formInput51 = Object.values(postBody)[51] = discountToApply = postBody['discountToApplyPost'] //discountToApplyPost
    console.log(`typeof discountToApply==> ${typeof discountToApply}`)
    console.log(`discountToApply==> ${discountToApply}`)
    console.log(`discountToApply * 5==> ${discountToApply * 5}`)
    let formInput52 = Object.values(postBody)[52] = edlpDisco = postBody['edlpDiscoPost'] //edlpDiscoPost


    // let formInput52 = Object.values(postBody)[52] //prKyPost

    // let formInput53 = Object.values(postBody)[53] //upcPost
    // let formInput54 = Object.values(postBody)[54] //skuPost
    // let formInput55 = Object.values(postBody)[55] //descrPost
    // let formInput56 = Object.values(postBody)[56] //updtWSPost

    // let formInput57 = Object.values(postBody)[57] //rbMargPost
    // let formInput58 = Object.values(postBody)[58] //rtlReqdPost

    // let formInput59 = Object.values(postBody)[59] //msrpPost

    let formInput53 = Object.values(postBody)[53] //wsDiffResultsPost

    let formInput54 = typeOfIMW = Object.values(postBody)[54] //typeOfIMWPost
    console.log('typeOfIMW==>', typeOfIMW)
    let formInput55 = skuOveride = Object.values(postBody)[55] //skuOveridePost
    console.log('skuOveride==>', skuOveride)
    let formInput56 = deptFilter = Object.values(postBody)[56] //deptFilterPost
    console.log('deptFilter==>', deptFilter)
    let formInput57 = edlpSwitch = Object.values(postBody)[57] //edlpSwitchPost
    console.log('edlpSwitch==>', edlpSwitch)
    let formInput58 = skuToggle = Object.values(postBody)[58] //skuTogglePost
    console.log('skuToggle==>', skuToggle)
    let formInput59 = ediTblName = Object.values(postBody)[59] //ediTblNamePost
    console.log('ediTblName==>', ediTblName)

    // let formInput64 = itemUnitValSwitch = Object.values(postBody)[64] //itemUnitValSwitchPost
    // console.log('itemUnitValSwitch==>', itemUnitValSwitch)

    // let formInput64 = tableToJoin = Object.values(postBody)[64] //tableToJoinPost
    // console.log('tableToJoin==>', tableToJoin)

    //^//create variables for form POST data from #retailCalcUniversal form ('Search Loaded Table')

    var deptFilterToApply = null

    for (let k = 0; k < deptFilterArr.length; k++) {
      console.log(`Object.keys(deptFilterArr[${k}]==> ${Object.keys(deptFilterArr[k])}`)
      if (Object.keys(deptFilterArr[k]) == deptFilter) {
        deptFilterToApply = deptFilter
      }
    }

    console.log(`deptFilterToApply==> ${deptFilterToApply}`)

    if (postBody['wsDiffResultsPost'].length > 0) { //must check to see if anything was entered in WS Diff Results
      //input, otherwise get 'unexpected end of JSON' error
      let wsDiffResults = JSON.parse(postBody['wsDiffResultsPost'])
    }

    //v//sanitize table column header post results from #retailCalcUniversal form ('Search Loaded Table')
    let toSplitField = postBody['fldArrToPostPost']
    // console.log('calcResults says: toSplitField before replace==>', toSplitField)
    let sanitizeColumnFields = /(\[)|(\])|(")/g
    let toSplitFieldReplace = toSplitField.replace(sanitizeColumnFields, "")
    // console.log('calcResults says: toSplitFieldReplace after replace==>', toSplitFieldReplace)
    let splitFieldResult = toSplitFieldReplace.split(',')
    // console.log('calcResults says: splitFieldResult==>', splitFieldResult)
    //^//sanitize table column header post results from #retailCalcUniversal form ('Search Loaded Table')



    //****************************************************************************************************************** */
    //v//generate generic column headers corresponding to nhcrtEdiJoin table column headers that are associated with
    //primary key, upc, sku, name, cost, msrp, etc...
    let genericHeaderObj = {}

    for (let i = 0; i < splitFieldResult.length; i++) {
      if (splitFieldResult[i].includes('ri_t0d')) { //primary key - don't think this will be needed for inv mnt wksht
        genericHeaderObj.primarykeyHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'invScanCode') { //Item ID (1); targets upc from catapult v_InventoryMaster table
        genericHeaderObj.upcHeader = splitFieldResult[i]
        // console.log('calcResults says: genericHeaderObj.upcHeader==>', genericHeaderObj.upcHeader)
      }
      if (splitFieldResult[i] == 'ordSupplierStockNumber') { //Supplier Unit ID (25); targets SKU from catapult v_InventoryMaster portion of
        //nhcrtEdiJoin table; ALSO NEED TO TARGET ediSKU from EDI portion of nhcrtEdiJoin table & THEN CHECK TO SEE IF THEY'RE THE SAME
        genericHeaderObj.cpltSKUHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'ediSKU') { //Supplier Unit ID (25); targets SKU from catapult v_InventoryMaster portion of
        //nhcrtEdiJoin table; ALSO NEED TO TARGET ediSKU from EDI portion of nhcrtEdiJoin table & THEN CHECK TO SEE IF THEY'RE THE SAME
        genericHeaderObj.ediSKUHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'invName') { //Item Name (6); targets prod name from catapult v_InventoryMaster portion of nhcrtEdiJoin table
        genericHeaderObj.nameHeader = splitFieldResult[i]
      }
      //v//20191121 MARGIN REPORT ISSUE///////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (splitFieldResult[i] == 'ediCost') { //Last Cost(?) ==>updated WS; cost from EDI portion of nhcrtEdiJoin
        genericHeaderObj.ediCostHeader = splitFieldResult[i]
      } //targeting ediCost from vendor catalog
      if (splitFieldResult[i] == 'invLastcost') { //Last Cost(?) ==>updated WS; cost from EDI portion of nhcrtEdiJoin
        genericHeaderObj.invLastcostHeader = splitFieldResult[i]
      } //targeting invLastcost from catapult v_InventoryMaster table -- probably going to want to check if ediCost == invLastCost
      //^//20191121 MARGIN REPORT ISSUE///////////////////////////////////////////////////////////////////////////////////////////////////////////

      // if (splitFieldResult[i].includes('item_price') || splitFieldResult[i].includes('msrp')) { //Suggested Retail ==>msrp?
      //   //***NEED TO ADD MSRP FROM EDI table to nhcrtEdiJoin results*/
      //   genericHeaderObj.msrpHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i].includes('ediPrice')) { //Suggested Retail ==>msrp?
        //targets msrp from edi table
        genericHeaderObj.msrpHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_price') { //
      //   genericHeaderObj.rbPriceHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'sibBasePrice') { //
        genericHeaderObj.sibBasePriceHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_dept') { //
      //   genericHeaderObj.rbDeptHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'dptName') { //
        genericHeaderObj.rbDeptHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_dept_id') {
      //   genericHeaderObj.rbDeptIDHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'dptNumber') {
        genericHeaderObj.rbDeptIDHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_dept_margin') {
      //   genericHeaderObj.rbDeptMarginHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'sibIdealMargin') {
        genericHeaderObj.sibIdealMarginHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_supplier') {
      //   genericHeaderObj.rbSupplierHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'venCompanyname') {
        genericHeaderObj.rbSupplierHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'edlp_flag') {
      //   genericHeaderObj.edlpFlagHeader = splitFieldResult[i]
      // }
      // if (splitFieldResult[i] == 'sale_flag') {
      //   genericHeaderObj.saleFlagHeader = splitFieldResult[i]
      // }
      // if (splitFieldResult[i] == 'kehe_uos') { //need to target kehe_uos in order to divide by that for kehe items sold by case
      //   genericHeaderObj.keheUOSHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'oupName') { //need to target catapult uos(oupName) in order to divide by that for any items sold by case
        genericHeaderObj.oupName = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'ordQuantityInOrderUnit') { //need to target catapult uos(oupName) in order to divide by that for any items sold by case
        genericHeaderObj.ordQuantityInOrderUnit = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'stoName') { //targets Catapult nhcrt stoName column
        genericHeaderObj.stoName = splitFieldResult[i]
      }
    }

    console.log('calcResults says: genericHeaderObj==>', genericHeaderObj)
    //^//generate generic column headers corresponding to margin_report table column headers that are associated with
    //primary key, upc, sku, name, cost, & msrp
    //****************************************************************************************************************** */



    function showSearchResults(rows) {
      console.log(`rows.length==>${rows.length}`)
      let nejRows = rows[0] //targets 1st query on NEJ table
      let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
      // let rainbowCatRows = rows[2] //targets 3rd query on rcth (rainbow--cat table hub) table

      console.log(`JSON.stringify(nejRows[0])==> ${JSON.stringify(nejRows[0])}`)
      console.log(`JSON.stringify(edlpRows[0])==> ${JSON.stringify(edlpRows[0])}`)

      for (let i = 0; i < nejRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
        //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table
        let srcRsObj = {}
        let reviewObj = {} //push data to this obj for review CSV

        srcRsObj['invPK'] = reviewObj['invPK'] = nejRows[i]['invPK'] //populate srcRsObj & reviewObj with invPK from Catapult
        srcRsObj['invCPK'] = reviewObj['invCPK'] = nejRows[i]['invCPK'] //populate srcRsObj & reviewObj with invCPK from Catapult

        function divideCostToUOS_Rtl_IMW() {
          if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually don't want to apply ongoing discount (discountToApply) OR edplDisco
            //at the RETAIL level, since we should have already applied it at the WHOLESALE level. VERY IMPORTANT!!!
            var wsDiscoVar = discountToApply
          } else {
            var wsDiscoVar = edlpDisco
          }
          ////v//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
          let oupNameVar = nejRows[i][genericHeaderObj.oupName]
          oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element
          if (oupNameSplit[0].toLowerCase().includes('ea') && oupNameSplit[0].toLowerCase() !== 'each' && oupNameSplit[0].toLowerCase() !== 'ea' ||
            oupNameSplit[0].toLowerCase().includes('cs') && oupNameSplit[0].toLowerCase() !== 'case' && oupNameSplit[0].toLowerCase() !== 'cs') {
            if (oupNameSplit[1] !== undefined) {
              reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
              //AND deduct any vendor discount from ediCost
              reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
              //AND deduct any vendor discount from ediCost
              reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameSplit[1] //set csPkgMltpl to numerical portion of oupName
            }
          } else {
            console.log(`oupNameSplit[0].toLowerCase()==> ${oupNameSplit[0].toLowerCase()}`)
            console.log(`oupNameVar==> ${oupNameVar}`)
            if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
              oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
              reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //divide ediCost by 1 for items with oupName value of just "each", "ea", "case", or "cs"
              //AND deduct any vendor discount from ediCost
              reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
              //AND deduct any vendor discount from ediCost
              reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for just "EA", "EACH", "CS", or "CASE"
            } else {
              reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //divide ediCost by oupName non-parsed value
              //AND deduct any vendor discount from ediCost
              reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
              //AND deduct any vendor discount from ediCost
              reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameVar //set csPkgMltpl to oupNameVar (since at this point, oupName should just be a number)
            }
          }
          ////^//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
        }

        function divideCostToUOS_WS_IMW() {
          if (typeOfIMW.toLowerCase() == 'wholesale') {

            if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually don't want to apply ongoing discount (discountToApply) OR edplDisco
              //at the RETAIL level, since we should have already applied it at the WHOLESALE level. VERY IMPORTANT!!!
              var wsDiscoVar = discountToApply
            } else {
              var wsDiscoVar = edlpDisco
            }

            ////v//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
            let oupNameVar = nejRows[i][genericHeaderObj.oupName]
            oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element
            if (oupNameSplit[0].toLowerCase().includes('ea') && oupNameSplit[0].toLowerCase() !== 'each' && oupNameSplit[0].toLowerCase() !== 'ea' ||
              oupNameSplit[0].toLowerCase().includes('cs') && oupNameSplit[0].toLowerCase() !== 'case' && oupNameSplit[0].toLowerCase() !== 'cs') {
              if (oupNameSplit[1] !== undefined) {
                let ediTestCost1 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]}` //apply vendor WS discount, if applicable
                let ediTstCst1Tr = ediTestCost1.trim().replace(/"/g, '')
                let ediTstCst1TrRnd = Math.round(ediTstCst1Tr * 100) / 100 //converts the result to a number with just 2 decimal places
                let cpltTstCst1Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
                let cpltTstCst1TrRnd = Math.round(cpltTstCst1Tr * 100) / 100 //converts the result to a number with just 2 decimal places
                if (ediTstCst1TrRnd !== cpltTstCst1TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost
                  reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
                  //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                  reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameSplit[1]) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
                  //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                  reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameSplit[1] //set csPkgMltpl to numerical portion of oupName
                  console.log(`ediTstCst1TrRnd==> ${ediTstCst1TrRnd}`)
                  console.log(`cpltTstCst1TrRnd==> ${cpltTstCst1TrRnd}`)
                  console.log(`oupNameSplit[1]==> ${oupNameSplit[1]}`)
                } else {
                  // srcRsObj['ediCostMod'] = reviewObj['ediCostMod'] = 'test1'
                }

              }
            } else {
              if (oupNameVar.trim().toLowerCase() == 'each' || oupNameVar.trim().toLowerCase() == 'ea' ||
                oupNameVar.trim().toLowerCase() == 'case' || oupNameVar.trim().toLowerCase() == 'cs') {
                let ediTestCost2 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1}` //apply vendor WS discount, if applicable
                let ediTstCst2Tr = ediTestCost2.trim().replace(/"/g, '')
                let ediTstCst2TrRnd = Math.round(ediTstCst2Tr * 100) / 100 //converts the result to a number with just 2 decimal places
                let cpltTstCst2Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
                let cpltTstCst2TrRnd = Math.round(cpltTstCst2Tr * 100) / 100 //converts the result to a number with just 2 decimal places
                if (ediTstCst2TrRnd !== cpltTstCst2TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost  
                  reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //divide ediCost by oupName parsed value (index 1 = numerical value)
                  //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                  reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / 1) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
                  //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                  reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = 1 //set csPkgMltpl to 1 for just "EA", "EACH", "CS", or "CASE"
                  console.log(`ediTstCst2TrRnd==> ${ediTstCst2TrRnd}`)
                  console.log(`cpltTstCst2TrRnd==> ${cpltTstCst2TrRnd}`)
                } else {
                  // srcRsObj['ediCostMod'] = reviewObj['ediCostMod'] = 'test2'
                }
              } //divide ediCost by 1 for items with oupName value of just "each", "ea", "case", or "cs"
              else {
                let ediTestCost3 = `${(srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar}` //apply vendor WS discount, if applicable
                let ediTestCost3Tr = ediTestCost3.trim().replace(/"/g, '')
                let ediTestCost3TrRnd = Math.round(ediTestCost3Tr * 100) / 100 //converts the result to a number with just 2 decimal places
                let cpltTstCst3Tr = srcRsObj['cpltCost'].trim().replace(/"/g, '')
                let cpltTstCst3TrRnd = Math.round(cpltTstCst3Tr * 100) / 100 //converts the result to a number with just 2 decimal places
                if (ediTestCost3TrRnd !== cpltTstCst3TrRnd) { //only handle items where new edi cat cost not equal to exist. catapult cost
                  reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //divide ediCost by oupName non-parsed value
                  //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                  reviewObj['lastCost'] = srcRsObj['lastCost'] = Math.round(((srcRsObj['ediCost'] - srcRsObj['ediCost'] * wsDiscoVar) / oupNameVar) * 100) / 100 //change lastCost to ediCostMod for wholesale IMWs
                  //AND apply wsDiscoVar to cost to account for ongoing discos as well as EDLP discos
                  reviewObj['csPkgMltpl'] = srcRsObj['csPkgMltpl'] = oupNameVar //set csPkgMltpl to oupNameVar (since at this point, oupName should just be a number)
                  console.log(`ediTstCst3TrRnd==> ${ediTstCst3TrRnd}`)
                  console.log(`cpltTstCst3TrRnd==> ${cpltTstCst3TrRnd}`)
                } else {
                  // srcRsObj['ediCostMod'] = reviewObj['ediCostMod'] = 'test3'
                }
              }
            }
            ////^//handle "case" and "each" division//////////////////////////////////////////////////////////////////////////////////
            //}
          }

        }

        function calcCharm(departmentMargin, lowerCutRqdRtl, lowerCutoffCharm1, lowerCutoffCharm2, lowerCutoffCharm3, lowerCutoffCharm4,
          lowerCutoffCharm5, lowerCutoffCharm6, lowerCutoffCharm7, upperCharmRqdRtl, defaultCharm1, defaultCharm2, defaultCharm3, defaultCharm4) {

          if (typeOfIMW.toLowerCase() == 'retail') {
            //apply DEPARTMENT margin to calculate charm pricing

            if (srcRsObj['ediCost'] > 0) {

              divideCostToUOS_Rtl_IMW()

              srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod']) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
              //v//ACTUALLY, IT APPEARS WE DO NOT want to apply ongoing discount (discountToApply) OR edplDisco at the RETAIL level/////////////////////
              // if (srcRsObj['edlpVar'] !== 'EDLP') { //we actually DO want to apply ongoing discount (discountToApply) OR edplDisco
              //   //at the RETAIL level, since even though we should have already applied it at the WHOLESALE level, we are using
              //   //cost from the EDI Vendor catalog (which has not yet had the disco applied) to calc updated retail VERY IMPORTANT!!!
              //   srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * discountToApply) / (departmentMargin - 1)) * 100) / 100
              //   //applies margin to WS for NON-EDLP
              // } else {
              //   srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * edlpDisco) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
              //   //applies margin to WS for EDLP
              // }
              //^//ACTUALLY, IT APPEARS WE DO NOT want to apply ongoing discount (discountToApply) OR edplDisco at the RETAIL level/////////////////////
              // srcRsObj['reqdRetail'] = reviewObj['reqdRetail'] = Math.round((-(srcRsObj['ediCostMod'] - srcRsObj['ediCostMod'] * discountToApply) / (departmentMargin - 1)) * 100) / 100 //applies margin to WS
              //AND also applies any % discount; discountToApply is set at default 0
              //Finally, Math.round(number*100)/100 converts the result to a number with just 2 decimal places.
              if (srcRsObj['reqdRetail'] % 1 < .10 && srcRsObj['reqdRetail'] > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
                dbl0Or10CharmResult = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 - .01
                // reviewObj['charm'] = srcRsObj['charm'] = '"' + dbl0Or10CharmResult + '"'
                reviewObj['charm'] = srcRsObj['charm'] = dbl0Or10CharmResult
                return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm']
              } else {
                if (srcRsObj['reqdRetail'] > 0) {
                  if (srcRsObj['reqdRetail'] < lowerCutRqdRtl) { //if req'd rtl is below lower cutoff
                    if ((srcRsObj['reqdRetail'] % 1) < .20) {
                      if (lowerCutoffCharm1 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm1
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm2
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) < .30) {
                      if (lowerCutoffCharm2 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm2
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm3
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) < .40) {
                      if (lowerCutoffCharm3 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm3
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm4
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) < .50) {
                      if (lowerCutoffCharm4 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm4
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm5
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) < .60) {
                      if (lowerCutoffCharm5 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm5
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm6
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) < .80) {
                      if (lowerCutoffCharm6 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm6
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm7
                      }
                    }
                    if ((srcRsObj['reqdRetail'] % 1) > .80) {
                      if (lowerCutoffCharm7 > 0) {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + lowerCutoffCharm7
                      } else {
                        return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail']
                      }
                    }
                  } else {
                    if (srcRsObj['reqdRetail'] < upperCharmRqdRtl) { //if req'd rtl is below upper charm cutoff ($12 for Brad & $9999 for Andrea)
                      if ((srcRsObj['reqdRetail'] % 1) <= .35) { //bump anything from #.10 to #.35 ==> #.29
                        if (defaultCharm1 > 0) {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm1
                        } else {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm2
                        }
                      }
                      if ((srcRsObj['reqdRetail'] % 1) <= .55) { //bump anything from #.36 to #.55 ==> #.49
                        if (defaultCharm2 > 0) {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm2
                        } else {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm3
                        }
                      }
                      if (srcRsObj['reqdRetail'] % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.79 (Brad); Andrea gets bumped
                        //to #.99 for anything from #.56 to #.85 (because defaultCharm3 for Brad is .79, but for Andrea it is .99)
                        if (defaultCharm3 > 0) {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm3
                        } else {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                        }
                      }
                      if (srcRsObj['reqdRetail'] % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                        if (lowerCutoffCharm4 > 0) {
                          return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                        }
                      }
                    } else {
                      return srcRsObj['sugstdRtl'] = reviewObj['charm'] = srcRsObj['charm'] = srcRsObj['reqdRetail'] - srcRsObj['reqdRetail'] % 1 + defaultCharm4
                    }
                  }
                }
              }
            } else {
              srcRsObj['reqdRetail'] = ""
              srcRsObj['charm'] = ""
            }
          }
        }

        function revealAppliedMarg(departmentMargin) {
          srcRsObj['appldMrgn'] = reviewObj['appldMrgn'] = departmentMargin * 100
        }

        srcRsObj['ri_t0d'] = nejRows[i][genericHeaderObj.primarykeyHeader] //for every row returned from sql query of NEJ table,
        //populate search results onject (srcRsObj) with corresponding primary key mapped to a key of 'ri_t0d' 
        srcRsObj['upc'] = nejRows[i][genericHeaderObj.upcHeader] //Item ID
        // console.log('calcResults says: srcRsObj[\'upc\']~~~>', srcRsObj['upc'])
        reviewObj['upc'] = nejRows[i][genericHeaderObj.upcHeader] //Item ID


        //v//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////
        for (let j = 0; j < edlpRows.length; j++) {
          srcRsObj['edlpUPC'] = edlpRows[j]['edlp_upc']
          reviewObj['edlpUPC'] = edlpRows[j]['edlp_upc'] //INCLUDE in save2CSVreview export data

          if (srcRsObj['upc'] == srcRsObj['edlpUPC']) {
            srcRsObj['edlpVar'] = "EDLP"
            reviewObj['edlpVar'] = "EDLP"
          }
        }
        //^//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////

        srcRsObj['cpltCost'] = reviewObj['cpltCost'] = nejRows[i][genericHeaderObj.invLastcostHeader]

        srcRsObj['deptID'] = "" //Department ID
        srcRsObj['deptName'] = "" //Department Name
        srcRsObj['rcptAlias'] = "" //Receipt Alias
        srcRsObj['brand'] = "" //Brand

        if (typeOfIMW.toLowerCase() == 'new') {
          if (nejRows[i][genericHeaderObj.nameHeader].includes(',')) { //remove any commas from item names, so csv isn't horked
            var cleanedName = nejRows[i][genericHeaderObj.nameHeader].replace(',', '')
            srcRsObj['itemName'] = cleanedName
          } else {
            srcRsObj['itemName'] = nejRows[i][genericHeaderObj.nameHeader]
          }
        } else {
          srcRsObj['itemName'] = "" //Item Name
        }

        srcRsObj['size'] = "" //Size
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //v//20191122 moved SUGGESTED RETAIL to pf8 & now populating the IMW sugstdRtl column with RB charm price
        // srcRsObj['sugstdRtl'] = nejRows[i][genericHeaderObj.msrpHeader] //Suggested Retail
        //TODO: May need to change this to srcRsObj['sugstdRtl'] = srcRsObj['charm'] (will have to declare it in calcCharm() function,
        //where you are actually calculating srcRsObj['charm']. I don't think this is a good idea AT ALL, especially given the fact
        //that Catapult specifically defines suggested retail as MSRP, so the way you're currently doing it is the correct way.
        //For now, if it is an issue with Tom, just manually change sugstdRtl column to be same as charm column)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // srcRsObj['charm'] = "" //Base Price ==>INCLUDE in save2CSVreview export data
        srcRsObj['autoDiscount'] = "" //Auto Discount

        // srcRsObj['idealMarg'] = "" //Ideal Margin
        srcRsObj['idealMarg'] = nejRows[i][genericHeaderObj.sibIdealMarginHeader] //set idealMarg to what it actually is in Catapult

        srcRsObj['wtPrfl'] = "" //Weight Profile
        srcRsObj['tax1'] = "" //Tax1
        srcRsObj['tax2'] = "" //Tax2
        srcRsObj['tax3'] = "" //Tax3
        srcRsObj['spclTndr1'] = "" //Special Tender 1
        srcRsObj['spclTndr2'] = "" //Special Tender 2
        srcRsObj['posPrmpt'] = "" //POS Prompt
        srcRsObj['lctn'] = "" //Location
        srcRsObj['altID'] = "" //Alternate ID
        srcRsObj['altRcptAlias'] = "" //Alternate Receipt Alias
        srcRsObj['pkgQnt'] = "" //Package Quantity
        srcRsObj['cpltSKU'] = nejRows[i][genericHeaderObj.cpltSKUHeader] //Supplier Unit ID
        reviewObj['cpltSKU'] = nejRows[i][genericHeaderObj.cpltSKUHeader] //Supplier Unit ID
        srcRsObj['ediSKU'] = nejRows[i][genericHeaderObj.ediSKUHeader] //Supplier Unit ID
        reviewObj['ediSKU'] = nejRows[i][genericHeaderObj.ediSKUHeader] //Supplier Unit ID

        if (skuToggle.toLowerCase() == 'edi') { //provide option to choose which SKU (EDI vs Catapult) to populate IMW with
          srcRsObj['imwSKU'] = reviewObj['imwSKU'] = srcRsObj['ediSKU']
        } else {
          srcRsObj['imwSKU'] = reviewObj['imwSKU'] = srcRsObj['cpltSKU']
        }

        if (reviewObj['ediSKU'] !== reviewObj['cpltSKU']) {
          srcRsObj['skuMismatch'] = reviewObj['skuMismatch'] = reviewObj['upc']
        } else {
          srcRsObj['skuMismatch'] = reviewObj['skuMismatch'] = ''
        }

        srcRsObj['splrID'] = nejRows[i][genericHeaderObj.rbSupplierHeader] //Supplier ID (EDI-VENDORNAME)
        srcRsObj['unit'] = "" //Unit

        srcRsObj['oupName'] = nejRows[i][genericHeaderObj.oupName] //oupName from catapult
        reviewObj['oupName'] = nejRows[i][genericHeaderObj.oupName] //oupName from catapult

        srcRsObj['stoName'] = nejRows[i][genericHeaderObj.stoName] //stoName from catapult
        reviewObj['stoName'] = nejRows[i][genericHeaderObj.stoName] //stoName from catapult

        // srcRsObj['numPkgs'] = "" //Number of Packages

        srcRsObj['numPkgs'] = reviewObj['numPkgs'] = 1 //set numPkgs (for IMW) to 1 FOR EVERYTHING (CRITICAL)

        srcRsObj['pf1'] = "" //Power Field 1 (today's date) - no, Tom says this should be pf5
        srcRsObj['pf2'] = "" //Power Field 2 (Supplier ID (EDI-VENDORNAME) again, for some reason)
        reviewObj['pf2'] = "" //Power Field 2 (Supplier ID (EDI-VENDORNAME) again, for some reason)
        srcRsObj['pf3'] = "" //Power Field 3 try to get department margin
        // reviewObj['pf3'] = //Power Field 3 revealAppliedMarg()
        srcRsObj['pf4'] = "" //Power Field 4
        //v//provide different update messages, based on what type of update you're doing (i.e. ws IMW, retail IMW, new item IMW)
        if (typeOfIMW.toLowerCase() == 'wholesale') {
          srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " WS UPDT (pf5)" //Power Field 5 - today's date
          srcRsObj['pf8'] = "" //Power Field 8
        }
        if (typeOfIMW.toLowerCase() == 'retail') {
          srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " RTL UPDT (pf5)" //Power Field 5 - today's date
          srcRsObj['pf8'] = `ACTUAL MSRP: ${nejRows[i][genericHeaderObj.msrpHeader]}` //Suggested Retail //Power Field 8 - this will target the ACTUAL MSRP
        }
        if (typeOfIMW.toLowerCase() == 'new') {
          srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + " NEW ITEM UPDT (pf5)" //Power Field 5 - today's date
          srcRsObj['pf8'] = "" //Power Field 8
        }
        //^//provide different update messages, based on what type of update you're doing (i.e. ws IMW, retail IMW, new item IMW)

        // srcRsObj['pf5'] = new Date().toISOString().split('T', 1)[0] + "RTL UPDT (pf5)" //Power Field 5 - today's date
        srcRsObj['pf6'] = nejRows[i][genericHeaderObj.rbSupplierHeader] //Power Field 6 //EDI-VENDORNAME INCLUDE in save2CSVreview export data
        reviewObj['pf6'] = nejRows[i][genericHeaderObj.rbSupplierHeader] //Power Field 6 //EDI-VENDORNAME INCLUDE in save2CSVreview export data
        srcRsObj['pf7'] = "" //Power Field 7
        // srcRsObj['pf8'] = "" //Power Field 8

        srcRsObj['onhndQnt'] = "" //On Hand Quantity
        srcRsObj['rdrPnt'] = "" //Reorder Point
        srcRsObj['mcl'] = "" //Maintain Constant Level
        srcRsObj['rdrQnt'] = "" //Reorder Quantity

        srcRsObj['memo'] = "" //Memo

        srcRsObj['flrRsn'] = "" //Failure Reason

        srcRsObj['dsd'] = "" //DSD

        srcRsObj['dscMltplr'] = "" //Discount Multiplier

        // srcRsObj['csPkgMltpl'] = "" //Case Package Multiple -- THIS IS NOW SET IN divideCostToUOS_Rtl_IMW() & divideCostToUOS_WS_IMW()

        // srcRsObj['ovr'] = reviewObj['ovr'] = 0 //set ovr (for IMW) to 0 FOR EVERYTHING (CRITICAL)
        // //this will NOT give buyers the option to override to buy "eaches" for items vendors sell to us in cases
        // //AS A GENERAL RULE, THIS SHOULD ALWAYS BE SET TO 0... IN SOME CASES, WE MIGHT CHANGE TO 1

        srcRsObj['ovr'] = reviewObj['ovr'] = 1 //20191224 set ovr (for IMW) to 1 FOR EVERYTHING per MaryKate's request
        //this WILL give buyers the option to override to buy "eaches" for items vendors sell to us in "cases"

        // srcRsObj['ovr'] = "" //OVR
        // srcRsObj['ovr'] = "" //OVR


        srcRsObj['name'] = nejRows[i][genericHeaderObj.nameHeader] //INCLUDE in save2CSVreview export data
        reviewObj['name'] = nejRows[i][genericHeaderObj.nameHeader]

        //v//this should get set as the value from edi catalog & never changed 
        reviewObj['ediCost'] = srcRsObj['ediCost'] = nejRows[i][genericHeaderObj.ediCostHeader] //INCLUDE in save2CSVreview export data
        //^//this should get set as the value from edi catalog & never changed 


        if (typeOfIMW.toLowerCase() == 'retail') { //only apply this if running retail
          //v//this should get initially set as the value from edi catalog & then changed according to division to UOS in calcCharm()
          reviewObj['ediCostMod'] = srcRsObj['ediCostMod'] = nejRows[i][genericHeaderObj.ediCostHeader] //NEED TO CHECK
          //^//this should get initially set as the value from edi catalog & then changed according to division to UOS in calcCharm()
        }


        if (nejRows[i][genericHeaderObj.ediCostHeaderItemCost] == "") { //generate blankEdiCostUPC entry to flag any margin report item_cost
          //values that are blank. This will then appear in the retail review worksheet under column name blankEdiCost. THESE ITEMS NEED
          //TO BE INVESTIGATED TO SEE IF SKUs ARE INACCURATE, OR WHATEVER ELSE IS GOING ON
          reviewObj['blankEdiCostUPC'] = srcRsObj['blankEdiCostUPC'] = nejRows[i][genericHeaderObj.upcHeader]
        }

        // srcRsObj['ediCost'] = nejRows[i][genericHeaderObj.ediCostHeader] 
        // reviewObj['ediCost'] = nejRows[i][genericHeaderObj.ediCostHeader]//INCLUDE in save2CSVreview export data
        srcRsObj['ediPrice'] = nejRows[i][genericHeaderObj.msrpHeader] //INCLUDE in csv to export data
        reviewObj['ediPrice'] = nejRows[i][genericHeaderObj.msrpHeader] //INCLUDE in save2CSVreview export data

        // srcRsObj['rb_price'] = nejRows[i][genericHeaderObj.rbPriceHeader] //INCLUDE in csv to export data
        // reviewObj['rb_price'] = nejRows[i][genericHeaderObj.rbPriceHeader] //INCLUDE in save2CSVreview export data

        srcRsObj['sibBasePrice'] = nejRows[i][genericHeaderObj.sibBasePriceHeader] //INCLUDE in csv to export data
        reviewObj['sibBasePrice'] = nejRows[i][genericHeaderObj.sibBasePriceHeader] //INCLUDE in save2CSVreview export data

        srcRsObj['globalMargin'] = globalMargin //do not include in csv to export data
        // srcRsObj['rb_dept'] = nejRows[i][genericHeaderObj.rbDeptHeader]
        // reviewObj['rb_dept'] = nejRows[i][genericHeaderObj.rbDeptHeader] //INCLUDE in save2CSVreview export data 

        srcRsObj['dptName'] = nejRows[i][genericHeaderObj.rbDeptHeader]
        reviewObj['dptName'] = nejRows[i][genericHeaderObj.rbDeptHeader] //INCLUDE in save2CSVreview export data 

        // srcRsObj['rb_dept_id'] = nejRows[i][genericHeaderObj.rbDeptIDHeader]
        // reviewObj['rb_dept_id'] = nejRows[i][genericHeaderObj.rbDeptIDHeader] //INCLUDE in save2CSVreview export data

        srcRsObj['dptNumber'] = nejRows[i][genericHeaderObj.rbDeptIDHeader]
        reviewObj['dptNumber'] = nejRows[i][genericHeaderObj.rbDeptIDHeader] //INCLUDE in save2CSVreview export data

        for (let m = 0; m < deptFilterArr.length; m++) {
          if (srcRsObj['dptNumber'] == Object.keys(deptFilterArr[m])) {
            srcRsObj['defaultMarg'] = reviewObj['defaultMarg'] = deptFilterArr[m][Object.keys(deptFilterArr[m])]['dfltMrg'] //populate defaultMarg column in retail review
            //with default rb margin for a particular department number
          }
        }

        // srcRsObj['rb_dept_margin'] = nejRows[i][genericHeaderObj.rbDeptMarginHeader]
        // reviewObj['rb_dept_margin'] = nejRows[i][genericHeaderObj.rbDeptMarginHeader] //INCLUDE in save2CSVreview export data

        srcRsObj['sibIdealMargin'] = nejRows[i][genericHeaderObj.sibIdealMarginHeader]
        reviewObj['sibIdealMargin'] = nejRows[i][genericHeaderObj.sibIdealMarginHeader] //INCLUDE in save2CSVreview export data

        // srcRsObj['edlp_flag'] = nejRows[i][genericHeaderObj.edlpFlagHeader]
        // reviewObj['edlp_flag'] = nejRows[i][genericHeaderObj.edlpFlagHeader] //INCLUDE in save2CSVreview export data

        srcRsObj['sale_flag'] = nejRows[i][genericHeaderObj.saleFlagHeader]
        reviewObj['sale_flag'] = nejRows[i][genericHeaderObj.saleFlagHeader] //INCLUDE in save2CSVreview export data

        srcRsObj['discountToApply'] = discountToApply * 100
        reviewObj['discountToApply'] = discountToApply * 100 //INCLUDE in save2CSVreview export data

        if (postBody['wsDiffResultsPost'] !== undefined && postBody['wsDiffResultsPost'].length > 0) { //must check to see if anything was entered in WS Diff Results
          //input, otherwise wsDiffResults will be undefined
          let wsDiffResults = JSON.parse(postBody['wsDiffResultsPost'])
          for (let j = 0; j < wsDiffResults.length; j++) {
            if (srcRsObj['upc'] == wsDiffResults[j]['wsDiffNewTable_upc']) {
              srcRsObj['wsDiff_t0d'] = wsDiffResults[j]['wsDiffNewTable_upc'] //INCLUDE in save2CSVreview export data
              reviewObj['wsDiff_t0d'] = wsDiffResults[j]['wsDiffNewTable_upc'] //INCLUDE in save2CSVreview export data
              // console.log('calcResults says: wsDiffResults[j][\'wsDiffNewTable_upc\']##>>', wsDiffResults[j]['wsDiffNewTable_upc'])
            }
          }
        }

        if (typeOfIMW.toLowerCase() == 'wholesale') { //start dept filtering handling with wholesale imw,
          //because lower down, we will be filtering for retail imw after running calcCharm()
          divideCostToUOS_WS_IMW()
          if (srcRsObj['ediCostMod'] !== undefined) { //only push items that have ediCostMod value (which means that exist cplt cost
            //is different than new divided-to-uos edi cost, as determined in divideCostToUOS_WS_IMW())

            // console.log(`srcRsObj['upc'](${i})...srcRsObj['ediCostMod'](${i})==>${srcRsObj['upc']}...${srcRsObj['ediCostMod']}`)
            if (skuOveride.toLowerCase() == 'matchonly') { //option for including or excluding matching catapult/edi SKUs
              if (nejRows[i][genericHeaderObj.cpltSKUHeader] == nejRows[i][genericHeaderObj.ediSKUHeader]) {
                srcRsObj['sugstdRtl'] = "" //set sugstdRtl to empty if typeofIMW = 'wholesale'
                srcRsObj['charm'] = "" //set charm to empty if typeofIMW = 'wholesale'
                if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                  if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                    searchResults.push(srcRsObj)
                    searchResultsForCSV.push(srcRsObj)
                    searchResultsForCSVreview.push(reviewObj)
                  }
                } else { //otherwise, push all depts into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                }
              }
            } else {
              srcRsObj['sugstdRtl'] = "" //set sugstdRtl to empty if typeofIMW = 'wholesale'
              srcRsObj['charm'] = "" //set charm to empty if typeofIMW = 'wholesale'
              if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                }
              } else { //otherwise, push all depts into searchResults
                searchResults.push(srcRsObj)
                searchResultsForCSV.push(srcRsObj)
                searchResultsForCSVreview.push(reviewObj)
              }
            }
          }
        } else {
          // if (edlpSwitch == 'no') {

          // }
          //v//need to run calcCharm for edi catalogs, thus there will be no rb_dept_id key; use value input for globalMargin
          if (formInput0.includes('edi_')) {
            calcCharm(globalMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
          }
          //^//need to run calcCharm for edi catalogs, thus there will be no rb_dept_id key; use value input for globalMargin

          if (srcRsObj['dptNumber'] == '54') { //Beer & Alcohol
            //apply Department margin to calculate charm pricing
            calcCharm(beerAlcMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(beerAlcMargin)
          }
          if (srcRsObj['dptNumber'] == '152') { //Body Care
            calcCharm(bodyCareMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(bodyCareMargin)
          }
          if (srcRsObj['dptNumber'] == '9') { //Books
            calcCharm(booksMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(booksMargin)
          }
          if (srcRsObj['dptNumber'] == '19') { //Bulk
            calcCharm(bulkMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(bulkMargin)
          }
          if (srcRsObj['dptNumber'] == '30') { //Bulk & Herb Prepack
            calcCharm(bulkHrbPrpkMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(bulkHrbPrpkMargin)
          }
          if (srcRsObj['dptNumber'] == '175') { //CBD - Grocery
            calcCharm(cbdGrocMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(cbdGrocMargin)
          }
          if (srcRsObj['dptNumber'] == '176') { //CBD - Supplements
            calcCharm(cbdSuppMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(cbdSuppMargin)
          }
          if (srcRsObj['dptNumber'] == '177') { //CBD - Topicals
            calcCharm(cbdTopMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(cbdTopMargin)
          }
          if (srcRsObj['dptNumber'] == '148') { //Consignments
            calcCharm(consignMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(consignMargin)
          }
          if (srcRsObj['dptNumber'] == '18') { //Frozen
            calcCharm(frozenMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(frozenMargin)
          }
          if (srcRsObj['dptNumber'] == '150') { //General Merchandise
            calcCharm(genMerchMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(genMerchMargin)
          }
          if (srcRsObj['dptNumber'] == '13') { //Gift Items
            calcCharm(giftMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(giftMargin)
          }
          if (srcRsObj['dptNumber'] == '62') { //Grab & Go
            calcCharm(grabGoMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(grabGoMargin)
          }
          if (srcRsObj['dptNumber'] == '25') { //Grocery
            calcCharm(grocMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(grocMargin)
          }
          if (srcRsObj['dptNumber'] == '179') { //Grocery - Local
            calcCharm(grocLocMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(grocLocMargin)
          }
          if (srcRsObj['dptNumber'] == '38') { //Grocery - Local Meat
            calcCharm(grocLcMtMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(grocLcMtMargin)
          }
          if (srcRsObj['dptNumber'] == '12') { //HBA - had this as 17 & was causing hba items not to get charm applied
            calcCharm(hbaMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(hbaMargin)
          }
          if (srcRsObj['dptNumber'] == '158') { //Herbs & Homeopathic
            calcCharm(herbsHomeoMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(herbsHomeoMargin)
          }
          if (srcRsObj['dptNumber'] == '80') { //LifeBar
            calcCharm(lfBrMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(lfBrMargin)
          }
          if (srcRsObj['dptNumber'] == '151') { //Other
            calcCharm(otherMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(otherMargin)
          }
          if (srcRsObj['dptNumber'] == '155') { //Refrigerated
            calcCharm(refrigMargin, lowerCutRqdRtlBrad, lowerCutoffCharm1Brad, lowerCutoffCharm2Brad, lowerCutoffCharm3Brad,
              lowerCutoffCharm4Brad, lowerCutoffCharm5Brad, lowerCutoffCharm6Brad, lowerCutoffCharm7Brad, upperCharmRqdRtlBrad,
              defaultCharm1Brad, defaultCharm2Brad, defaultCharm3Brad, defaultCharm4Brad)
            revealAppliedMarg(refrigMargin)
          }
          if (srcRsObj['dptNumber'] == '157') { //Vitamins & Supplements
            calcCharm(vitSuppMargin, lowerCutRqdRtlAndrea, lowerCutoffCharm1Andrea, lowerCutoffCharm2Andrea, lowerCutoffCharm3Andrea,
              lowerCutoffCharm4Andrea, lowerCutoffCharm5Andrea, lowerCutoffCharm6Andrea, lowerCutoffCharm7Andrea, upperCharmRqdRtlAndrea,
              defaultCharm1Andrea, defaultCharm2Andrea, defaultCharm3Andrea, defaultCharm4Andrea)
            revealAppliedMarg(vitSuppMargin)
          }

          function populateResultsObj_Rtl() {
            if (srcRsObj['charm'] !== "" && Math.round((srcRsObj['charm']) * 100) / 100 !== Math.round((srcRsObj['sibBasePrice']) * 100) / 100) { // only push results that have some
              //value for "charm" column, AND ALSO select only items whose updated price is different than the exist. price in cplt
              if (skuOveride.toLowerCase() == 'matchonly') { //option for including or excluding matching catapult/edi SKUs
                if (nejRows[i][genericHeaderObj.cpltSKUHeader] == nejRows[i][genericHeaderObj.ediSKUHeader]) {
                  if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                    if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                      searchResults.push(srcRsObj)
                      searchResultsForCSV.push(srcRsObj)
                      searchResultsForCSVreview.push(reviewObj)
                    }
                  } else { //otherwise, push all depts into searchResults
                    searchResults.push(srcRsObj)
                    searchResultsForCSV.push(srcRsObj)
                    searchResultsForCSVreview.push(reviewObj)
                  }
                }
              } else {
                if (deptFilterToApply !== null) { //if a valid dept filter option is entered,
                  if (srcRsObj['dptNumber'] == deptFilterToApply) { //only push that dept into searchResults
                    searchResults.push(srcRsObj)
                    searchResultsForCSV.push(srcRsObj)
                    searchResultsForCSVreview.push(reviewObj)
                  }
                } else { //otherwise, push all depts into searchResults
                  searchResults.push(srcRsObj)
                  searchResultsForCSV.push(srcRsObj)
                  searchResultsForCSVreview.push(reviewObj)
                }
              }
            }
          }
          //v//EDLP switch handler. This should exclude EDLPS from calcCharm results if switch is set to 'no', but include them if set to 'yes'
          if (edlpSwitch == 'no') {
            if (srcRsObj['edlpVar'] !== 'EDLP') {
              populateResultsObj_Rtl()
            }
          } else {
            populateResultsObj_Rtl()
          }
          //^//EDLP switch handler. This should exclude EDLPS from calcCharm results if switch is set to 'no', but include them if set to 'yes'
        }

      }
      console.log('calcResults says: searchResults[0] from showSearchResults()==>', searchResults[0])
      // console.log('calcResults says: searchResultsForCSV from showSearchResults()==>', searchResultsForCSV)
      console.log('calcResults says: searchResultsForCSVreview[0] from showSearchResults()==>', searchResultsForCSVreview[0])
    }


    function queryNhcrtEdiJoinTable() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
      connection.query(`SELECT * FROM ${formInput0} GROUP BY ${genericHeaderObj.upcHeader}, ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader};
      SELECT * FROM rb_edlp_data;`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchResults(rows)

          res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
            title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${loadedSqlTbl}>>)`,
            searchResRows: searchResults,
            loadedSqlTbl: loadedSqlTbl,
            // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          })
        })

    }

    queryNhcrtEdiJoinTable()

  })
}