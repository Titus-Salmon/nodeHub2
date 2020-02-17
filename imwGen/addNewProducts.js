const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')

const connection = mysql.createConnection({ //for home local testing
  host: process.env.TEST_STUFF_T0D_HOST,
  user: process.env.TEST_STUFF_T0D_USER,
  password: process.env.TEST_STUFF_T0D_PW,
  database: process.env.TEST_STUFF_T0D_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

// const connection = mysql.createConnection({ //for work testing
//   host: process.env.NODEHUB_TEST1_HOST,
//   user: process.env.NODEHUB_TEST1_USER,
//   password: process.env.NODEHUB_TEST1_PW,
//   database: process.env.NODEHUB_TEST1_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

const objKeyArr = [
  "itemID", "deptID", "deptName", "recptAlias", "brand", "itemName", "size", "suggRtl", "lastCost", "basePrice", "autoDisco",
  "discoMult", "idealMarg", "weightProf", "tax1", "tax2", "tax3", "specTndr1", "specTndr2", "posPrompt", "location", "altID",
  "altRcptAlias", "pkgQty", "suppUnitID", "suppID", "unit", "numPkgs", "dsd", "csPkMlt", "ovr", "category", "subCtgry", "prodGroup",
  "prodFlag", "rbNote", "ediDefault", "pwrfld7", "tmpGroup", "onhndQty", "reorderPt", "mcl", "reorderQty"
]

module.exports = {

  addNewProducts: router.post(`/addNewProducts`, (req, res, next) => {

    const postBody = req.body

    // console.log(`req.query==> ${req.query}`)
    // console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)

    let itemID = postBody['itemIDPost']
    let deptID = postBody['deptIDPost']
    let deptName = postBody['deptNamePost']
    let recptAlias = postBody['recptAliasPost']
    let brand = postBody['brandPost']
    let itemName = postBody['itemNamePost']
    let size = postBody['sizePost']
    let suggRtl = postBody['suggRtlPost']
    let lastCost = postBody['lastCostPost']
    let basePrice = postBody['basePricePost']
    let autoDisco = postBody['autoDiscoPost']
    let discoMult = postBody['discoMultPost']
    let idealMarg = postBody['idealMargPost']
    let weightProf = postBody['weightProfPost']
    let tax1 = postBody['tax1Post']
    let tax2 = postBody['tax2Post']
    let tax3 = postBody['tax3Post']
    let specTndr1 = postBody['specTndr1Post']
    let specTndr2 = postBody['specTndr2Post']
    let posPrompt = postBody['posPromptPost']
    let location = postBody['locationPost']
    let altID = postBody['altIDPost']
    let altRcptAlias = postBody['altRcptAliasPost']
    let pkgQty = postBody['pkgQtyPost']
    let suppUnitID = postBody['suppUnitIDPost']
    let suppID = postBody['suppIDPost']
    let unit = postBody['unitPost']
    let numPkgs = postBody['numPkgsPost']
    let dsd = postBody['dsdPost']
    let csPkMlt = postBody['csPkMltPost']
    let ovr = postBody['ovrPost']
    let category = postBody['categoryPost']
    let subCtgry = postBody['subCtgryPost']
    let prodGroup = postBody['prodGroupPost']
    let prodFlag = postBody['prodFlagPost']
    let rbNote = postBody['rbNotePost']
    let ediDefault = postBody['ediDefaultPost']
    let pwrfld7 = postBody['pwrfld7Post']
    let tmpGroup = postBody['tmpGroupPost']
    let onhndQty = postBody['onhndQtyPost']
    let reorderPt = postBody['reorderPtPost']
    let mcl = postBody['mclPost']
    let reorderQty = postBody['reorderQtyPost']

    let offset = postBody['offsetPost']

    let numQueryRes = postBody['numQueryResPost']
    console.log(`numQueryRes==> ${numQueryRes}`)

    if (offset == undefined) {
      offset = parseInt(numQueryRes)
    } else {
      offset = parseInt(offset) + parseInt(numQueryRes)
    }

    let itemListAccumulator = postBody['itemListAccumulatorPost']
    let imwProductValObj = {} //this holds product values (for one discrete product entry at a time) as an object;
    //it gets stringified & pushed to imwProductArr
    let imwProductArr = [] //this gets sent back to frontend input for itemListAccumulatorPost
    // var sanitizedThing
    let objectifiedImwProdArr = [] //we objectify imwProductArr so it can be easily displayed in the DOM template

    let tableName = postBody['tableNamePost']
    let srsObjArr = []

    let removeItem = postBody['removeItemPost']

    let totalRowsArr = []
    let totalRowsPost = postBody['totalRowsPost']

    if (totalRowsPost !== undefined) {
      let numPages = totalRowsPost / numQueryRes
      console.log(`numPages==> ${numPages}`)
    }


    function showSearchResults(rows) {
      let countRows = rows[0]
      let totalRows = countRows[0]['COUNT(*)']
      totalRowsArr.push(totalRows)
      console.log(`totalRows==> ${totalRows}`)
      console.log(`countRows==> ${countRows}`)
      // console.log(`JSON.stringify(countRows)==> ${JSON.stringify(countRows)}`)
      // console.log(`countRows[0]['COUNT(*)']==> ${countRows[0]['COUNT(*)']}`)
      let displayRows = rows[1]
      // let srsObj = {}
      console.log(`displayRows.length==>${displayRows.length}`)
      console.log(`displayRows==>${displayRows}`)
      console.log(`JSON.stringify(displayRows)==>${JSON.stringify(displayRows)}`)
      for (let i = 0; i < displayRows.length; i++) {
        let srsObj = {}
        srsObj['ri_t0d'] = displayRows[i]['ri_t0d']
        srsObj['item_id'] = displayRows[i]['item_id']
        srsObj['dept_id'] = displayRows[i]['dept_id']
        srsObj['dept_name'] = displayRows[i]['dept_name']
        srsObj['recpt_alias'] = displayRows[i]['recpt_alias']
        srsObj['brand'] = displayRows[i]['brand']
        srsObj['item_name'] = displayRows[i]['item_name']
        srsObj['size'] = displayRows[i]['size']
        srsObj['sugg_retail'] = displayRows[i]['sugg_retail']
        srsObj['last_cost'] = displayRows[i]['last_cost']
        srsObj['base_price'] = displayRows[i]['base_price']
        srsObj['auto_discount'] = displayRows[i]['auto_discount']
        srsObj['disc_mult'] = displayRows[i]['disc_mult']
        srsObj['ideal_margin'] = displayRows[i]['ideal_margin']
        srsObj['weight_profile'] = displayRows[i]['weight_profile']
        srsObj['tax1'] = displayRows[i]['tax1']
        srsObj['tax2'] = displayRows[i]['tax2']
        srsObj['tax3'] = displayRows[i]['tax3']
        srsObj['spec_tndr1'] = displayRows[i]['spec_tndr1']
        srsObj['spec_tndr2'] = displayRows[i]['spec_tndr2']
        srsObj['pos_prompt'] = displayRows[i]['pos_prompt']
        srsObj['location'] = displayRows[i]['location']
        srsObj['alternate_id'] = displayRows[i]['alternate_id']
        srsObj['alt_rcpt_alias'] = displayRows[i]['alt_rcpt_alias']
        srsObj['pkg_qty'] = displayRows[i]['pkg_qty']
        srsObj['supp_unit_id'] = displayRows[i]['supp_unit_id']
        srsObj['supplier_id'] = displayRows[i]['supplier_id']
        srsObj['unit'] = displayRows[i]['unit']
        srsObj['num_pkgs'] = displayRows[i]['num_pkgs']
        srsObj['dsd'] = displayRows[i]['dsd']
        srsObj['case_pk_mult'] = displayRows[i]['case_pk_mult']
        srsObj['ovr'] = displayRows[i]['ovr']
        srsObj['category'] = displayRows[i]['category']
        srsObj['sub_category'] = displayRows[i]['sub_category']
        srsObj['product_group'] = displayRows[i]['product_group']
        srsObj['product_flag'] = displayRows[i]['product_flag']
        srsObj['rb_note'] = displayRows[i]['rb_note']
        srsObj['edi_default'] = displayRows[i]['edi_default']
        srsObj['powerfield_7'] = displayRows[i]['powerfield_7']
        srsObj['temp_group'] = displayRows[i]['temp_group']
        srsObj['onhand_qty'] = displayRows[i]['onhand_qty']
        srsObj['reorder_point'] = displayRows[i]['reorder_point']
        srsObj['mcl'] = displayRows[i]['mcl']
        srsObj['reorder_qty'] = displayRows[i]['reorder_qty']
        srsObjArr.push(srsObj)
      }
    }

    sanitizerFuncs.sanitizedItemListObjGenerator(itemListAccumulator, sanitizerFuncs.thingSanitizer,
      imwProductArr, imwProductValObj, itemID, deptID, deptName, recptAlias, brand, itemName, size, suggRtl, lastCost, basePrice, autoDisco,
      discoMult, idealMarg, weightProf, tax1, tax2, tax3, specTndr1, specTndr2, posPrompt, location, altID, altRcptAlias, pkgQty, suppUnitID,
      suppID, unit, numPkgs, dsd, csPkMlt, ovr, category, subCtgry, prodGroup, prodFlag, rbNote, ediDefault, pwrfld7, tmpGroup, onhndQty,
      reorderPt, mcl, reorderQty)

    sanitizerFuncs.objectifyImwProductArr(imwProductArr, objectifiedImwProdArr)

    console.log(`typeof imwProductArr==> ${typeof imwProductArr}`)
    console.log(`imwProductArr==> ${imwProductArr}`)
    console.log(`typeof imwProductArr[0]==> ${typeof imwProductArr[0]}`)
    console.log(`imwProductArr[0]==> ${imwProductArr[0]}`)
    if (imwProductArr[0] !== undefined) {
      console.log(`imwProductArr[0]==> ${imwProductArr[0]}`)
      console.log(`JSON.parse(imwProductArr[0])==> ${JSON.parse(imwProductArr[0])}`)
    }

    var removeItemSPLIT
    let removeItemSPLITsanArr = []
    let removeItemSPLITsanArrObject = {}

    function removeItemPrepper() {
      console.log(`removeItem==> ${removeItem}`)
      console.log(`typeof removeItem==> ${typeof removeItem}`)
      let regexRemoveItem1 = /(<\/td><td>)/g
      let removeItemReplace = removeItem.replace(regexRemoveItem1, '</td>,<td>')
      removeItemSPLIT = removeItemReplace.split(',')
      console.log(`removeItemSPLIT==> ${removeItemSPLIT}`)
    }

    function removeItemSPLITsanitizer() {
      // let removeItemSPLITsanArr = []
      let regexRemoveItem2 = /(<td>)|(<\/td>)/g
      for (let i = 0; i < removeItemSPLIT.length; i++) {
        let removeItemSPLITsan = removeItemSPLIT[i].replace(regexRemoveItem2, '')
        removeItemSPLITsanArr.push(removeItemSPLITsan)
      }
      console.log(`removeItemSPLITsanArr==> ${removeItemSPLITsanArr}`)
    }

    function removeItemSPLITsanArrObjectifier() {
      for (let i = 0; i < objKeyArr.length; i++) {
        removeItemSPLITsanArrObject[`${objKeyArr[i]}`] = removeItemSPLITsanArr[i]
      }
      console.log(`removeItemSPLITsanArrObject==> ${removeItemSPLITsanArrObject}`)
      console.log(`JSON.stringity(removeItemSPLITsanArrObject)==> ${JSON.stringify(removeItemSPLITsanArrObject)}`)
    }

    if (removeItem !== undefined) {
      removeItemPrepper()
      removeItemSPLITsanitizer()
      removeItemSPLITsanArrObjectifier()
    }

    function removeItemHandler() {
      for (let i = 0; i < imwProductArr.length; i++) {
        sanitizerFuncs.thingSanitizer(imwProductArr[i])
        console.log(`sanitizedThing from removeItemHandler==> ${sanitizedThing}`)
        console.log(`JSON.stringify(sanitizedThing)==> ${JSON.stringify(sanitizedThing)}`)
        console.log(`JSON.stringity(imwProductArr[i])==> ${JSON.stringify(imwProductArr[i])}`)
        console.log(`removeItemSPLITsanArrObject==> ${removeItemSPLITsanArrObject}`)
        console.log(`JSON.stringify(removeItemSPLITsanArrObject)==> ${JSON.stringify(removeItemSPLITsanArrObject)}`)
        if (sanitizedThing == JSON.stringify(removeItemSPLITsanArrObject)) {
          imwProductArr.splice(i, 1)
          console.log(`imwProductArr from removeItemHandler()==> ${imwProductArr}`)
        }
      }
    }
    removeItemHandler()


    function queryEDI_Table() {
      //    SELECT * FROM someTable ORDER BY id DESC LIMIT 0,5
      connection.query(`SELECT COUNT(*) FROM ${tableName};
      SELECT * FROM ${tableName} ORDER BY item_name LIMIT ${offset},${numQueryRes};`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchResults(rows)

          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator`,
            srsObjArr: srsObjArr,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            tableName: tableName,
            // newqueryForwardPosition: newqueryForwardPosition,
            // newqueryBackwardPosition: newqueryBackwardPosition,
            numQueryRes: numQueryRes,
            totalRows: totalRowsArr[0],
            numPages: Math.ceil(totalRowsArr[0] / numQueryRes),
            offset: offset

          })
        })
    }

    if (tableName !== undefined && tableName !== '') {
      queryEDI_Table()
    } else {
      res.render('vw-imwGenerator', {
        title: `vw-imwGenerator`,
        imwProductValObj: imwProductValObj,
        imwProductArr: imwProductArr,
        objectifiedImwProdArr: objectifiedImwProdArr
      })
    }

    // router.get('/addNewProducts', (req, res, next) => {
    //   console.log(`req.query==> ${req.query}`)
    //   console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)

    //   res.render('vw-imwGenerator', {
    //     title: `vw-imwGenerator (GET request)`,
    //     srsObjArr: srsObjArr,
    //     imwProductValObj: imwProductValObj,
    //     imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
    //     objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
    //     tableName: tableName,
    //     // newqueryForwardPosition: newqueryForwardPosition,
    //     // newqueryBackwardPosition: newqueryBackwardPosition,
    //     totalRows: totalRowsArr[0],

    //   })

    // })

  }),

  // addNewProducts: router.get('/addNewProducts', (req, res, next) => {
  //   console.log(`req.query==> ${req.query}`)
  //   console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)

  //   res.render('vw-imwGenerator', {
  //     title: `vw-imwGenerator (GET request)`,
  //     // srsObjArr: srsObjArr,
  //     // imwProductValObj: imwProductValObj,
  //     imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
  //     objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
  //     tableName: tableName,
  //     // newqueryForwardPosition: newqueryForwardPosition,
  //     // newqueryBackwardPosition: newqueryBackwardPosition,
  //     // totalRows: totalRowsArr[0],

  //   })

  // }),

}