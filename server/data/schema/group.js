module.exports = `
  type Group {
    id: String!
    name: String!
    admin: Boolean!
    members: [User!]!
    channels: [Channel!]!
  }

  type CreateGroupResponse {
    ok: Boolean!
    group: Group!
    errors: [Error!]
  }

  type VoidResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Query {
    allGroups: [Group!]!
    getGroup(id: Int!): Group!
  }

  type Mutation {
    createGroup(name: String!): CreateGroupResponse!
    addGroupMember(email: String!, groupId: Int!): VoidResponse!
  }
`;
