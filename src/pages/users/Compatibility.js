import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Paper,
  Toolbar,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import axios from 'axios';
import clsx from 'clsx';

import env from 'src/environment';
import i18next from 'src/i18n'
import { str } from 'src/helpers';
import AppContext from 'src/contexts/AppContext';


const useStyles = makeStyles(theme => ({
  right: {
    margin: 0,
    padding: '5px 10px',
    textAlign: 'left',
    width: 'auto',
  },
  left: {
    margin: 0,
    padding: '5px 10px',
    textAlign: 'right',
    width: 'auto',
  },
  center: {
    textAlign: 'center',
  },
  gap: {
    width: 100,
    padding: '5px 10px',
    borderRight: '1px solid lightgray',
    borderLeft: '1px solid lightgray',
    textAlign: 'center',
  },
  compatibility: {
    width: 500,
  },
  family_relationship: {
    width: 500,
  },
  precious_comparison: {
    width: 200,
  },
  religion_value: {
    width: 400,
  },
  question: {
    padding: '5px 10px',
    borderRight: '1px solid lightgray',
    borderLeft: '1px solid lightgray',
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

const AvatarRow = props => {
  const {user, partner} = props;
  const classes = useStyles();

  return (
    <TableRow key='avatar'>
      <TableCell className={classes.left}>
        <Grid container justify = "center">
          <Avatar
            alt={ str(user.nickname) }
            src={ user.avatar_url }
            style={ {width: 100, height: 100, margin: 10} }
          />
        </Grid>
        <Grid container justify = "center">
          { user.nickname }
        </Grid>
      </TableCell>
      <TableCell></TableCell>
      <TableCell className={classes.left}>
        <Grid container justify = "center">
          <Avatar
            alt={ str(partner.nickname) }
            src={ partner.avatar_url }
            style={ {width: 100, height: 100, margin: 10} }
          />
        </Grid>
        <Grid container justify = "center">
          { partner.nickname }
        </Grid>
      </TableCell>
    </TableRow>
  );
};

const QuestionItem = props => {
  const {user, partner, question} = props;
  const classes = useStyles();

  const choices = question.question_choices_attributes;
  const values = question.answer_values_attributes;
  const notes = question.answer_notes_attributes;
  const labels = choices ? choices.reduce((obj,choice) => {
                             obj[choice.value] = choice.label;
                             return obj;
                           }, {}) : null;
  const value_labels = values ? values.reduce((arr,value) => {
                                  if(value.user_id === user.id)          arr[0].push(labels[value.value]);
                                  else if(value.user_id === partner.id)  arr[1].push(labels[value.value]);
                                  return arr;
                                }, [[], []]) : null;
  const note_labels = notes ? notes.reduce((arr,note) => {
                                if(note.user_id === user.id)           arr[0].push(note.note);
                                else if(note.user_id === partner.id)  arr[1].push(note.note);
                                return arr;
                              }, [[], []]) : null;

  console.log(labels);

  return (
    <TableRow key={question.id}>
      <TableCell className={classes.left}>
        { value_labels ? value_labels[0].map(label => <Typography>{ label }</Typography>) : null }
        { note_labels ? note_labels[0].map(label => <Typography>{ label }</Typography>) : null }
      </TableCell>
      <TableCell className={clsx(classes[question.question_type], classes.question)}>{ str(question.content) }</TableCell>
      <TableCell className={classes.right}>
        { value_labels ? value_labels[1].map(label => <Typography>{ label }</Typography>) : null }
        { note_labels ? note_labels[1].map(label => <Typography>{ label }</Typography>) : null }
      </TableCell>
    </TableRow>
  );
};

const QuestionCompatibility = props => {
  const {user, partner, questions} = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableBody>
          <AvatarRow user={user} partner={partner} />
          {questions.map((question, i) => (
            <QuestionItem key={i} user={user} partner={partner} question={question} />
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

const ProfileCompatibility = props => {
  const {user, partner} = props;
  const classes = useStyles();
  const columns = [
    [i18next.attr('user', 'age'), (u => i18next.age(u.age))],
    [i18next.attr('user', 'prefecture'), (u => (u.prefecture ? i18next.t('prefecture.' + u.prefecture) : ''))],
    [i18next.attr('user', 'marital_status'), (u => (u.marital_status ? i18next.enum('user', 'marital_status', u.marital_status) : ''))],
    [i18next.attr('user', 'blood'), (u => (u.blood ? i18next.enum('user', 'blood', u.blood) : ''))],
    [i18next.attr('user', 'height'), (u => (u.height ? str(u.height) + 'cm' : null))],
    [i18next.attr('user', 'drinking'), (u => (u.drinking ? i18next.enum('user', 'drinking', u.drinking) : ''))],
    [i18next.attr('user', 'smoking'), (u => (u.smoking ? i18next.enum('user', 'smoking', u.smoking) : ''))],
    [i18next.t('views.user.sickness'), (u => (u.diseased ? u.disease_name : null))],
    [i18next.t('views.user.religion'), (u => u.religion ? str(i18next.enum('user', 'religion', u.religion)) : null)],
    [i18next.attr('user', 'job'), (u => u.job)],
    [i18next.attr('user', 'education'), (u => u.education)],
    [i18next.attr('user', 'hobby'), (u => u.hobby)],
  ];

  return (
    <React.Fragment>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableBody>
          <AvatarRow user={user} partner={partner} />
          {columns.map(column => (
            <TableRow key={column[0]}>
              <TableCell className={classes.left}>{ column[1](user) }</TableCell>
              <TableCell className={classes.gap}>{ column[0] }</TableCell>
              <TableCell className={classes.right}>{ column[1](partner) }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

const Compatibility = props => {
  const {state: {session}} = useContext(AppContext);
  const { user, onClose, partner_id } = props;
  const [partner, setPartner] = React.useState({});
  const [question_type, setQuestionType] = useState('profile');
  const [questions, setQuestions] = useState([[], []]);
  const question_types = i18next.data_list('enum', 'question', 'question_type');
  const classes = useStyles();

  useEffect(() => {
    if(partner_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + partner_id;
        axios.get(url, {headers})
          .then((results) => {
            const data = results.data;
            setPartner(data.user);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  }, [partner_id, session.headers]);

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      if(question_type !== 'profile') {
        const url = env.API_ORIGIN + `api/questions?question_type=${question_type}&answer=true&user_id=${user.id},${partner.id}`;
        axios.get(url, {headers})
          .then((results) => {
            setQuestions(results.data.questions);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
    else {
      alert(i18next.t('errors.app.occurred'));
    }

  }, [session.headers, question_type, user.id, partner.id]);

  const changeQuestionType = event => {
    setQuestionType(event.target.value);
  };

  return (
    <React.Fragment>
      <Paper>
        <FormControl className={classes.control} style={{width: 150}} >
          <Select
            value={ str(question_type) }
            name="question_type"
            onChange={changeQuestionType}
            inputProps={{
              name: "question_type",
            }}
            fullWidth
          >
            <MenuItem value="profile">
              { i18next.t('views.user.profile') }
            </MenuItem>
            {
              Object.keys(question_types).map((question_type, i) => (
                <MenuItem key={i} value={question_type}>{ question_types[question_type] }</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        { question_type === 'profile' ? (
            <ProfileCompatibility
              user={user}
              partner={partner}
            />
            ) : (
            <QuestionCompatibility
              user={user}
              partner={partner}
              questions={questions}
            />
          )
        }

      </Paper>
      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            {
              onClose ? (
                <Grid item>
                  <Button onClick={onClose} color="primary">
                    { i18next.t('views.app.back') }
                  </Button>
                </Grid>
              ) : null
            }
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withRouter(Compatibility);
