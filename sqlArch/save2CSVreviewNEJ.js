const express = require('express')
const router = express.Router()
const fs = require('fs')

module.exports = {

  save2CSVreviewNEJ: router.post('/save2CSVreviewNEJ', (req, res, next) => {

    console.log('searchResultsForCSV[0][\'P_K\']', searchResultsForCSV[0]['P_K'])
    console.log('Object.keys(searchResultsForCSV[0])', Object.keys(searchResultsForCSV[0]))

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      "upc", "cpltSKU", "ediSKU", "name", "oupName", "numPkgs", "csPkgMltpl", "ovr", "stoName", "cpltCost", "ediCost", "ediCostMod", "reqdRetail", "charm",
      "ediPrice", "sibBasePrice", "dptName", "dptNumber", "sibIdealMargin", "defaultMarg", "appldMrgn", "wsDiff_t0d", "discountToApply",
      "edlpVar", "pi1Description", "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
    ];
    const opts = {
      fields,
      // excelStrings: true,
      // header: false
      quote: '', //whatever is inside the '' will be use as your quote character, so this removes all quotes from CSV
      // quote: '"'
    };

    try {
      console.log('searchResultsForCSV from json2csv======>>', searchResultsForCSV)
      const parser = new Parser(opts);
      const csv = parser.parse(searchResultsForCSV);
      csvContainer.push(csv);
      console.log('csv_T0d=====>>', csv);
      fs.writeFile(process.cwd() + '/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    res.render('vw-csvSaved', { //render searchResults to vw-dbEditPassport page
      title: 'CSV Saved'
    });

  })
}