import React, {useContext, useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import {
  AppBar,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  FormControlLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Radio,
  Checkbox,
  RadioGroup,
  FormGroup,
  TextField,
  Toolbar,
  makeStyles,
} from '@material-ui/core';
import axios from 'axios'

import env from 'src/environment';
import i18next from 'src/i18n'
import { str } from 'src/helpers';
import CustomizedSnackbar from 'src/pages/components/CustomizedSnackbar';
import AppContext from 'src/contexts/AppContext';


const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: 15,
  },
  question: {
    fontSize: '120%',
    width: 'auto',
    padding: 8,
    borderBottom: 'lightgray 1px dashed',
  },
  answer: {
    width: 'auto',
    padding: '0 20px',
    borderBottom: 'lightgray 1px solid',
  },
  radio: {
    padding: 0,
    margin: 0,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
  error: {
    fontSize: '50%',
    color: 'red',
  },
}));

const AnswerChoices = props => {
  const {question, question_choices, answer_choices, handleValueChange, index} = props;
  const classes = useStyles();
  const radio = ((question.min_answer_size === 1) && (question.max_answer_size === 1));
  const checked_values = answer_choices.filter(choice => !choice._destroy);

  if (radio) {
    const value = (answer_choices.length > 0) ? answer_choices[0].question_choice_id : null;
    return (
      <Grid key={question.id} className={classes.answer}>
        <FormControl component="fieldset">
          <RadioGroup name="values" value={+value} onChange={handleValueChange(index)} row>
            {
              question_choices.map((choice, i) => (
                  <FormControlLabel key={i} value={+choice.id} control={<Radio/>} label={choice.label}/>
                )
              )
            }
          </RadioGroup>
        </FormControl>
      </Grid>
    );
  }

  const values = checked_values.map(answer_choice => answer_choice.question_choice_id);
  return (
    <Grid key={question.id} className={classes.answer}>
      <FormControl component="fieldset">
        <FormGroup name="values" onChange={handleValueChange(index)} row>
          {
            question_choices.map((choice, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      value={choice.id}
                      checked={~values.indexOf(choice.id)}
                      onChange={handleValueChange(index)}
                    />
                  }
                  label={choice.label}
                  classes={classes.radio}/>
              )
            )
          }
        </FormGroup>
      </FormControl>
    </Grid>
  );
};

const AnswerNotes = props => {
  const {question, answer_notes, handleNoteChange, index} = props;
  const classes = useStyles();
  const answer_notes2 = (answer_notes.length > 0) ? answer_notes : [{question_id: question.id}];

  return (
    <Grid key={question.id} className={classes.answer}>
      <FormControl fullWidth>
        {
          answer_notes2.map((answer_note, i) => (
            <TextField
              key={i}
              name="note"
              autoComplete="off"
              value={ str(answer_note.note) }
              onChange={handleNoteChange(index)}
              fullWidth
            />
            )
          )
        }
      </FormControl>
    </Grid>
  );
};

const Question = props => {
  const { question, handleValueChange, handleNoteChange, index, error } = props;
  const classes = useStyles();
  const question_choices = question.question_choices_attributes || [];
  const answer_choices = question.answer_choices_attributes || [];
  const answer_notes = question.answer_notes_attributes || [];
  const is_num = question.answer_type === 'number';
  const is_note = question.answer_type === 'note';

  return (
    <React.Fragment>
      <Grid container key={question.id}  className={classes.question}>
        <Grid item>
          <Typography component="h5" variant="h5">
            {question.content}
          </Typography>
          <Typography className={classes.error} >{ error }</Typography>
        </Grid>
        <Grid item xs />
        <Grid item>
          { i18next.t('views.question.answer_size') }
          { (question.min_answer_size === question.max_answer_size) ?
              question.min_answer_size : `${question.min_answer_size}~${question.max_answer_size}` }
        </Grid>
      </Grid>
      {
        is_num ? (
          <AnswerChoices
            question={question}
            question_choices={question_choices}
            answer_choices={answer_choices}
            index={index}
            handleValueChange={handleValueChange}
          />
        ) : null
      }
      {
        is_note ? (
          <AnswerNotes
            question={question}
            answer_notes={answer_notes}
            index={index}
            handleNoteChange={handleNoteChange}
          />
        ) : null
      }
    </React.Fragment>
  );
};

