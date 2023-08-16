/** @format */
export const ALLLOCKS = "ALLLOCKS";

export const setAllLocks = (data) => {
  return {
    type: ALLLOCKS,
    payload: data,
  };
}; 

const initialState = {
  userLocks: [],
}; //Initial state of the counter

const reducer = (state = initialState, action) => {
  // console.log(action.payload.data,"action")
  switch (action.type) {
    case ALLLOCKS:
      return {
        userLocks: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
