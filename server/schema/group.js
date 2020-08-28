module.exports = `
  type Group {
    id: String!
    name: String!
    public: Boolean!
    members: [User]!
  }

  type Query {
    getGroup(id: Int!): Group
    getAllGroups: [Group]!
  }

  type Mutation {
    createGroup(group: GroupInput): GroupResponse!
    addMember(email: String!, groupId: Int!): DbResponse!
  }

  input GroupInput {
    name: String!
    public: Boolean
  }

  type GroupResponse implements DatabaseResponse {
    code: String!
    success: Boolean!
    message: String!
    errors: [String]
    group: Group
  }
`;