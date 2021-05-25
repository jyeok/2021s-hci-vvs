import React from "react";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";
import { Grid } from "@material-ui/core";

import Preview from "container/Preview/Preview";
import PreviewText from "container/PreviewText/PreviewText";
import ButtonEdit from "container/Buttons/ButtonEdit";
import ButtonPlay from "container/Buttons/ButtonPlay";
import ButtonLock from "container/Buttons/ButtonLock";

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
      <Preview name="미리보기" />
      <PreviewText name="여기가 대화의 내용" />
      <ButtonEdit name="편집" />
      <ButtonPlay name="재생" />
      <ButtonLock name="잠금" />
    </Grid>
  </Grid>
);

export default fileManager;
