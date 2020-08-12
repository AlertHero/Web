module.exports = `
  type Message {
    id: Int!
    text: String!
    image: String
    user: User!
    code: Code!
    reaction: Reaction
    comments: [Comment]
    channel: Channel
    createdAt: Date!
  }

  type MessageConnection {
    edges: [MessageEdge]
    pageInfo: PageInfo!
  }

  type MessageEdge {
    cursor: String!
    node: Message!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type CodeRatio {
    severe: String!
    elevated: String!
    behavior: String!
    low: String!
  }

  type Query {
    allMessages: [Message!]!
    codesOfMessages: CodeRatio!
    lastGeneralMessage: Message!
    messagesRelay(channelId: Int!, first: Int, after: String, last: Int, before: String): MessageConnection!
  }

  type Mutation {
    createMessage(channelId: [Int!], text: String!, image: String, codeId: Int!): Boolean!
  }

  type Subscription {
    newChannelMessage(channelId: Int): Message!
  }
`;
