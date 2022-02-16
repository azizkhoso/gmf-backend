/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const ReportSchema = mongoose.Schema({
  user: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

ReportSchema.plugin(autoIncrement.plugin, 'Report');
const Report = mongoose.model('Report', ReportSchema);

export default Report;
