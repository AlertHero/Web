import gql from 'graphql-tag';

const MESSAGE_SUBSCRIPTION = gql`
  subscription newChannelMessage($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      createdAt
      channel {
        name
      }
      code {
        desc
        color
      }
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export default MESSAGE_SUBSCRIPTION;
