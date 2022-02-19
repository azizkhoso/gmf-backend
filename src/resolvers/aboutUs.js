/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import fs from 'fs';

// Resolvers
const aboutUs = () => {
  const abtus = JSON.parse(fs.readFileSync('aboutUs.txt'));
  return abtus;
};

const updateAboutUs = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  let aboutus;
  try {
    aboutus = JSON.parse(fs.readFileSync('aboutUs.txt'));
  } catch (e) {
    if (e.code === 'ENOENT' && e.path === 'aboutUs.txt') {
      fs.writeFileSync('aboutUs.txt', '');
    } else throw e;
  } finally {
    fs.writeFileSync('aboutUs.txt', JSON.stringify({ ...aboutus, ...args }, null, 4));
  }
  return fs.readFileSync('aboutUs.txt');
};

export default {
  queryResolvers: {
    aboutUs,
  },
  mutationResolvers: {
    updateAboutUs,
  },
};
