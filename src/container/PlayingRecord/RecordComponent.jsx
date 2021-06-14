/* eslint-disable no-unused-vars */
// /* eslint-disable */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";

import { useMutation, useQuery } from "@apollo/client";

import {
  Grid,
  Button,
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import Popover from "material-ui-popup-state/HoverPopover";
import { useSnackbar } from "notistack";

import { mutations, queries } from "api/gql/schema";

import TextRank from "api/ai/summarization";
import MessageHolder from "container/MessageHolder/MessageHolder";
import { secondsToTime } from "component/Recorder/Util";
import Loading from "container/Loading/Loading";
import MessageInput from "@chatscope/chat-ui-kit-react/dist/cjs/MessageInput";
import { answerQuestion } from "api/ai/answerQuestion";

const useStyles = makeStyles(() => ({
  topElements: {
    height: "50px",
    borderBottom: "0.5px solid",
  },
  formControl: {
    minWidth: 100,
    marginRight: "5px",
  },
  middleElements: {
    height: "500px",
    overflow: "scroll",
  },
  popupButtons: {
    margin: "3px",
  },
}));

const RecordComponent = (props) => {
  const { audioRef, id } = props;

  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id },
  });

  // State
  const [numCompress, setNumCompress] = useState(3);
  const [openCompress, setOpenCompress] = useState(false);
  const [editText, setEditText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [memo, setMemo] = useState("");
  const [tag, setTag] = useState("");
  const [answer, setAnswer] = useState();

  // Hooks
  const history = useHistory();

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data && data.recordById) {
      setMemo(data.recordById.memo);
      setTag(data.recordById.tag);
    }
  }, [data]);

  // GrqphQL Queries and Mutations
  const [updateTextBlockMutation] = useMutation(mutations.updateTextBlock);
  const [updateRecordMutation] = useMutation(mutations.updateRecord);

  // Variables and Constants
  const onBack = (msg, variant) => {
    if (msg) enqueueSnackbar(msg, { variant });
    history.push("/");
  };

  if (loading)
    return <Loading message="녹음 파일을 로딩중입니다." transparent />;
  if (error) return <Loading message="오류가 발생했습니다." error />;
  if (!data || !data.recordById || data.recordById.isLocked) {
    onBack("올바르지 않은 접근입니다.", "warning");
  }

  const allContents = data.recordById.content.map((e) => e.content);
  const contentsConcat = allContents.reduce((acc, cur) => `${acc} ${cur}`, "");
  const textRank = new TextRank(allContents);

  // Handlers
  const changeNumCompress = (e) => {
    // TODO: CHANGE IT
    const currNumCompress = e.target.value;

    setNumCompress(currNumCompress);
    alert(textRank.getSummarizedText(currNumCompress));
  };

  const onMemoUpdate = () => {
    updateRecordMutation({
      variables: {
        id: data.recordById.id,
        data: {
          memo,
        },
      },
    })
      .then(() => {
        enqueueSnackbar("수정된 내용이 저장되었습니다.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("오류가 발생했습니다! 다시 시도해 주세요.", {
          variant: "error",
        });
      });
  };

  const onTagUpdate = () => {
    updateRecordMutation({
      variables: {
        id: data.recordById.id,
        data: {
          tag,
        },
      },
    })
      .then(() => {
        enqueueSnackbar("수정된 내용이 저장되었습니다.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("오류가 발생했습니다! 다시 시도해 주세요.", {
          variant: "error",
        });
      });
  };

  const onPlayText = (time) => {
    audioRef.current.audio.current.currentTime = Number.parseFloat(time);
    audioRef.current.audio.current.play();
  };

  const onEditOpen = (textBlock) => {
    setEditText(textBlock.content);
    setEditOpen(true);
  };

  const onEditClose = () => {
    setEditText("");
    setEditOpen(false);
  };

  const onEditTextBlock = (textBlock) => {
    updateTextBlockMutation({
      variables: {
        id: textBlock.id,
        data: {
          content: editText,
        },
      },
    })
      .then(() => {
        enqueueSnackbar("수정된 내용이 저장되었습니다.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("오류가 발생했습니다! 다시 시도해 주세요.", {
          variant: "error",
        });
      });

    onEditClose();
  };

  const onToggleLocation = (textBlock) => {
    updateTextBlockMutation({
      variables: {
        id: textBlock.id,
        data: {
          isMine: 1 - textBlock.isMine,
        },
      },
    }).catch(() => {
      enqueueSnackbar("오류가 발생했습니다! 다시 시도해 주세요.", {
        variant: "error",
      });
    });
  };

  const onAddBookmark = (textBlock) => {
    updateTextBlockMutation({
      variables: {
        id: textBlock.id,
        data: {
          isHighlighted: 1 - textBlock.isHighlighted,
        },
      },
    }).catch(() => {
      enqueueSnackbar("오류가 발생했습니다! 다시 시도해 주세요.", {
        variant: "error",
      });
    });
  };

  const handleSpeed = (e) => {
    audioRef.current.audio.current.playbackRate = e.target.value;
  };

  const handleQuestion = async (input) => {
    answerQuestion(contentsConcat, input).then((result) => {
      const ans = result[0];
      const ansBlock = data.recordById.content.filter(
        (x) => x.content.indexOf(ans) !== -1
      );

      setAnswer({
        answer: ans,
        block: ansBlock,
      });

      alert(ans);
      console.log(ansBlock); // TODO: FIX IT
    });
  };

  return (
    <>
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={0}
        direction="row"
        className={classes.topElements}
        style={{ border: "1px solid" }}
      >
        <Grid item lg={1}>
          <Button onClick={() => onBack()} startIcon={<ArrowBack />}>
            돌아가기
          </Button>
        </Grid>
        <Grid item lg={4} />
        <Grid item lg={1}>
          <FormControl className={classes.formControl}>
            <InputLabel variant="filled" color="primary" id="playSpeed">
              재생 속도
            </InputLabel>
            <Select
              labelId="playSpeed"
              onChange={(e) => handleSpeed(e)}
              defaultValue={1}
            >
              <MenuItem value={0.8}>0.8</MenuItem>
              <MenuItem defaultChecked value={1}>
                1
              </MenuItem>
              <MenuItem value={1.2}>1.2</MenuItem>
              <MenuItem value={1.5}>1.5</MenuItem>
              <MenuItem value={1.8}>1.8</MenuItem>
              <MenuItem value={2.0}>2.0</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={1} />
        <Grid item lg={1}>
          <FormControl className={classes.formControl}>
            <InputLabel variant="filled" color="primary" id="numCompress">
              N줄 요약
            </InputLabel>
            <Select
              labelId="numCompress"
              value={numCompress}
              open={openCompress}
              onOpen={() => setOpenCompress(true)}
              onClose={() => setOpenCompress(false)}
              onChange={(e) => changeNumCompress(e)}
            >
              <MenuItem value={3}> 3 </MenuItem>
              <MenuItem value={5}> 5 </MenuItem>
              <MenuItem value={7}> 7 </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={1} />
        <Grid item lg={1}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => onMemoUpdate()}
          >
            메모 업데이트
          </Button>
        </Grid>
        <Grid item lg={1} />
        <Grid item lg={1}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => onTagUpdate()}
          >
            태그 업데이트
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={0}
        style={{ border: "1px solid" }}
      >
        <Grid item xs={8} className={classes.middleElements}>
          {data.recordById?.content.map((e) => (
            <PopupState
              key={`${id}${e.start}`}
              variant="popover"
              popupId={`play${id}${e.start}`}
            >
              {(popupState) => (
                <>
                  <MessageHolder
                    id={e.id}
                    content={e.content}
                    isMine={e.isMine}
                    start={secondsToTime(e.start)}
                    isHighlighted={e.isHighlighted}
                    bindHover={() => bindHover(popupState)}
                  />
                  <Popover
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: e.isMine ? "right" : "left",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    disableRestoreFocus
                  >
                    <Button
                      className={classes.popupButtons}
                      variant="contained"
                      color="primary"
                      onClick={() => onPlayText(e.start)}
                    >
                      이 부분 재생
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.popupButtons}
                      onClick={() => onEditOpen(e)}
                    >
                      텍스트 편집
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.popupButtons}
                      onClick={() => onToggleLocation(e)}
                    >
                      {e.isMine ? "상대의 말로 표시" : "내 말로 표시"}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ margin: "3px" }}
                      onClick={() => onAddBookmark(e)}
                    >
                      {e.isHighlighted ? "북마크 제거" : "북마크 추가"}
                    </Button>
                    <Dialog
                      open={editOpen}
                      onClose={() => onEditClose()}
                      fullWidth
                    >
                      <DialogContent>
                        <TextField
                          multiline
                          autoFocus
                          margin="dense"
                          label="수정할 텍스트 입력"
                          value={editText}
                          fullWidth
                          onChange={(event) => {
                            setEditText(event.target.value);
                          }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => onEditClose()}>취소</Button>
                        <Button onClick={() => onEditTextBlock(e)}>확인</Button>
                      </DialogActions>
                    </Dialog>
                  </Popover>
                </>
              )}
            </PopupState>
          ))}
        </Grid>
        <Grid
          item
          xs={4}
          className={classes.middleElements}
          style={{ borderLeft: "1px solid" }}
        >
          <TextField
            label="메모"
            name="memo"
            defaultValue={memo}
            fullWidth
            multiline
            rows={16}
            style={{ marginTop: "6px", marginBottom: "5px" }}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
          />
          <TextField
            label="태그"
            name="tag"
            defaultValue={tag}
            fullWidth
            multiline
            rows={9}
            style={{ marginTop: "6px" }}
            onChange={(e) => {
              setTag(e.target.value);
            }}
          />
        </Grid>
      </Grid>
      <Grid container justify="center" alignItems="center" spacing={0}>
        <Grid item lg={12}>
          <MessageInput
            attachButton={false}
            placeholder="여기에 질문을 입력해보세요"
            onSend={(e) => handleQuestion(e)}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default RecordComponent;

RecordComponent.propTypes = {
  audioRef: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    current: PropTypes.any,
  }).isRequired,
  id: PropTypes.number.isRequired,
};
