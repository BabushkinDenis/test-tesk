const ConnectReducers = (reducers, initialState) => (state = initialState, action) => {
  let newState;
  switch (action.type) {
    // Put global reducers here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
};

export default ConnectReducers;
