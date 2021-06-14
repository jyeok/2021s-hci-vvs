/* eslint-disable no-unused-vars */
// /* eslint-disable */

import React, { useState } from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";

import { useMutation } from "@apollo/client";

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

import { mutations } from "api/gql/schema";

import TextRank from "api/ai/summarization";
import MessageHolder from "container/MessageHolder/MessageHolder";
import { secondsToTime } from "component/Recorder/Util";

const useStyles = makeStyles(() => ({
  topElements: {
    height: "50px",
    borderBottom: "0.5px solid",
  },
  formControl: {
    minWidth: 100,
    float: "right",
    marginRight: "5px",
  },
  middleElements: {
    height: "550px",
    overflow: "scroll",
  },
  popupButtons: {
    margin: "3px",
  },
}));

const RecordComponent = (props) => {
  const { data, id, audioRef } = props;

  // State
  const [numCompress, setNumCompress] = useState(3);
  const [openCompress, setOpenCompress] = useState(false);
  const [editText, setEditText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [memo, setMemo] = useState(data.recordById.memo);
  const [tag, setTag] = useState(data.recordById.tag);
  const [answer, setAnswer] = useState();

  // Hooks
  const history = useHistory();

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // GrqphQL Queries and Mutations
  const [updateTextBlockMutation] = useMutation(mutations.updateTextBlock);
  const [updateRecordMutation] = useMutation(mutations.updateRecord);

  // Variables and Constants
  const onBack = (msg, variant) => {
    if (msg) enqueueSnackbar(msg, { variant });
    history.push("/");
  };

  // Data Logic
  // setMemo(data.recordById.memo);
  // setTag(data.recordById.tag);

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
        <Grid item lg={2}>
          <Button onClick={() => onMemoUpdate()}>메모 업데이트</Button>
        </Grid>
        <Grid item lg={2}>
          <Button onClick={() => onTagUpdate()}>태그 업데이트</Button>
        </Grid>
        <Grid item lg={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="numCompress"> 녹음 요약 </InputLabel>
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
        질문자리
      </Grid>
    </>
  );
};

export default RecordComponent;

RecordComponent.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.shape({
    recordById: PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          start: PropTypes.string,
        })
      ),
      memo: PropTypes.string,
      tag: PropTypes.string,
    }),
  }).isRequired,
  audioRef: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    current: PropTypes.any,
  }).isRequired,
};
