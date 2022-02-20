/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { GraphQLScalarType } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';

import institute from './institute.js';
import faculty from './faculty.js';
import user from './user.js';
import rating from './rating.js';
import report from './report.js';
import admin from './admin.js';
import blog from './blog.js';
import allowedEmail from './allowedEmail.js';
import ad from './ad.js';
import faq from './faq.js';
import teamMember from './teamMember.js';
import aboutUs from './aboutUs.js';

const resolvers = {
  Query: {
    ...institute.queryResolvers,
    ...faculty.queryResolvers,
    ...user.queryResolvers,
    ...rating.queryResolvers,
    ...report.queryResolvers,
    ...admin.queryResolvers,
    ...blog.queryResolvers,
    ...allowedEmail.queryResolvers,
    ...ad.queryResolvers,
    ...faq.queryResolvers,
    ...teamMember.queryResolvers,
    ...aboutUs.queryResolvers,
  },
  Mutation: {
    ...user.mutationResolvers,
    ...institute.mutationResolvers,
    ...faculty.mutationResolvers,
    ...admin.mutationResolvers,
    ...aboutUs.mutationResolvers,
    ...ad.mutationResolvers,
    ...allowedEmail.mutationResolvers,
    ...faq.mutationResolvers,
    ...blog.mutationResolvers,
    ...teamMember.mutationResolvers,
  },
  Upload: GraphQLUpload, // For handling file uploads
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A valid JavaScript Date object',
    parseValue: (value) => new Date(value),
    serialize: (value) => (new Date(value)).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

export default resolvers;
