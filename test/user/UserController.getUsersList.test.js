const app = require('../../src/app');
const expect = require('chai').expect;
const request = require('supertest');
const UserHelper = require('./UserHelper.test');

describe('Get user by id test', () => {

	let admin = null;
	let adminToken = null;
	let user = null;
	let userToken = null;

	before(async () => {
		admin = await UserHelper.createVerifiedUser();
		adminToken = await UserHelper.getAuthToken(admin);
	});

	after(async () => {
		await UserHelper.deleteUser(admin);
	});

	it('Without token should fails', (done) => {
		request(app).get('/user').expect(401, done);
	});

	it('With invalid token should fails', (done) => {
		request(app).get('/user').set('Authorization', 'Bearer invalid.token').expect(401, done);
	});

	it('Should return only my user because there is only one user created', (done) => {
		request(app).get('/user').set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				expect(response.body).to.be.an('array').to.have.lengthOf(1);
				Object.keys(admin).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(admin[key]).to.be.equals(response.body[0][key]);
					}
				});
			})
			.end(done);
	});

	it('Creates an user with user role', async () => {
		user = await UserHelper.createUser('johndoe2', 'user');
	});

	it('Should return only my user because the second user is not verified', (done) => {
		request(app).get('/user').set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				expect(response.body).to.be.an('array').to.have.lengthOf(1);
			})
			.end(done);
	});

	it('Verifies the second user', async () => {
		user = await UserHelper.verifyUser(user);
		userToken = await UserHelper.getAuthToken(user);
	});

	it('Should return 2 users, first and second one', (done) => {
		request(app).get('/user').set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				expect(response.body).to.be.an('array').to.have.lengthOf(2);
			})
			.end(done);
	});

	it('Should fails with user role token', (done) => {
		request(app).get('/user').set('Authorization', 'Bearer ' + userToken).expect(401, done);
	});

	it('Verifies the second user', async () => {
		await UserHelper.deleteUser(user);
	});

	it('Should return 1 user because the second one was deleted', (done) => {
		request(app).get('/user').set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				expect(response.body).to.be.an('array').to.have.lengthOf(1);
				Object.keys(admin).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(admin[key]).to.be.equals(response.body[0][key]);
					}
				});
			})
			.end(done);
	});

});
