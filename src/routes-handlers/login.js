/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import AllowedEmail from '../models/AllowedEmail.js';

const secret = process.env.JWT_SECRET;

async function adminLogin(req, res) {
  try {
    const tk = req.headers.authentication;
    if (tk) {
      let verifiedToken;
      try {
        verifiedToken = await jwt.verify(tk, secret);
        if (verifiedToken.role === 'admin') {
          const admin = await Admin.findOne({ email: verifiedToken.admin }, { password: 0 });
          return res.json({ admin, token: tk });
        }
        throw new Error('invalid verified token');
      } catch (err) {
        res.json({ error: true, message: 'Invalid token' });
      }
    } else {
      const args = req.body;
      const result = await Admin.findOne({ email: args.email.toLowerCase() });
      if (!result || !result._doc) {
        return res.json({ error: true, message: 'Admin does not exist' });
      }
      const admin = result._doc;
      if (admin.password !== args.password) {
        return res.json({ error: true, message: 'Wrong password, please try again' });
      }
      const token = jwt.sign(
        { admin: admin.email, _id: admin._id, role: 'admin' },
        secret,
        {
          expiresIn: '1h',
        },
      );
      return res.json({ admin: { ...admin, password: undefined }, token });
    }
    return 0; // 0 for handling eslint error
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
async function userLogin(req, res) {
  try {
    const tk = req.headers.authentication;
    if (tk) {
      let verifiedToken;
      try {
        verifiedToken = await jwt.verify(tk, secret);
        if (verifiedToken.role === 'user') {
          const user = await User.findOne({ email: verifiedToken.user }, { password: 0 });
          return res.json({ user, token: tk });
        }
        throw new Error('invalid verified token');
      } catch (err) {
        res.json({ error: true, message: 'Invalid token' });
      }
    } else {
      const args = req.body;
      const result = await User.findOne({ email: args.email.toLowerCase() });
      if (!result || !result._doc) {
        return res.json({ error: true, message: 'User does not exist' });
      }
      const user = result._doc;
      if (user.password !== args.password) {
        return res.json({ error: true, message: 'Wrong password, please try again' });
      }
      if (!user.verified) {
        return res.json({ error: true, message: 'User not verified, please check verification email' });
      }
      const allowedEmails = await AllowedEmail.find({});
      const foundEmail = allowedEmails.find((e) => e.emailDomain === user.email.split('@')[1] && e.status === 'Active');
      if (!foundEmail) throw new Error('User not allowed');
      const token = jwt.sign(
        { user: user.email, _id: user._id, role: 'user' },
        secret,
        {
          expiresIn: '1h',
        },
      );
      return res.json({ user: { ...user, password: undefined }, token });
    }
    return 0; // 0 for handling eslint error
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export {
  userLogin,
  adminLogin,
};
