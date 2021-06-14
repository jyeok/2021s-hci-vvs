/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
// /* eslint-disable */

import React, { useRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";

import { useQuery, useMutation } from "@apollo/client";

import { Grid } from "@material-ui/core";

import { useSnackbar } from "notistack";

import { queries } from "api/gql/schema";

import Loading from "container/Loading/Loading";
import { base64StringToBlob } from "blob-util";
import H5AudioPlayer from "react-h5-audio-player";
import RecordComponent from "./RecordComponent";

const PlayingLayout = () => {
  // State

  // Hooks
  const history = useHistory();
  const audioRef = useRef();

  const { enqueueSnackbar } = useSnackbar();

  const recordId = parseInt(useParams().id, 10);

  // GrqphQL Queries and Mutations
  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id: recordId },
  });

  // Variables and Constants
  const onBack = (msg, variant) => {
    if (msg) enqueueSnackbar(msg, { variant });
    history.push("/");
  };
  const dataType = "data:audio/webm;";
  const codecs = "codecs=opus";

  if (loading)
    return <Loading message="녹음 파일을 로딩중입니다." transparent />;
  if (error) return <Loading message="오류가 발생했습니다." error />;
  if (!data || !data.recordById || data.recordById.isLocked) {
    onBack("올바르지 않은 접근입니다.", "warning");
  }

  // Data Logic

  const blob = base64StringToBlob(data.recordById.voice, dataType + codecs);
  const blobUrl = URL.createObjectURL(blob);

  // Handlers

  return (
    <Grid container>
      <RecordComponent id={recordId} data={data} audioRef={audioRef} />
      <Grid container justify="center" alignItems="center" spacing={0}>
        <H5AudioPlayer
          src={blobUrl}
          ref={audioRef}
          onLoadedMetaData={() => {
            const aud = audioRef.current.audio.current;
            if (aud.duration === Infinity) {
              aud.currentTime = 1e101;
            }
          }}
          onLoadedData={() => {
            const aud = audioRef.current.audio.current;
            aud.currentTime = 0;
            aud.playbackRate = 1;
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PlayingLayout;
