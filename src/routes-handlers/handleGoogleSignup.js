/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import AllowedEmail from '../models/AllowedEmail.js';
import transport from '../resolvers/transport.js';
import User from '../models/User.js';

const secret = process.env.JWT_SECRET;
const clientId = process.env.OAUTH_CLIENT;
const client = new OAuth2Client(clientId);

async function googleAuth(id_token) {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: clientId,
  });
  const payload = ticket.getPayload();
  return payload;
}

async function handleGoogleSignUp(req, res) {
  try {
    const { tokenObj } = req.body;
    if (!tokenObj) throw new Error('Invalid Google Signup');
    const {
      given_name,
      family_name,
      email,
      email_verified,
    } = await googleAuth(tokenObj?.id_token);
    if (!given_name || !email) throw new Error('Google login not verified');
    const found = await User.findOne({ email });
    if (!found) {
      const user = {
        firstName: given_name,
        lastName: family_name || 'Not provided',
        email,
        password: crypto.randomBytes(10).toString('hex'),
        verified: email_verified,
      };
      const result = await User.create(user);
      try {
        await transport.sendMail({
          from: process.env.GMAIL,
          to: user.email,
          subject: 'Email Verification',
          // eslint-disable-next-line quotes
          html: `
            <h1>Hello ${user.firstName}!</h1>
            <p>Thank you for registering in Grade My Faculty.</p>
            <p>We have setup a random password for you. It is '${user.password}'.</p>
            ${user.verified ? '' : `
              <a href="${process.env.SERVER_URL}/verifyemail?email=${user.email}&confirmationCode=${result.confirmationCode}">
              Click here to verify your email
              </a>
            `}
          `,
        });
        res.json({ user: result, token: null });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    } else {
      if (!found.verified) throw new Error('User not verified, please check verification email');
      const allowedEmails = await AllowedEmail.find({});
      const foundEmail = allowedEmails.find((e) => e.emailDomain === found.email.split('@')[1] && e.status === 'Active');
      if (!foundEmail) throw new Error('User not allowed');
      const token = jwt.sign(
        { user: found.email, _id: found._id, role: 'user' },
        secret,
        {
          expiresIn: '1h',
        },
      );
      res.json({
        user: found,
        role: 'user',
        token,
      });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
}

export default handleGoogleSignUp;
