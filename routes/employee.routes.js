// const express = require('express');
// const router = express.Router();
// const {
//   createEmployee,
//   getAllEmployees,
//   getEmployeeById,
//   updateEmployee,
//   deleteEmployee,
// } = require('../controllers/employee.controller');

// router.post('/', createEmployee);
// router.get('/', getAllEmployees);
// router.get('/:id', getEmployeeById);
// router.put('/:id', updateEmployee);
// router.delete('/:id', deleteEmployee);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getPaginatedEmployees,
  getUpcomingBirthdays
} = require('../controllers/employee.controller');

const { authenticate, authorizeRoles } = require('../middleware/auth');

// Protect all employee routes — only accessible to logged-in admins
router.use(authenticate, authorizeRoles('admin', 'superadmin'));


router.get('/paginated', getPaginatedEmployees);
router.get('/upcoming-birthdays', getUpcomingBirthdays);

// Then the dynamic routes
router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);



module.exports = router;
