import React from "react";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";
import { Grid } from "@material-ui/core";

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "http://localhost:3020",
};

const fileManager = () => (
  <Grid container>
    <Grid item xs={7}>
      <FileManager style={{ height: "600px" }}>
        <FileNavigator
          id="filemanager-1"
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          capabilities={connectorNodeV1.capabilities}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    </Grid>
    <Grid item xs={5}>
      <div>오노</div>
    </Grid>
  </Grid>
);

export default fileManager;
