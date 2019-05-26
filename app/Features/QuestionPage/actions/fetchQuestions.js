const axios = require('axios');

const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS';
const FETCH_QUESTIONS_REQUEST = 'FETCH_QUESTIONS_REQUEST';
const FETCH_QUESTIONS_ERROR = 'FETCH_QUESTIONS_ERROR';

export default function fetchQuestions() {
  const query = `
    {
      Questions {
        id
        body
        cases {
          val
        }
        hash
      }
    }
  `;

  return (dispatch) => {
    dispatch({
      type: FETCH_QUESTIONS_REQUEST,
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
        type: FETCH_QUESTIONS_SUCCESS,
        payload: results.data.data.Questions,
      });
      return Promise.resolve(results);
    }).catch(err => dispatch({
      type: FETCH_QUESTIONS_ERROR,
      payload: err.response,
    }));
  };
}


export function fetchQuestionsReducer(state, action) {
  switch (action.type) {
    case FETCH_QUESTIONS_SUCCESS:
      return { ...state, list: action.payload, isFetching: false };
    case FETCH_QUESTIONS_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_QUESTIONS_ERROR:
      return {
        ...state, isFeching: false, error: true, errorBody: action.payload,
      };
    default:
      return state;
  }
}
