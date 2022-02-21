/* eslint-disable import/extensions */
import transport from '../resolvers/transport.js';

async function handleContactUs(req, res) {
  try {
    const {
      fullName, email, subject, message,
    } = req.body;
    if (!fullName || !email || !subject || !message) throw new Error('Some fields missing');
    await transport.sendMail({
      from: email,
      to: process.env.GMAIL,
      subject,
      // eslint-disable-next-line quotes
      html: `
        <h1>Hello Team Grade My Faculty!</h1>
        <h6><strong>Sent by: ${email} </strong><h6>
        <p>${message}</p>
      `,
    });
    res.end('Contact mail sent successfully');
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export default handleContactUs;
