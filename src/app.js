const express = require('express');
const UserController = require('./controllers/UserController');
const DatabaseHelper = require('./helpers/DatabaseHelper');

const app = express();
module.exports = app;

app.use(express.json());

app.use((req, res, next) => {
	next();
	res.on('finish', async () => {
		await DatabaseHelper.disconnect();
	});
});

const port = process.env.POST || 3000;

// ROUTES ------

app.route('/user')
	.get((res, req) => UserController.getUsersList(req, res))
	.post((req, res) => UserController.createUser(req, res));

app.get('/user/:id/verify/:token', (req, res) => UserController.verifyUser(req, res));

app.post('/user/login', (req, res) => UserController.loginUser(req, res));

app.route('/user/:id')
	.get((req, res) => UserController.getUser(req, res))
	.put((req, res) => UserController.updateUser(req, res))
	.delete((req, res) => UserController.deleteUser(req, res));

// SERVER START ------

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});