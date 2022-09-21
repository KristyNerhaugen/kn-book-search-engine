import { gql } from "@apollo/client";

// GET_ME query
export const QUERY_GET_ME = gql`
{
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
  }
`;
