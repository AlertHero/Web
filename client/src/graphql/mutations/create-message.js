import gql from 'graphql-tag';

const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($channelId: [Int!], $text: String!, $image: String, $codeId: Int!) {
    createMessage(channelId: $channelId, text: $text, image: $image, codeId: $codeId)
  }
`;
export default CREATE_MESSAGE_MUTATION;
