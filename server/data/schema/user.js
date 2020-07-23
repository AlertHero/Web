module.exports = `
  scalar Date

  type User {
    id: String!
    firstName: String!
    lastName: String!
    phone: String!
    title: String!
    email: String!
    lastLogin: Date
    latitude: Float
    longitude: Float
    group: Group!
    employed: Boolean
    workingNow: Boolean
    isAdmin: Boolean
  }

  input UserInput {
    firstName: String!
    lastName: String!
    phone: String!
    title: String!
    email: String!
    password: String!
    employed: Boolean
    workingNow: Boolean
    groups: [Int!]
  }

  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  type UserStats {
    total: String!
    active: String!
  }

  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
    getStats: UserStats!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type DatabaseResponse {
    ok: Boolean!
    res: String!
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    id: String
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    register(phone: String!): LoginResponse!
    verify2FA(otp: String!, id: String!): LoginResponse!

    deleteUser(id: String!): DatabaseResponse!
    update(id: String!, firstName: String, lastName: String, phone: String, 
      title: String, email: String, password: String, employed: Boolean
    ): DatabaseResponse!
    create( firstName: String!, lastName: String!, phone: String!, title: String!,
      email: String!, password: String!, employed: Boolean, workingNow: Boolean, groupId: Int!
    ): RegisterResponse!
    bulkCreate(users: [UserInput!]): DatabaseResponse!
  }
`;
