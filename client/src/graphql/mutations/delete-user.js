import gql from 'graphql-tag';

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      ok
      res
      errors {
        message
      }
    }
  }
`;
export default DELETE_USER_MUTATION;
