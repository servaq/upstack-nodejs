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
		user = await UserHelper.createVerifiedUser('johndoe2', 'user');
		userToken = await UserHelper.getAuthToken(user);
	});

	after(async () => {
		await UserHelper.deleteUser(admin);
	});

	it('Without token should fails', (done) => {
		request(app).get('/user/0').expect(401, done);
	});

	it('With invalid token should fails', (done) => {
		request(app).get('/user/0').set('Authorization', 'Bearer invalid.token').expect(401, done);
	});

	it('With invalid user id should fails', (done) => {
		request(app).get('/user/0').set('Authorization', 'Bearer ' + adminToken).expect(404, done);
	});

	it('With my user id should be OK for "admin" role', (done) => {
		request(app).get('/user/' + admin.id).set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				Object.keys(admin).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(admin[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('With my user id should be OK for "user" role', (done) => {
		request(app).get('/user/' + user.id).set('Authorization', 'Bearer ' + userToken).expect(200)
			.expect(response => {
				Object.keys(user).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(user[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('With admin id should fails for "user" role', (done) => {
		request(app).get('/user/' + admin.id).set('Authorization', 'Bearer ' + userToken).expect(403, done);
	});

	it('With user id should be OK for "admin" role', (done) => {
		request(app).get('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				Object.keys(user).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(user[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('Deletes user', async () => {
		await UserHelper.deleteUser(user);
	});

	it('Should fails because user was deleted', (done) => {
		request(app).get('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).expect(404, done);
	});

});
