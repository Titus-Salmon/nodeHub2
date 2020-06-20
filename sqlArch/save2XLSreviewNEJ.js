const express = require('express')
const router = express.Router()
const fs = require('fs')
const xl = require('excel4node')

module.exports = {

  save2XLSreviewNEJ: router.post('/save2XLSreviewNEJ', (req, res, next) => {

    //NOTE++++++++>>> srcRsXLS_nonPag is the array that holds the collection of SearchResults objects {columnNema: cellValue}

    console.log(`typeof srcRsXLS_nonPag[0]==> ${typeof srcRsXLS_nonPag[0]}`)
    console.log(`typeof Object.keys(srcRsXLS_nonPag[0])==> ${typeof Object.keys(srcRsXLS_nonPag[0])}`)
    console.log(`Object.keys(srcRsXLS_nonPag[0])==> ${Object.keys(srcRsXLS_nonPag[0])}`)
    console.log(`JSON.stringify(srcRsXLS_nonPag[0])==> ${JSON.stringify(srcRsXLS_nonPag[0])}`)
    console.log(`Object.keys(srcRsXLS_nonPag[0])[0]==> ${Object.keys(srcRsXLS_nonPag[0])[0]}`)


    // Create a new instance of a Workbook class
    var wb = new xl.Workbook()

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1')

    var style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    })

    // Set value of cell A2 to 'string' styled with paramaters of style
    ws.cell(2, 1)
      .string('string')
      .style(style)

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