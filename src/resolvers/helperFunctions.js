/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Institute from '../models/Institute.js';
import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import Report from '../models/Report.js';
import Admin from '../models/Admin.js';
import Blog from '../models/Blog.js';

// The following helper functions are for establishing bidirectional
// data loading. It is the power of GraphQL.

let faculties;
let ratings;
let blogs;
let reports;

const institute = async (instituteId) => {
  const nullInstitute = { // For handling undefined on frontend
    _id: -1,
    name: 'N/A',
    email: 'N/A',
    courses: [],
    createdAt: new Date(),
    faculties: faculties.bind(this, []),
  };
  if (instituteId === -1) return nullInstitute;
  const inst = await Institute.findById(instituteId);
  if (!inst || !inst._doc) {
    return nullInstitute;
  }
  return {
    ...inst._doc,
    faculties: faculties.bind(this, inst._doc.faculties),
  };
};

const faculty = async (facultyId) => {
  const nullFaculty = { // For handling undefined on frontend
    _id: -1,
    firstName: 'N/A',
    lastName: 'N/A',
    email: 'N/A',
    institute: institute.bind(this, -1),
    department: 'N/A',
    courses: [],
    ratings: [],
    attributes: [],
    levelOfDifficulty: 0,
  };
  if (facultyId === -1) return nullFaculty;
  const fac = await Faculty.findById(facultyId);
  if (!fac || !fac._doc) {
    return nullFaculty;
  }
  return {
    ...fac._doc,
    institute: institute.bind(this, fac._doc.institute),
    ratings: ratings.bind(this, fac._doc.ratings),
  };
};

faculties = async (facultyIds) => {
  const facs = await Faculty.find({ _id: { $in: facultyIds } });
  if (!facs) return [];
  return facs.map((f) => ({
    ...f._doc,
    institute: institute.bind(this, f._doc.institute),
    ratings: ratings.bind(this, f._doc.ratings),
  }));
};

const user = async (userId) => {
  const nullUser = {
    _id: -1,
    firstName: 'N/A',
    lastName: 'N/A',
    email: 'N/A',
    institute: 'N/A',
    savedFaculties: [],
    graduationYear: -1,
    registeredAt: new Date(),
    ratings: [],
  };
  if (userId === -1) return nullUser;
  const usr = await User.findById(userId);
  if (!usr || !usr._doc) {
    return nullUser;
  }
  return {
    ...usr._doc,
    savedFaculties: faculties.bind(this, usr._doc.savedFaculties),
    ratings: ratings.bind(this, usr._doc.ratings),
  };
};

const users = async (userIds) => {
  const usrs = await User.find({ _id: { $in: userIds } });
  if (!usrs) return [];
  return usrs.map((u) => ({
    ...u._doc,
    savedFaculties: faculties.bind(this, u._doc.savedFaculties),
    ratings: ratings.bind(this, u._doc.ratings),
  }));
};

const rating = async (ratingId) => {
  const nullRating = {
    _id: -1,
    user: user.bind(this, -1),
    faculty: faculty.bind(this, -1),
    course: 'N/A',
    semester: 'N/A',
    createdAt: new Date(),
    overAllRating: 0,
    levelOfDifficulty: 0,
    tags: [],
    wouldTakeAgain: false,
    isAttendanceMandatory: false,
    thoughts: 'N/A',
    likes: [],
    disLikes: [],
    reports: [],
  };
  if (ratingId === -1) return nullRating;
  const rate = await Rating.findById(ratingId);
  if (!rate) {
    return nullRating;
  }
  return {
    ...rate._doc,
    user: user.bind(this, rate._doc.user),
    faculty: faculty.bind(this, rate._doc.faculty),
    likes: users.bind(this, rate._doc.likes),
    disLikes: users.bind(this, rate._doc.disLikes),
    reports: reports.bind(this, rate._doc.reports),
  };
};

ratings = async (ratingIds) => {
  const ratngs = await Rating.find({ _id: { $in: ratingIds } });
  if (!ratngs) return [];
  return ratngs.map((r) => ({
    ...r._doc,
    user: user.bind(this, r._doc.user),
    faculty: faculty.bind(this, r._doc.faculty),
    likes: users.bind(this, r._doc.likes),
    disLikes: users.bind(this, r._doc.disLikes),
    reports: reports.bind(this, r._doc.reports),
  }));
};

const report = async (reportId) => {
  const nullReport = {
    _id: -1,
    user: user.bind(this, -1),
    rating: rating.bind(this, -1),
    details: 'N/A',
    summary: 'N/A',
  };
  if (reportId === -1) return nullReport;
  const result = await report.findById(reportId);
  if (!result || !result._doc) return nullReport;
  return {
    ...result._doc,
    user: user.bind(this, result._doc.user),
    rating: rating.bind(this, result._doc.rating),
  };
};

reports = async (reportIds) => {
  const reprts = await Report.find({ _id: { $in: reportIds } });
  if (!reprts) return [];
  return reprts.map((r) => ({
    ...r._doc,
    user: user.bind(this, r._doc.user),
    rating: rating.bind(this, r._doc.rating),
  }));
};

const admin = async (adminId) => {
  const nullAdmin = {
    _id: -1,
    name: 'N/A',
    email: 'N/A',
    status: 'Inactive',
    blogs: [],
    facebookLink: 'N/A',
    instagramLink: 'N/A',
    twitterLink: 'N/A',
  };
  if (adminId === -1) return nullAdmin;
  const result = await Admin.findById(adminId);
  if (!result || !result._doc) return nullAdmin;
  return {
    ...result._doc,
    blogs: blogs.bind(this, result._doc.blogs),
  };
};

const admins = async (adminIds) => {
  const admns = await Admin.find({ _id: { $in: adminIds } });
  return admns.map((a) => ({
    ...a._doc,
    blogs: blogs.bind(this, a._doc.blogs),
  }));
};

const blog = async (blogId) => {
  const nullBlog = {
    _id: -1,
    title: 'N/A',
    content: 'N/A',
    writtenBy: admin.bind(this, -1),
    tags: [],
    createdAt: new Date(),
  };
  if (blogId === -1) return nullBlog;
  const result = await Blog.findById(blogId);
  if (!result || !result._doc) return nullBlog;
  return {
    ...result._doc,
    writtenBy: admin.bind(this, result._doc.writtenBy),
  };
};

blogs = async (blogIds) => {
  const blgs = await Blog.find({ _id: { $in: blogIds } });
  if (!blgs) return [];
  return blgs.map((b) => ({
    ...b._doc,
    writtenBy: admin.bind(this, b._doc.writtenBy),
  }));
};

export default {
  institute,
  faculty,
  faculties,
  user,
  users,
  rating,
  ratings,
  report,
  reports,
  admin,
  admins,
  blog,
  blogs,
};
