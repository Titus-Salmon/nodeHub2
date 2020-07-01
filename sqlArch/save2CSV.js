var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

module.exports = {
    save2CSV: router.post('/save2CSV', (req, res, next) => {

        // console.log(`req.body['save2CSVArrPost']==> ${req.body['save2CSVArrPost']}`)
        console.log(`req.body['save2CSVArrPost'][0]==>${req.body['save2CSVArrPost'][0]}`)
        console.log(`JSON.parse(req.body['save2CSVArrPost'])==>${JSON.parse(req.body['save2CSVArrPost'])}`)

        // console.log(`catapultTableArr[0]==>${catapultTableArr[0]}`)
        // console.log(`catapultTables[0]==>${catapultTables[0]}`)
        // console.log(`JSON.stringify(catapultTableArr[0])==>${JSON.stringify(catapultTableArr[0])}`)
        // console.log(`JSON.parse(JSON.stringify(catapultTableArr[0]))==>${JSON.parse(JSON.stringify(catapultTableArr[0]))}`)


        //begin csv generator //////////////////////////////////////////////////////////////////////////
        const {
            Parser
        } = require('json2csv')

        const fields = [
            "ri_t0d", "invPK", "invCPK", "invScanCode", "invName", "ordSupplierStockNumber", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated",
            "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName", "stoNumber", "stoName", "brdName", "dptName", "dptNumber", "sibIdealMargin", "venCompanyname",
            "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit", "invMemo", "pi1Description",
            "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
        ]

        const opts = {
            fields
        }

        try {
            // console.log('catapultTableArr[0] from json2csv======>>', catapultTableArr[0])
            const parser = new Parser(opts);
            // const csv = parser.parse(catapultTableArr);
            // const csv = parser.parse(catapultTables)
            // const csv = parser.parse(JSON.stringify(req.body['save2CSVArrPost']))
            console.log(`req.body['save2CSVArrPost'][0]==>${req.body['save2CSVArrPost'][0]}`)
            const csv = parser.parse(JSON.parse(req.body['save2CSVArrPost']))
            // csvContainer.push(csv);
            // console.log(`req.body-->${req.body}`)
            // console.log(`JSON.stringify(req.body)-->${JSON.stringify(req.body)}`)
            console.log(`JSON.stringify(req.body['save2CSVArrPost'][0])-->${JSON.stringify(req.body['save2CSVArrPost'][0])}`)
            console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
            console.log('csv.length=====>>', csv.length);
            fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
                if (err) throw err;
                console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
            })
        } catch (err) {
            console.error(err);
        }
        //end csv generator //////////////////////////////////////////////////////////////////////////

        res.render('vw-tsqlTableHub', { //render searchResults to vw-dbEditPassport page
            title: 'CSV Saved'
        })
    })
}