export default {
  /***** Login API *******/
  LOGIN: "users/signin",

  /***** Register API *******/
  REGISTER: "users/signup",

  /***** Users API *******/
  UPDATE_USERS: "users/updateUser",

  /***** Total Expense API *******/
  ADD_TOTAL_EXPENSE: "totalExpense/createTotalExpense",

  /***** Category API *****/
  ADD_CATEGORY: "categories/createCategory",
  UPDATE_CATEGORY: "categories/updateCategory",
  GET_USER_CATEGORY: "categories/getMyCategory",
  DELETE_USER_CATEGORY_BY_ID: "categories/deleteCategoryById",
  DELETE_USER_ALL_CATEGORY: "categories/deleteAllCategory",

  /***** Expense API *****/
  ADD_EXPENSE: "expenses/createExpense",
  UPDATE_EXPENSE: "expenses/updateExpense",
  GET_USER_EXPENSE: "expenses/getMyExpense",
  DELETE_USER_EXPENSE_BY_ID: "expenses/deleteExpenseById",
  DELETE_USER_ALL_EXPENSE: "expenses/deleteAllExpense",

  /***** Get expense and category *****/
  GET_EXPENSE_CATEGORY: "categories/getExpensesAndCategoriesOfUser",
};
