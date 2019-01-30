const app = require('../../src/app');
const expect = require('chai').expect;
const request = require('supertest');
const DatabaseHelper = require('../../src/helpers/DatabaseHelper');
const UserService = require('../../src/services/UserService');

describe('User creation tests', () => {

	let userId = null;

	after(async () => {
		if (userId != null) {
			await UserService.deleteUser(userId);
		}
		await DatabaseHelper.disconnect();
	});

	it('Without body', (done) => {
		request(app).post('/user').expect(400, done);
	});

	it('With body empty', (done) => {
		const body = {}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('Without firstName', (done) => {
		const body = {
			username: "johndoe",
		}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('Without lastName', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
		}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('Without email', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
		}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('Without password', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
			email: "john",
		}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('Without role', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
			email: "john",
			password: "doe",
		}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('With invalid role', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
			email: "john",
			password: "doe",
			role: "inexistent"
		}
		request(app).post('/user').send(body).expect(400, done);
	});

	it('Creation with valid body', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
			email: "john",
			password: "doe",
			role: "admin"
		}
		request(app).post('/user').send(body).expect(201)
			.expect(response => {
				expect(response.body.id).to.be.a('number');
				userId = response.body.id;
				Object.keys(body).forEach(key => {
					if (key != 'password') {
						expect(body[key]).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('username not available', (done) => {
		const body = {
			username: "johndoe",
			firstName: "John",
			lastName: "Doe",
			email: "john",
			password: "doe",
			role: "admin"
		}
		request(app).post('/user').send(body).expect(400, done);
	});

});
