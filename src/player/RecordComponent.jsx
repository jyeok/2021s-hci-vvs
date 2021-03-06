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

import { mutations, queries } from "api/gql/schema";
import { answerQuestion, TextRank } from "api/ai";

import { secondsToTime } from "recorder/Util";

import MessageHolder from "common/MessageHolder";
import Loading from "common/Loading";
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
    return <Loading message="?????? ????????? ??????????????????." transparent />;
  if (error) return <Loading message="????????? ??????????????????." error />;
  if (!data || !data.recordById || data.recordById.isLocked) {
    onBack("???????????? ?????? ???????????????.", "warning");
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
      title: `${currNumCompress}????????? ??????!`,
      contents: [
        { id: 0, content: `${currNumCompress}????????? ?????????...` },
        ...resultSplited,
        {
          id: resultSplited.length + 1,
          content:
            resultSplited.length - 1 === currNumCompress
              ? "???????????? ??? ????????? :)"
              : `????????? ${currNumCompress}??? ???????????????? ?????? ??? ??? ???????????? ????????? ?????????.`,
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
        enqueueSnackbar("????????? ?????????????????????.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("????????? ??????????????????! ?????? ????????? ?????????.", {
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
        enqueueSnackbar("????????? ?????????????????????.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("????????? ??????????????????! ?????? ????????? ?????????.", {
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
        enqueueSnackbar("????????? ????????? ?????????????????????.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("????????? ??????????????????! ?????? ????????? ?????????.", {
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
      enqueueSnackbar("????????? ??????????????????! ?????? ????????? ?????????.", {
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
      enqueueSnackbar("????????? ??????????????????! ?????? ????????? ?????????.", {
        variant: "error",
      });
    });
  };

  const handleSpeed = (e) => {
    audioRef.current.audio.current.playbackRate = e.target.value;
  };

  const handleQuestion = async (input) => {
    answerQuestion(contentsConcat, input).then((result) => {
      const ans = result ? result.split("\n")[0] : undefined;
      const ansBlock = data.recordById.content.filter(
        (x) => x.content.indexOf(ans) !== -1
      );

      setDialogContent({
        title: `??????: "${input}"??? ??????!`,
        contents: ansBlock[0]
          ? [
              { id: 0, content: `?????? ${input}??? ?????? ?????? ???????????????.` },
              { id: 1, content: `???: ${ans}` },
              { id: 2, content: ansBlock[0].content },
              { id: 3, content: "??? ????????? ????????? ??????????????????????" },
            ]
          : [
              { id: 0, content: `?????? ${input}??? ?????? ?????? ?????? ??? ?????????.` },
              { id: 1, content: "?????? ???????????? ?????? ?????????????????????????" },
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
        {/* ???????????? */}
        {withHelp(
          <Grid item lg={1}>
            <Button onClick={() => onBack()} startIcon={<ArrowBack />}>
              ????????????
            </Button>
          </Grid>,
          "????????? ???????????? ???????????????."
        )}
        {/* ????????? ?????? */}
        {allBookmarks.length === 0 ? (
          <Grid item lg={3}>
            <Typography variant="caption">
              ???????????? ????????????. ???????????? ????????? ???????????? ????????? ?????????!
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
                  ? "?????????"
                  : "?????? ?????????"}
              </Button>
            </Grid>
            <Grid item lg={1}>
              <Button
                disabled={currBookmark >= allBookmarks.length - 1}
                onClick={() => onForward()}
                startIcon={<ArrowForwardIos />}
              >
                {currBookmark === undefined ? "????????? ??????" : "?????? ?????????"}
              </Button>
            </Grid>
            <Grid item lg={1} />
          </>
        )}
        <Grid item lg={1}>
          <Tooltip
            title={`???????????? ${
              openHelp ? "???????????? ?????? " : "?????????"
            } ???????????????.`}
          >
            <Button
              onClick={() => {
                setOpenHelp(!openHelp);
              }}
              startIcon={<Help fontSize="large" />}
              size="large"
            />
          </Tooltip>
        </Grid>
        <Grid item lg={1} />
        {/* ?????? ?????? */}
        <Grid item lg={1}>
          <FormControl className={classes.formControl}>
            <InputLabel variant="filled" color="primary" id="playSpeed">
              ?????? ??????
            </InputLabel>
            <Select
              labelId="playSpeed"
              onChange={(e) => handleSpeed(e)}
              defaultValue={1}
            >
              <MenuItem value={0.8}>0.8??????</MenuItem>
              <MenuItem defaultChecked value={1}>
                1??????
              </MenuItem>
              <MenuItem value={1.2}>1.2??????</MenuItem>
              <MenuItem value={1.2}>1.2??????</MenuItem>
              <MenuItem value={1.5}>1.5??????</MenuItem>
              <MenuItem value={1.8}>1.8??????</MenuItem>
              <MenuItem value={2.0}>2.0??????</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={1} />
        {/* ?????? */}
        <Grid item lg={1}>
          <FormControl className={classes.formControl}>
            <InputLabel variant="filled" color="primary" id="numCompress">
              N??? ??????
            </InputLabel>
            <Select
              labelId="numCompress"
              value={numCompress}
              open={openCompress}
              onOpen={() => setOpenCompress(true)}
              onClose={() => setOpenCompress(false)}
              onClick={(e) => changeNumCompress(e)}
            >
              <MenuItem value={3}> 3??? </MenuItem>
              <MenuItem value={5}> 5??? </MenuItem>
              <MenuItem value={7}> 7??? </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={1} />
        {/* ?????? & ?????? ???????????? */}
        <Grid item lg={2} style={{ float: "right" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              onMemoUpdate();
              onTagUpdate();
            }}
          >
            ?????? & ?????? ????????????
          </Button>
        </Grid>
      </Grid>
      {/* ????????? ??????  */}
      <Grid
        container
        justifyContent="center"
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
                        ??? ?????? ??????
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.popupButtons}
                        onClick={() => onEditOpen(e)}
                      >
                        ????????? ??????
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.popupButtons}
                        onClick={() => onToggleLocation(e)}
                      >
                        {e.isMine ? "????????? ?????? ??????" : "??? ?????? ??????"}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: "3px" }}
                        onClick={() => onAddBookmark(e)}
                      >
                        {e.isHighlighted ? "????????? ??????" : "????????? ??????"}
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
                            label="????????? ????????? ??????"
                            value={editText}
                            fullWidth
                            onChange={(event) => {
                              setEditText(event.target.value);
                            }}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => onEditClose()}>??????</Button>
                          <Button onClick={() => onEditTextBlock(e)}>
                            ??????
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
        {/* ??????, ?????? */}
        <Grid
          item
          xs={4}
          className={classes.middleElements}
          style={{ borderLeft: "1px solid" }}
        >
          <TextField
            label="??????"
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
            label="??????"
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
      {/* ??????  */}
      <Grid container justifyContent="center" alignItems="center" spacing={0}>
        {withHelp(
          <Grid item lg={12}>
            <MessageInput
              style={{ width: "100vw" }}
              attachButton={false}
              placeholder="???????????? ?????? ?????? ????????? ????????? ?????????."
              onSend={(e) => handleQuestion(e)}
            />
          </Grid>,
          "????????? ???????????? ????????? ?????? ????????? ?????? ?????? ???????????????."
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
            ??????
          </Button>
          {dialogContent && dialogContent.onConfirm ? (
            <Button onClick={() => dialogContent.onConfirm()} color="primary">
              ????????? ??????
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
