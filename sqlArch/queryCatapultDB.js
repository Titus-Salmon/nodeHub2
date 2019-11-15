var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

module.exports = {
	queryCatapultDB: router.post('/queryCatapultDB', (req, res, next) => {
		const queryCatapultDBPostBody = req.body
		let catapultDbQuery = queryCatapultDBPostBody['dbQueryPost']

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

		odbc.connect(DSN, (error, connection) => {
			connection.query(`${catapultDbQuery}`, (error, result) => {
				if (error) { console.error(error) }
				console.log('result[0]==>', result[0])
				showCatapultTables(result)

				res.render('vw-catapultDbQuery', {
					title: 'Catapult DB Query Results',
					catapultTables: catapultTableArr
				})
			})
		})
	})
}