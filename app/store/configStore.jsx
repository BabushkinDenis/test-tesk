import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import questionPageReducers from '../Features/QuestionPage/reducers';
import answerPageReducers from '../Features/AnswerPage/reducers';

export const ping = () => next => (action) => {
  console.log(`Тип события: ${action.type}, дополнительные данные события: ${action.payload}`);
  return next(action);
};

export default function configureStore(initialState) {
  const logger = createLogger();
  const store = createStore(combineReducers({
    questions: questionPageReducers,
    answers: answerPageReducers,
  }),
  initialState,
  applyMiddleware(thunk, logger));
  return store;
}
