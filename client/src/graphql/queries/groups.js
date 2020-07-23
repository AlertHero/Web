import gql from 'graphql-tag';

export const GROUP_QUERY = gql`
  query group($groupId: Int!) {
    group(id: $groupId) {
      id
      name
      users {
        id
        firstName
        lastName
      }
      messages {
        ... MessageFragment
      }
    }
  }
`;

export const GROUPS_QUERY = gql`
  query groups {
    groups {
      id
      name
    }
  }
`;
export default GROUP_QUERY;
