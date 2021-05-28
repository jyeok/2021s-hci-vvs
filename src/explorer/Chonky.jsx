/* eslint-disable */

import React, { useState, useEffect } from "react";
import { FullFileBrowser, ChonkyActions } from "chonky";
import PropTypes from "prop-types";

import { Record } from "proptypes/ModelPropTypes";

const fileToFilemap = (files) =>
  files
    ? files.map((e) => ({
        id: e.id,
        name: e.title,
        size: Number.isInteger(e.size) ? Number.parseInt(e.size) : 0,
        isDir: false,
        modDate: e.updatedAt,
        createDate: e.createdAt,
        tag: e.tag,
        memo: e.memo,
      }))
    : [];

const extraActions = [
  ChonkyActions.CreateFolder,
  ChonkyActions.UploadFiles,
  ChonkyActions.DownloadFiles,
  ChonkyActions.DeleteFiles,
];

const onFileAction = (e, props) => {
  console.log("e, data :>> ", e, props.data);

  switch (e.id) {
    case ChonkyActions.EnableGridView.id:
    case ChonkyActions.EnableListView.id:
      props.refetchAll();
      break;

    default:
      break;
  }
};

const getFolderChain = () => [
  { id: "xcv", name: "Demo", isDir: true },
  { id: "abdd", name: "zzz", isDir: true },
  { id: "asdfasdf", name: "ohno", isDir: true },
];

export const MyFileBrowser = (props) => {
  const {
    data: { allRecords },
  } = props;

  console.log("props :>> ", props);

  const [currRecords, setCurrRecords] = useState(props.data.allRecords);
  const [folderChain, setFolderChain] = useState(getFolderChain());

  useEffect(() => {
    setCurrRecords(props.data.allRecords);
  }, [props.data.allRecords]);

  return (
    <div style={{ height: "600px" }}>
      <FullFileBrowser
        files={fileToFilemap(currRecords)}
        folderChain={folderChain}
        fileActions={extraActions}
        onFileAction={(e) => onFileAction(e, props)}
      />
    </div>
  );
};

export default MyFileBrowser;

const { preview, voice, content, ...recordShape } = Record;

MyFileBrowser.propTypes = {
  data: PropTypes.shape({
    allRecords: PropTypes.arrayOf(PropTypes.shape(recordShape)),
  }).isRequired,
  refetchAll: PropTypes.func,
  onCreateFolder: PropTypes.func,
  onUploadFile: PropTypes.func,
  onFileDoubleClick: PropTypes.func,
  onFileClick: PropTypes.func,
};
