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

      enqueueSnackbar("녹음이 저장되었습니다.", {
        variant: "success",
      });

      goBack();
    } catch (err) {
      if (err.message.includes("Unique constraint failed")) {
        enqueueSnackbar("이미 존재하는 제목입니다. 제목을 수정해 주세요.", {
          variant: "error",
        });
      } else if (err.message.includes("Failed to fetch")) {
        enqueueSnackbar("인터넷 연결을 확인해 주세요.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.", {
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
      enqueueSnackbar("녹음 중 오류가 발생했습니다! 새로고침해 주세요.", {
        variant: "error",
      });
      setStatus(RECORD_STATUS.ERROR);
    },
    onInterim: (interimStr) => {
      setInterim(interimStr);
    },
    onSaveVoice: (voice) => {
      setVoiceData(voice);

      enqueueSnackbar("녹음이 종료되었습니다.", {
        variant: "success",
      });
    },
    onSaveRecord: async (userName = "root") => {
      if (!inputState.title) {
        enqueueSnackbar("녹음 제목을 입력해주세요.", {
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
        enqueueSnackbar("음성 업로드에 실패하였습니다!", {
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
