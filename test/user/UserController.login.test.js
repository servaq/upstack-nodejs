const app = require('../../src/app');
const expect = require('chai').expect;
const request = require('supertest');
const UserHelper = require('./UserHelper.test');

describe('User login tests', () => {

	let user = null;
	let token = null;

	before(async () => {
		user = await UserHelper.createUser();
	});

	after(async () => {
		await UserHelper.deleteUser(user);
	});

	it('Login should fails because invalid username', (done) => {
		const body = {
			username: user.username + 'a',
			password: UserHelper.getUserPassword() + 'a',
		}
		request(app).post('/user/login').send(body).expect(401, done);
	});

	it('Login should fails because invalid password', (done) => {
		const body = {
			username: user.username,
			password: UserHelper.getUserPassword() + 'a',
		}
		request(app).post('/user/login').send(body).expect(401, done);
	});

	it('Login should fails because user is not verified', (done) => {
		const body = {
			username: user.username,
			password: UserHelper.getUserPassword(),
		}
		request(app).post('/user/login').send(body).expect(401, done);
	});

	it('Verify user', async () => {
		user = await UserHelper.verifyUser(user);
	});

	it('Login should be OK', (done) => {
		const body = {
			username: user.username,
			password: UserHelper.getUserPassword(),
		}
		request(app).post('/user/login').send(body).expect(201)
			.expect(response => {
				expect(response.body.token).to.be.a('string');
				token = response.body.token;
			})
			.end(done);
	});

	it('Provided token should works', (done) => {
		request(app).get('/user/' + user.id).set('Authorization', 'Bearer ' + token).expect(200, done);
	});

});
