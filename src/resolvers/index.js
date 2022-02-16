/* eslint-disable prefer-regex-literals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import fs from 'fs';
import dotenv from 'dotenv';
import { GraphQLScalarType } from 'graphql';
import jwt from 'jsonwebtoken';
import transport from './transport.js';
import Ad from '../models/Ad.js';
import Admin from '../models/Admin.js';
import TeamMember from '../models/TeamMember.js';
import AllowedEmail from '../models/AllowedEmail.js';
import Faculty from '../models/Faculty.js';
import Faq from '../models/Faq.js';
import Institute from '../models/Institute.js';
import Rating from '../models/Rating.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Report from '../models/Report.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    allFaculties: async () => {
      const result = await Faculty.count();
      return result;
    },
    allUsers: async () => {
      const result = await User.count();
      return result;
    },
    allInstitutes: async () => {
      const result = await Institute.count();
      return result;
    },
    allRatings: async () => {
      const result = await Rating.count();
      return result;
    },
    allAdmins: async () => {
      const result = await Admin.count();
      return result;
    },
    allAds: async () => {
      const result = await Ad.count();
      return result;
    },
    allAllowedEmails: async () => {
      const result = await AllowedEmail.count();
      return result;
    },
    allFaqs: async () => {
      const result = await Faq.count();
      return result;
    },
    allBlogs: async () => {
      const result = await Blog.count();
      return result;
    },
    allReports: async () => {
      const result = await Report.count();
      return result;
    },
    allMembers: async () => {
      const result = await TeamMember.count();
      return result;
    },
    faculties: async (parent, args) => {
      let faculties;
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      if (args.institute || args.institute === 0) {
        faculties = await Faculty.find({ institute: args.institute });
        faculties = faculties.slice(offset, offset + limit);
      } else faculties = (await Faculty.find()).slice(offset, offset + limit);
      return faculties;
    },
    users: async (parent, args) => {
      const users = await User.find({});
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return users.slice(offset, offset + limit);
    },
    institutes: async (parent, args) => {
      const institutes = await Institute.find({});
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return institutes.slice(offset, offset + limit);
    },
    admins: async (parent, args) => {
      const admins = await Admin.find({});
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return admins.slice(offset, offset + limit);
    },
    members: async (parent, args) => {
      const members = await TeamMember.find({});
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return members.slice(offset, offset + limit);
    },
    ads: async (parent, args) => {
      const ads = await Ad.find({});
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return ads.slice(offset, offset + limit);
    },
    ratings: async (parent, args) => {
      let result;
      if ((args.faculty || args.faculty === 0) && (args.user || args.user === 0)) {
        result = await Rating.find({ faculty: args.faculty, user: args.user });
        return result;
      }
      if (args.faculty || args.faculty === 0) {
        result = await Rating.find({ faculty: args.faculty });
        return result;
      }
      if (args.user || args.user === 0) {
        result = await Rating.find({ user: args.user });
        return result;
      }
      result = await Rating.find({});
      return result;
    },
    allowedEmails: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const result = await AllowedEmail.find({});
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return result.slice(offset, offset + limit);
    },
    faqs: async (parent, args) => {
      const result = await Faq.find();
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return result.slice(offset, offset + limit);
    },
    blogs: async (parent, args) => {
      const result = await Blog.find();
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return result.slice(offset, offset + limit);
    },
    reports: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const result = await Report.find();
      const offset = args.offset || 0;
      const limit = args.limit || 100000;
      return result.slice(offset, offset + limit);
    },
    loggedUser: async (parent, args, context) => {
      if (!context.user) throw new Error('User not loggedIn');
      const user = await User.findOne({ email: context.user.toLowerCase() });
      return { ...context, user };
    },
    loggedAdmin: async (parent, args, context) => {
      if (!context.admin) throw new Error('Admin not loggedIn');
      const admin = await Admin.findOne({ email: context.admin.toLowerCase() });
      return { ...context, admin };
    },
    aboutUs: () => {
      const aboutUs = JSON.parse(fs.readFileSync('aboutUs.txt'));
      return aboutUs;
    },
  },
  Mutation: {
    loginUser: async (parent, args) => {
      const user = await User.findOne({ email: args.email.toLowerCase() });
      if (!user) throw new Error('User does not exist');
      if (user.password !== args.password) {
        throw new Error('Wrong password, please try again');
      }
      if (!user.verified) throw new Error('User not verified, please check verification email');
      const allowedEmails = await AllowedEmail.find({});
      const foundEmail = allowedEmails.find((e) => e.emailDomain === user.email.split('@')[1] && e.status === 'Active');
      if (!foundEmail) throw new Error(`Provided '${user.email.split('@')[1]}' eamil domain is not allowed`);
      const token = jwt.sign(
        { user: user.email, _id: user._id, role: 'user' },
        secret,
        {
          expiresIn: '1h',
        },
      );
      return { user, token };
    },
    loginAdmin: async (parent, args) => {
      const admin = await Admin.findOne({ email: args.email.toLowerCase() });
      if (!admin) throw new Error('Admin does not exist');
      if (admin.password !== args.password) {
        throw new Error('Wrong password, please trye again');
      }
      const token = jwt.sign(
        { admin: admin.email, _id: admin._id, role: 'admin' },
        secret,
        {
          expiresIn: '1h',
        },
      );
      return { admin, token };
    },
    newUser: async (parent, args) => {
      if (args.confirmPassword !== args.password) throw new Error('Passwords do not match');
      const confirmationCode = (Math.random() * 10000).toFixed(0);
      const user = {
        ...args,
        email: args.email.toLowerCase(),
        confirmationCode,
      };
      const allowedEmails = await AllowedEmail.find({});
      const foundEmail = allowedEmails.find((e) => e.emailDomain === user.email.split('@')[1] && e.status === 'Active');
      if (!foundEmail) throw new Error(`Provided '${user.email.split('@')[1]}' email domain is not allowed`);
      let result;
      try {
        result = await User.create(user);
      } catch (e) {
        if (e.code === 11000) throw new Error('User already exists');
        else throw e;
      }
      await transport.sendMail({
        from: process.env.GMAIL,
        to: user.email,
        subject: 'Email Verification',
        // eslint-disable-next-line quotes
        html: `
          <h1>Hello ${user.firstName}!</h1>
          <p>Thank you for registering in Grade My Faculty.</p>
          <a href="${process.env.SERVER_URL}/verifyemail?email=${user.email}&confirmationCode=${confirmationCode}">
            Click here to verify your email
          </a>
        `,
      });
      return result;
    },
    updateUser: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      if ((args.confirmPassword || args.password) && (args.confirmPassword !== args.password)) throw new Error('Passwords do not match');
      const user = await User.findOne({ _id: args._id });
      const update = {
        ...user._doc,
        ...args,
        email: args.email.toLowerCase(),
      };
      let result;
      if (args.email !== user.email) {
        const allowedEmails = await AllowedEmail.find();
        const foundEmail = allowedEmails.find((e) => e.emailDomain === args.email.split('@')[1] && e.status === 'Active');
        if (!foundEmail) throw new Error(`Provided '${args.email.split('@')[1]}' eamil domain is not allowed`);
        if (!args.email.includes('@')) throw new Error('Enter a valid email');
        if (user.password !== args.password) throw new Error('Wrong password, please try again');
        const confirmationCode = (Math.random() * 10000).toFixed(0);
        try {
          result = await User.findOneAndUpdate(
            { _id: args._id },
            { ...update, verified: false, confirmationCode },
            { new: true },
          );
          await transport.sendMail({
            from: process.env.GMAIL,
            to: args.email,
            subject: 'Email Verification',
            // eslint-disable-next-line quotes
            html: `
              <h1>Hello ${user.firstName}!</h1>
              <p>Thank you for registering in Grade My Faculty.</p>
              <a href="https://grade-my-faculty-backend.herokuapp.com/verifyemail?email=${args.email}&confirmationCode=${confirmationCode}">
                Click here to verify your email
              </a>
            `,
          });
          return result;
        } catch (e) {
          if (e.code === 11000) throw new Error('Email already exists');
          else throw e;
        }
      }
      result = await User.findOneAndUpdate({ _id: args._id }, { ...update }, { new: true });
      return result;
    },
    updateUserEmail: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      const user = await User.findOne({ _id: args._id });
      if (args.email === user.email) throw new Error('Please provide different email');
      const allowedEmails = await AllowedEmail.find();
      const foundEmail = allowedEmails.find((e) => e.emailDomain === args.email.split('@')[1] && e.status === 'Active');
      if (!foundEmail) throw new Error(`Provided '${args.email.split('@')[1]}' eamil domain is not allowed`);
      if (!args.email.includes('@')) throw new Error('Enter a valid email');
      if (user.password !== args.password) throw new Error('Wrong password, please try again');
      const confirmationCode = (Math.random() * 10000).toFixed(0);
      await User.updateOne(
        { _id: args._id },
        { email: args.email, verified: false, confirmationCode },
      );
      await transport.sendMail({
        from: process.env.GMAIL,
        to: args.email,
        subject: 'Email Verification',
        // eslint-disable-next-line quotes
        html: `
          <h1>Hello ${user.firstName}!</h1>
          <p>Thank you for registering in Grade My Faculty.</p>
          <a href="https://grade-my-faculty-backend.herokuapp.com/verifyemail?email=${args.email}&confirmationCode=${confirmationCode}">
            Click here to verify your email
          </a>
        `,
      });
      return args.email;
    },
    updateUserPassword: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      if (args.oldPassword.length < 8 || args.newPassword.length < 8) throw new Error('Passwords should be at least 8 characters long');
      const user = await User.findOne({ _id: args._id });
      if (user.password !== args.oldPassword) throw new Error('Wrong old password, please try again');
      await User.findOneAndUpdate({ _id: args._id }, { password: args.newPassword });
      return true;
    },
    updateAdmin: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const admin = await Admin.findOne({ _id: args._id });
      if (admin.password !== args.password) throw new Error('Wrong password, please try again');
      const update = {
        ...admin._doc,
        name: args.name,
        email: args.email.toLowerCase(),
        password: args.newPassword || admin.password,
        status: args.status,
        facebookLink: args.facebookLink || admin.facebookLink,
        instagramLink: args.instagramLink || admin.instagramLink,
        twitterLink: args.twitterLink || admin.twitterLink,
      };
      let result;
      try {
        result = await Admin.findOneAndUpdate({ _id: args._id }, { ...update }, { new: true });
      } catch (e) {
        if (e.code === 11000) throw new Error('Email already exists');
        else throw e;
      }
      return result;
    },
    updateMember: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let result;
      try {
        result = await TeamMember.findOneAndUpdate({ _id: args._id }, args, { new: true });
      } catch (e) {
        if (e.code === 11000) throw new Error('Member already exists');
        else throw e;
      }
      return result;
    },
    updateFaculty: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let result;
      try {
        result = await Faculty.findOneAndUpdate({ _id: args._id }, args, { new: true });
      } catch (e) {
        if (e.code === 11000) throw new Error('Email already exists');
        else throw e;
      }
      return result;
    },
    updateInstitute: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let result;
      const update = {
        ...args,
        _id: undefined,
      };
      try {
        result = await Institute.findOneAndUpdate({ _id: args._id }, update, { new: true });
      } catch (e) {
        if (e.code === 11000) throw new Error('Email already exists');
        else throw e;
      }
      return result;
    },
    updateAd: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundAd = await Ad.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
      if (foundAd && (foundAd._id !== args._id)) {
        throw new Error('Ad already exists');
      }
      let ad;
      try {
        ad = Ad.findOneAndUpdate({ _id: args._id }, args, { new: true });
      } catch (e) {
        if (e.code === 11000) throw new Error('Ad title already exists');
        else throw new Error(e);
      }
      return ad;
    },
    updateAllowedEmail: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundEmail = await AllowedEmail.findOne({ emailDomain: { $regex: new RegExp(`^${args.emailDomain.toLowerCase()}`, 'i') } });
      if (foundEmail && (foundEmail._id !== args._id)) {
        throw new Error('Email domain already exists');
      }
      const update = {
        ...args,
        _id: undefined,
      };
      const result = await AllowedEmail.findOneAndUpdate({ _id: args._id }, update, { new: true });
      return result;
    },
    updateFaq: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundFaq = await Faq.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
      if (foundFaq && (foundFaq._id !== args._id)) throw new Error('Faq already exists');
      const update = {
        ...args,
        _id: undefined,
      };
      const result = await Faq.findOneAndUpdate({ _id: args._id }, update, { new: true });
      return result;
    },
    updateAboutUs: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let aboutUs;
      try {
        aboutUs = JSON.parse(fs.readFileSync('aboutUs.txt'));
      } catch (e) {
        if (e.code === 'ENOENT' && e.path === 'aboutUs.txt') {
          fs.writeFileSync('aboutUs.txt', '');
        } else throw e;
      } finally {
        fs.writeFileSync('aboutUs.txt', JSON.stringify({ ...aboutUs, ...args }, null, 4));
      }
      return fs.readFileSync('aboutUs.txt');
    },
    updateBlog: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundBlog = await Blog.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
      if (foundBlog && (foundBlog._id !== args._id)) throw new Error('Blog already exists');
      const update = {
        ...args,
        _id: undefined,
      };
      const result = await Blog.findOneAndUpdate({ _id: args._id }, update, { new: true });
      return result;
    },
    newFaculty: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let result;
      const faculty = {
        ...args,
        email: args.email.toLowerCase(),
      };
      try {
        result = await Faculty.create(faculty);
      } catch (e) {
        if (e.code === 11000) throw new Error('Faculty already exists');
        else throw e;
      }
      return result;
    },
    newInstitute: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let result;
      try {
        result = await Institute.create(args);
      } catch (e) {
        if (e.code === 11000) throw new Error('Email already exists');
        else throw e;
      }
      return result;
    },
    newAdmin: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      if (args.password !== args.confirmPassword) throw new Error('Passwords do not match');
      const admin = {
        ...args,
        email: args.email.toLowerCase(),
      };
      let result;
      try {
        result = await Admin.create(admin);
      } catch (e) {
        if (e.code === 11000) throw new Error('Admin already exists');
        else throw e;
      }
      return result;
    },
    newMember: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      let result;
      try {
        result = await TeamMember.create(args);
      } catch (e) {
        if (e.code === 11000) throw new Error('Member already exists');
        else throw e;
      }
      return result;
    },
    newAd: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundAd = await Ad.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
      if (foundAd) {
        throw new Error('Ad already exists');
      }
      let ad;
      try {
        ad = Ad.create(args);
      } catch (e) {
        if (e.code === 11000) throw new Error('Ad title already exists');
        else throw new Error(e);
      }
      return ad;
    },
    newRating: async (parent, args, context) => {
      if (!context.admin && !context.user) throw new Error('Not logged in, please login first');
      const foundRating = await Rating.findOne(
        {
          user: args.user,
          course: args.course.toUpperCase(),
          semester: args.semester,
          faculty: args.faculty,
        },
      );
      if (foundRating) {
        throw new Error(`Already rated this faculty on ${args.course} in ${args.semester}`);
      }
      const rating = await Rating.create(args);
      return rating;
    },
    addLike: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      const rating = await Rating.findOne({ _id: args.rating });
      if (rating.likes.includes(args.user)) {
        await rating.update(
          { $pull: { likes: args.user } },
        );
        return rating.likes.length;
      }
      await Rating.findOneAndUpdate(
        { _id: args.rating },
        {
          $push: { likes: args.user },
          $pull: { disLikes: args.user },
        },
      );
      return rating.likes.length + 1;
    },
    addDisLike: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      const rating = await Rating.findOne({ _id: args.rating });
      if (rating.disLikes.includes(args.user)) {
        await rating.update(
          { $pull: { disLikes: args.user } },
        );
        return rating.likes.length;
      }
      await Rating.findOneAndUpdate(
        { _id: args.rating },
        {
          $push: { disLikes: args.user },
          $pull: { likes: args.user },
        },
      );
      return rating.disLikes.length + 1;
    },
    saveFaculty: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      const user = await User.findOne({ _id: args.user });
      if (user.savedFaculties.includes(args.faculty)) {
        const updated = await User.findOneAndUpdate({ _id: args.user }, {
          $pull: { savedFaculties: args.faculty },
        }, { new: true });
        return updated.savedFaculties;
      }
      const updated = await User.findOneAndUpdate({ _id: args.user }, {
        $push: { savedFaculties: args.faculty },
      }, { new: true });
      return updated.savedFaculties;
    },
    newReport: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      const found = await Report.findOne({ user: args.user, rating: args.rating });
      if (found) throw new Error('Already reported on this rating');
      const report = Report.create(args);
      return report;
    },
    newAllowedEmail: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundEmail = await AllowedEmail.findOne({ emailDomain: { $regex: new RegExp(`^${args.emailDomain.toLowerCase()}`, 'i') } });
      if (foundEmail) throw new Error('Email domain already exists');
      let result;
      try {
        result = await AllowedEmail.create(args);
      } catch (e) {
        if (e.code === 11000) throw new Error('Email domain already exists');
        else throw e;
      }
      return result;
    },
    newFaq: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundFaq = await Faq.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
      if (foundFaq) throw new Error('Faq already exists');
      let result;
      try {
        result = await Faq.create(args);
      } catch (e) {
        if (e.code === 11000) throw new Error('Faq already exists');
        else throw e;
      }
      return result;
    },
    newBlog: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const foundBlog = await Blog.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
      if (foundBlog) throw new Error('Blog already exists');
      let result;
      try {
        result = await Blog.create(args);
      } catch (e) {
        if (e.code === 11000) throw new Error('Blog already exists');
        else throw e;
      }
      return result;
    },
    deleteUser: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      await User.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteAdmin: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      const count = await Admin.count();
      if (count === 1) {
        // There should be at least one admin
        throw new Error('Can not delete last remaining admin');
      }
      await Admin.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteMember: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await TeamMember.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteFaculty: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await Faculty.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteInstitute: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await Institute.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteAd: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await Ad.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteEmail: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await AllowedEmail.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteFaq: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await Faq.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteRating: async (parent, args, context) => {
      if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
      await Rating.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteBlog: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await Blog.deleteOne({ _id: args._id });
      return args._id;
    },
    deleteReport: async (parent, args, context) => {
      if (!context.admin) throw new Error('Not logged in, please login first');
      await Report.deleteOne({ _id: args._id });
      return args._id;
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A valid JavaScript Date object',
    parseValue: (value) => new Date(value),
    serialize: (value) => (new Date(value)).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

export default resolvers;
