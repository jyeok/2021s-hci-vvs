/* eslint-disable*/
/* eslint-disable react/no-unused-prop-types */
import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { Grid, TextField } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";

import { useQuery } from "@apollo/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { TextBlock } from "proptypes/ModelPropTypes";
import MessageHolder from "../MessageHolder/MessageHolder";
import { queries } from "./api";

const PlayingRecord = () => {
  const reactId = parseInt(useParams().id);
  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id: reactId },
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
        <ArrowBack />
        <button type="button">전체 요약</button>
        <button type="button">선택 요약</button>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ borderBottom: "0.5px solid", height: "600px" }}
      >
        {data.recordById.content.map((e, i) => (
          <MessageHolder
            id={e.id}
            content={e.content}
            isMine={e.isMine}
            start={e.start}
            isHighlighted={e.isHighlighted}
          />
        ))}
      </Grid>
      <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
        <AudioPlayer src="data.recordById.path" />
      </Grid>
      <Grid item xs={1}>
        <HelpIcon fontSize="large" />
      </Grid>
      <Grid item xs={11}>
        <TextField
          id="Question"
          row="1"
          label="여기에 질문을 입력해보세요."
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default PlayingRecord;
