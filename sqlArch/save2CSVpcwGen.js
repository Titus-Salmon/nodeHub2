var express = require('express');
var router = express.Router();

const fs = require('fs')

const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

module.exports = {
  save2CSVpcwGen: router.post('/save2CSVpcwGen', (req, res, next) => {

    console.log(`req.body['csvDataPost']==> ${req.body['csvDataPost']}`)
    console.log(`JSON.stringify(req.body['csvDataPost'])==> ${JSON.stringify(req.body['csvDataPost'])}`)
    console.log(`JSON.parse(req.body['csvDataPost'])==> ${JSON.parse(req.body['csvDataPost'])}`)

    let csvDataPostparsed = JSON.parse(req.body['csvDataPost'])

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      // 'ri_t0d', 'INDstocked', 'ri_t0d', 'IND_NOTstocked', 'ri_t0d', 'SMstocked', 'ri_t0d', 'SM_NOTstocked', 'ri_t0d', 'MTstocked',
      // 'ri_t0d', 'MT_NOTstocked', 'ri_t0d', 'SHstocked', 'ri_t0d', 'SH_NOTstocked', 'ri_t0d', 'GLstocked', 'ri_t0d', 'GL_NOTstocked'
      'INDstocked', 'IND_NOTstocked', 'SMstocked', 'SM_NOTstocked', 'MTstocked',
      'MT_NOTstocked', 'SHstocked', 'SH_NOTstocked', 'GLstocked', 'GL_NOTstocked'
    ]

    const opts = {
      fields
    }

    try {
      const parser = new Parser(opts);
      console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
      const csv = parser.parse(csvDataPostparsed)
      console.log(`csv==> ${csv}`)
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