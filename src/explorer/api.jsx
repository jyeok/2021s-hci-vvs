import { gql } from "@apollo/client";

export const queries = {
  allRecords: gql`
    query allRecords {
      allRecords {
        id
        path
        title
        size
        createdAt
        updatedAt
        tag
        memo
        isLocked
        preview {
          id
          excerpt {
            id
            content
            isMine
            isModified
            isHighlighted
            reliability
            start
          }
        }
      }
    }
  `,
  previewById: gql`
    query previewById($id: Int!) {
      previewById(id: $id) {
        id
        memo
        tag
        content
      }
    }
  `,
};

export default {
  queries,
};
