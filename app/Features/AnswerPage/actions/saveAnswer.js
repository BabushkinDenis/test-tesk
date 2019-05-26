const request = require('axios');

const SAVE_ANSWER_SUCCESS = 'SAVE_ANSWER__SUCCESS';
const SAVE_ANSWER_REQUEST = 'SAVE_ANSWER__REQUEST';
const SAVE_ANSWER_ERROR = 'SAVE_ANSWER__ERROR';

export default function saveAnswer(answer) {
  return (dispatch) => {
    dispatch({
      type: SAVE_ANSWER_REQUEST,
      payload: null,
    });

    const query = `
      mutation {
        SaveAnswer(
          name:"${answer.name}",
          idQuestion:${answer.idQuestion},
          idCase: ${answer.idCase},
          uid: "${answer.uid}",
        ) {
            id
          }
      }`;

    return request({
      url: window.SERVER_URL_API,
      method: 'post',
      data: {
        query,
        variables: answer,
      },
    }).then((results) => {
      dispatch({
        type: SAVE_ANSWER_SUCCESS,
        payload: { ...results.data.data },
      });
      return Promise.resolve(results);
    }).catch(err => dispatch({
      type: SAVE_ANSWER_ERROR,
      payload: err.response,
    }));
  };
}

export function saveAnswerReducer(state, action) {
  switch (action.type) {
    case SAVE_ANSWER_SUCCESS:
      return { ...state, isFetching: false };
    case SAVE_ANSWER_REQUEST:
      return { ...state, isFetching: true };
    case SAVE_ANSWER_ERROR:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