const QuestionForm = props => {
  const {state: {session}} = useContext(AppContext);
  const { onClose, user } = props;
  const [question_type, setQuestionType] = useState('compatibility');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [error_message, setErrorMessage] = useState(null);
  const classes = useStyles();
  const question_types = i18next.data_list('enum', 'question', 'question_type');

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + `api/questions?question_type=${question_type}&answer=true&user_id=${user.id}`;
      axios.get(url, {headers})
        .then((results) => {
          setQuestions(results.data.questions);
        })
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
        });
    }
    else {
      alert(i18next.t('errors.app.occurred'));
    }

  }, [session.headers, question_type, user.id]);

  const onSave = () => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/questions/save_answers';
      let form_answers = {};
      form_answers.user = {id :user.id};
      form_answers.questions = questions.map(question => ({id: question.id}));
      form_answers.answer_choices_attributes = questions.map(question => question.answer_choices_attributes || []).flat();
      form_answers.answer_notes_attributes = questions.map(question => question.answer_notes_attributes || []).flat();
      axios.post(url, {form_answers}, {headers})
      .then((results) => {
        setErrors({});
        setErrorMessage(null);
        setMessage(i18next.t('views.app.save_done'));
      })
      .catch(({response}) => {
        setErrors(response.data.errors);
        setErrorMessage(i18next.t('errors.app.occurred'));
      });
    }
  };

  const handleSearchChange = event => {
    setQuestionType(event.target.value);
  };

  const handleValueChange = i => event => {
    let questions2 = Array.from(questions);
    let question = questions2[i];
    let answer_choices = questions2[i].answer_choices_attributes || [];

    const value = +event.target.value;
    if(question.min_answer_size === 1 && question.max_answer_size === 1) {
      if(answer_choices.length > 0) {
        answer_choices[0].question_choice_id = value;
      } else {
        answer_choices.push({question_id: question.id, question_choice_id: value});
      }
    } else {
      if(event.target.type === 'checkbox') {
        if(event.target.checked) {
          const index = answer_choices.findIndex(v => v.question_choice_id === value);
          if(~index) {
            answer_choices[index]._destroy = null;
          } else {
            answer_choices.push({question_id: question.id, question_choice_id: value});
          }
        } else {
          const index = answer_choices.findIndex(v => v.question_choice_id === value);
          if(~index) {
            answer_choices[index]._destroy = true;
          }
        }
      }
    }
    questions2[i].answer_choices_attributes = answer_choices;
    setQuestions(questions2);
  };

  const handleNoteChange = i => event => {
    let questions2 = Array.from(questions);
    let question = questions2[i];
    let answer_notes = question.answer_notes_attributes || [];

    if(answer_notes.length > 0) {
      answer_notes[0].note = event.target.value;
    } else {
      answer_notes.push({question_id: question.id, note: event.target.value});
    }
    questions2[i].answer_notes_attributes = answer_notes;
    setQuestions(questions2);
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={ Object.keys(errors).length > 0 }
        variant="error"
        message={ <div>{error_message}</div>}
        onClose={() => setErrors({})}
      />
      <CustomizedSnackbar
        open={ message }
        variant="info"
        message={ message }
        onClose={() => setMessage(null)}
      />

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
                  Object.keys(question_types).map((question_type, i) => (
                    <MenuItem key={i} value={question_type}>{ question_types[question_type] }</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Paper className={classes.paper} >
          {
            questions.map((q, i) => (
                <Question
                  question={q}
                  key={i}
                  index={i}
                  error={!!errors[q.id]}
                  handleValueChange={handleValueChange}
                  handleNoteChange={handleNoteChange}
                />
              )
            )
          }
        </Paper>
      </Box>
      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            <Grid item>
              {
                onClose ? (
                  <Button onClick={() => onClose(null)} color="primary">
                    { i18next.t('views.user.back') }
                  </Button>
                ): null
              }
              {
                onSave ? (
                  <Button onClick={onSave} color="primary">
                    {i18next.t('views.app.save')}
                  </Button>
                ) : null
              }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withRouter(QuestionForm);
