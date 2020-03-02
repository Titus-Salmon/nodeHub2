const express = require('express')
const router = express.Router()
const fs = require('fs')

module.exports = {

  saveIMW_CSV: router.post('/saveIMW_CSV', (req, res, next) => {

    console.log('srcRsCSV_nonPag[0][\'P_K\']', srcRsCSV_nonPag[0]['P_K'])
    console.log('Object.keys(srcRsCSV_nonPag[0])', Object.keys(srcRsCSV_nonPag[0]))

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
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
      console.log('srcRsCSV_nonPag from json2csv======>>', srcRsCSV_nonPag)
      const parser = new Parser(opts);
      const csv = parser.parse(srcRsCSV_nonPag);
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

    res.render('vw-MySqlTableHub', {
      title: `<<${process.cwd()}/public/csv/${req.body['csvPost']} SAVED>>`
    });

  })
}