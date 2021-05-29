import { gql } from "@apollo/client";

export const queries = {
  recordById: gql`
    query recordById($id: Int!) {
      recordById(id: $id) {
        id
        path
        title
        size
        createdAt
        isLocked
        tag
        memo
        voice
        content {
          id
          content
          isMine
          isHighlighted
          isModified
          reliability
          start
        }
      }
    }
  `,
};

export default {
  queries,
};
