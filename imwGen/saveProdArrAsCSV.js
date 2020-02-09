const express = require('express')
const router = express.Router()
const fs = require('fs')

module.exports = {

  saveProdArrAsCSV: router.post('/saveProdArrAsCSV', (req, res, next) => {

    const postBody = req.body
    let itemsToAdd = postBody['productArrayPost']
    let itemsToAddArr = []
    let objectifiedItemsToAddArr = []

    console.log(`typeof itemsToAdd==> ${typeof itemsToAdd}`)

    function itemsToAddSanitizer() {
      if (itemsToAdd !== undefined) {
        let sanitizerRegex1 = /(\\)|(\[)|(\])/g
        let sanitizerRegex2 = /("")/g
        let sanitizerRegex3 = /("{)/g
        let sanitizerRegex4 = /(}")/g
        sanitizeditemsToAdd = itemsToAdd.replace(sanitizerRegex1, "")
          .replace(sanitizerRegex2, `"`).replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
        console.log(`sanitizeditemsToAdd==> ${sanitizeditemsToAdd}`)
      }
    }

    function itemsToAddArrayGenerator() {
      if (itemsToAdd !== undefined) {
        itemsToAddSanitizer()
        /* X(?=Y) 	Positive lookahead 	X if followed by Y
         * (?<=Y)X 	Positive lookbehind 	X if after Y
         * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
        let splitRegex1 = /(?<=}),(?={)/g
        let itemsToAddSPLIT = sanitizeditemsToAdd.split(splitRegex1)
        console.log(`sanitizeditemsToAdd==> ${sanitizeditemsToAdd}`)
        console.log(`itemsToAddSPLIT==> ${itemsToAddSPLIT}`)
        console.log(`itemsToAddSPLIT.length==> ${itemsToAddSPLIT.length}`)
        for (let i = 0; i < itemsToAddSPLIT.length; i++) {
          itemsToAddArr.push(itemsToAddSPLIT[i])
        }
      }
    }

    function objectifyProductArr() {
      itemsToAddArrayGenerator()
      console.log(`itemsToAddArr.length==> ${itemsToAddArr.length}`)
      for (let i = 0; i < itemsToAddArr.length; i++) {
        let objectifiedArrItem = JSON.parse(itemsToAddArr[i])
        objectifiedItemsToAddArr.push(objectifiedArrItem)
        console.log(`typeof objectifiedArrItem==> ${typeof objectifiedArrItem}`)
        console.log(`objectifiedArrItem['itemID']==> ${objectifiedArrItem['itemID']}`)
      }
    }

    // objectifyProductArr()

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
      objectifyProductArr()
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