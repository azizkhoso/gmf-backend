/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import TeamMember from '../models/TeamMember.js';

// Resolvers
const allMembers = async () => {
  const result = await TeamMember.count();
  return result;
};

const members = async () => {
  const result = await TeamMember.find();
  if (!result) return [];
  return result;
};

export default {
  queryResolvers: {
    allMembers,
    members,
  },
  mutationResolvers: {

  },
};
