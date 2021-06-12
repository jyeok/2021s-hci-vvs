import React from "react";
import propTypes from "prop-types";

import { Backdrop, CircularProgress, Typography, Box } from "@material-ui/core";
import { ErrorOutline } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    backgroundColor: "#000",
  },
  backdrop_transparent: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Loading = (props) => {
  const classes = useStyles();

  const { message, transparent, error } = props;

  return (
    <Backdrop
      className={transparent ? classes.backdrop_transparent : classes.backdrop}
      open
    >
      <Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "5%",
          }}
        >
          {error ? (
            <ErrorOutline style={{ fontSize: 40 }} />
          ) : (
            <CircularProgress color="inherit" />
          )}
        </div>

        <Typography variant="h5" gutterBottom>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

Loading.propTypes = {
  message: propTypes.string,
  transparent: propTypes.bool,
  error: propTypes.bool,
};

Loading.defaultProps = {
  message: "",
  transparent: false,
  error: false,
};

export default Loading;
