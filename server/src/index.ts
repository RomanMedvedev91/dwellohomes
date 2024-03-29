import bodyParser from "body-parser";
require("dotenv").config();

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';

const port = process.env.PORT;

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  server.applyMiddleware({ app, path: '/api' });
  app.listen(port);

  console.log(`[app] : http://localhost:${port}`);

  const listings = await db.listings.find({}).toArray(); // listings is type any[]
};

mount(express());
