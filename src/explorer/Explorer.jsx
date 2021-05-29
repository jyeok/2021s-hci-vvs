/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FullFileBrowser } from "chonky";

import { Grid } from "@material-ui/core";
import { DropzoneDialogBase } from "material-ui-dropzone";

import Preview from "container/Preview/Preview";
import { queries } from "./api";
import { fileToFilemap, getFolderChain } from "./Util";
import { onFileAction, extraActions } from "./ChonkyOptions";

const onFileSave = (upload, setOpen, refetch) => {
  console.log("upload :>> ", upload);
  console.log("upload[0][data] :>> ", upload[0]["data"]);
  setOpen(false);
  // refetch();
};

export const Explorer = () => {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    queries.allRecords
  );

  const [files, setFiles] = useState(data);
  const [netStat, setNetStat] = useState(networkStatus);
  const [currSelect, setCurrSelect] = useState({
    id: undefined,
    memo: undefined,
    tag: undefined,
    content: [],
  });
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState({});

  useEffect(() => {
    setFiles(data);
    setNetStat(networkStatus);
    setUpload(upload);
  }, [data, networkStatus, upload]);

  if (loading) return <div> Loading... </div>;
  if (error) return <div> error! {netStat.message}</div>;
  if (!files) {
    setFiles(data);
    setNetStat(networkStatus);
  }

  const fileMap = files ? fileToFilemap(files.allRecords) : null;
  const { id, memo, tag, content } = currSelect;
  const folderChain = getFolderChain();

  return (
    <Grid
      container
      padding={15}
      style={{ border: "1px solid", height: "800px" }}
    >
      <Grid item xs={8}>
        <FullFileBrowser
          files={fileMap}
          folderChain={folderChain}
          fileActions={extraActions}
          onFileAction={(e) =>
            onFileAction(e, { refetch, setCurrSelect, setOpen })
          }
        />
      </Grid>
      <Grid item xs={4}>
        <Preview id={id} memo={memo} tag={tag} content={content} />
      </Grid>
      <DropzoneDialogBase
        dialogTitle="파일을 선택하세요"
        acceptedFiles={["audio/*"]}
        fileObjects={upload}
        cancelButtonText="취소"
        submitButtonText="업로드"
        open={open}
        onAdd={(newUpload) => setUpload(newUpload)}
        onClose={() => setOpen(false)}
        onSave={() => onFileSave(upload, setOpen, refetch)}
        showPreviews={true}
        showFileNamesInPreview={true}
        filesLimit={1}
      />
    </Grid>
  );
};

export default Explorer;
