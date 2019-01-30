const express = require('express');
const UserController = require('./controllers/UserController');
const AppHelper = require('./helpers/AppHelper');

const port = process.env.PORT || 3000;

const app = express();
module.exports = app;

app.use(express.json());
app.use(AppHelper.closeResources);

app.route('/user')
	.get(AppHelper.checkAuth, AppHelper.checkAdminRole, (res, req) => UserController.getUsersList(req, res))
	.post((req, res) => UserController.createUser(req, res));

app.get('/user/:id/verify/:token', (req, res) => UserController.verifyUser(req, res));

app.post('/user/login', (req, res) => UserController.loginUser(req, res));

app.route('/user/:id')
	.get(AppHelper.checkAuth, (req, res) => UserController.getUser(req, res))
	.put(AppHelper.checkAuth, (req, res) => UserController.updateUser(req, res))
	.delete(AppHelper.checkAuth, AppHelper.checkAdminRole, (req, res) => UserController.deleteUser(req, res));

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
