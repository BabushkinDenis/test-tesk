const axios = require('axios');

const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
const FETCH_QUESTION_REQUEST = 'FETCH_QUESTION_REQUEST';
const FETCH_QUESTION_ERROR = 'FETCH_QUESTION_ERROR';

export default function fetchQuestion(hash) {
  const query = `
    {
      Question(hash:"${hash}"){
        id,
        body,
        cases {
          id,
          val,
        }
      }
    }
  `;

  return (dispatch) => {
    dispatch({
      type: FETCH_QUESTION_REQUEST,
      payload: null,
    });

    return axios({
      url: window.SERVER_URL_API,
      method: 'post',
      data: {
        query,
      },
    }).then((results) => {
      dispatch({
        type: FETCH_QUESTION_SUCCESS,
        payload: results.data.data,
      });
      return Promise.resolve(results);
    }).catch(err => dispatch({
      type: FETCH_QUESTION_ERROR,
      payload: err.response,
    }));
  };
}


export function fetchQuestionReducer(state, action) {
  switch (action.type) {
    case FETCH_QUESTION_SUCCESS:
      return { ...state, question: action.payload.Question, isFetching: false };
    case FETCH_QUESTION_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_QUESTION_ERROR:
      return {
        ...state, isFeching: false, error: true, errorBody: action.payload,
      };
    default:
      return state;
  }
}
