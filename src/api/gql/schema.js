import { gql } from "@apollo/client";

export const fragments = {
  allRecordFields: gql`
    fragment allRecordFields on Record {
      id
      path
      title
      size
      createdAt
      updatedAt
      tag
      memo
      isLocked
      voice
    }
  `,

  allTextBlockFields: gql`
    fragment allTextBlockFields on TextBlock {
      id
      content
      isMine
      isHighlighted
      isModified
      reliability
      start
      end
    }
  `,

  allPreviewFields: gql`
    fragment allPreviewFields on Preview {
      id
      voice
    }
  `,

  allScheduleFields: gql`
    fragment allScheduleFields on Schedule {
      id
      date
      memo
    }
  `,
};

export const queries = {
  recordById: gql`
    ${fragments.allRecordFields}
    ${fragments.allTextBlockFields}
    query recordById($id: Int!) {
      recordById(id: $id) {
        ...allRecordFields
        content {
          ...allTextBlockFields
        }
      }
    }
  `,

  allRecords: gql`
    ${fragments.allRecordFields}
    ${fragments.allTextBlockFields}
    query allRecords {
      allRecords {
        ...allRecordFields
        preview {
          id
          excerpt {
            ...allTextBlockFields
          }
        }
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
  addRecord: gql`
    ${fragments.allRecordFields}
    ${fragments.allTextBlockFields}
    mutation addRecord($data: RecordCreateInput!) {
      addRecord(data: $data) {
        ...allRecordFields
        content {
          ...allTextBlockFields
          record {
            id
          }
        }
      }
    }
  `,
  generatePreview: gql`
    mutation generatePreview($id: Int!) {
      generatePreview(recordId: $id) {
        id
        record {
          id
        }
        excerpt {
          id
          content
        }
      }
    }
  `,
  updateRecord: gql`
    ${fragments.allRecordFields}
    ${fragments.allTextBlockFields}
    mutation updateRecord($id: Int!, $data: RecordUpdateInput!) {
      updateRecord(id: $id, data: $data) {
        ...allRecordFields
        content {
          ...allTextBlockFields
        }
      }
    }
  `,
  updateTextBlock: gql`
    ${fragments.allTextBlockFields}
    mutation updateTextBlock($id: Int!, $data: TextBlockUpdateInput!) {
      updateTextBlock(id: $id, data: $data) {
        ...allTextBlockFields
      }
    }
  `,
};

export default {
  queries,
  mutations,
  fragments,
};
