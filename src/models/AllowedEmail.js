/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const AllowedEmailSchema = mongoose.Schema({
  emailDomain: {
    type: String,
    required: true,
    unique: true,
  },
  isAllowed: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Active',
  },
});

AllowedEmailSchema.plugin(autoIncrement.plugin, 'AllowedEmail');
const AllowedEmail = mongoose.model('AllowedEmail', AllowedEmailSchema);

export default AllowedEmail;
