const {ApolloServer} = require('apollo-server');
const {PrismaClient} = require('@prisma/client')
const {getUserId} = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')
const {PubSub} = require('apollo-server')
const fs = require('fs');
const path = require('path');


const resolvers = {
    Query,
    Mutation,
    User,
    Link,
    Subscription,
    Vote
}


const pubsub = new PubSub()
const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: async ({req}) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization ? getUserId(req) : null
        };
    }
})


server.listen().then(({url}) => console.log(`server started at ${url}`));
