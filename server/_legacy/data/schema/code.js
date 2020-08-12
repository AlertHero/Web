module.exports = `
  type Code {
    id: String!
    desc: String!
    color: String!
    isActive: Boolean!
  }

  type CreateCodeResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Query {
    allCodes: [Code!]!
    activeCode: Code!
  }

  type Mutation {
    createCode(desc: String!, color: String!): CreateCodeResponse!
  }

  type Subscription {
    newGlobalCode: Code!
  }
`;
