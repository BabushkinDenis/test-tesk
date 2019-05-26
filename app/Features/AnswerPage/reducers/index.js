import ConnectReducers from '../../../helpers/ConnectReducers';
import { fetchQuestionReducer } from '../actions/fetchQuestion';
import { fetchAnswersReducer } from '../actions/fetchAnswers';
import { saveAnswerReducer } from '../actions/saveAnswer';

const initialState = { question: { body: '', cases: [] }, list: [], isFeching: false };

export default ConnectReducers([
  fetchQuestionReducer,
  saveAnswerReducer,
  fetchAnswersReducer,
], initialState);
