/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import fs from 'fs';

// Resolvers
const aboutUs = () => {
  const abtus = JSON.parse(fs.readFileSync('aboutUs.txt'));
  return abtus;
};

export default {
  queryResolvers: {
    aboutUs,
  },
  mutationResolvers: {

  },
};
