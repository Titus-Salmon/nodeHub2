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
    let itemsToAdd = postBody['productArrayPost']
    let itemsToAddArr = []
    let objectifiedItemsToAddArr = []

    console.log(`typeof productArray==> ${typeof productArray}`)

    function itemsToAddArrayGenerator() {
      // if (itemListAccumulator !== undefined) {
      // itemListAccSanitizer()
      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
      let splitRegex1 = /(?<=}),(?={)/g
      let itemsToAddSPLIT = itemsToAdd.split(splitRegex1)
      for (let i = 0; i < itemsToAddSPLIT.length; i++) {
        itemsToAddArr.push(itemsToAddSPLIT[i])
      }
      //}
      // imwProductValObj['itemID'] = itemID
      // imwProductValObj['suppUnitID'] = suppUnitID
      // let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
      // imwProductArr.push(stringifiedImwProductValObj)
    }

    function objectifyProductArr() {
      itemsToAddArrayGenerator()
      for (let i = 0; i < itemsToAddArr.length; i++) {
        let objectifiedArrItem = JSON.parse(itemsToAddArr[i])
        objectifiedItemsToAddArr.push(objectifiedArrItem)
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
      console.log('objectifiedItemsToAddArr from json2csv======>>', objectifiedItemsToAddArr)
      const parser = new Parser(opts);
      const csv = parser.parse(objectifiedItemsToAddArr);
      // csvContainer.push(csv);
      console.log('csv_T0d=====>>', csv);
      fs.writeFile(process.cwd() + '/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    // res.render('vw-imwGenerator', {
    //   title: `vw-imwGenerator`,
    //   imwProductValObj: imwProductValObj,
    //   imwProductArr: imwProductArr,
    //   objectifiedImwProdArr: objectifiedImwProdArr
    // })

    res.render('vw-MySqlTableHub', {
      title: `<<${process.cwd()}/public/csv/${req.body['csvPost']} SAVED>>`
    })

  })
}