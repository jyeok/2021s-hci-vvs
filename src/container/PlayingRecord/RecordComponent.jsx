/* eslint-disable no-unused-vars */

import React, { useState, useEffect, createRef } from "react";
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
  DialogTitle,
  DialogContentText,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos,
  Help,
} from "@material-ui/icons";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import Popover from "material-ui-popup-state/HoverPopover";
import { useSnackbar } from "notistack";

import TextRank from "api/ai/summarization";
import { mutations, queries } from "api/gql/schema";
import { answerQuestion } from "api/ai/answerQuestion";

import { secondsToTime } from "component/Recorder/Util";

import MessageHolder from "container/MessageHolder/MessageHolder";
import Loading from "container/Loading/Loading";
import MessageInput from "@chatscope/chat-ui-kit-react/dist/cjs/MessageInput";

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
    height: "480px",
    overflow: "scroll",
  },
  popupButtons: {
    margin: "3px",
  },
  selected: {
    backgroundColor: "#A9F1DF",
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    contents: [],
    onClose: () => {},
    onConfirm: undefined,
  });

  const [currBookmark, setCurrBookmark] = useState(undefined);
  const [bookmarkRefs, setBookmarkRefs] = useState([]);
  const [openHelp, setOpenHelp] = useState(false);

  // Hooks
  const history = useHistory();

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data && data.recordById) {
      setMemo(data.recordById.memo);
      setTag(data.recordById.tag);
      setBookmarkRefs((refs) =>
        Array(data.recordById.content.length)
          .fill()
          .map((_, i) => refs[i] || createRef())
      );
    }
  }, [data]);

  useEffect(() => {
    if (
      currBookmark !== undefined &&
      currBookmark >= 0 &&
      currBookmark < bookmarkRefs.length
    ) {
      const realContentBookmark = data.recordById.content.findIndex(
        (e) =>
          e.id ===
          data.recordById.content.filter((t) => t.isHighlighted)[currBookmark]
            .id
      );

      bookmarkRefs.forEach((e, i) => {
        if (i === realContentBookmark) {
          e.current.scrollIntoView();
          e.current.className = classes.selected;
        } else {
          e.current.className = "";
        }
      });
    } else if (currBookmark === undefined) {
      bookmarkRefs.forEach((e) => {
        e.current.className = "";
      });
    }
  }, [currBookmark]);

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
  const allBookmarks = data.recordById.content.filter((e) => e.isHighlighted);

  const contentsConcat = allContents.reduce((acc, cur) => `${acc} ${cur}`, "");
  const textRank = new TextRank(allContents);

  // Handlers
  const changeNumCompress = (e) => {
    const currNumCompress = e.target.value || numCompress;

    setNumCompress(currNumCompress);
    const result = textRank.getSummarizedText(currNumCompress);

    const resultSplited = result.split("\n").map((s, i) => ({
      id: i + 1,
      content: s === "undefined" ? "" : s,
    }));

    setDialogContent({
      title: `${currNumCompress}줄요약 결과!`,
      contents: [
        { id: 0, content: `${currNumCompress}줄요약 결과는...` },
        ...resultSplited,
        {
          id: resultSplited.length + 1,
          content:
            resultSplited.length - 1 === currNumCompress
              ? "재미로만 봐 주세요 :)"
              : `결과가 ${currNumCompress}줄 이하인가요? 조금 더 긴 녹음으로 시도해 보세요.`,
        },
      ],
      onClose: () => setDialogOpen(false),
      onConfirm: undefined,
    });

    setDialogOpen(true);
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
        enqueueSnackbar("메모가 저장되었습니다.", {
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
        enqueueSnackbar("태그가 저장되었습니다.", {
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
          reliability: 1,
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
    if (currBookmark !== undefined && textBlock.isHighlighted) {
      if (allBookmarks[currBookmark].id === textBlock.id) {
        bookmarkRefs.forEach((e, i) => {
          e.current.className = "";
        });

        if (allBookmarks.length === 1) setCurrBookmark(undefined);
        else setCurrBookmark(currBookmark - 1);
      }
    }

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
      const ans = result[0] ? result[0].split("\n")[0] : undefined;
      const ansBlock = data.recordById.content.filter(
        (x) => x.content.indexOf(ans) !== -1
      );

      setDialogContent({
        title: `질문: "${input}"에 대해!`,
        contents: ansBlock[0]
          ? [
              { id: 0, content: `질문 ${input}에 대해 찾은 답변이에요.` },
              { id: 1, content: `답: ${ans}` },
              { id: 2, content: ansBlock[0].content },
              { id: 3, content: "이 부분을 자세히 들어보시겠어요?" },
            ]
          : [
              { id: 0, content: `질문 ${input}에 대한 답을 찾을 수 없어요.` },
              { id: 1, content: "다른 검색어로 다시 시도해보시겠어요?" },
            ],
        onClose: () => setDialogOpen(false),
        onConfirm: ansBlock[0]
          ? () => {
              onPlayText(Number.parseFloat(ansBlock[0].start, 10));
              setDialogOpen(false);
            }
          : undefined,
      });

      setDialogOpen(true);
    });
  };

  const nextBookmark = () => {
    if (allBookmarks >= allBookmarks.length) return undefined;
    if (currBookmark === undefined) {
      return 0;
    }

    return currBookmark + 1;
  };

  const prevBookmark = () => {
    if (currBookmark >= allBookmarks.length) {
      return allBookmarks.length - 1;
    }
    if (currBookmark === 0 || allBookmarks.length === 0) {
      return undefined;
    }

    return currBookmark - 1;
  };

  const onForward = () => {
    const next = nextBookmark();
    setCurrBookmark(next);
  };

  const onBackward = () => {
    const prev = prevBookmark();
    setCurrBookmark(prev);
  };

  const withHelp = (rest, msg) => (
    <Tooltip
      arrow
      title={msg}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      PopperProps={{
        disablePortal: true,
      }}
      open={openHelp}
      onClick={() => setOpenHelp(false)}
      onClose={() => setOpenHelp(false)}
      onOpen={() => setOpenHelp(true)}
    >
      {rest}
    </Tooltip>
  );

  return (
    <>
      <Grid
        container
        alignItems="center"
        spacing={0}
        direction="row"
        className={classes.topElements}
        style={{ border: "1px solid" }}
      >
        {/* 돌아가기 */}
        {withHelp(
          <Grid item lg={1}>
            <Button onClick={() => onBack()} startIcon={<ArrowBack />}>
              돌아가기
            </Button>
          </Grid>,
          "재생을 종료하고 돌아갑니다."
        )}
        {/* 북마크 탐색 */}
        {allBookmarks.length === 0 ? (
          <Grid item lg={3}>
            <Typography variant="caption">
              북마크가 없습니다. 텍스트를 클릭해 북마크를 추가해 보세요!
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item lg={1}>
              <Button
                disabled={currBookmark === undefined || currBookmark < 0}
                onClick={() => onBackward()}
                endIcon={<ArrowBackIos />}
              >
                {currBookmark === 0 || currBookmark >= allBookmarks.length
                  ? "끝내기"
                  : "이전 북마크"}
              </Button>
            </Grid>
            <Grid item lg={1}>
              <Button
                disabled={currBookmark >= allBookmarks.length - 1}
                onClick={() => onForward()}
                startIcon={<ArrowForwardIos />}
              >
                {currBookmark === undefined ? "북마크 보기" : "다음 북마크"}
              </Button>
            </Grid>
            <Grid item lg={1} />
          </>
        )}
        <Grid item lg={1}>
          <Tooltip
            title={`도움말을 ${
              openHelp ? "숨기려면 다시 " : "보려면"
            } 클릭하세요.`}
          >
            <Button
              onClick={() => {
                setOpenHelp(!openHelp);
              }}
              startIcon={<Help fontSize="large" />}
              size="40"
            />
          </Tooltip>
        </Grid>
        <Grid item lg={1} />
        {/* 재생 속도 */}
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
              <MenuItem value={0.8}>0.8배속</MenuItem>
              <MenuItem defaultChecked value={1}>
                1배속
              </MenuItem>
              <MenuItem value={1.2}>1.2배속</MenuItem>
              <MenuItem value={1.2}>1.2배속</MenuItem>
              <MenuItem value={1.5}>1.5배속</MenuItem>
              <MenuItem value={1.8}>1.8배속</MenuItem>
              <MenuItem value={2.0}>2.0배속</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={1} />
        {/* 요약 */}
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
              onClick={(e) => changeNumCompress(e)}
            >
              <MenuItem value={3}> 3줄 </MenuItem>
              <MenuItem value={5}> 5줄 </MenuItem>
              <MenuItem value={7}> 7줄 </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={1} />
        {/* 메모 & 태그 업데이트 */}
        <Grid item lg={2} style={{ float: "right" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              onMemoUpdate();
              onTagUpdate();
            }}
          >
            메모 & 태그 업데이트
          </Button>
        </Grid>
      </Grid>
      {/* 메시지 블록  */}
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={0}
        style={{ border: "1px solid" }}
      >
        <Grid item xs={8} className={classes.middleElements}>
          {data.recordById?.content.map((e, i) => (
            <div key={e.id} ref={bookmarkRefs[i]}>
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
                      reliability={e.reliability}
                      isModified={e.isModified}
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
                          <Button onClick={() => onEditTextBlock(e)}>
                            확인
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Popover>
                  </>
                )}
              </PopupState>
            </div>
          ))}
        </Grid>
        {/* 메모, 태그 */}
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
      {/* 질문  */}
      <Grid container justify="center" alignItems="center" spacing={0}>
        {withHelp(
          <Grid item lg={12}>
            <MessageInput
              style={{ width: "100vw" }}
              attachButton={false}
              placeholder="녹음에서 찾고 싶은 내용을 입력해 보세요."
              onSend={(e) => handleQuestion(e)}
            />
          </Grid>,
          "입력이 일치하지 않아도 가장 비슷한 답을 찾아 보여줍니다."
        )}
      </Grid>
      {/* Dialog  */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle id="alert-dialog-title">{dialogContent.title}</DialogTitle>
        <DialogContent>
          {dialogContent.contents.map((e) => (
            <DialogContentText key={e.id}> {e.content} </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dialogContent.onClose()} color="primary">
            닫기
          </Button>
          {dialogContent && dialogContent.onConfirm ? (
            <Button onClick={() => dialogContent.onConfirm()} color="primary">
              들으러 가기
            </Button>
          ) : (
            false
          )}
        </DialogActions>
      </Dialog>
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
