module.exports = `
  type Comment {
    id: String!
    text: String!
  }

  type CommentConnection {
    edges: [CommentEdge]
    pageInfo: PageInfo!
  }

  type CommentEdge {
    cursor: String!
    node: Message!
  }

  type Query {
    numberOfComments(messageId: Int!): String!
    commentRelay(messageId: Int!, first: Int, after: String, last: Int, before: String): CommentConnection!
  }

  type Mutation {
    createComment(messageId: Int!, text: String!): Boolean!
  }

  type Subscription {
    newMessageComment(messageId: Int): Comment!
  }
`;
