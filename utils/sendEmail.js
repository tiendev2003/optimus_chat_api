const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path');
dotenv.config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const templatePath = path.join(__dirname, '../templates', `${options.template}.ejs`);
  const html = await ejs.renderFile(templatePath, options.variables);

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;