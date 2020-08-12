module.exports = `
  type GeneralChannel {
    id: String!
    name: String!
    users: [User!]!
    messages(first: Int, after: String, last: Int, before: String): MessageConnection!
  }
`;
