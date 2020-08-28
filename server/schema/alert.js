module.exports = `
  type Alert {
    id: ID!
    title: String!
    text: String
    image: String
    upvotes: Int!
    downvotes: Int!
    createdAt: Date!
    user: User!
    code: Code!
    group: Group!
    comments: [Comment]
  }

  type Query {
    getAlert(id: ID!): Alert
    getAlerts(
      groupId: ID!,
      pageSize: Int
      after: String
    ): AlertConnection!
  }

  type Mutation {
    sendAlert(
      groupIds: [Int!],
      title: String!,
      text: String,
      image: String,
      codeId: Int!
    ): AlertResponse
  }

  type Subscription {
    newGroupAlert(groupId: ID!): Alert!
  }

  type AlertConnection {
    cursor: String!
    hasMore: Boolean!
    alerts: [Alert]!
  }

  type AlertResponse implements DatabaseResponse {
    code: String!
    success: Boolean!
    message: String!
    errors: String
  }
`;
