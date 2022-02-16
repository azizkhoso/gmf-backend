/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import db from './src/db/index.js';
import typeDefs from './src/schema/index.js';
import resolvers from './src/resolvers/index.js';

import {
  userLogin,
  adminLogin,
  handleGoogleSignup,
  handleCodeConfirmation,
  handlePasswordReset,
  handleContactUs,
  emailVerification,
  generateConfirmationCode,
} from './src/routes-handlers/index.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

async function startApolloServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(cors());
  // app.use('/utilities', utilitesRouter);
  app.get('/verifyemail', emailVerification);
  app.post('/contact', handleContactUs);
  app.post('/googleSignup', handleGoogleSignup);
  app.post('/adminlogin', adminLogin);
  app.post('/forgetPassword', generateConfirmationCode);
  app.post('/validateCode', handleCodeConfirmation);
  app.post('/resetPassword', handlePasswordReset);
  app.post('/login', userLogin);
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    context: async ({ req }) => {
      let verifiedToken;
      const token = req.headers.authentication;
      try {
        verifiedToken = jwt.verify(req.headers.authentication, secret);
      } catch (e) {
        console.log(e);
      }
      return { ...verifiedToken, token };
    },
    debug: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => {
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve);
  });
  console.log(`🚀 GraphQL Server ready at ${process.env.SERVER_URL}${server.graphqlPath}`);
}

db.once('open', () => {
  console.log('Connected to Database successfully');
  startApolloServer();
});
