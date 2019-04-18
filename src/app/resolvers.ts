import gql from 'graphql-tag';

export const resolvers = {
    Mutation: {

    },
};

export const typeDefs = `

  type Mutation {
    addApp(name: String!): Application!
    addLanguage(appId: ID!, languageId: ID!): Language!
  }

  type Query {
    apps: [Application!]!
    addApp(name: String!): Application!
    languages(appId: ID!): [Language!]!
  }

  extend type Application {
    id: ID!
    createdAt: String!
    updatedAt: String!
  
    name: String!
  }
`;