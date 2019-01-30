const app = require('../../src/app');
const expect = require('chai').expect;
const request = require('supertest');
const UserHelper = require('./UserHelper.test');

describe('User verification tests', () => {

	let user = null;

	before(async () => {
		user = await UserHelper.createUser();
	});

	after(async () => {
		await UserHelper.deleteUser(user);
	});

	it('Invalid user id', (done) => {
		request(app).get('/user/0/verify/a-token').expect(404, done);
	});

	it('Invalid token', (done) => {
		request(app).get('/user/' + user.id + '/verify/a-token').expect(400, done);
	});

	it('Valid token, should work', (done) => {
		request(app).get('/user/' + user.id + '/verify/' + user.verificationToken).expect(200, done);
	});

	it('Valid token, should fails because user is already verified', (done) => {
		request(app).get('/user/' + user.id + '/verify/' + user.verificationToken).expect(400, done);
	});

});
