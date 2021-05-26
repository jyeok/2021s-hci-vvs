import React, { PureComponent } from "react";
import { Grid } from "@material-ui/core";
import RecordingKeyword from "container/RecordingKeyword/RecordingKeyword";
import RecordingMemo from "../component/RecordingMemo/RecordingMemo";
import RecordingTop from "../component/RecordingTop/RecordingTop";

class WhileRecording extends PureComponent {
  render() {
    return (
      <Grid container padding={15}>
        <Grid
          item
          xs={12}
          style={
            ({ height: "600px" },
            {
              borderTop: "1px solid",
              borderRight: "1px solid",
              borderLeft: "1px solid",
            })
          }
        >
          <RecordingTop />
        </Grid>
        <Grid
          item
          xs={8}
          style={
            ({ height: "600px" },
            {
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderLeft: "1px solid",
            })
          }
        >
          <Grid style={{ borderBottom: "1px solid" }}>여기는 메세지</Grid>
          <Grid>여기는 삭제+저장 함</Grid>
        </Grid>
        <Grid
          item
          xs={4}
          style={({ height: "600px" }, { border: "1px solid" })}
        >
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
