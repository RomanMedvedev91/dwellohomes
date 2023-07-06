import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    authUrl: () => {
      return "Query.authUrl";
    }
  }
  type Mutation {
    logIn: () => {
      return "Mutation.logIn";
    },
    logOut: () => {
      return "Mutation.logOut";
    }
  }
`;
