import gql from 'graphql-tag';

export const ALl_CHANNELS_QUERY = gql`
  query channels{
    allChannels{
      id
      name
      public
    }
  }
`;
export default ALl_CHANNELS_QUERY;
