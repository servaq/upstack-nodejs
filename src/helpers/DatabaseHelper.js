const Knex = require('knex');
const config = require('../config');

class DatabaseHelper {

	constructor() {
		this.db = null;
	}

	async disconnect() {
		if (this.db != null) {
			await this.db.destroy();
			this.db = null;
		}
	}

	getDb() {
		if (this.db == null) {
			this.db = new Knex(config.getConfig().database);
		}
		return this.db;
	}

}

module.exports = new DatabaseHelper();