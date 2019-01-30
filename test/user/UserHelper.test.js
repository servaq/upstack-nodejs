const app = require('../../src/app');
const request = require('supertest');
const DatabaseHelper = require('../../src/helpers/DatabaseHelper');
const UserService = require('../../src/services/UserService');

class UserHelper {

	getUserPassword() {
		return "doe";
	}

	async createUser() {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
			email: "john",
			password: this.getUserPassword(),
			role: "admin"
		}
		const response = await request(app).post('/user').send(body).expect(201);
		await DatabaseHelper.disconnect();
		const user = await UserService.getUserForId(response.body.id);
		await DatabaseHelper.disconnect();
		return user;
	}

	async verifyUser(user) {
		await request(app).get('/user/' + user.id + '/verify/' + user.verificationToken).expect(200);
		return user;
	}

	async createVerifiedUser() {
		const user = this.createUser();
		return this.verifyUser(user);
	}

	async deleteUser(user) {
		if (user != null) {
			await UserService.deleteUser(user.id);
		}
		await DatabaseHelper.disconnect();
	}

}

module.exports = new UserHelper();