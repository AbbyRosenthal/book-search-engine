const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
//ApolloServer
const { ApolloServer } = require('apollo-server-express');

//typeDefs and resolvers
const {typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
//new apollow server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//create new instance of apollo server
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo server with express app
  server.applyMiddleware({ app });
}


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

startApolloServer(typeDefs, resolvers);
