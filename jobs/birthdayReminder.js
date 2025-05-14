const db = require('../models');
const sendMail = require('../utils/mailer');
const cron = require('node-cron');

const getBirthdaysIn2Days = async () => {
  const today = new Date();
  const targetDate = new Date(today.setDate(today.getDate() + 2));

  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;

  const employees = await db.Employee.findAll();

  return employees.filter((emp) => {
    const birthDate = new Date(emp.birthDate);
    return (
      birthDate.getDate() === day &&
      birthDate.getMonth() + 1 === month
    );
  });
};

const birthdayReminderJob = cron.schedule('0 9 * * *', async () => {
  console.log('Checking for upcoming birthdays...');
  const upcomingBirthdays = await getBirthdaysIn2Days();

  for (let employee of upcomingBirthdays) {
    const message = `
      <h3>Birthday Reminder</h3>
      <p>This is a reminder that <strong>${employee.employeeName}</strong> has a birthday in 2 days!</p>
      <p>Date of Birth: ${employee.birthDate}</p>
    `;
    await sendMail('rajneesh.j77@gmail.com', `🎂 Upcoming Birthday: ${employee.employeeName}`, message);
  }
}, {
  timezone: 'Asia/Kolkata' // Change timezone if needed
});

module.exports = birthdayReminderJob;
