var express = require('express');
var router = express.Router();

const fs = require('fs')

module.exports = {
    save2CSVnhcrtEdiJoin: router.post('/save2CSVnhcrtEdiJoin', (req, res, next) => {

        // console.log(`req.body['save2CSVArrPost']==> ${req.body['save2CSVArrPost']}`)
        console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
        console.log(`JSON.parse(req.body['csvDataPost'])==>${JSON.parse(req.body['csvDataPost'])}`)

        // console.log(`catapultTableArr[0]==>${catapultTableArr[0]}`)
        // console.log(`catapultTables[0]==>${catapultTables[0]}`)
        // console.log(`JSON.stringify(catapultTableArr[0])==>${JSON.stringify(catapultTableArr[0])}`)
        // console.log(`JSON.parse(JSON.stringify(catapultTableArr[0]))==>${JSON.parse(JSON.stringify(catapultTableArr[0]))}`)


        //begin csv generator //////////////////////////////////////////////////////////////////////////
        const {
            Parser
        } = require('json2csv')

        const fields = [
            "record_id", "invScanCode", "ordSupplierStockNumber", "ediSKU", "invName", "invSize", "invReceiptAlias", "posTimeStamp",
            "invDateCreated", "ordQuantityInOrderUnit", "oupName", "stoName", "brdName", "dptName", "dptNumber", "sibIdealMargin", "venCompanyname", "invLastcost",
            "ediCost", "sibBasePrice", "ediPrice", "pi1Description", "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
        ]

        const opts = {
            fields
        }

        try {
            // console.log('catapultTableArr[0] from json2csv======>>', catapultTableArr[0])
            const parser = new Parser(opts);
            // const csv = parser.parse(catapultTableArr);
            // const csv = parser.parse(catapultTables)
            // const csv = parser.parse(JSON.stringify(req.body['csvDataPost']))
            console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
            const csv = parser.parse(JSON.parse(req.body['csvDataPost']))
            // csvContainer.push(csv);
            // console.log(`req.body-->${req.body}`)
            // console.log(`JSON.stringify(req.body)-->${JSON.stringify(req.body)}`)
            console.log(`JSON.stringify(req.body['csvDataPost'][0])-->${JSON.stringify(req.body['csvDataPost'][0])}`)
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

// router.post('/save2CSV', function (req, res, next) {
//     console.log(`catapultTableArr[0]==>${catapultTableArr[0]}`)
//     console.log(`JSON.stringify(catapultTableArr[0])==>${JSON.stringify(catapultTableArr[0])}`)
//     console.log(`JSON.parse(JSON.stringify(catapultTableArr[0]))==>${JSON.parse(JSON.stringify(catapultTableArr[0]))}`)


//     //begin csv generator //////////////////////////////////////////////////////////////////////////
//     const {
//         Parser
//     } = require('json2csv')

//     const fields = [
//         "invPK", "invScanCode", "invName", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated", "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName",
//         "stoName", "brdName", "dptName", "dptNumber", "venCompanyname", "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit",
//         "pi1Description", "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
//     ]

//     const opts = {
//         fields
//     }

//     try {
//         console.log('catapultTableArr[0] from json2csv======>>', catapultTableArr[0])
//         const parser = new Parser(opts);
//         const csv = parser.parse(catapultTableArr);
//         // csvContainer.push(csv);
//         // console.log(`req.body-->${req.body}`)
//         console.log(`JSON.stringify(req.body)-->${JSON.stringify(req.body)}`)
//         console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
//         console.log('csv.length=====>>', csv.length);
//         fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
//             if (err) throw err;
//             console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
//         })
//     } catch (err) {
//         console.error(err);
//     }
//     //end csv generator //////////////////////////////////////////////////////////////////////////

//     res.render('vw-v_InventoryMaster_query', { //render searchResults to vw-dbEditPassport page
//         title: 'CSV Saved'
//     })
// })

// module.exports = router;