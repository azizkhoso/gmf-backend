/* eslint-disable import/extensions */
import transport from '../resolvers/transport.js';

async function handleNewFacultyReq(req, res) {
  try {
    const {
      firstName, lastName, courses, facultyEmail, userEmail, institute, department,
    } = req.body;
    if (!firstName || !courses || !institute || !department || !userEmail) throw new Error('Some fields missing');
    await transport.sendMail({
      from: userEmail,
      to: process.env.GMAIL,
      subject: 'Request for new Faculty',
      // eslint-disable-next-line quotes
      html: `
        <h1>Hello Team Grade My Faculty!</h1>
        <h6><strong>Sent by: ${userEmail} </strong><h6>
        <p>Request for adding new Faculty</p>
        <p>First Name:<strong>${firstName}</strong></p>
        <p>Last Name:<strong>${lastName}</strong></p>
        <p>Email:<strong>${facultyEmail}</strong></p>
        <p>Courses:<strong>${courses}</strong></p>
        <p>Institute:<strong>${institute}</strong></p>
        <p>Department:<strong>${department}</strong></p>
      `,
    });
    res.end('Contact mail sent successfully');
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export default handleNewFacultyReq;
