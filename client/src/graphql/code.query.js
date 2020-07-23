import gql from 'graphql-tag';

const CODES_QUERY = gql`
  query allCodes{
    allCodes{
      id
      desc
      color
      isActive
    }
  }
`;
export default CODES_QUERY;
