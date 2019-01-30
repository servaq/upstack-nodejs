const DatabaseHelper = require('../helpers/DatabaseHelper');

const TABLENAME = 'users';

class UserService {

	async getAllUsers(verified = true) {
		let query = DatabaseHelper.getDb().table(TABLENAME);
		if (verified === true) {
			query = query.whereNull('verificationToken');
		} else if (verified === false) {
			query = query.whereNotNull('verificationToken');
		}
		return await query.select();
	}

	async getUserForId(id) {
		const result = await DatabaseHelper.getDb().table(TABLENAME)
			.where('id', id)
			.select();
		return result.length == 1 ? result[0] : null;
	}

	async getUserForUsername(username) {
		const result = await DatabaseHelper.getDb().table(TABLENAME)
			.where('username', username)
			.select();
		return result.length == 1 ? result[0] : null;
	}

	async saveUser(user) {
		if (user.id) {
			await DatabaseHelper.getDb().table(TABLENAME)
				.where('id', user.id)
				.update(user);
			return user;
		} else {
			const result = await DatabaseHelper.getDb().table(TABLENAME)
				.insert(user);
			user.id = result[0];
			return user;
		}
	}

	async deleteUser(userId) {
		await DatabaseHelper.getDb().table(TABLENAME)
			.where('id', userId)
			.del();
	}

}

module.exports = new UserService();
