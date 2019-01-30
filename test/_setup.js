const mysql = require('mysql');
const fs = require('fs');
const config = require('../src/config');

const queryExec = async (connection, query) => {
	return new Promise((resolve, reject) => {
		connection.query(query, (err, res) => {
			if (err) {
				return reject(err);
			} else {
				return resolve(res);
			}
		});
	});
}

before(async () => {
	const dbConfig = { ...config.getConfig().database.connection };
	const dbName = '`' + dbConfig.database + '`';
	delete dbConfig.database;
	const conn = mysql.createConnection(dbConfig);
	await queryExec(conn, 'DROP DATABASE IF EXISTS ' + dbName);
	const scripts = fs.readFileSync('./database/upstack-node.sql').toString().replace(new RegExp('`upstack-node`', 'g'), dbName).split(';');
	scripts.forEach(async sql => {
		if (sql.trim().length > 0) {
			await queryExec(conn, sql.trim());
		}
	});
	conn.end();
});