import { readFileSync } from 'fs';

const expressPlayground = require('graphql-playground-middleware-express')
  .default;
/** 'apollo-server-express'와 'express'를 require합니다. */
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const { MongoClient } = require('mongodb');
require('dotenv').config();

var typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');
const resolvers = require('./resolvers');

async function start() {
  /** 'express()' 를 호출하여 익스프레스 애플리케이션을 만듭니다. */
  const app = express();

  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });

  const db = client.db();

  const context = { db };

  /**
   * 서버 인스턴스를 새로 만듭니다.
   * typeDefs(스키마)와 리졸버를 객체에 넣어 전달합니다.
   */
  const server = new ApolloServer({ typeDefs, resolvers, context });

  /** 'applyMiddleWare()'를 호출하여 미들웨어가 같은 경로에 마운트되도록 합니다. */
  server.applyMiddleware({ app });

  /** 홈 라우트를 만듭니다. */
  app.get('/', (req, res) =>
    res.end('PhotoShare API 에 오신 것을 환영합니다.')
  );
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  /** 특정 포트에서 리스닝을 시작합니다. */
  app.listen({ port: 4000 }, () =>
    console.log(
      `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
    )
  );
}

start();
