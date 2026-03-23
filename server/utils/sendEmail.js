const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendExpirationAlert = async ({ to, name, items }) => {
  const itemList = items
    .map((i) => `<li><strong>${i.name}</strong> — expires ${new Date(i.expirationDate).toLocaleDateString()}</li>`)
    .join('');

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'FridgeIQ: Items expiring soon',
    html: `
      <h2>Hi ${name},</h2>
      <p>The following items in your fridge are expiring soon:</p>
      <ul>${itemList}</ul>
      <p><a href="http://localhost:5173/expiration">View expiration alerts</a></p>
    `,
  });
};

module.exports = { sendExpirationAlert };
