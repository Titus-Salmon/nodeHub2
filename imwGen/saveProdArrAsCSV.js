const express = require('express')
const router = express.Router()
// const mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.RB_HOST,
//   user: process.env.RB_USER,
//   password: process.env.RB_PW,
//   database: process.env.RB_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

module.exports = {

  saveProdArrAsCSV: router.post('/saveProdArrAsCSV', (req, res, next) => {

    const postBody = req.body
    let productArray = postBody['productArrayPost']
    let objectifiedProductArray = []

    function objectifyProductArr() {
      for (let i = 0; i < productArray.length; i++) {
        let objectifiedArrItem = JSON.parse(productArray[i])
        objectifiedProductArray.push(objectifiedArrItem)
      }
    }

    objectifyProductArr()

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      "itemID", "suppUnitID"
    ];
    const opts = {
      fields,
      // excelStrings: true,
      // header: false
      quote: '', //whatever is inside the '' will be use as your quote character, so this removes all quotes from CSV
      // quote: '"'
    };

    try {
      console.log('objectifiedProductArray from json2csv======>>', objectifiedProductArray)
      const parser = new Parser(opts);
      const csv = parser.parse(objectifiedProductArray);
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

    res.render('vw-imwGenerator', {
      title: `vw-imwGenerator`,
      imwProductValObj: imwProductValObj,
      imwProductArr: imwProductArr,
      objectifiedImwProdArr: objectifiedImwProdArr
    })

  })
}