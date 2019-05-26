// import _ from 'lodash';
import ConnectReducers from '../../../helpers/ConnectReducers';
import { fetchQuestionsReducer } from '../actions/fetchQuestions';

const initialState = { list: [], isFetchin: false };

export default ConnectReducers([
  fetchQuestionsReducer,
], initialState);
