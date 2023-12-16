import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

const DefaultDialog = (props) => {
  const [open, setOpen] = useState(props.toOpen);

  useEffect(() => {
    setOpen(props.toOpen);
  }, [props.toOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  DefaultDialog.propTypes = {
    toOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    contentText: PropTypes.string.isRequired
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DefaultDialog;