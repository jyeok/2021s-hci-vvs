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
      }
    }
  `,
  recordById: gql`
    query recordById($id: Int!) {
      recordById(id: $id) {
        id
        path
        title
        size
        createdAt
        updatedAt
        tag
        memo
        isLocked
      }
    }
  `,
};

export default {
  queries,
};
