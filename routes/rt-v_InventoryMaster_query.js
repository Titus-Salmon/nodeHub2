var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

/* GET /catapultTableQuery */

let catapultTableArr = []

router.get('/', function (req, res, next) {
	res.render('vw-v_InventoryMaster_query', {
		title: 'v_InventoryMaster query',
		// username: req.user.name,
		// userEmail: req.user.email,
		// userEmail_stringified: JSON.stringify(req.user.email),
	});
});

router.post('/queryTable', function (req, res, next) {

	// let catapultTableArr = []

	const queryCatapultDBPostBody = req.body
	// console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
	// console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
	let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

	console.log(`catapultDbQuery==> ${catapultDbQuery}`)

	// let catapultTableArr = []

	function showCatapultTables(result) {
		for (let i = 0; i < result.length; i++) {
			let catapultTableListObj = {}
			catapultTableListObj['invPK'] = result[i]['INV_PK']
			catapultTableListObj['invScanCode'] = result[i]['INV_ScanCode']
			catapultTableListObj['invName'] = result[i]['INV_Name']
			catapultTableListObj['invSize'] = result[i]['INV_Size']
			catapultTableListObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias']
			catapultTableListObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
			catapultTableListObj['invDateCreated'] = result[i]['INV_DateCreated']
			catapultTableListObj['invEmpFkCreatedBy'] = result[i]['INV_EMP_FK_CreatedBy']
			catapultTableListObj['ordQuantityInOrderUnit'] = result[i]['ord_quantityinorderunit']
			catapultTableListObj['oupName'] = result[i]['oup_name']
			catapultTableListObj['stoName'] = result[i]['sto_name']
			catapultTableListObj['brdName'] = result[i]['brd_name']
			catapultTableListObj['dptName'] = result[i]['dpt_name']
			catapultTableListObj['dptNumber'] = result[i]['dpt_number']
			catapultTableListObj['venCompanyname'] = result[i]['ven_companyname']
			catapultTableListObj['invLastreceived'] = result[i]['inv_lastreceived']
			catapultTableListObj['invLastsold'] = result[i]['inv_lastsold']
			catapultTableListObj['invLastcost'] = result[i]['inv_lastcost']
			catapultTableListObj['sibBasePrice'] = result[i]['SIB_BasePrice']
			catapultTableListObj['invOnhand'] = result[i]['inv_onhand']
			catapultTableListObj['invOnorder'] = result[i]['inv_onorder']
			catapultTableListObj['invIntransit'] = result[i]['inv_intransit']
			catapultTableListObj['pi1Description'] = result[i]['PI1_Description']
			catapultTableListObj['pi2Description'] = result[i]['PI2_Description']
			catapultTableListObj['pi3Description'] = result[i]['PI3_Description']
			catapultTableListObj['pi4Description'] = result[i]['PI4_Description']
			catapultTableListObj['invPowerField1'] = result[i]['INV_PowerField1']
			catapultTableListObj['invPowerField2'] = result[i]['INV_PowerField2']
			catapultTableListObj['invPowerField3'] = result[i]['INV_PowerField3']
			catapultTableListObj['invPowerField4'] = result[i]['INV_PowerField4']

			catapultTableArr.push(catapultTableListObj)
		}
		console.log('result.length~~~>', result.length)
	}

	odbc.connect(DSN, (error, connection) => {
		connection.query(`${catapultDbQuery}`, (error, result) => {
			if (error) { console.error(error) }
			console.log('result==>', result)
			// console.log('result[0]==>', result[0])
			// console.log('result[\'columns\'][2]==>', result['columns'][2])
			// console.log('result.length~~~>', result.length)
			showCatapultTables(result)

			res.render('vw-v_InventoryMaster_query', { //render searchResults to vw-retailCalcPassport page
				title: 'v_InventoryMaster query results',
				catapultTables: catapultTableArr
			})
		})
	})
});

