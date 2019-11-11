import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Box } from "@material-ui/core";
import { Settings } from "react-feather";

import i18next from 'i18n'
import TitleBar from "pages/components/TitleBar";
import UserProfile from "./UserProfile";


const MyProfile = props => {
  const { session } = props;
  const title = i18next.t('views.user.account');
  const user_id = session.user.id;

  return (
    <React.Fragment>
      <TitleBar title={title} icon={<Settings />} />
      <Box p={6}>
        <UserProfile user_id={user_id} open />
      </Box>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(MyProfile));
