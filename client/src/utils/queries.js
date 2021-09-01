const { gql } = require('@apollo/client');

export const GET_ME = gql`
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
        link
        image
        title
      }
    }
  }
`;