import React from "react";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";
import { Grid } from "@material-ui/core";
// eslint-disable-next-line no-unused-vars
import { padding } from "@material-ui/system";

import Preview from "container/Preview/Preview";

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "http://localhost:3020",
};

const fileManager = () => (
  <Grid container padding={15}>
    <Grid item xs={8}>
      <FileManager style={({ height: "600px" }, { border: "1px solid" })}>
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
    <Grid
      item
      xs={4}
      style={
        ({ height: "600px" },
        {
          borderTop: "1px solid",
          borderRight: "1px solid",
          borderBottom: "1px solid",
        })
      }
    >
      <Preview name="미리보기" />
    </Grid>
  </Grid>
);

export default fileManager;
