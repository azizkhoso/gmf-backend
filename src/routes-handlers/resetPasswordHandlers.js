/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import transport from '../resolvers/transport.js';
import thankyouEmail from '../emailTemplates/thankyouEmail.js';
import resetPassword from '../emailTemplates/resetPassword.js';

const resetPasswordSecret = 'f85bb7ead1b2dffc34966e549edfca40980eb4ef5b49f4656d037a8901b86b857dc38859ee1af45019ddb3874cdefd7c8d5144520fba58e617ef24f375203e5';

async function emailVerification(req, res) {
  const { query } = req;
  const user = await User.findOneAndUpdate(
    { ...query, confirmationCode: Number(query.confirmationCode) },
    { $set: { verified: true } },
    { new: true },
  );
  if (!user) return res.status(400).json({ error: 'Invalid verification link' });
  await transport.sendMail({
    from: process.env.GMAIL,
    to: user.email,
    subject: 'Welcome!',
    // eslint-disable-next-line quotes
    html: thankyouEmail(user.firstName),
  });
  return res.json({ verified: true, email: user.email });
}

async function generateConfirmationCode(req, res) {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: 'Email or role is missing' });
  }
  const confirmationCode = (Math.random() * 10000).toFixed(0);
  let user = {};
  if (role === 'admin') {
    user = await Admin.findOneAndUpdate(
      { email },
      { $set: { confirmationCode } },
      { new: true },
    );
  } else if (role === 'user') {
    user = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { confirmationCode } },
      { new: true },
    );
  }
  if (!user) {
    res.status(404).json({ error: `${role} not found` });
  } else {
    try {
      await transport.sendMail({
        from: process.env.GMAIL,
        to: req.body.email,
        subject: 'Reset Password',
        // eslint-disable-next-line quotes
        html: resetPassword(confirmationCode, true),
      });
      res.end(`Confirmation code sent on email ${user.email}`);
    } catch (e) {
      if (e.code) {
        res.status(500).json({ error: 'Internal server error' });
      } else res.status(500).json({ error: e.message });
    }
  }
}

async function handleCodeConfirmation(req, res) {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: 'Email or role is missing' });
  }
  let user = {};
  if (role === 'user') {
    user = await User.findOne({ email: req.body.email });
  } else if (role === 'admin') {
    user = await Admin.findOne({ email: req.body.email });
  }
  if (!user) {
    res.status(404).json({ error: `${role} not found` });
  } else if (user.confirmationCode === Number(req.body.confirmationCode)) {
    const token = await jwt.sign(
      { email: user.email, confirmationCode: user.confirmationCode },
      resetPasswordSecret,
      {
        expiresIn: '1m',
      },
    );
    res.json({ token });
  } else {
    const confirmationCode = (Math.random() * 10000).toFixed(0);
    if (role === 'user') {
      user = await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { confirmationCode } },
        { new: true },
      );
    } else if (role === 'admin') {
      user = await Admin.findOneAndUpdate(
        { email: req.body.email },
        { $set: { confirmationCode } },
        { new: true },
      );
    }
    try {
      await transport.sendMail({
        from: process.env.GMAIL,
        to: req.body.email,
        subject: 'Reset Password',
        // eslint-disable-next-line quotes
        html: resetPassword(confirmationCode, false),
      });
      res.status(400).json({ error: 'Invalid confirmation code, new code sent' });
    } catch (e) {
      if (e.code) {
        res.status(500).json({ error: 'Internal server error' });
      } else res.status(500).json({ error: e.message });
    }
  }
}

async function handlePasswordReset(req, res) {
  try {
    const {
      token, newPassword, confirmPassword, role,
    } = req.body;
    if (!token || !newPassword || !confirmPassword || !role) {
      return res.status(400).json({ error: 'Token, newPassword, confirmPassword, or role not provided' });
    }
    if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Passwords do not match' });
    let email;
    let confirmationCode;
    try {
      const obj = await jwt.verify(token, resetPasswordSecret);
      email = obj.email;
      confirmationCode = obj.confirmationCode;
    } catch (e) {
      return res.status(404).json({ error: 'Invalid token' });
    }
    let user = {};
    if (role === 'user') {
      user = await User.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    }
    if (!user) return res.status(404).json({ error: 'Invalid token' });
    if (user.confirmationCode !== confirmationCode) return res.status(403).json({ error: 'Invalid token' });
    if (role === 'user') {
      await User.findOneAndUpdate({ email }, { $set: { password: newPassword } });
    } else if (role === 'admin') {
      await Admin.findOneAndUpdate({ email }, { $set: { password: newPassword } });
    }
    return res.end('Password changed successfully');
  } catch (e) {
    if (e.code) {
      res.status(500).json({ error: 'Internal server error' });
    } else res.status(500).json({ error: e.message });
  }
}

export {
  emailVerification,
  generateConfirmationCode,
  handleCodeConfirmation,
  handlePasswordReset,
};
