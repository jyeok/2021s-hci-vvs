import React from "react";
import { useParams, useHistory } from "react-router-dom";

import { Grid, TextField } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";

import { useQuery } from "@apollo/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import MessageHolder from "../MessageHolder/MessageHolder";
import { queries } from "./api";

const PlayingRecord = () => {
  const recordId = parseInt(useParams().id, 10);
  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id: recordId },
  });
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (!data.recordById) goBack();

  const handleValue = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const questionInput = e.target.question.value;
  };

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
        <ArrowBack onClick={goBack} />
        <button type="button">전체 요약</button>
        <button type="button">선택 요약</button>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ borderBottom: "0.5px solid", height: "600px" }}
      >
        {data.recordById &&
          data.recordById.content.map((e, i) => (
            <MessageHolder
              key={`${recordId + i * 2}`}
              id={e.id}
              content={e.content}
              isMine={e.isMine}
              start={e.start}
              isHighlighted={e.isHighlighted}
            />
          ))}
      </Grid>
      <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
        <AudioPlayer src={data.recordById.voice} />
      </Grid>
      <Grid item xs={1}>
        <HelpIcon fontSize="large" />
      </Grid>
      <Grid item xs={11}>
        <form onSubmit={handleValue}>
          <TextField
            id="question"
            row="1"
            label="여기에 질문을 입력해보세요."
            fullWidth
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default PlayingRecord;
