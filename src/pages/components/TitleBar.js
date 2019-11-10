import {AppBar, Box, Grid, Tab, Tabs, Toolbar, Typography} from "@material-ui/core";
import React from "react";


const TitleBar = props => {
  const {title, icon, children} = props;

return (
  <AppBar position="static" color="inherit">
    <Grid container spacing={3}>
      <Grid item >
        <Toolbar variant="regular">
          <Box pt={2} px={4} >
            { icon }
          </Box>
          <Typography variant="h4">
            { title }
          </Typography>
          <Box pr={10} />
        </Toolbar>
      </Grid>
      <Grid item>
        <Box p={2}>
          { children }
        </Box>
      </Grid>
    </Grid>
  </AppBar>
  );
};

export default TitleBar;
