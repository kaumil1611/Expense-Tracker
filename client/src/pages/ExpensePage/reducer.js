import actionTypes from "../../actions";

/******************* 
@Purpose : Object containing paths for application
@Parameter : {}

******************/

const initialState = {
  addExpense: {},
  expenseListing: [],
  editExpense: {},
  expenseCategoryListing: {},
  deleteExpense: {},
  // expenseCategoryListing: { loading: false },
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_CATEGORY:
      return { ...state, addExpense: action.addExpenseSet };

    case actionTypes.EXPENSE_LISTING:
      return { ...state, expenseListing: action.payload };

    case actionTypes.UPDATE_CATEGORY:
      return { ...state, editExpense: action.update_expense };

    case actionTypes.EXPENSE_CATEGORY_LISTING:
      return { ...state, expenseCategoryListing: action.cListing };

    case actionTypes.DELETE_EXPENSE:
      return { ...state, deleteExpense: action.deleteExpenseSet };

    default:
      return state;
  }
};
export default expenseReducer;
