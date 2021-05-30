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

export const mutations = {
  uploadRecord: gql`
    mutation uploadRecord(
      $path: String!
      $title: String!
      $size: Int!
      $voice: String!
    ) {
      uploadRecord(path: $path, title: $title, size: $size, voice: $voice) {
        id
      }
    }
  `,
};

export default {
  queries,
  mutations,
};
