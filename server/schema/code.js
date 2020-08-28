module.exports = `
  type Code {
    id: String!
    desc: String!
    color: String!
    isActive: Boolean!
  }

  type Query {
    getActiveCode: Code!
    getAllCodes: [Code]!
    # codesOfMessages: CodeRatio!
  }

  type Mutation {
    createCode(desc: String!, color: String!): DatabaseResponse!
  }

  type Subscription {
    newGlobalCode: Code!
  }

  # type CodeRatio {
  #   severe: String!
  #   elevated: String!
  #   behavior: String!
  #   low: String!
  # }
`;
