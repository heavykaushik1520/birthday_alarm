//employee.controller.js
const { Op, fn, col, where , literal  } = require('sequelize');
const db = require('../models');
const sequelize = db.sequelize; 
const Employee = db.Employee;

// Create
const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPaginatedEmployees = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const offset = (pageNumber - 1) * pageSize;

  try {
    const { count, rows: employees } = await Employee.findAndCountAll({
      limit: pageSize,
      offset,
      order: [['id', 'ASC']], // Optional: You can change to other fields
    });

    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({
      currentPage: pageNumber,
      totalPages,
      totalEmployees: count,
      employees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllEmployees = async (req, res) => {
  const { name, month } = req.query;

  try {
    let conditions = [];

    if (name) {
      conditions.push({
        employeeName: {
          [Op.like]: `%${name}%`
        }
      });
    }

    if (month) {
      conditions.push(
        where(fn('MONTH', col('birthDate')), month)
      );
    }

    const employees = await Employee.findAll({
      where: {
        [Op.and]: conditions
      }
    });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
const getEmployeeById = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
};

// Update
const updateEmployee = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  try {
    await employee.update(req.body);
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  await employee.destroy();
  res.json({ message: 'Employee deleted' });
};


const getUpcomingBirthdays =  async (req, res) => {
  try {
    const [employees] = await sequelize.query(`
      SELECT *
      FROM Employees
      WHERE
        DATE_FORMAT(
          STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(birthDate), '-', DAY(birthDate)), '%Y-%m-%d'),
          '%Y-%m-%d'
        )
        BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY MONTH(birthDate), DAY(birthDate);
    `);

    // Check if data exists
    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: 'No upcoming birthdays found' });
    }

    res.status(200).json(employees);

  } catch (error) {
    console.error('Error in getUpcomingBirthdaysRaw:', error);

    // Return detailed error info for development (optional: restrict in production)
    res.status(500).json({
      message: 'Failed to fetch upcoming birthdays',
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        sql: error.sql || null,
      },
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getPaginatedEmployees,
  getUpcomingBirthdays,
};
