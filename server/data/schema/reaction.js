module.exports = `
  type Reaction {
    id: String!
    upvotes: String!
    downvotes: String!
  }

  type Query {
    getReactions(messageId: Int!): Reaction!
  }

  type Mutation {
    upvote(messageId: Int!): Boolean!
    downvote(messageId: Int!): Boolean!
  }

  type Subscription {
    newMessageReaction(messageId: Int): Reaction!
  }
`;
