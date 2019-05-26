const request = require('axios');

const SAVE_QUESTION_SUCCESS = 'SAVE_QUESTION__SUCCESS';
const SAVE_QUESTION_REQUEST = 'SAVE_QUESTION__REQUEST';
const SAVE_QUESTION_ERROR = 'SAVE_QUESTION__ERROR';

export default function saveQuestion(question) {
  return (dispatch) => {
    dispatch({
      type: SAVE_QUESTION_REQUEST,
      payload: null,
    });

    const query = `
      mutation {
        SaveQuestion(body:"${question.body}", cases: ${JSON.stringify(question.cases)}) {
            body
            hash
          }
      }`;

    return request({
      url: window.SERVER_URL_API,
      method: 'post',
      data: {
        query,
        variables: question,
      },
    }).then((results) => {
      dispatch({
        type: SAVE_QUESTION_SUCCESS,
        payload: { ...results.data.data.SaveQuestion },
      });
      return Promise.resolve(results);
    }).catch(err => dispatch({
      type: SAVE_QUESTION_ERROR,
      payload: err.response,
    }));
  };
}

export function saveQuestionReducer(state, action) {
  switch (action.type) {
    case SAVE_QUESTION_SUCCESS:
      return { ...state, isFetching: false };
    case SAVE_QUESTION_REQUEST:
      return { ...state, isFetching: true };
    case SAVE_QUESTION_ERROR:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
