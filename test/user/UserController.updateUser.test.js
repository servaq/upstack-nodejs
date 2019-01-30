const app = require('../../src/app');
const expect = require('chai').expect;
const request = require('supertest');
const UserHelper = require('./UserHelper.test');

describe('Update user test', () => {

	const user2username = 'johndoe2';
	let admin = null;
	let adminToken = null;
	let user = null;
	let userToken = null;

	before(async () => {
		admin = await UserHelper.createVerifiedUser();
		adminToken = await UserHelper.getAuthToken(admin);
		user = await UserHelper.createUser(user2username, 'user');
		delete admin.password;
		delete user.password;
		delete admin.createVerifiedUser;
		delete user.createVerifiedUser;
		admin.username += 'modified';
		admin.firstName += 'modified';
		admin.lastName += 'modified';
		admin.email += 'modified';
		user.username += 'modified';
		user.firstName += 'modified';
		user.lastName += 'modified';
		user.email += 'modified';
	});

	after(async () => {
		await UserHelper.deleteUser(admin);
	});

	it('Without token should fails', (done) => {
		request(app).put('/user/0').expect(401, done);
	});

	it('With invalid token should fails', (done) => {
		request(app).put('/user/0').set('Authorization', 'Bearer invalid.token').expect(401, done);
	});

	it('With invalid user id should fails', (done) => {
		request(app).put('/user/0').set('Authorization', 'Bearer ' + adminToken).expect(404, done);
	});

	it('With duplicated username "user" id should fails', (done) => {
		const adminClone = { ...admin }
		adminClone.username = user2username;
		request(app).put('/user/' + admin.id).set('Authorization', 'Bearer ' + adminToken).send(adminClone).expect(400, done);
	});

	it('With "admin" user id should be OK for "admin" role and dont modify password', (done) => {
		request(app).put('/user/' + admin.id).set('Authorization', 'Bearer ' + adminToken).send(admin).expect(200)
			.expect(response => {
				Object.keys(admin).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(admin[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('Double check "admin" modified data', (done) => {
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

	it('Login "admin" with new username and original password should be OK', (done) => {
		const body = {
			username: admin.username,
			password: UserHelper.getUserPassword(),
		}
		request(app).post('/user/login').send(body).expect(201)
			.expect(response => {
				expect(response.body.token, 'token').to.be.a('string');
				adminToken = response.body.token;
			})
			.end(done);
	});

	it('With "admin" user id should be OK for "admin" role and modify password', (done) => {
		admin.password = UserHelper.getUserPassword() + 'modified';
		request(app).put('/user/' + admin.id).set('Authorization', 'Bearer ' + adminToken).send(admin).expect(200)
			.expect(response => {
				Object.keys(admin).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(admin[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('Double check "admin" modified data', (done) => {
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

	it('Login "admin" with new username and new password should be OK', (done) => {
		const body = {
			username: admin.username,
			password: admin.password,
		}
		request(app).post('/user/login').send(body).expect(201)
			.expect(response => {
				expect(response.body.token, 'token').to.be.a('string');
				adminToken = response.body.token;
			})
			.end(done);
	});

	it('With "user" id should fails for "admin" role because "user" is not verified', (done) => {
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).send(user).expect(403, done);
	});

	it('Verifies "use" role', async () => {
		await UserHelper.verifyUser(user);
	});

	it('With "user" id should be OK for "admin" role because "user" is verified', (done) => {
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).send(user).expect(200)
			.expect(response => {
				Object.keys(user).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(user[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('Double check "user" modified data', (done) => {
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

	it('Deletes "user"', async () => {
		await UserHelper.deleteUser(user);
	});

	it('Should fails because user was deleted', (done) => {
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).send(user).expect(404, done);
	});

	it('Create "user" role again', async () => {
		user = await UserHelper.createVerifiedUser(user2username, 'user');
		delete user.createVerifiedUser;
		user.username += 'modified';
		user.firstName += 'modified';
		user.lastName += 'modified';
		user.email += 'modified';
		user.password = UserHelper.getUserPassword() + 'modified';
	});

	it('Login "user" with original username and password should be OK', (done) => {
		const body = {
			username: user2username,
			password: UserHelper.getUserPassword(),
		}
		request(app).post('/user/login').send(body).expect(201)
			.expect(response => {
				expect(response.body.token, 'token').to.be.a('string');
				userToken = response.body.token;
			})
			.end(done);
	});

	it('With "user" id should be OK for "user" role', (done) => {
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + userToken).send(user).expect(200)
			.expect(response => {
				Object.keys(user).forEach(key => {
					if (key != 'password' && key != 'verificationToken') {
						expect(user[key], key).to.be.equals(response.body[key]);
					}
				});
			})
			.end(done);
	});

	it('Login "user" with new username should be OK', (done) => {
		const body = {
			username: user.username,
			password: user.password,
		}
		request(app).post('/user/login').send(body).expect(201)
			.expect(response => {
				expect(response.body.token, 'token').to.be.a('string');
				userToken = response.body.token;
			})
			.end(done);
	});

	it('With "admin" id should fails for "user" role', (done) => {
		request(app).put('/user/' + admin.id).set('Authorization', 'Bearer ' + userToken).send(admin).expect(403, done);
	});

	it('Change "user" role to "admin" should fail because "user" cannot upgrade its role', (done) => {
		user.role = 'admin';
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + userToken).send(user).expect(403, done);
	});

	it('Change "user" role to "admin" should be OK because "admin" can upgrade user role', (done) => {
		user.role = 'admin';
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).send(user).expect(200)
			.expect(response => {
				expect(user.role, 'role').to.be.equals(response.body.role);
			})
			.end(done);
	});

	it('Double check "user" modified role', (done) => {
		request(app).get('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).expect(200)
			.expect(response => {
				expect(user.role, 'role').to.be.equals(response.body.role);
			})
			.end(done);
	});

	it('Change "admin" role to "user" with second user should be OK because second user now has "admin" role', (done) => {
		admin.role = 'user';
		request(app).put('/user/' + admin.id).set('Authorization', 'Bearer ' + userToken).send(admin).expect(200)
			.expect(response => {
				expect(admin.role, 'role').to.be.equals(response.body.role);
			})
			.end(done);
	});

	it('Change "user" role to "admin" with first user should fail because first user now has "user" role', (done) => {
		user.role = 'user';
		request(app).put('/user/' + user.id).set('Authorization', 'Bearer ' + adminToken).send(user).expect(403, done);
	});

	it('Deletes user', async () => {
		await UserHelper.deleteUser(user);
	});

});
