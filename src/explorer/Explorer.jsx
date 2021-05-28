import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { FullFileBrowser } from "chonky";
import Preview from "container/Preview/Preview";

import { queries } from "./api";
import { fileToFilemap, getFolderChain } from "./Util";
import { onFileAction, extraActions } from "./ChonkyOptions";

export const Explorer = () => {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    queries.allRecords
  );

  const [files, setFiles] = useState(data);
  const [netStat, setNetStat] = useState(networkStatus);
  const [currSelect, setCurrSelect] = useState({
    id: 0,
    memo: "",
    tag: "",
    content: [],
  });

  useEffect(() => {
    setFiles(data);
    setNetStat(networkStatus);
  }, [data, networkStatus]);

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
          onFileAction={(e) => onFileAction(e, { refetch, setCurrSelect })}
        />
      </Grid>
      <Grid item xs={4}>
        <Preview id={id} memo={memo} tag={tag} content={content} />
      </Grid>
    </Grid>
  );
};

export default Explorer;
