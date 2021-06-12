import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FullFileBrowser } from "chonky";

import { Grid } from "@material-ui/core";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useSnackbar } from "notistack";

import { queries, mutations } from "api/gql/schema";
import Preview from "container/Preview/Preview";
import Loading from "container/Loading/Loading";

import { onFileAction, extraActions } from "./ChonkyOptions";
import { fileToFilemap, getFolderChain } from "./Util";

const Explorer = () => {
  const { loading, error, data, refetch } = useQuery(queries.allRecords, {
    fetchPolicy: "network-only",
  });
  const [uploadMutation] = useMutation(mutations.uploadRecord);

  const [files, setFiles] = useState(data);
  const [currSelect, setCurrSelect] = useState({
    id: undefined,
    memo: undefined,
    tag: undefined,
    content: [],
  });
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFiles(data);
  }, [data]);

  if (loading) return <Loading message="파일을 로딩중입니다." transparent />;
  if (error)
    return (
      <Loading
        error
        message="파일을 로드할 수 없습니다! 인터넷 연결을 확인해 주세요."
      />
    );
  if (!files) {
    setFiles(data);
  }

  const onFileSave = () => {
    const { file } = upload[0];

    const uploadInterface = {
      path: file.path,
      title: file.name.substring(0, file.name.lastIndexOf(".")),
      size: file.size,
      voice: upload[0].data,
    };

    (async () => {
      try {
        await uploadMutation({ variables: uploadInterface });
        setOpen(false);
        setUpload({});
        refetch();
      } catch {
        enqueueSnackbar("중복된 파일이 있습니다!", { variant: "error" });
      }
    })();
  };

  const fileMap = files ? fileToFilemap(files.allRecords) : null;
  const { id, memo, tag, content } = currSelect;
  const folderChain = getFolderChain();

  return (
    <Grid container padding={15} style={{ height: "650px" }}>
      <Grid item xs={8} style={{ border: "1px solid", height: "650px" }}>
        <FullFileBrowser
          files={fileMap}
          folderChain={folderChain}
          fileActions={extraActions}
          onFileAction={(e) =>
            onFileAction(e, { refetch, setCurrSelect, setOpen })
          }
        />
      </Grid>
      <Grid item xs={4} style={{ border: "1px solid", height: "650px" }}>
        <Preview
          id={id}
          memo={memo}
          tag={tag}
          content={content}
          style={{ height: "650px" }}
        />
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
        onSave={() => onFileSave()}
        showPreviews
        showFileNamesInPreview
        filesLimit={1}
      />
    </Grid>
  );
};

export default Explorer;
