import { ForgotPassword } from './modules/user/ForgotPassword';
import 'reflect-metadata';
import Express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import { ConfirmUser } from './modules/user/ConfirmUser';
import { UserResolver } from './modules/user/User';
import { LoginResolver } from './modules/user/Login';
import { RegisterResolver } from './modules/user/Register';

import { redis } from './redis';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      UserResolver,
      ConfirmUser,
      ForgotPassword,
    ],
    authChecker: ({ context: { req } }) => {
      if (req.session.userId) {
        return true;
      }

      return false;
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: 'qid',
      resave: false,
      saveUninitialized: false,
      secret: 'hgsdjhgjhdsg',
      cookie: {
        secure: process.env.NODE_ENV === 'production', // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10, // session max age in miliseconds
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server started on http://localhost:4000/graphql');
  });
};

main();
