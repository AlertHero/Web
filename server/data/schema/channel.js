module.exports = `
  type Channel {
    id: String!
    name: String!
    users: [User!]!
    public: Boolean!
    messages: [Message!]!
  }

  type Query {
    allChannels: [Channel!]!
  }

  type CreateChannelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type Mutation {
    createChannel(name: String!, groupId: Int!, public: Boolean=false): CreateChannelResponse!
  }
`;
