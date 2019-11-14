import React from "react";
import {Grid, Divider, Box, makeStyles, Toolbar} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MaximizeIcon from '@material-ui/icons/Maximize';
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: 0,
  },
  item_title: {
    padding: theme.spacing(4),
  },
  item_child: {
    padding: theme.spacing(1),
  },
  item_button: {
    padding: theme.spacing(3),
  },
  closeButton: {
    top: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
}));

const DialogTitle = props => {
  const { title, icon, children, onClose, onResize, fullScreen, ...other } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <MuiDialogTitle className={classes.root} {...other} >
        <Grid container spacing={3} >
          <Grid item>
            <Box className={classes.item_title} >
              { title }
            </Box>
          </Grid>
          <Grid item >
            <Box className={classes.item_child} >
              { children }
            </Box>
          </Grid>
          <Grid item xs />
          <Grid item>
            <Box className={classes.item_button} >
              { onResize ? (
                <IconButton size="small" aria-label="resize" onClick={onResize} className={classes.closeButton} >
                  { fullScreen ? <MinimizeIcon fontSize="small" /> : <MaximizeIcon fontSize="small" /> }
                </IconButton>
                ) : null
              }
              <IconButton size="small" aria-label="close" onClick={onClose} className={classes.closeButton} >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </MuiDialogTitle>
      <Divider />
    </React.Fragment>
  );
};

export default DialogTitle;
