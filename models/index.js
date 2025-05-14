const sequelize = require('../config/database');
const Admin = require('./admin.model');
const Employee = require('./employee.model');


const db = {};
db.Sequelize = sequelize;
db.sequelize = sequelize;
db.Admin = Admin(sequelize); 
db.Employee = Employee(sequelize);

module.exports = db;
