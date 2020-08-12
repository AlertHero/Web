module.exports = `
  interface DatabaseResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type DbResponse implements DatabaseResponse {
    code: String!
    success: Boolean!
    message: String!
    errors: [String]
  }

  type Query {
    alerts: [Alert]
  }

  """
  Simple wrapper around our list of alerts that contains a cursor to the
  last item in the list. Pass this cursor to the alerts query to fetch results
  after these.
  """
  type AlertConnection {
    cursor: String!
    hasMore: Boolean!
    alerts: [Alert]!
  }

  type Alert {
    id: ID!
    message: String
    severity: AllowedSeverity
    isActive: Boolean!
  }

  enum AllowedSeverity {
    LOW
    ELEVATED
    SEVERE
  }

  type Error {
    path: String!
    message: String
  }

  scalar Date
`;
