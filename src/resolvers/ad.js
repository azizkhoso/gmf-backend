/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Ad from '../models/Ad.js';

// Resolvers
const allAds = async () => {
  const result = await Ad.count();
  return result;
};

const ads = async () => {
  const result = await Ad.find();
  if (!result) return [];
  return result;
};

export default {
  queryResolvers: {
    allAds,
    ads,
  },
  mutationResolvers: {

  },
};
