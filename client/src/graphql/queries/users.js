import gql from 'graphql-tag';

const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      group {
        id
        name
      }
    }
  }
`;

export const USERS_STATS_QUERY = gql`
  query getStats {
    getStats{
      total
      active
    }
  }
`;

export const ALL_USERS_QUERY = gql`
  query allUsers {
    allUsers {
      id
      phone
      firstName
      lastName
      title
      employed
      workingNow
      group {
        id
        name
      }
    }
  }
`;
export default USER_QUERY;
