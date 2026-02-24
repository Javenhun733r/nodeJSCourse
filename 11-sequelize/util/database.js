const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete', 'root', 'qqwwee112233', {
	dialect: 'mysql',
	host: 'localhost',
});

module.exports = sequelize;
