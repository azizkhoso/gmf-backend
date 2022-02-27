/* eslint-disable import/extensions */
import transport from '../resolvers/transport.js';

async function handleNewInstituteReq(req, res) {
  try {
    const {
      name, courses, instituteEmail, userEmail,
    } = req.body;
    if (!name || !courses || !instituteEmail || !userEmail) throw new Error('Some fields missing');
    await transport.sendMail({
      from: userEmail,
      to: process.env.GMAIL,
      subject: 'Request for new Institute',
      // eslint-disable-next-line quotes
      html: `
        <h1>Hello Team Grade My Faculty!</h1>
        <h6><strong>Sent by: ${userEmail} </strong><h6>
        <p>Request for adding new Institue</p>
        <p>Name:<strong>${name}</strong></p>
        <p>Email:<strong>${instituteEmail}</strong></p>
        <p>Courses:<strong>${courses}</strong></p>
      `,
    });
    res.end('Contact mail sent successfully');
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export default handleNewInstituteReq;
