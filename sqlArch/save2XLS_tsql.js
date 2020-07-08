const express = require('express')
const router = express.Router()
// const fs = require('fs')
const xl = require('excel4node')

module.exports = {

  save2XLS_tsql: router.post('/save2XLS_tsql', (req, res, next) => {

    //NOTE++++++++>>> catapultResArr is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is not the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from catapultResArr that we DON'T want to display (i.e.
    //invPK, invCPK), we selectively reorder and/or remove the key:value pairs from catapultResArr to form the srcRsXLS_selectiveReordering array
    //(WITHOUT modifying the original catapultResArr array).

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < catapultResArr.length; a++) {
      let reorderedResObj = {}
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      reorderedResObj['invScanCode'] = catapultResArr[a]['invScanCode']
      reorderedResObj['ordSupplierStockNumber'] = catapultResArr[a]['ordSupplierStockNumber']
      reorderedResObj['invName'] = catapultResArr[a]['invName']
      reorderedResObj['invSize'] = catapultResArr[a]['invSize']
      reorderedResObj['invReceiptAlias'] = catapultResArr[a]['invReceiptAlias']
      reorderedResObj['invDefault'] = catapultResArr[a]['invDefault']
      reorderedResObj['posTimeStamp'] = catapultResArr[a]['posTimeStamp']
      reorderedResObj['invDateCreated'] = catapultResArr[a]['invDateCreated']
      reorderedResObj['invEmpFkCreatedBy'] = catapultResArr[a]['invEmpFkCreatedBy']
      reorderedResObj['oupName'] = catapultResArr[a]['oupName']
      reorderedResObj['stoNumber'] = catapultResArr[a]['stoNumber']
      reorderedResObj['stoName'] = catapultResArr[a]['stoName']
      reorderedResObj['brdName'] = catapultResArr[a]['brdName']
      reorderedResObj['dptName'] = catapultResArr[a]['dptName']
      reorderedResObj['dptNumber'] = catapultResArr[a]['dptNumber']
      reorderedResObj['sibIdealMargin'] = catapultResArr[a]['sibIdealMargin']
      reorderedResObj['venCompanyname'] = catapultResArr[a]['venCompanyname']
      reorderedResObj['invLastreceived'] = catapultResArr[a]['invLastreceived']
      reorderedResObj['invLastsold'] = catapultResArr[a]['invLastsold']
      reorderedResObj['invLastcost'] = catapultResArr[a]['invLastcost']
      reorderedResObj['sibBasePrice'] = catapultResArr[a]['sibBasePrice']
      reorderedResObj['invOnhand'] = catapultResArr[a]['invOnhand']
      reorderedResObj['invOnorder'] = catapultResArr[a]['invOnorder']
      reorderedResObj['invIntransit'] = catapultResArr[a]['invIntransit']
      reorderedResObj['invMemo'] = catapultResArr[a]['invMemo']
      reorderedResObj['pi1Description'] = catapultResArr[a]['pi1Description']
      reorderedResObj['pi2Description'] = catapultResArr[a]['pi2Description']
      reorderedResObj['pi3Description'] = catapultResArr[a]['pi3Description']
      reorderedResObj['pi4Description'] = catapultResArr[a]['pi4Description']
      reorderedResObj['invPowerField1'] = catapultResArr[a]['invPowerField1']
      reorderedResObj['invPowerField2'] = catapultResArr[a]['invPowerField2']
      reorderedResObj['invPowerField3'] = catapultResArr[a]['invPowerField3']
      reorderedResObj['invPowerField4'] = catapultResArr[a]['invPowerField4']

      srcRsXLS_selectiveReordering.push(reorderedResObj)
    }

    console.log(`JSON.stringify(srcRsXLS_selectiveReordering[0])==> ${JSON.stringify(srcRsXLS_selectiveReordering[0])}`)


    // Create a new instance of a Workbook class
    var wb = new xl.Workbook()

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1')

    var bodyStyle = wb.createStyle({
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      font: {
        color: 'black',
        size: 12,
      },
      // numberFormat: '$#,##0.00; ($#,##0.00); -',
    })

    var headerStyle = wb.createStyle({
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      font: {
        color: 'black',
        size: 14,
        bold: true,

      },
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'bright green' // HTML style hex value. defaults to black.
      },
    })

    var charmHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#92D050' // HTML style hex value. defaults to black.
      },
    })

    var ediPriceHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#93CDDD' // HTML style hex value. defaults to black.
      },
    })

    var sibBasePriceHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'yellow' // HTML style hex value. defaults to black.
      },
    })

    var invalidOupName = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'red' // HTML style hex value. defaults to black.
      },
    })

    for (let i = 0; i < Object.keys(srcRsXLS_selectiveReordering[0]).length; i++) {

      ws.cell(1, i + 1) //this targets "header" cells
        .string(`${Object.keys(srcRsXLS_selectiveReordering[0])[i]}`)
        .style(headerStyle)

      for (let j = 0; j < srcRsXLS_selectiveReordering.length; j++) {
        ws.cell(j + 2, i + 1)
          .string(`${Object.values(srcRsXLS_selectiveReordering[j])[i]}`)
          .style(bodyStyle)
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'charm') {
          ws.cell(j + 2, i + 1).style(charmHilite)
        }
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'ediPrice') {
          ws.cell(j + 2, i + 1).style(ediPriceHilite)
        }
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'sibBasePrice') {
          ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
        }
        if (Object.values(srcRsXLS_selectiveReordering[j])[i] == 'invalid oupName') {
          ws.cell(j + 2, i + 1).style(invalidOupName)
        }
      }
    }


    wb.write(`${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs`)


    res.render('vw-TSqlTableHub', {
      title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED>>`
    });

  })
}