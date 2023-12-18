import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PropTypes from 'prop-types';

const DefaultDialog = (props) => {

  const handleClose = () => {
    if (props.handleOkButton) {
      props.setOpenDialogFalse();
      props.handleOkButton();
    } else {
      props.setOpenDialogFalse();
    }
  };

  DefaultDialog.propTypes = {
    toOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    contentText: PropTypes.string.isRequired,
    setOpenDialogFalse: PropTypes.func.isRequired,
    handleOkButton: PropTypes.func
  };

  return (
    <Dialog
      open={props.toOpen}
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