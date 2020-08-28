module.exports = `
  type Comment {
    id: ID!
    text: String!
  }

  type Query {
    getCommentNumber(alertId: ID!): Int!
    getComments(
      alertId: ID!
      pageSize: Int
      after: String
    ): CommentConnection!
  }
    
  type Mutation {
    addComment(
      alertId: ID!, text: String!
    ): CommentResponse!
  }

  type Subscription {
    newComment(alertId: ID!): Comment!
  }

  type CommentConnection {
    cursor: String
    hasMore: Boolean!
    comments: [Comment]
  }

  type CommentResponse implements DatabaseResponse {
    code: String!
    success: Boolean!
    message: String!
    errors: String
  }
`;
