// const db = require("../models");
// const sendMail = require("../utils/mailer");
// const cron = require("node-cron");
// const { Op, fn, col, literal } = require('sequelize');

// const getBirthdaysIn2Days = async () => {
//   const today = new Date();
//   const targetDate = new Date(today.setDate(today.getDate() + 2));

//   const day = targetDate.getDate();
//   const month = targetDate.getMonth() + 1;

//   const employees = await db.Employee.findAll();

//   return employees.filter((emp) => {
//     const birthDate = new Date(emp.birthDate);
//     return birthDate.getDate() === day && birthDate.getMonth() + 1 === month;
//   });
// };




// const birthdayReminderJob = cron.schedule(
//   "0 11 * * *",
//   async () => {
//     console.log("Checking for upcoming birthdays...");
//     const upcomingBirthdays = await getBirthdaysIn2Days();

//     for (let employee of upcomingBirthdays) {
//       const message = `
//       <h3>Birthday Reminder</h3>
//       <p>This is a reminder that <strong>${employee.employeeName}</strong> has a birthday in 2 days!</p>
//       <p>Date of Birth: ${employee.birthDate}</p>

//       <br/>
//         <h4>Person's Details:</h4>
//         <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
//             <thead style="background-color: #f2f2f2;">
//             <tr>
//                 <th>Sr. No</th>
//                 <th>Company Name</th>
//                 <th>Employee Name</th>
//                 <th>Email</th>
//                 <th>Date of Birth</th>
//                 <th>Short Note</th>
//             </tr>
//             </thead>
//             <tbody>
//             <tr>
//                 <td>${employee.id}</td>
//                 <td>${employee.companyName}</td>
//                 <td>${employee.employeeName}</td>
//                 <td>${employee.email}</td>
//                 <td>${employee.birthDate}</td>
//                 <td>${employee.shortNote}</td>
//             </tr>
//             </tbody>
//         </table>
//     `;
//       await sendMail(
//         "kaushikmandavkar6@gmail.com",
//         `🎂 Upcoming Birthday: ${employee.employeeName}`,
//         message
//       );
//     }
//   },
//   {
//     timezone: "Asia/Kolkata", // Change timezone if needed
//     scheduled: false, //changes on 20-05 tuesday morning 11:22
//   }
// );

// module.exports = 
//   {
//     birthdayReminderJob 
//   };

const db = require("../models");
const sendMail = require("../utils/mailer");
const cron = require("node-cron");

const getBirthdaysIn2Days = async () => {
  const today = new Date();
  const targetDate = new Date(today.setDate(today.getDate() + 2));

  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;

  const employees = await db.Employee.findAll();

  return employees.filter((emp) => {
    const birthDate = new Date(emp.birthDate);
    return birthDate.getDate() === day && birthDate.getMonth() + 1 === month;
  });
};

const runJob = async () => {
  console.log("🔔 Running Birthday Reminder Job...");
  const upcomingBirthdays = await getBirthdaysIn2Days();

  for (let employee of upcomingBirthdays) {
    const message = `
      <h3>Birthday Reminder</h3>
      <p>This is a reminder that <strong>${employee.employeeName}</strong> has a birthday in 2 days!</p>
      <p>Date of Birth: ${employee.birthDate}</p>

      <br/>
        <h4>Person's Details:</h4>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <thead style="background-color: #f2f2f2;">
            <tr>
                <th>Sr. No</th>
                <th>Company Name</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Short Note</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>${employee.id}</td>
                <td>${employee.companyName}</td>
                <td>${employee.employeeName}</td>
                <td>${employee.email}</td>
                <td>${employee.birthDate}</td>
                <td>${employee.shortNote}</td>
            </tr>
            </tbody>
        </table>
    `;

    await sendMail(
      "kaushikmandavkar6@gmail.com",
      `🎂 Upcoming Birthday: ${employee.employeeName}`,
      message
    );
  }
};

// Scheduled cron job (disabled by default, good for local dev or future use)
const birthdayReminderJob = cron.schedule(
  "10 12 * * *",
  runJob,
  {
    timezone: "Asia/Kolkata",
    scheduled: false, // Disable auto-run (since cPanel will hit manually)
  }
);

module.exports = {
  birthdayReminderJob, // If you ever want to start it locally
  execute: runJob       // 👈 Exposed for manual web-trigger
};
