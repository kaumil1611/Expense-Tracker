import { combineReducers } from "redux";
import LoginReducer from "../pages/Login/reducer";
import CategoryReducer from "../pages/CategoryPage/reducer";
import ExpenseReducer from "../pages/ExpensePage/reducer";
import categoryAndExpenseReducer from "../pages/Homepage/reducer";
const allReducers = combineReducers({
  login: LoginReducer,
  category: CategoryReducer,
  expense: ExpenseReducer,
  cat_and_expense: categoryAndExpenseReducer,
});

export default allReducers;
