/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actionsRedux from './actions';
import { DEF_QUESTION } from './const';
import './style.scss';

class QuestionPage extends Component {
  static propTypes = {
    questions: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
    actions: PropTypes.shape({
      saveQuestion: PropTypes.func,
      fetchQuestions: PropTypes.func,
    }).isRequired,
    history: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      question: DEF_QUESTION,
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchQuestions();
  }

  changeQuestionBody(value) {
    const { question } = this.state;
    this.setState({ question: { ...question, body: value } });
  }

  changeQuestionCase(value, i) {
    const { question } = this.state;
    this.setState({
      question: {
        ...question,
        cases: question.cases.map((item, key) => (key === i ? value : item)),
      },
    });
  }

  addCase() {
    const { question } = this.state;
    this.setState({
      question: {
        ...question,
        cases: [...question.cases, ''],
      },
    });
  }

  render() {
    const { actions, questions, history } = this.props;
    const { question } = this.state;
    console.log(this.props);
    return (
      <div className="page__content page__content--padding">
        <div className="poll">
          <table className="poll-table">
            <thead>
              <tr>
                <th>Question:</th>
                <th>
                  <input
                    type="text"
                    value={question.body}
                    onChange={e => this.changeQuestionBody(e.target.value)}
                    className="input-text"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {question.cases.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  <th>{`Answer ${i + 1}:`}</th>
                  <td>
                    <input
                      type="text"
                      value={item}
                      className="input-text"
                      onChange={e => this.changeQuestionCase(e.target.value, i)}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="poll-table__plus">
                  <button className="btn btn--plus" onClick={() => this.addCase()}>
                    +
                  </button>
                </td>
                <td />
              </tr>
            </tbody>
          </table>

          <button
            className="btn btn--start"
            disabled={!question.body || question.cases.filter(item => !item).length}
            onClick={() => (actions.saveQuestion(question)
              .then((res) => {
                const { data, status } = res;
                if (status === 200 && data.data && data.data.SaveQuestion) {
                  history.push(`/${data.data.SaveQuestion.hash}`);
                }
              })
            )}
          >
            Start
          </button>
        </div>
        <div className="questions">
          <h1>Questions</h1>
          <table className="q-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id}>
                  <td>{q.body}</td>
                  <td><Link className="link" to={`/${q.hash}`}>link</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions.list,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    saveQuestion: q => dispatch(actionsRedux.saveQuestion(q)),
    fetchQuestions: () => dispatch(actionsRedux.fetchQuestions()),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
