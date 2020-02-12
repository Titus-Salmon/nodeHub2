const express = require('express')
const router = express.Router()
const fs = require('fs')

const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')

module.exports = {

  saveProdArrAsCSV: router.post('/saveProdArrAsCSV', (req, res, next) => {

    const postBody = req.body
    let itemsToAdd = postBody['productArrayPost']
    let itemsToAddArr = []
    let objectifiedItemsToAddArr = []

    console.log(`typeof itemsToAdd==> ${typeof itemsToAdd}`)

    function objectifyProductArr() {
      sanitizerFuncs.itemsToAddArrayGenerator(itemsToAdd, sanitizerFuncs.itemListAccSanitizer, itemsToAddArr)
      sanitizerFuncs.objectifyImwProductArr(itemsToAddArr, objectifiedItemsToAddArr)
    }

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      "itemID", "suppUnitID", "deptName", "recptAlias", "brand", "itemName"
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