const express = require('express');
const UserController = require('./controllers/UserController');
const AppConfigHelper = require('./helpers/AppConfigHelper');

const port = process.env.POST || 3000;

const app = express();

app.use(express.json());
app.use(AppConfigHelper.closeResources());

app.route('/user')
	.get((res, req) => UserController.getUsersList(req, res))
	.post((req, res) => UserController.createUser(req, res));

app.get('/user/:id/verify/:token', (req, res) => UserController.verifyUser(req, res));

app.post('/user/login', (req, res) => UserController.loginUser(req, res));

app.route('/user/:id')
	.get(AppConfigHelper.checkAuth, (req, res) => UserController.getUser(req, res))
	.put((req, res) => UserController.updateUser(req, res))
	.delete((req, res) => UserController.deleteUser(req, res));

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

module.exports = app;
