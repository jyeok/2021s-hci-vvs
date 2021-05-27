import React, { PureComponent } from "react";
import { Grid } from "@material-ui/core";
import { Delete, SaveAlt } from "@material-ui/icons";

import RecordingKeyword from "component/RecordingKeyword/RecordingKeyword";
import RecordingMemo from "../component/RecordingMemo/RecordingMemo";
import RecordingTop from "../component/RecordingTop/RecordingTop";
import RecordingMessage from "../container/RecordingMessage/RecordingMessage";

class WhileRecording extends PureComponent {
  render() {
    return (
      <Grid container padding={15} style={{ border: "1px solid" }}>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <RecordingTop />
        </Grid>
        <Grid
          item
          xs={8}
          style={({ height: "600px" }, { borderRight: "0.5px solid" })}
        >
          <Grid style={{ height: "600px" }}>
            <RecordingMessage messageTalk="아아아" />
            <Delete />
            <SaveAlt />
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ height: "600px" }}>
          <div>
            <RecordingMemo
              style={{
                border: "0.5px solid",
              }}
            />
          </div>
          <p2>
            <RecordingKeyword keyword="키워드" />
          </p2>
        </Grid>
      </Grid>
    );
  }
}

export default WhileRecording;
