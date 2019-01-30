const app = require('../../src/app');
const request = require('supertest');
const DatabaseHelper = require('../../src/helpers/DatabaseHelper');
const UserService = require('../../src/services/UserService');

class UserHelper {

	getUserPassword() {
		return "doe";
	}

	async createUser(username = 'johndoe', role = 'admin') {
		const body = {
			username: username,
			firstName: "John",
			lastName: "Doe",
			email: "john",
			password: this.getUserPassword(),
			role: role
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

	async createVerifiedUser(username, role) {
		const user = await this.createUser(username, role);
		return await this.verifyUser(user);
	}

	async deleteUser(user) {
		if (user != null) {
			await UserService.deleteUser(user.id);
		}
		await DatabaseHelper.disconnect();
	}

	async getAuthToken(user) {
		const body = {
			username: user.username,
			password: this.getUserPassword(),
		}
		const response = await request(app).post('/user/login').send(body).expect(201);
		await DatabaseHelper.disconnect();
		return response.body.token;
	}

}

module.exports = new UserHelper();