var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING
const sybaseHost = process.env.SYBASE_HOST
const sybaseDbName = process.env.SYBASE_DB_NAME
const sybaseUserName = process.env.SYBASE_USER_NAME
const sybasePW = process.env.SYBASE_PW

const Sybase = require('sybase')
db = new Sybase(sybaseHost, '3000', sybaseDbName, sybaseUserName, sybasePW)

module.exports = {
	queryCatapultDB: router.post('/queryCatapultDB', (req, res, next) => {
		const queryCatapultDBPostBody = req.body
		// console.log(`req.body==> ${req.body}`)
		let catapultDbQuery = queryCatapultDBPostBody['dbQueryPost']
		console.log(`catapultDbQuery==> ${catapultDbQuery}`)

		let catapultTableArr = []

		function showCatapultTables(result) {
			for (let i = 0; i < result.length; i++) {
				let catapultTableListObj = {}
				catapultTableListObj['tableQualifier'] = result[i]['table_qualifier']
				catapultTableListObj['tableOwner'] = result[i]['table_owner']
				catapultTableListObj['tableName'] = result[i]['table_name']
				catapultTableListObj['tableType'] = result[i]['table_type']
				catapultTableListObj['tableRemarks'] = result[i]['remarks']

				catapultTableArr.push(catapultTableListObj)
			}
			console.log('result.length~~~>', result.length)
		}

		db.connect(function (err) {
			if (err) return console.log(err);

			db.query(`${catapultDbQuery}`, function (err, data) {
				if (err) console.log(err);

				console.log(data);

				db.disconnect();

			});
		});

		// odbc.connect(DSN, (error, connection) => {
		// 	connection.query(`${catapultDbQuery}`, (error, result) => {
		// 		if (error) {
		// 			console.error(error)
		// 		}
		// 		// console.log('result[0]==>', result[0])
		// 		// console.log('result==>', result)
		// 		console.log(`result==> ${result}`)
		// 		console.log(`JSON.stringify(result)==> ${JSON.stringify(result)}`)
		// 		console.log('result[\'columns\']==>', result['columns'])
		// 		// console.log('result[\'columns\'][0][\'name\']==>', result['columns'][0]['name'])
		// 		showCatapultTables(result)

		// 		res.render('vw-catapultDbQuery', {
		// 			title: 'Catapult DB Query Results',
		// 			catapultTables: catapultTableArr
		// 		})
		// 	})
		// })
	})
}