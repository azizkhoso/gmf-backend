/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { GraphQLScalarType } from 'graphql';

import institute from './institute.js';
import faculty from './faculty.js';
import user from './user.js';
import rating from './rating.js';
import report from './report.js';
import admin from './admin.js';
import blog from './blog.js';

const resolvers = {
  Query: {
    ...institute.queryResolvers,
    ...faculty.queryResolvers,
    ...user.queryResolvers,
    ...rating.queryResolvers,
    ...report.queryResolvers,
    ...admin.queryResolvers,
    ...blog.queryResolvers,
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A valid JavaScript Date object',
    parseValue: (value) => new Date(value),
    serialize: (value) => (new Date(value)).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

export default resolvers;
