/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, useHistory } from "react-router-dom";

import { Grid, TextField } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";

import { useQuery } from "@apollo/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { compression } from "api/compression";
import { answerQuestion } from "api/answerQuestion";
import TextRank from "container/summarization/summarization";
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

  const newData = data.recordById.content.map((e) => e.content);

  const finalCompressData = newData.reduce((acc, cur) => `${acc} ${cur}`, "");

  const handleValue = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const questionInput = e.target.question.value;
    answerQuestion(finalCompressData, questionInput);
  };

  const textrank = new TextRank(newData);

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid
        item
        xs={12}
        style={({ borderBottom: "0.5px solid" }, { height: "50px" })}
      >
        <ArrowBack onClick={goBack} />
        <button
          type="button"
          style={{ float: "right" }}
          onClick={() => {
            // eslint-disable-next-line no-alert
            alert(textrank.getSummarizedThreeText());
          }}
        >
          전체 요약
        </button>
        <button type="button" style={{ float: "right" }}>
          선택 요약
        </button>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ borderBottom: "0.5px solid", height: "500px" }}
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
