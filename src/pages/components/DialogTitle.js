import React from "react";
import {Box, withStyles} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MaximizeIcon from '@material-ui/icons/Maximize';
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(4),
  },
  closeButton: {
    top: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, onResize, fullScreen, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      <Box display="flex">
        <Box flexGrow={1}>
          {children}
        </Box>
        <Box>
          <IconButton size="small" aria-label="resize" onClick={onResize} className={classes.closeButton} >
            { fullScreen ? <MinimizeIcon fontSize="small" /> : <MaximizeIcon fontSize="small" /> }
          </IconButton>
          <IconButton size="small" aria-label="close" onClick={onClose} className={classes.closeButton} >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </MuiDialogTitle>
  );
});

export default DialogTitle;
