const app = require('../../src/app');
const expect = require('chai').expect;
const request = require('supertest');
const UserHelper = require('./UserHelper.test');

describe('Delete user test', () => {

	let admin = null;
	let adminToken = null;
	let user = null;
	let userToken = null;

	before(async () => {
		admin = await UserHelper.createVerifiedUser();
		adminToken = await UserHelper.getAuthToken(admin);
		user = await UserHelper.createVerifiedUser('johndoe2', 'user');
		userToken = await UserHelper.getAuthToken(user);
	});

	after(async () => {
		await UserHelper.deleteUser(admin);
	});

	it('Without token should fails', (done) => {
		request(app).delete('/user/0').expect(401, done);
	});

	it('With invalid token should fails', (done) => {
		request(app).delete('/user/0').set('Authorization', 'Bearer invalid.token').expect(401, done);
	});

	it('With invalid user id should fails', (done) => {
		request(app).delete('/user/0').set('Authorization', 'Bearer ' + adminToken).expect(404, done);
	});

	it('With my user id should fails because I cant delete myself', (done) => {
		request(app).delete('/user/' + admin.id).set('Authorization', 'Bearer ' + adminToken).expect(403, done);
	});

	it('User with "user" role should not delete an "admin"', (done) => {
		request(app).delete('/user/' + admin.id).set('Authorization', 'Bearer ' + userToken).expect(401, done);
	});

	it('User with "admin" role should delete a verified "user"', (done) => {
		request(app).delete('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).expect(200, done);
	});

	it('Login should fails because "user" was deleted', (done) => {
		const body = {
			username: user.username,
			password: UserHelper.getUserPassword(),
		}
		request(app).post('/user/login').send(body).expect(404, done);
	});

	it('Verifies "use" role', async () => {
		user = await UserHelper.createUser('johndoe2', 'user');
	});

	it('User with "admin" role should delete a not verified "user"', (done) => {
		request(app).delete('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).expect(200, done);
	});

	it('Login should fails because "user" was deleted', (done) => {
		const body = {
			username: user.username,
			password: UserHelper.getUserPassword(),
		}
		request(app).post('/user/login').send(body).expect(404, done);
	});

});
