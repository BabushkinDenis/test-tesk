const axios = require('axios');

const FETCH_ANSWERS_SUCCESS = 'FETCH_ANSWERS_SUCCESS';
const FETCH_ANSWERS_REQUEST = 'FETCH_ANSWERS_REQUEST';
const FETCH_ANSWERS_ERROR = 'FETCH_ANSWERS_ERROR';

export default function fetchAnswers(hash) {
  const query = `
    {
      Answers(hash:"${hash}") {
        id
        name
        idCase
        uid
      }
    }
  `;

  return (dispatch) => {
    dispatch({
      type: FETCH_ANSWERS_REQUEST,
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
        type: FETCH_ANSWERS_SUCCESS,
        payload: results.data.data.Answers,
      });
      return Promise.resolve(results);
    }).catch(err => dispatch({
      type: FETCH_ANSWERS_ERROR,
      payload: err.response,
    }));
  };
}


export function fetchAnswersReducer(state, action) {
  switch (action.type) {
    case FETCH_ANSWERS_SUCCESS:
      return { ...state, list: action.payload, isFetching: false };
    case FETCH_ANSWERS_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_ANSWERS_ERROR:
      return {
        ...state, isFeching: false, error: true, errorBody: action.payload,
      };
    default:
      return state;
  }
}
