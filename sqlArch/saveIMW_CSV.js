const express = require('express')
const router = express.Router()
const fs = require('fs')

module.exports = {

  saveIMW_CSV: router.post('/saveIMW_CSV', (req, res, next) => {

    console.log('searchResultsForCSV[0][\'P_K\']', searchResultsForCSV[0]['P_K'])
    console.log('Object.keys(searchResultsForCSV[0])', Object.keys(searchResultsForCSV[0]))

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      // 'P_K', 'upc', 'sku', 'name', 'cost', 'msrp', 'rbMargin', 'reqdRetail', 'charm',
      // 'upc', 'deptID', 'deptName', 'rcptAlias', 'brand', 'itemName', 'size', 'sugstdRtl', 'lastCost', 'charm', 'autoDiscount', 'dscMltplr',
      // 'idealMarg', 'wtPrfl', 'tax1', 'tax2', 'tax3', 'spclTndr1', 'spclTndr2', 'posPrmpt', 'lctn', 'altID', 'altRcptAlias', 'pkgQnt', 'sku',
      // 'splrID', 'unit', 'numPkgs', 'dsd', 'csPkgMltpl', 'ovr', 'pf1', 'pf2', 'pf3', 'pf4', 'pf5', 'pf6', 'pf7', 'pf8', 'onhndQnt', 'rdrPnt', 'mcl', 'rdrQnt', 'flrRsn'
      "upc", "deptID", "deptName", "rcptAlias", "brand", "itemName", "size", "sugstdRtl", "lastCost", "charm", "autoDiscount", "idealMarg", "wtPrfl", "tax1",
      "tax2", "tax3", "spclTndr1", "spclTndr2", "posPrmpt", "lctn", "altID", "altRcptAlias", "pkgQnt", "imwSKU", "splrID", "unit", "numPkgs", "pf1", "pf2", "pf3",
      "pf4", "pf5", "pf6", "pf7", "pf8", "onhndQnt", "rdrPnt", "mcl", "rdrQnt", "memo", "flrRsn", "dsd", "dscMltplr", "csPkgMltpl", "ovr"
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