import React from "react";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import { Grid } from "@material-ui/core";
import "@material-ui/system";

import Preview from "container/Preview/Preview";
import connectorNodeV1 from "./explorer-node/lib/index";

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "http://localhost:3020",
};

const fileManager = () => (
  <Grid container padding={15} style={{ border: "1px solid" }}>
    <Grid item xs={8}>
      <FileManager style={({ height: "600px" }, { borderRight: "1px solid" })}>
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
    <Grid item xs={4} style={{ height: "600px" }}>
      <Preview name="미리보기" />
    </Grid>
  </Grid>
);

export default fileManager;
