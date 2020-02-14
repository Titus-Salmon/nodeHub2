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

  addNewProducts: router.post('/addNewProducts', (req, res, next) => {

    const postBody = req.body

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

    let itemListAccumulator = postBody['itemListAccumulatorPost']
    let imwProductValObj = {} //this holds product values (for one discrete product entry at a time) as an object;
    //it gets stringified & pushed to imwProductArr
    let imwProductArr = [] //this gets sent back to frontend input for itemListAccumulatorPost
    // var sanitizedThing
    let objectifiedImwProdArr = [] //we objectify imwProductArr so it can be easily displayed in the DOM template

    let tableName = postBody['tableNamePost']
    let srsObjArr = []

    let removeItem = postBody['removeItemPost']

    function showSearchResults(rows) {
      // let srsObj = {}
      console.log(`rows.length==>${rows.length}`)
      console.log(`rows==>${rows}`)
      console.log(`JSON.stringify(rows)==>${JSON.stringify(rows)}`)
      for (let i = 0; i < rows.length; i++) {
        let srsObj = {}
        srsObj['pk_t0d'] = rows[i]['pk_t0d']
        srsObj['item_id'] = rows[i]['item_id']
        srsObj['dept_id'] = rows[i]['dept_id']
        srsObj['dept_name'] = rows[i]['dept_name']
        srsObj['recpt_alias'] = rows[i]['recpt_alias']
        srsObj['brand'] = rows[i]['brand']
        srsObj['item_name'] = rows[i]['item_name']
        srsObj['size'] = rows[i]['size']
        srsObj['sugg_retail'] = rows[i]['sugg_retail']
        srsObj['last_cost'] = rows[i]['last_cost']
        srsObj['base_price'] = rows[i]['base_price']
        srsObj['auto_discount'] = rows[i]['auto_discount']
        srsObj['disc_mult'] = rows[i]['disc_mult']
        srsObj['ideal_margin'] = rows[i]['ideal_margin']
        srsObj['weight_profile'] = rows[i]['weight_profile']
        srsObj['tax1'] = rows[i]['tax1']
        srsObj['tax2'] = rows[i]['tax2']
        srsObj['tax3'] = rows[i]['tax3']
        srsObj['spec_tndr1'] = rows[i]['spec_tndr1']
        srsObj['spec_tndr2'] = rows[i]['spec_tndr2']
        srsObj['pos_prompt'] = rows[i]['pos_prompt']
        srsObj['location'] = rows[i]['location']
        srsObj['alternate_id'] = rows[i]['alternate_id']
        srsObj['alt_rcpt_alias'] = rows[i]['alt_rcpt_alias']
        srsObj['pkg_qty'] = rows[i]['pkg_qty']
        srsObj['supp_unit_id'] = rows[i]['supp_unit_id']
        srsObj['supplier_id'] = rows[i]['supplier_id']
        srsObj['unit'] = rows[i]['unit']
        srsObj['num_pkgs'] = rows[i]['num_pkgs']
        srsObj['dsd'] = rows[i]['dsd']
        srsObj['case_pk_mult'] = rows[i]['case_pk_mult']
        srsObj['ovr'] = rows[i]['ovr']
        srsObj['category'] = rows[i]['category']
        srsObj['sub_category'] = rows[i]['sub_category']
        srsObj['product_group'] = rows[i]['product_group']
        srsObj['product_flag'] = rows[i]['product_flag']
        srsObj['rb_note'] = rows[i]['rb_note']
        srsObj['edi_default'] = rows[i]['edi_default']
        srsObj['powerfield_7'] = rows[i]['powerfield_7']
        srsObj['temp_group'] = rows[i]['temp_group']
        srsObj['onhand_qty'] = rows[i]['onhand_qty']
        srsObj['reorder_point'] = rows[i]['reorder_point']
        srsObj['mcl'] = rows[i]['mcl']
        srsObj['reorder_qty'] = rows[i]['reorder_qty']
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
      connection.query(`SELECT * FROM ${tableName};`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchResults(rows)

          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator`,
            srsObjArr: srsObjArr,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            tableName: tableName
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

  })
}