module.exports = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    phone: String!
    title: String!
    email: String!
    profileImage: String
    alerts: [Alert]
    token: String
    refreshToken: String
    lastLogin: Date
    latitude: Float
    longitude: Float
    groups: [Group]
    workingNow: Boolean
    isAdmin: Boolean
  }

  type Query {
    me: User
    getUser(id: Int!): User!
  }

  type Mutation {
    login(email: String!, password: String!): UserResponse!
    updateUser(id: ID!, firstName: String, lastName: String, phone: String, 
      title: String, email: String, password: String, employed: Boolean
    ): UserResponse!

    bulkCreateUsers(users: [UserInput]!): DbResponse!
    createUser(user: UserInput): UserResponse!
    deleteUser(id: ID!): DbResponse!

    # TBD
    # register(phone: String!): User!
    # verify2FA(otp: String!, id: String!): User!
    # uploadProfileImage(file: Upload!): User
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

  type UserResponse implements DatabaseResponse {
    code: String!
    success: Boolean!
    message: String!
    errors: [String]
    user: User
  }
`;
