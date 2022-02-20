import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'
import http from 'http'

import app from './app.js'
import connectToMongo from './mongo.js'
import typeDefs from './graphql/schema.js'
import users from './graphql/resolvers/users.js'

import * as config from './config.js'

async function startServer() {
  const { server: serverConfig } = config
  await connectToMongo()

  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers :{...users},
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req }) => {
      const { user } = req
      return {
        user,
        req,
      }
    },
  })

  await server.start()
  server.applyMiddleware({ app })
  await new Promise((resolve) =>
    httpServer.listen({ port: serverConfig.port }, resolve)
  )
  console.log(
    `🚀 Server ready at http://localhost:${serverConfig.port}${server.graphqlPath}`
  )
}

startServer()
