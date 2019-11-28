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
  Typography,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { QuestionAnswer, Edit, Done, AddCircleOutline } from '@material-ui/icons';
import axios from 'axios'
import clsx from 'clsx';

import i18next from 'i18n'
import { str, collectErrors, createFormData } from 'helpers';
import { logout } from "redux/actions/sessionActions";
import TitleBar from "pages/components/TitleBar";
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";
import env from 'environment';


const useStyles = makeStyles(theme => ({
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
  cell_small: {
    width: 60,
    margin: 0,
    padding: 5,
  },
  cell_tools: {
    width: 40,
    margin: 0,
    padding: '5px !important',
  },
  border_dashed: {
    borderBottomStyle: 'dashed',
  },
  cell_choices: {
    margin: 0,
    padding: '5px !important',
  },
  choice_label: {
    width: 150,
    marginLeft: 5,
  },
  choice_value: {
    width: 40,
    marginLeft: 5,
  },
}));

const QuestionChoices = props => {
  const { question, question_choices, handleChoiceChange, onChoiceNew, index } = props;
  const classes = useStyles();

  if(question.edit) {
    return (
      <TableRow className={classes.row_choice} >
        <TableCell colspan="4" className={classes.cell_choices}>
          {
            question_choices.map((choice, i) => (
              <React.Fragment>
                <FormControl>
                  <TextField
                    name="label"
                    label={i18next.attr('question_choice', 'label')}
                    autoComplete="off"
                    defaultValue=""
                    value={str(choice.label)}
                    onChange={handleChoiceChange(index, i)}
                    // error={errors.content}
                    className={classes.choice_label}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    name="value"
                    type="number"
                    label={i18next.attr('question_choice', 'value')}
                    autoComplete="off"
                    defaultValue=""
                    value={str(choice.value)}
                    onChange={handleChoiceChange(index, i)}
                    // error={errors.content}
                    className={classes.choice_value}
                  />
                </FormControl>
              </React.Fragment>
            ))
          }
        </TableCell>
        <TableCell className={classes.cell_tools}>
          <IconButton size="small" onClick={onChoiceNew(index)} >
            <AddCircleOutline fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className={classes.row_choice} >
      <TableCell colspan="5" className={classes.cell_choices}>
        <Grid container spacing={6} >
          <Grid item>
            <Typography>
              { i18next.model('question_choice') }:
            </Typography>
          </Grid>
          {
            question_choices.map((choice, i) => (
              <Grid item>
                <Typography>
                  { choice.label }({ choice.value }) &nbsp;
                </Typography>
              </Grid>
            ))
          }
        </Grid>
      </TableCell>
    </TableRow>
  );
};


const Question = props => {
  const { question, errors, onEdit, onSave, handleChange, handleChoiceChange, onChoiceNew, index } = props;
  const classes = useStyles();
  const answer_types = i18next.data_list('enum', 'question', 'answer_type');
  const question_choices = question.question_choices_attributes || [];
  const is_num = question.answer_type == 'number';
  const class_cell = is_num ? classes.border_dashed : {};

  if(question.edit) {
    return (
      <React.Fragment>
        <TableRow key={question.id} >
          <TableCell className={clsx(classes.content, class_cell)}>
            <FormControl fullWidth>
              <TextField
                name="content"
                label={ i18next.attr('question', 'content') }
                autoComplete="off"
                defaultValue=""
                value={ str(question.content) }
                onChange={handleChange(index)}
                error={errors.content}
                fullWidth
              />
            </FormControl>
          </TableCell>
          <TableCell className={clsx(classes.answer_type, class_cell)} >
            <FormControl className={classes.control} >
              <InputLabel htmlFor="answer_type">{ i18next.attr('question', 'answer_type') }</InputLabel>
              <Select
                value={ question.answer_type }
                name="answer_type"
                onChange={handleChange(index)}
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
          <TableCell className={clsx(classes.cell_small, class_cell)}>
            <FormControl fullWidth>
              <TextField
                name="min_answer_size"
                type="number"
                label={ i18next.attr('question', 'min_answer_size') }
                autoComplete="off"
                defaultValue=""
                value={ question.min_answer_size }
                onChange={handleChange(index)}
                error={errors.min_answer_size}
                fullWidth
              />
            </FormControl>
          </TableCell>
          <TableCell className={clsx(classes.cell_small, class_cell)}>
            <FormControl fullWidth>
              <TextField
                name="max_answer_size"
                type="number"
                label={ i18next.attr('question', 'max_answer_size') }
                autoComplete="off"
                defaultValue=""
                value={ question.max_answer_size }
                onChange={handleChange(index)}
                error={errors.max_answer_size}
                fullWidth
              />
            </FormControl>
          </TableCell>
          <TableCell className={clsx(classes.cell_tools, class_cell)}>
            <IconButton size="small" onClick={onSave(index)} >
              <Done fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
        {
          is_num ? (
            <QuestionChoices
              question={question}
              question_choices={question_choices}
              index={index}
              handleChoiceChange={handleChoiceChange}
              onChoiceNew={onChoiceNew}
            />
          ) : null
        }
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <TableRow key={question.id} >
        <TableCell  className={clsx(classes.content, class_cell)} >
          {question.content}
        </TableCell>
        <TableCell className={clsx(classes.answer_type, class_cell)}>
          {question.answer_type ? i18next.enum('question', 'answer_type', question.answer_type) : ''}
        </TableCell>
        <TableCell className={clsx(classes.cell_small, class_cell)}>
          {question.min_answer_size}
        </TableCell>
        <TableCell className={clsx(classes.cell_small, class_cell)}>
          {question.max_answer_size}
        </TableCell>
        <TableCell className={clsx(classes.cell_tools, class_cell)}>
          <IconButton size="small" onClick={onEdit(index)} >
            <Edit fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      {
        is_num ? (
          <QuestionChoices
            question={question}
            question_choices={question_choices}
            index={index}
            handleChoiceChange={handleChoiceChange}
            onChoiceNew={onChoiceNew}
          />
        ) : null
      }
    </React.Fragment>
    );
};

const QuestionAll = props => {
  const { dispatch, session, history } = props;
  const [question_type, setQuestionType] = useState('compatibility');
  const [questions, setQuestions] = useState([]);
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

  const onQuestionSave = i => () => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let question = questions[i];

      let url = env.API_ORIGIN + 'api/questions/';
      if (question.id) url += question.id;

      let promise;
      if (question.id) {
        promise = axios.patch(url, {question}, {headers});
      } else {
        promise = axios.post(url, {question}, {headers});
      }
      promise
      .then((results) => {
        let questions2 = Array.from(questions);
        questions2[i] = results.data.question;
        setQuestions(questions2);
        setErrors({});
      })
      .catch((data) => {
        setErrors(collectErrors(data.response, 'question'));
        setErrorIndex(i);
      });
    }
  };

  const handleSearchChange = event => {
    setQuestionType(event.target.value);
  };

  const onQuestionEdit = i => () => {
    let questions2 = Array.from(questions);
    let q = questions2[i];
    q.edit = !q.edit;
    setQuestions(questions2);
  };

  const onQuestionNew = () => {
    const q = { question_type: question_type,
                answer_type: 'number',
                min_answer_size: 1,
                max_answer_size: 1,
                question_choices_attributes: [],
                edit: true　};
    let questions2 = questions.concat(q);
    setQuestions(questions2);
  };

  const onQuestionChoiceNew = i => () => {
    let questions2 = Array.from(questions);
    let choices = questions2[i].question_choices_attributes || [];
    choices.push({value: choices.length + 1});
    questions2[i].question_choices_attributes = choices;
    setQuestions(questions2);
  };

  const handleChoiceChange = (i, j) => event => {
    let questions2 = Array.from(questions);
    let choice = questions2[i].question_choices_attributes[j];
    choice[event.target.name] = event.target.value;
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

      <TitleBar title={title} icon={ <QuestionAnswer /> } variant="dense" />
      <Box px={5} py={2} >
        <Grid container spacing={6} >
          <Grid item>
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
          </Grid>
          <Grid item xs />
          <Grid item>
            <Tooltip title={i18next.t('views.question.add_question')}>
              <IconButton size="small" onClick={onQuestionNew} >
                <AddCircleOutline fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Paper className={classes.paper} >
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableBody>
              {
                questions.map((q, i) => (
                  <Question
                    question={q}
                    index={i}
                    errors={(+error_index == i) ? errors : {}}
                    onEdit={onQuestionEdit}
                    onSave={onQuestionSave}
                    onChoiceNew={onQuestionChoiceNew}
                    handleChoiceChange={handleChoiceChange}
                    handleChange={handleChange}
                  />
                  )
                )
              }
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(QuestionAll));
