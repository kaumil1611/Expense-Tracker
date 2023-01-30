import actionTypes from "../../actions";

/******************* 
@Purpose : Object containing paths for application
@Parameter : {}

******************/

const initialState = {
  getCategoryAndExpenseListing: [],
};

const categoryAndExpenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EXPENSE_CATEGORY_DISPLAY:
      return { ...state, getCategoryAndExpenseListing: action.payload };

    default:
      return state;
  }
};
export default categoryAndExpenseReducer;
