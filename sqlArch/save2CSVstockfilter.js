var express = require('express');
var router = express.Router();

const fs = require('fs')

const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

module.exports = {
  save2CSVstockfilter: router.post('/save2CSVstockfilter', (req, res, next) => {

    let csvDataPostparsed = JSON.parse(req.body['csvDataPost'])
    console.log(`csvDataPostparsed==> ${csvDataPostparsed}`)
    console.log(`csvDataPostparsed[0]==> ${csvDataPostparsed[0]}`)
    console.log(`JSON.stringify(csvDataPostparsed[0])==> ${JSON.stringify(csvDataPostparsed[0])}`)
    console.log(`csvDataPostparsed[0][0]==> ${csvDataPostparsed[0][0]}`)
    console.log(`csvDataPostparsed[0][0]['ri_t0d']==> ${csvDataPostparsed[0][0]['ri_t0d']}`)
    console.log(`JSON.stringify(csvDataPostparsed[0][0])==> ${JSON.stringify(csvDataPostparsed[0][0])}`)

    // console.log(`JSON.stringify(req.body['csvDataPost'])==>${JSON.stringify(req.body['csvDataPost'])}`)

    // let searchResultsCache = cacheMainStockFilter['data']['searchResultsCache_key']['v']

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      // 'ri_t0d', 'invMismatchUPC', 'invMismatchSKU', 'invMismatchName', 'invMismatchStore', 'invMismatchSFdata', 'invMismatchCPLTdata',
      // 'invMismatchLastRecd', 'invMismatchLastSold', 'LastRecd0_3', 'LastRecd3_6', 'LastRecd6_9', 'LastRecd9_12', 'LastRecd12plus', 'Comments1',
      // 'Comments2'
      // `${srcRsINDstocked['ri_t0d']}`, `${srcRsINDstocked['INDstocked']}`
      'ri_t0d', 'INDstocked', 'ri_t0d', 'IND_NOTstocked', 'ri_t0d', 'SMstocked', 'ri_t0d', 'SM_NOTstocked', 'ri_t0d', 'MTstocked',
      'ri_t0d', 'MT_NOTstocked', 'ri_t0d', 'SHstocked', 'ri_t0d', 'SH_NOTstocked', 'ri_t0d', 'GLstocked', 'ri_t0d', 'GL_NOTstocked'
    ]

    const opts = {
      fields
    }

    try {
      const parser = new Parser(opts);
      console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
      // const csv = parser.parse(JSON.parse(req.body['csvDataPost']))
      // const csv = parser.parse(csvDataPostparsed[0])
      const csv = parser.parse(csvDataPostparsed)

      // console.log(`JSON.stringify(req.body['csvDataPost'][0])-->${JSON.stringify(req.body['csvDataPost'][0])}`)
      // console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
      console.log('csv.length=====>>', csv.length);
      fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    res.render('vw-signFilterChecker', {
      title: `<<${process.cwd()}/public/csv-to-insert/${req.body['csvPost']} SAVED>>`
    })
  })
}