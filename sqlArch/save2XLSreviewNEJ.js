const express = require('express')
const router = express.Router()
const fs = require('fs')
const xl = require('excel4node')

module.exports = {

  save2XLSreviewNEJ: router.post('/save2XLSreviewNEJ', (req, res, next) => {

    let invPK = srcRsXLS_nonPag[0][0]
    let invCPK = srcRsXLS_nonPag[0][1]
    let upc = srcRsXLS_nonPag[0][2]
    let edlpUPC = srcRsXLS_nonPag[0][3]
    let cpltCost = srcRsXLS_nonPag[0][4]
    let cpltSKU = srcRsXLS_nonPag[0][5]
    let ediSKU = srcRsXLS_nonPag[0][6]
    let imwSKU = srcRsXLS_nonPag[0][7]
    let skuMismatch = srcRsXLS_nonPag[0][8]
    let oupName = srcRsXLS_nonPag[0][9]
    let stoNumber = srcRsXLS_nonPag[0][10]
    let stoName = srcRsXLS_nonPag[0][11]
    let pf1 = srcRsXLS_nonPag[0][12]
    let pf2 = srcRsXLS_nonPag[0][13]
    let pf6 = srcRsXLS_nonPag[0][14]
    let ovr = srcRsXLS_nonPag[0][15]
    let name = srcRsXLS_nonPag[0][16]
    let ediCost = srcRsXLS_nonPag[0][17]
    let ediCostMod = srcRsXLS_nonPag[0][18]
    let ediPrice = srcRsXLS_nonPag[0][19]
    let sibBasePrice = srcRsXLS_nonPag[0][20]
    let dptName = srcRsXLS_nonPag[0][21]
    let dptNumber = srcRsXLS_nonPag[0][22]
    let defaultMarg = srcRsXLS_nonPag[0][23]
    let sibIdealMargin = srcRsXLS_nonPag[0][24]
    let sale_flag = srcRsXLS_nonPag[0][25]
    let discountToApply = srcRsXLS_nonPag[0][26]
    let lastCost = srcRsXLS_nonPag[0][27]
    let numPkgs = srcRsXLS_nonPag[0][28]
    let csPkgMltpl = srcRsXLS_nonPag[0][29]
    let reqdRetail = srcRsXLS_nonPag[0][30]
    let charm = srcRsXLS_nonPag[0][31]
    let appldMrgn = srcRsXLS_nonPag[0][32]



    var srcRsXLS_selectiveReordering = []
    srcRsXLS_selectiveReordering.push(upc, cpltSKU, ediSKU, skuMismatch, name, oupName, numPkgs, csPkgMltpl, ovr, cpltCost, ediCost, ediCostMod,
      reqdRetail, charm, ediPrice, sibBasePrice, dptName, dptNumber, sibIdealMargin, defaultMarg, appldMrgn, discountToApply, edlpVar, pf1, pf2)

    //NOTE++++++++>>> srcRsXLS_nonPag is the array that holds the collection of SearchResults objects {columnNema: cellValue}

    console.log(`typeof srcRsXLS_nonPag[0]==> ${typeof srcRsXLS_nonPag[0]}`)
    console.log(`typeof Object.keys(srcRsXLS_nonPag[0])==> ${typeof Object.keys(srcRsXLS_nonPag[0])}`)
    console.log(`Object.keys(srcRsXLS_nonPag[0])==> ${Object.keys(srcRsXLS_nonPag[0])}`)
    console.log(`JSON.stringify(srcRsXLS_nonPag[0])==> ${JSON.stringify(srcRsXLS_nonPag[0])}`)
    console.log(`JSON.stringify(srcRsXLS_nonPag[3])==> ${JSON.stringify(srcRsXLS_nonPag[3])}`)
    console.log(`Object.keys(srcRsXLS_nonPag[0])[0]==> ${Object.keys(srcRsXLS_nonPag[0])[0]}`)

    for (let i = 0; i < Object.keys(srcRsXLS_nonPag[0]).length; i++) {
      console.log(`Object.keys(srcRsXLS_nonPag[0])[${i}]==> ${Object.keys(srcRsXLS_nonPag[0])[i]}`)
    }

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

    var ediCostHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'bright green' // HTML style hex value. defaults to black.
      },
    })

    for (let i = 0; i < Object.keys(srcRsXLS_nonPag[0]).length; i++) {
      if (Object.keys(srcRsXLS_nonPag[0])[i] == 'invPK' || Object.keys(srcRsXLS_nonPag[0])[i] == 'invCPK' || Object.keys(srcRsXLS_nonPag[0])[i] == 'edlpUPC' ||
        Object.keys(srcRsXLS_nonPag[0])[i] == 'cpltSKU' || Object.keys(srcRsXLS_nonPag[0])[i] == 'ediSKU' || Object.keys(srcRsXLS_nonPag[0])[i] == 'stoName' ||
        Object.keys(srcRsXLS_nonPag[0])[i] == 'sale_flag') {
        ws.column(i + 1).hide()
      }
      // let headerCellStringLength = Object.keys(srcRsXLS_nonPag[0])[i]
      // console.log(`Object.keys(srcRsXLS_nonPag[0])[${i}]==> ${Object.keys(srcRsXLS_nonPag[0])[i]}`)
      ws.cell(1, i + 1) //this targets "header" cells
        .string(`${Object.keys(srcRsXLS_nonPag[0])[i]}`)
        .style(headerStyle)
      // .column(i + 1).setWidth(headerCellStringLength.length)

      for (let j = 0; j < srcRsXLS_nonPag.length; j++) {
        if (Object.keys(srcRsXLS_nonPag[0])[i] == 'ediCost') {
          ws.column(i + 1).style(ediCostHilite)
        }
        // let bodyCellStringLength = Object.values(srcRsXLS_nonPag[j])[i]
        ws.cell(j + 2, i + 1)
          .string(`${Object.values(srcRsXLS_nonPag[j])[i]}`)
          .style(bodyStyle)
        // .column(i + 1).setWidth(bodyCellStringLength.length)
      }
    }


    wb.write(`${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs`)

    // // Set value of cell A2 to 'string' styled with paramaters of style
    // ws.cell(2, 1)
    //   .string('string')
    //   .style(style)

    //   // console.log('srcRsCSV_nonPag[0][\'P_K\']', srcRsCSV_nonPag[0]['P_K'])
    //   // console.log('Object.keys(srcRsCSV_nonPag[0])', Object.keys(srcRsCSV_nonPag[0]))

    //   // //begin csv generator //////////////////////////////////////////////////////////////////////////
    //   // const {
    //   //   Parser
    //   // } = require('json2csv');

    //   // const fields = [
    //   //   "ri_t0d", "invPK", "invCPK", "upc", "cpltSKU", "ediSKU", "skuMismatch", "name", "oupName", "numPkgs", "csPkgMltpl", "ovr", "stoNumber", "stoName", "cpltCost", "ediCost", "ediCostMod", "reqdRetail", "charm",
    //   //   "ediPrice", "sibBasePrice", "dptName", "dptNumber", "sibIdealMargin", "defaultMarg", "appldMrgn", "wsDiff_t0d", "discountToApply",
    //   //   "edlpVar", "pf1", "pf2"
    //   // ];
    //   // const opts = {
    //   //   fields,
    //   //   // excelStrings: true,
    //   //   // header: false
    //   //   quote: '', //whatever is inside the '' will be use as your quote character, so this removes all quotes from CSV
    //   //   // quote: '"'
    //   // };

    //   try {
    //     console.log('srcRsCSV_nonPag from json2csv======>>', srcRsCSV_nonPag)
    //     const parser = new Parser(opts);
    //     const csv = parser.parse(srcRsCSV_nonPag);
    //     csvContainer.push(csv);
    //     console.log('csv_T0d=====>>', csv);
    //     fs.writeFile(process.cwd() + '/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
    //       if (err) throw err;
    //       console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
    //     })
    //   } catch (err) {
    //     console.error(err);
    //   }
    //   //end csv generator //////////////////////////////////////////////////////////////////////////

    //   res.render('vw-MySqlTableHub', {
    //     title: `<<${process.cwd()}/public/csv/${req.body['csvPost']} SAVED>>`
    //   });

  })
}