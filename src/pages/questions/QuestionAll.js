import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Paper,
  makeStyles, AppBar, Toolbar, Button,
} from "@material-ui/core";
import { QuestionAnswer, Edit, Done } from '@material-ui/icons';
import axios from 'axios'

import i18next from 'i18n'
import { str, collectErrors, createFormCollectionData } from 'helpers';
import { logout } from "redux/actions/sessionActions";
import TitleBar from "pages/components/TitleBar";
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";
import env from 'environment';


const useStyles = makeStyles(theme => ({
  grid: {
    margin: 0,
    padding: 0,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  media: {
    width: '100%',
    height: 200
  },
  paper: {
    marginTop: 15,
  },
  content: {
    width: 'auto',
    margin: 0,
    padding: 5,
  },
  answer_type: {
    width: 80,
    margin: 0,
    padding: 5,
  },
  small: {
    width: 60,
    margin: 0,
    padding: 5,
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

const Question = props => {
  const { question, errors, onEdit, handleChange } = props;
  const classes = useStyles();
  const answer_types = i18next.data_list('enum', 'question', 'answer_type');

  if(question.edit) {
    return (
      <TableRow key={question.id}>
        <TableCell className={classes.content}>
          <FormControl fullWidth>
            <TextField
              name="content"
              label={ i18next.attr('question', 'content') }
              autoComplete="off"
              defaultValue=""
              value={ str(question.content) }
              onChange={handleChange}
              error={errors.content}
              fullWidth
            />
          </FormControl>
        </TableCell>
        <TableCell className={classes.answer_type} >
          <FormControl className={classes.control} >
            <InputLabel htmlFor="answer_type">{ i18next.attr('question', 'answer_type') }</InputLabel>
            <Select
              value={ question.answer_type }
              name="answer_type"
              onChange={handleChange}
              inputProps={{
                name: "answer_type",
              }}
              style={{width: 90}}
              error={errors.answer_type}
              fullWidth
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              {
                Object.keys(answer_types).map(answer_type => <MenuItem value={answer_type}>{ answer_types[answer_type] }</MenuItem>)
              }
            </Select>
          </FormControl>
        </TableCell>
        <TableCell className={classes.small}>
          <FormControl fullWidth>
            <TextField
              name="min_answer_size"
              type="number"
              label={ i18next.attr('question', 'min_answer_size') }
              autoComplete="off"
              defaultValue=""
              value={ question.min_answer_size }
              onChange={handleChange}
              error={errors.min_answer_size}
              fullWidth
            />
          </FormControl>
        </TableCell>
        <TableCell className={classes.small}>
          <FormControl fullWidth>
            <TextField
              name="max_answer_size"
              type="number"
              label={ i18next.attr('question', 'max_answer_size') }
              autoComplete="off"
              defaultValue=""
              value={ question.max_answer_size }
              onChange={handleChange}
              error={errors.max_answer_size}
              fullWidth
            />
          </FormControl>
        </TableCell>
        <TableCell className={classes.small}>
          <IconButton size="small" onClick={onEdit} >
            <Done size="small" fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={question.id}>
      <TableCell className={classes.content}>
        {question.content}
      </TableCell>
      <TableCell className={classes.answer_type}>
        {question.answer_type ? i18next.enum('question', 'answer_type', question.answer_type) : ''}
      </TableCell>
      <TableCell className={classes.small}>
        {question.min_answer_size}
      </TableCell>
      <TableCell className={classes.small}>
        {question.max_answer_size}
      </TableCell>
      <TableCell className={classes.small}>
        <IconButton size="small" onClick={onEdit} >
          <Edit size="small" fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
    );
};

const QuestionAll = props => {
  const { dispatch, session, history } = props;
  const [question_type, setQuestionType] = useState('compatibility');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [error_index, setErrorIndex] = useState(null);
  const title = i18next.t('views.question.list');
  const classes = useStyles();
  const question_types = i18next.data_list('enum', 'question', 'question_type');

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/questions?question_type=' + question_type;
      axios.get(url, {headers})
        .then((results) => {
          setQuestions(results.data.questions);
        })
        .catch((data) => {
          alert('データの取得に失敗しました。');
        });
    }
    else {
      dispatch(logout());
      history.push('/auth/sign-in');
    }

  }, [session.headers, question_type]);

  const onSave = () => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/questions/save_collection';
      let question_params = createFormCollectionData(questions, 'question');
      axios.post(url, question_params, { headers })
      .then((results) => {
        clearEdit();
        setErrors([]);
        setMessage(i18next.t('views.app.save_done'));
      })
      .catch(({response}) => {
        setErrors(collectErrors(response, 'question'));
        setErrorIndex(+response.data.index);
      });
    }
  };

  const handleSearchChange = event => {
    setQuestionType(event.target.value);
  };

  const onEdit = i => () => {
    let questions2 = Array.from(questions);
    let q = questions2[i];
    q.edit = !q.edit;
    setQuestions(questions2);
  };

  const clearEdit = () => {
    let questions2 = Array.from(questions);
    for(const i in questions2) {
      questions2[i].edit = false;
    }
    setQuestions(questions2);
  };

  const handleChange = i => event => {
    let questions2 = Array.from(questions);
    let q = questions2[i];
    q[event.target.name] = event.target.value;
    setQuestions(questions2);
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={ Object.keys(errors).length > 0 }
        variant="error"
        message={
          Object.keys(errors).map(key => {
            return (
              <div>{errors[key]}</div>
            );
          })
        }
        onClose={() => setErrors({})}
      />
      <CustomizedSnackbar
        open={ message }
        variant="info"
        message={ message }
        onClose={() => setMessage(null)}
      />

      <TitleBar title={title} icon={ <QuestionAnswer /> } variant="dense" />
      <Box px={5} py={2} >
        <FormControl className={classes.control} style={{width: 150}} >
          <InputLabel htmlFor="question_type">{ i18next.attr('question', 'question_type') }</InputLabel>
          <Select
            value={ str(question_type) }
            name="question_type"
            onChange={handleSearchChange}
            inputProps={{
              name: "question_type",
            }}
            fullWidth
          >
            <MenuItem value="">
              <em></em>
            </MenuItem>
            {
              Object.keys(question_types).map(question_type => <MenuItem value={question_type}>{ question_types[question_type] }</MenuItem>)
            }
          </Select>
        </FormControl>
        <Paper className={classes.paper} >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableBody>
              {
                questions.map((q, i) => (
                  <Question
                    question={q}
                    errors={(+error_index == i) ? errors : {}}
                    onEdit={onEdit(i)}
                    handleChange={handleChange(i)}
                  />
                  )
                )
              }
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            <Grid item>
              <Button onClick={onSave} color="primary">
                { i18next.t('views.app.save') }
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(QuestionAll));
