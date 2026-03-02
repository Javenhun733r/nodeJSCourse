require('dotenv').config();
const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const Post = require('../models/post');
const mongoose = require('mongoose');
const FeedController = require('../controllers/feed');
describe('Feed Controller', function () {
	before(function (done) {
		mongoose
			.connect(process.env.DB_URL_TEST)
			.then(result => {
				const user = new User({
					email: 'test@test.com',
					password: 'password',
					name: 'Tester',
					posts: [],
					_id: '5c0f66b979af55031b34728a',
				});
				return user.save();
			})
			.then(() => {
				done();
			});
	});
	it('should add a created post to the post of the creator', function (done) {
		const req = {
			body: {
				title: 'Test Post',
				content: 'A Test Post',
			},
			file: {
				path: 'abc',
			},
			userId: '5c0f66b979af55031b34728a',
		};
		const res = {
			status: function () {
				return this;
			},
			json: function () {},
		};
		FeedController.createPost(req, res, () => {}).then(savedUser => {
			expect(savedUser).to.have.property('posts');
			expect(savedUser.posts).to.have.length(1);
			done();
		});
	});

	after(function (done) {
		User.deleteMany({})
			.then(() => {
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			});
	});
});
