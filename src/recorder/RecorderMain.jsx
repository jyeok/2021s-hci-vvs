import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/client";

import { Grid } from "@material-ui/core";

import { keywords } from "api/ai";
import { mutations } from "api/gql/schema";

import RecordTopPanel from "./RecordTopPanel";
import RecorderContent from "./RecorderContent";
import RecorderInput from "./RecorderInput";

import { uploadVoice } from "./Util";
import { RECORD_STATUS } from "./constants";

const useVoiceRecord = () => {
  const inputHandler = useState({
    title:"",
    memo:"",
    tag:""
  });
  const recordStatus = useState(RECORD_STATUS.WAITING);
  const dataHandler = useState([]);
  const interimHandler = useState("");
  const voiceHandler = useState(null);

  return {
    recordStatus,
    inputHandler,
    dataHandler,
    interimHandler,
    voiceHandler,
  };
};

const useVoiceMutation = () => {
  const [addRecordMutation] = useMutation(mutations.addRecord);
  const [generatePreviewMutation] = useMutation(mutations.generatePreview);

  return {
    addRecordMutation,
    generatePreviewMutation,
  };
};

const RecorderMain = () => {
  const {
    inputHandler: [inputState, setInputState],
    recordStatus: [status, setStatus],
    dataHandler: [textData, accTextData],
    interimHandler: [interimString, setInterim],
    voiceHandler: [voiceData, setVoiceData],
  } = useVoiceRecord();

  const { addRecordMutation, generatePreviewMutation } = useVoiceMutation();
  const { goBack } = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const extractTag = async () => {
    const allContents = textData
      .reduce((acc, cur) => `${acc} ${cur.content}`, "")
      .trim();

    const userTag = inputState.tag?.trim()
      ? inputState.tag
          .split(" ")
          .map((e) => (e.startsWith("#") ? e.trim() : `#${e.trim()}`))
      : [];

    const tagList = await keywords(allContents);

    const tagConcat = userTag.concat(tagList);
    return [...new Set(tagConcat)].slice(0, 10).join(" ").trim();
  };

  const addRecord = async (
    userName,
    textBlockCreateInput,
    finalTag,
    voiceURL
  ) => {
    const recordCreateInput = {
      path: `records/${userName}/${inputState.title}`,
      title: inputState.title,
      size: voiceData.size,
      tag: finalTag,
      memo: inputState.memo,
      content: textBlockCreateInput,
      voice: voiceURL,
    };

    try {
      const res = await addRecordMutation({
        variables: {
          data: recordCreateInput,
        },
      });

      await generatePreviewMutation({
        variables: {
          id: res.data.addRecord.id,
        },
      });

      enqueueSnackbar("????????? ?????????????????????.", {
        variant: "success",
      });

      goBack();
    } catch (err) {
      if (err.message.includes("Unique constraint failed")) {
        enqueueSnackbar("?????? ???????????? ???????????????. ????????? ????????? ?????????.", {
          variant: "error",
        });
      } else if (err.message.includes("Failed to fetch")) {
        enqueueSnackbar("????????? ????????? ????????? ?????????.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("??? ??? ?????? ????????? ??????????????????. ?????? ????????? ?????????.", {
          variant: "error",
        });
      }
    }
  };

  const speechHandler = {
    onTranscript: (newTextBlock) => {
      setInterim("");
      accTextData((prevData) => [...prevData, newTextBlock]);
    },
    onSpeechError: () => {
      enqueueSnackbar("?????? ??? ????????? ??????????????????! ??????????????? ?????????.", {
        variant: "error",
      });
      setStatus(RECORD_STATUS.ERROR);
    },
    onInterim: (interimStr) => {
      setInterim(interimStr);
    },
    onSaveVoice: (voice) => {
      setVoiceData(voice);

      enqueueSnackbar("????????? ?????????????????????.", {
        variant: "success",
      });
    },
    onSaveRecord: async (userName = "root") => {
      if (!inputState.title) {
        enqueueSnackbar("?????? ????????? ??????????????????.", {
          variant: "error",
        });

        return;
      }

      const textBlockCreateInput = textData.map((block) => ({
        content: block.content,
        isMine: 1,
        isHighlighted: 0,
        isModified: 0,
        reliability: block.reliability,
        start: block.start.toString(),
        end: block.end.toString(),
      }));

      const uploaded = await uploadVoice(inputState.title, voiceData, userName);

      if (!uploaded) {
        enqueueSnackbar("?????? ???????????? ?????????????????????!", {
          variant: "error",
        });

        return;
      }

      const finalTag = await extractTag();
      await addRecord(userName, textBlockCreateInput, finalTag, uploaded);
    },
  };

  return (
    <Grid container>
      <RecordTopPanel
        recordStatus={[status, setStatus]}
        speechHandler={speechHandler}
      />
      <RecorderContent
        textData={textData}
        recording={status}
        interimString={interimString}
      />
      <RecorderInput inputHandler={[inputState, setInputState]} />
    </Grid>
  );
};

export default RecorderMain;
