import React from "react";
import { PropTypes } from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";

const PopupDialog = (prop) => {
  const { content, title, open, handleClose } = prop;
  return open ? (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="dialogTitle" open={open}>
        <DialogTitle id="dialogTitle" onClose={handleClose}>
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    false
  );
};

export default PopupDialog;

PopupDialog.PropType = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
