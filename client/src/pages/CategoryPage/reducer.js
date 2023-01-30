import actionTypes from "../../actions";

/******************* 
@Purpose : Object containing paths for application
@Parameter : {}

******************/

const initialState = {
  addCategory: {},
  categotyListing: [],
  editCategory: {},
  deleteCategory: {},
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_CATEGORY:
      return { ...state, addCategory: action.addCategorySet };

    case actionTypes.CATEGORY_LISTING:
      return { ...state, categoryListing: action.payload };

    case actionTypes.UPDATE_CATEGORY:
      return { ...state, editCategory: action.update_category };

    case actionTypes.DELETE_CATEGORY:
      return { ...state, deleteExpense: action.deleteCategorySet };

    default:
      return state;
  }
};
export default categoryReducer;
