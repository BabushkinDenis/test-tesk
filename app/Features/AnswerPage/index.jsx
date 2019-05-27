import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import actionsRedux from './actions';
import { getCookie, setCookie } from '../../helpers/utils';
import './style.scss';

class UsersPage extends Component {
  static propTypes = {
    question: PropTypes.shape({}),
    answers: PropTypes.arrayOf(PropTypes.shape({})),
    actions: PropTypes.shape({}).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
  };

  static defaultProps = {
    question: {},
    answers: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      idCase: null,
      isAlredySend: false,
    };
  }

  componentWillMount() {
    const { actions, match } = this.props;
    const socket = io('http://localhost:3002');
    socket.on('newAnswer', () => {
      actions.fetchAnswers(match.params.id);
    });

    actions.fetchQuestion(match.params.id);
    actions.fetchAnswers(match.params.id);
    if (!getCookie('__UID')) {
      setCookie('__UID', `__${Math.random()}`.split('.').join(''), {});
    }
  }

  componentWillReceiveProps(newProps) {
    const uid = getCookie('__UID');
    const { answers } = newProps;
    this.setState({ isAlredySend: false });
    if (answers.filter(i => i.uid === uid).length) {
      this.setState({ isAlredySend: true });
    }
  }

  render() {
    const uid = getCookie('__UID');
    const {
      question, answers, actions,
    } = this.props;
    const {
      name, idCase, isAlredySend,
    } = this.state;

    return (
      <div className="page__content page__content--padding">
        <div className="poll">
          {question ? (
            <Fragment>
              <h1>{question.body}</h1>
              <div className="ex2-question">
                <div className="ex2-question__label">Your name:</div>
                <div className="ex2-question__input">
                  <input
                    type="text"
                    value={name}
                    className="input-text"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </div>
                <div className="ex2-question__answer">
                  {question.cases.map(item => (
                    <label htmlFor="answer" key={item.id}>
                      <input
                        type="radio"
                        name="answer"
                        value={item.id}
                        onChange={e => this.setState({ idCase: e.target.value })}
                      />
                      {item.val}
                    </label>
                  ))}
                </div>
                <div className="ex2-question__submit">
                  {isAlredySend
                    ? (<p>You has already send answer</p>)
                    : (
                      <input
                        type="submit"
                        className="btn"
                        value="Submit"
                        disabled={!name || !idCase}
                        onClick={() => actions.saveAnswer({
                          idQuestion: question.id, idCase, name, uid,
                        })}
                      />
                    )}
                </div>
              </div>

              <h1>Results</h1>

              <table className="ex2-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    {question.cases.map(item => (<th key={item.id}>{item.val}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {answers.map(answer => (
                    <tr key={answer.id}>
                      <td>{answer.name}</td>
                      {question.cases.map(c => (
                        <td key={c.id}>{c.id === answer.idCase ? 'X' : '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Fragment>
          ) : <div>question not fild</div>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  question: state.answers.question,
  answers: state.answers.list,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    saveAnswer: a => dispatch(actionsRedux.saveAnswer(a)),
    fetchQuestion: hash => dispatch(actionsRedux.fetchQuestion(hash)),
    fetchAnswers: hash => dispatch(actionsRedux.fetchAnswers(hash)),
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
