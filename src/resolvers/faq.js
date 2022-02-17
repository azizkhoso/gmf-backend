/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Faq from '../models/Faq.js';

// Resolvers
const allFaqs = async () => {
  const result = await Faq.count();
  return result;
};

const faqs = async () => {
  const result = await Faq.find();
  if (!result) return [];
  return result;
};

export default {
  queryResolvers: {
    allFaqs,
    faqs,
  },
  mutationResolvers: {

  },
};
