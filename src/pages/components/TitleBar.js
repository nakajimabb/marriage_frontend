import React from "react";
import {
  AppBar,
  Box,
  Grid,
  Divider,
  Toolbar,
  Typography,
} from "@material-ui/core";


const TitleBar = props => {
  const {title, icon, children, variant, sub_menu} = props;

  return (
    <AppBar position="static" color="inherit">
      <Divider />
      <Grid container spacing={3}>
        <Grid item >
          <Toolbar variant={variant} >
            {
              icon ? (
                <Box pt={1} px={2} >
                  { icon }
                </Box>
              ) : null
            }
            <Box px={2} >
              <Typography variant="h5">
                { title }
              </Typography>
            </Box>
          </Toolbar>
        </Grid>
        <Grid item>
          { children }
        </Grid>
        <Grid item xs />
        <Grid item>
          { sub_menu }
        </Grid>
      </Grid>
      <Divider />
    </AppBar>
  );
};

export default TitleBar;
