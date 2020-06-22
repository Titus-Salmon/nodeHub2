const express = require('express')
const router = express.Router()
const fs = require('fs')
const xl = require('excel4node')

module.exports = {

  save2XLSreviewNEJ: router.post('/save2XLSreviewNEJ', (req, res, next) => {

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < srcRsXLS_nonPag.length; a++) {
      let reorderedResObj = {}
      // reorderedResObj['invPK'] = srcRsXLS_nonPag[a]['invPK']
      // reorderedResObj['invCPK'] = srcRsXLS_nonPag[a]['invCPK']
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      reorderedResObj['upc'] = srcRsXLS_nonPag[a]['upc']
      reorderedResObj['cpltSKU'] = srcRsXLS_nonPag[a]['cpltSKU']
      reorderedResObj['ediSKU'] = srcRsXLS_nonPag[a]['ediSKU']
      reorderedResObj['skuMismatch'] = srcRsXLS_nonPag[a]['skuMismatch']
      reorderedResObj['name'] = srcRsXLS_nonPag[a]['name']
      reorderedResObj['oupName'] = srcRsXLS_nonPag[a]['oupName']
      reorderedResObj['numPkgs'] = srcRsXLS_nonPag[a]['numPkgs']
      reorderedResObj['csPkgMltpl'] = srcRsXLS_nonPag[a]['csPkgMltpl']
      reorderedResObj['ovr'] = srcRsXLS_nonPag[a]['ovr']
      reorderedResObj['cpltCost'] = srcRsXLS_nonPag[a]['cpltCost']
      reorderedResObj['ediCost'] = srcRsXLS_nonPag[a]['ediCost']
      reorderedResObj['ediCostMod'] = srcRsXLS_nonPag[a]['ediCostMod']
      reorderedResObj['reqdRetail'] = srcRsXLS_nonPag[a]['reqdRetail']
      reorderedResObj['charm'] = srcRsXLS_nonPag[a]['charm']
      reorderedResObj['ediPrice'] = srcRsXLS_nonPag[a]['ediPrice']
      reorderedResObj['sibBasePrice'] = srcRsXLS_nonPag[a]['sibBasePrice']
      reorderedResObj['dptName'] = srcRsXLS_nonPag[a]['dptName']
      reorderedResObj['dptNumber'] = srcRsXLS_nonPag[a]['dptNumber']
      reorderedResObj['sibIdealMargin'] = srcRsXLS_nonPag[a]['sibIdealMargin']
      reorderedResObj['defaultMarg'] = srcRsXLS_nonPag[a]['defaultMarg']
      reorderedResObj['appldMrgn'] = srcRsXLS_nonPag[a]['appldMrgn']
      reorderedResObj['discountToApply'] = srcRsXLS_nonPag[a]['discountToApply']
      reorderedResObj['edlpVar'] = srcRsXLS_nonPag[a]['edlpVar']
      reorderedResObj['pf1'] = srcRsXLS_nonPag[a]['pf1']
      reorderedResObj['pf2'] = srcRsXLS_nonPag[a]['pf2']
      // reorderedResObj['edlpUPC'] = srcRsXLS_nonPag[a]['edlpUPC']
      // reorderedResObj['imwSKU'] = srcRsXLS_nonPag[a]['imwSKU']
      // reorderedResObj['stoNumber'] = srcRsXLS_nonPag[a]['stoNumber']
      // reorderedResObj['stoName'] = srcRsXLS_nonPag[a]['stoName']
      // reorderedResObj['pf6'] = srcRsXLS_nonPag[a]['pf6']
      // reorderedResObj['sale_flag'] = srcRsXLS_nonPag[a]['sale_flag']
      // reorderedResObj['lastCost'] = srcRsXLS_nonPag[a]['lastCost']

      srcRsXLS_selectiveReordering.push(reorderedResObj)
    }

    console.log(`JSON.stringify(srcRsXLS_selectiveReordering[0])==> ${JSON.stringify(srcRsXLS_selectiveReordering[0])}`)



    //NOTE++++++++>>> srcRsXLS_nonPag is the array that holds the collection of SearchResults objects {columnNema: cellValue}

    // console.log(`typeof srcRsXLS_nonPag[0]==> ${typeof srcRsXLS_nonPag[0]}`)
    // console.log(`typeof Object.keys(srcRsXLS_nonPag[0])==> ${typeof Object.keys(srcRsXLS_nonPag[0])}`)
    // console.log(`Object.keys(srcRsXLS_nonPag[0])==> ${Object.keys(srcRsXLS_nonPag[0])}`)
    // console.log(`JSON.stringify(srcRsXLS_nonPag[0])==> ${JSON.stringify(srcRsXLS_nonPag[0])}`)
    // console.log(`JSON.stringify(srcRsXLS_nonPag[3])==> ${JSON.stringify(srcRsXLS_nonPag[3])}`)
    // console.log(`Object.keys(srcRsXLS_nonPag[0])[0]==> ${Object.keys(srcRsXLS_nonPag[0])[0]}`)

    // for (let i = 0; i < Object.keys(srcRsXLS_selectiveReordering[0]).length; i++) {
    //   console.log(`Object.keys(srcRsXLS_selectiveReordering[0])[${i}]==> ${Object.keys(srcRsXLS_selectiveReordering[0])[i]}`)
    // }

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
        fgColor: 'light green' // HTML style hex value. defaults to black.
      },
    })

    var ediPriceHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'Aqua, Accent 5, Lighter 40%' // HTML style hex value. defaults to black.
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

    for (let i = 0; i < Object.keys(srcRsXLS_selectiveReordering[0]).length; i++) {
      // if (Object.keys(srcRsXLS_nonPag[0])[i] == 'invPK' || Object.keys(srcRsXLS_nonPag[0])[i] == 'invCPK' || Object.keys(srcRsXLS_nonPag[0])[i] == 'edlpUPC' ||
      //   Object.keys(srcRsXLS_nonPag[0])[i] == 'cpltSKU' || Object.keys(srcRsXLS_nonPag[0])[i] == 'ediSKU' || Object.keys(srcRsXLS_nonPag[0])[i] == 'stoName' ||
      //   Object.keys(srcRsXLS_nonPag[0])[i] == 'sale_flag') {
      //   ws.column(i + 1).hide()
      // }
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