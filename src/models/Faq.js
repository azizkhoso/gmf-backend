/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const FaqSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

FaqSchema.plugin(autoIncrement.plugin, 'Faq');
const Faq = mongoose.model('Faq', FaqSchema);

export default Faq;