router.post('/save2CSV', function (req, res, next) {
	console.log(`catapultTableArr[0]==>${catapultTableArr[0]}`)
	console.log(`JSON.stringify(catapultTableArr[0])==>${JSON.stringify(catapultTableArr[0])}`)
	console.log(`JSON.parse(JSON.stringify(catapultTableArr[0]))==>${JSON.parse(JSON.stringify(catapultTableArr[0]))}`)
	console.log(`catapultTableArr[0]['invPK']==> ${catapultTableArr[0]['invPK']}`)
	console.log(`catapultTableArr[0]['invScanCode']==> ${catapultTableArr[0]['invScanCode']}`)
	console.log(`catapultTableArr[0]['invName']==> ${catapultTableArr[0]['invName']}`)
	console.log(`catapultTableArr[0]['invSize']==> ${catapultTableArr[0]['invSize']}`)
	console.log(`catapultTableArr[0]['invReceiptAlias']==> ${catapultTableArr[0]['invReceiptAlias']}`)
	console.log(`catapultTableArr[0]['posTimeStamp']==> ${catapultTableArr[0]['posTimeStamp']}`)
	console.log(`catapultTableArr[0]['invDateCreated']==> ${catapultTableArr[0]['invDateCreated']}`)
	console.log(`catapultTableArr[0]['invEmpFkCreatedBy']==> ${catapultTableArr[0]['invEmpFkCreatedBy']}`)
	console.log(`catapultTableArr[0]['ordQuantityInOrderUnit']==> ${catapultTableArr[0]['ordQuantityInOrderUnit']}`)
	console.log(`catapultTableArr[0]['oupName']==> ${catapultTableArr[0]['oupName']}`)
	console.log(`catapultTableArr[0]['stoName']==> ${catapultTableArr[0]['stoName']}`)
	console.log(`catapultTableArr[0]['brdName']==> ${catapultTableArr[0]['brdName']}`)
	console.log(`catapultTableArr[0]['dptName']==> ${catapultTableArr[0]['dptName']}`)
	console.log(`catapultTableArr[0]['dptNumber']==> ${catapultTableArr[0]['dptNumber']}`)
	console.log(`catapultTableArr[0]['venCompanyname']==> ${catapultTableArr[0]['venCompanyname']}`)
	console.log(`catapultTableArr[0]['invLastreceived']==> ${catapultTableArr[0]['invLastreceived']}`)
	console.log(`catapultTableArr[0]['invLastsold']==> ${catapultTableArr[0]['invLastsold']}`)
	console.log(`catapultTableArr[0]['invLastcost']==> ${catapultTableArr[0]['invLastcost']}`)
	console.log(`catapultTableArr[0]['sibBasePrice']==> ${catapultTableArr[0]['sibBasePrice']}`)
	console.log(`catapultTableArr[0]['invOnhand']==> ${catapultTableArr[0]['invOnhand']}`)
	console.log(`catapultTableArr[0]['invOnorder']==> ${catapultTableArr[0]['invOnorder']}`)
	console.log(`catapultTableArr[0]['invIntransit']==> ${catapultTableArr[0]['invIntransit']}`)
	console.log(`catapultTableArr[0]['pi1Description']==> ${catapultTableArr[0]['pi1Description']}`)
	console.log(`catapultTableArr[0]['pi2Description']==> ${catapultTableArr[0]['pi2Description']}`)
	console.log(`catapultTableArr[0]['pi3Description']==> ${catapultTableArr[0]['pi3Description']}`)
	console.log(`catapultTableArr[0]['pi4Description']==> ${catapultTableArr[0]['pi4Description']}`)
	console.log(`catapultTableArr[0]['invPowerField1']==> ${catapultTableArr[0]['invPowerField1']}`)
	console.log(`catapultTableArr[0]['invPowerField2']==> ${catapultTableArr[0]['invPowerField2']}`)
	console.log(`catapultTableArr[0]['invPowerField3']==> ${catapultTableArr[0]['invPowerField3']}`)
	console.log(`catapultTableArr[0]['invPowerField4']==> ${catapultTableArr[0]['invPowerField4']}`)

	//begin csv generator //////////////////////////////////////////////////////////////////////////
	const {
		Parser
	} = require('json2csv')

	const fields = [
		"invPK", "invScanCode", "invName", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated", "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName",
		"stoName", "brdName", "dptName", "dptNumber", "venCompanyname", "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit",
		"pi1Description", "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
	]

	const opts = {
		fields
	}

	try {
		console.log('catapultTableArr[0] from json2csv======>>', catapultTableArr[0])
		const parser = new Parser(opts);
		const csv = parser.parse(catapultTableArr);
		// csvContainer.push(csv);
		console.log('csv.length=====>>', csv.length);
		fs.writeFile(process.cwd() + '/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
			if (err) throw err;
			console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
		})
	} catch (err) {
		console.error(err);
	}
	//end csv generator //////////////////////////////////////////////////////////////////////////

	res.render('vw-v_InventoryMaster_query', { //render searchResults to vw-dbEditPassport page
		title: 'CSV Saved'
	})
})

module.exports = router;
