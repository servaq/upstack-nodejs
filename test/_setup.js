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
	const dbConfig = config.getConfig().database.connection;
	const dbName = dbConfig.database;
	delete dbConfig.database;
	let conn = mysql.createConnection(dbConfig);
	conn.connect();
	await queryExec(conn, 'DROP DATABASE `' + dbName + '`');
	await queryExec(conn, 'CREATE DATABASE `' + dbName + '` character set UTF8mb4 collate utf8mb4_general_ci');
	conn.end();
	dbConfig.database = dbName;
	conn = mysql.createConnection(dbConfig);
	fs.readFileSync('./database/upstack-node.sql').toString().split(';').forEach(async sql => {
		if (sql.trim().length > 0) {
			await queryExec(conn, sql.trim());
		}
	});
	conn.end();
});
