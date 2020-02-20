import React from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input,
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import i18next from 'src/i18n'
import { str, full_name, age } from 'src/helpers';


const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 10,
    marginBottom: 10,
  },
  list_text: {
    paddingLeft: 5,
  },
  text_half: {
    paddingLeft: 5,
    width: '30%',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
}));

const UserSelf = props => {
  const { user, errors, OnChange } = props;
  const classes = useStyles();
  const user_age = age(user.birthday) || user.age;
  const prefecture = user.prefecture ? i18next.t('prefecture.' + user.prefecture): '';
  const address = prefecture + str(user.city) + str(user.street) + str(user.building);
  const statuses = i18next.data_list('enum', 'user', 'status');

  return (
    <React.Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardHeader
                title={ i18next.t('views.user.basic') }
            />
            <Grid container justify = "center">
              <Box m={3}>
                <Avatar
                    alt={ str(user.code) }
                    src={ user.avatar_url }
                    style={ {width: 160, height: 160, margin: 10} }
                />
              </Box>
            </Grid>

            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'status') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ statuses[user.status] }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'name') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ full_name(user.first_name, user.last_name, user.lang) }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'kana') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ full_name(user.first_name_kana, user.last_name_kana, user.lang) }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'code') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.code }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'sex') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.sex ? i18next.enum('user', 'sex', user.sex) : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'age') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user_age ? user_age + i18next.t('views.app.age_year') : null }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'marital_status') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.marital_status ? i18next.enum('user', 'marital_status', user.marital_status) : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'email') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.email }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'birthday') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.birthday }
                  className={classes.list_text}
                />
              </ListItem>
            </List>

            <CardContent>
              <FormControl fullWidth>
                <InputLabel htmlFor="lang">{ i18next.attr('user', 'lang') }</InputLabel>
                <Select
                  value={ str(user.lang) }
                  onChange={OnChange}
                  inputProps={{
                    name: "lang",
                    id: "user_lang"
                  }}
                  error={!!errors.lang}
                  fullWidth
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value='en'>{ i18next.t('lang.en') }</MenuItem>
                  <MenuItem value='ja'>{ i18next.t('lang.ja') }</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="password">{ i18next.attr('user', 'password') }</InputLabel>
                <Input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={ str(user.password) }
                  onChange={OnChange}
                  error={!!errors.password}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="password_confirmation">{ i18next.attr('user', 'password_confirmation') }</InputLabel>
                <Input
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={ str(user.password_confirmation) }
                  onChange={OnChange}
                  error={!!errors.password_confirmation}
                />
              </FormControl>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardHeader
              title={ i18next.t('views.user.location') }
            />
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'country') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.country ? i18next.t('country.' + user.country) :null }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'zip') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.zip }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.t('views.user.address') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ address }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'tel') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.tel }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'mobile') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.mobile }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'fax') }
                    className={classes.list_text}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.fax }
                  className={classes.list_text}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardHeader
              title={ i18next.t('views.user.comment') }
            />
            <CardContent>
              <FormControl fullWidth>
                <TextField
                  name="bio"
                  label={ i18next.attr('user', 'bio') }
                  autoComplete="off"
                  multiline
                  rows="5"
                  rowsMax="10"
                  value={ str(user.bio) }
                  onChange={OnChange}
                  variant="outlined"
                  margin="normal"
                  error={!!errors.bio}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  name="remark_self"
                  label={ i18next.attr('user', 'remark_self') }
                  autoComplete="off"
                  multiline
                  rows="20"
                  rowsMax="50"
                  value={ str(user.remark_self) }
                  onChange={OnChange}
                  variant="outlined"
                  margin="normal"
                  error={!!errors.remark_self}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  name="remark_matchmaker"
                  label={ i18next.attr('user', 'remark_matchmaker') }
                  autoComplete="off"
                  multiline
                  rows="20"
                  rowsMax="50"
                  value={ str(user.remark_matchmaker) }
                  onChange={OnChange}
                  variant="outlined"
                  margin="normal"
                  disabled
                  error={!!errors.remark_matchmaker}
                />
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default UserSelf;
