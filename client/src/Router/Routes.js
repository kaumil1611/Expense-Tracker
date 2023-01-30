import { paths } from "./Constant";
import Login from "../pages/Login";
import Home from "../pages/Homepage";
import Register from "../pages/Register";
import Category from "../pages/CategoryPage";
import CreateCategory from "../pages/CategoryPage/CreateCategory";
import EditCategory from "../pages/CategoryPage/EditCategory";
import Expense from "../pages/ExpensePage";
import CreateExpense from "../pages/ExpensePage/CreateExpense";
import EditExpense from "../pages/ExpensePage/EditExpense";
const {
  login,
  home,
  register,
  category,
  addCategory,
  editCategory,
  expense,
  addExpense,
  editExpense,
} = paths;

/***
@Purpose : List of the routes used in application along with the components to be rendered
@Parameter : {}

**/

export const routes = {
  Login: {
    path: login,
    component: Login,
    exact: true,
    private: false,
  },
  Register: {
    path: register,
    component: Register,
    exact: true,
    private: false,
  },
  Home: {
    path: home,
    component: Home,
    exact: true,
    private: true,
  },
  Category: {
    path: category,
    component: Category,
    exact: true,
    private: true,
  },
  CreateCategory: {
    path: addCategory,
    component: CreateCategory,
    exact: true,
    private: true,
  },
  EditCategory: {
    path: editCategory,
    component: EditCategory,
    exact: true,
    private: true,
  },
  Expense: {
    path: expense,
    component: Expense,
    exact: true,
    private: true,
  },
  CreateExpense: {
    path: addExpense,
    component: CreateExpense,
    exact: true,
    private: true,
  },
  EditExpense: {
    path: editExpense,
    component: EditExpense,
    exact: true,
    private: true,
  },
};

export const renderRoutes = Object.entries(routes);
