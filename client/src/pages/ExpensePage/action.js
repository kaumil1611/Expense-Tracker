import API from "../../api/Routes";
import swal from "sweetalert";
import ACTION from "../../actions";
import { toast } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../../utils/Functions";

import URL from "../../config/index";
import ApiServices from "../../services/Api.services";

/*********************************** 
@Purpose : Used to  Add expense 
@Parameter : payload

**********************************/

export const addExpenseHandler = (payload) => async (dispatch) => {
  try {
    const response = await ApiServices.postApi(
      URL.API_URL + API.ADD_EXPENSE,
      payload
    );
    if (response.status === 1) {
      dispatch({
        type: ACTION.ADD_EXPENSE,
        addExpenseSet: response.data,
      });
      showSuccessToast(response.message);
    }
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      let validationErrors = error.response.data.message;
      showErrorToast(validationErrors);
    } else {
      let errorMessage = "An error occurred. Please try again later.";
      showErrorToast(errorMessage);
    }
  }
};

/*********************************** 
@Purpose : Used to expense Listing
@Parameter : payload

**********************************/

export const expenseListingHandler = (payload) => async (dispatch) => {
  try {
    let apiLink;
    if (
      payload.page &&
      payload.pageSize &&
      !payload.searchField &&
      !payload.sort
    ) {
      apiLink =
        URL.API_URL +
        API.GET_USER_EXPENSE +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize;
    }
    if (payload.page && payload.pageSize && payload.searchField) {
      apiLink =
        URL.API_URL +
        API.GET_USER_EXPENSE +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize +
        `&searchField=` +
        payload.searchField;
    }
    if (
      payload.page &&
      payload.pageSize &&
      payload.sort &&
      !payload.searchField
    ) {
      apiLink =
        URL.API_URL +
        API.GET_USER_EXPENSE +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize +
        `&sort=` +
        payload.sort;
    }

    const response = await ApiServices.getApi(apiLink);

    dispatch({
      type: ACTION.EXPENSE_LISTING,
      payload: response.data,
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      let validationErrors = error.response.data.message;
      showErrorToast(validationErrors);
    } else {
      let errorMessage = "An error occurred. Please try again later.";
      showErrorToast(errorMessage);
    }
  }
};

export const categoryListingHandler = () => async (dispatch) => {
  try {
    // dispatch({ type: ACTION.EXPENSE_CATEGORY_LISTING, loading: true });
    const response = await ApiServices.getApi(
      URL.API_URL + API.GET_USER_CATEGORY
    );
    dispatch({
      type: ACTION.EXPENSE_CATEGORY_LISTING,
      cListing: response.data,
      // loading: false,
    });

    return response;
  } catch (error) {
    showErrorToast(error);
  }
};

/*********************************** 
@Purpose : Used to update Expense
@Parameter : payload

**********************************/

export const updateExpenseHandler = (payload) => async (dispatch) => {
  try {
    const response = await ApiServices.putApi(
      URL.API_URL + API.UPDATE_EXPENSE,
      payload
    );
    if (response.data.status === 1) {
      dispatch({
        type: ACTION.UPDATE_EXPENSE,
        update_expense: response.data,
      });
      showSuccessToast(response.data.message);
    } else {
      dispatch({
        type: ACTION.UPDATE_EXPENSE,
        update_expense: response.data,
      });
      toast.error(response.data.message);
    }
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      let validationErrors = error.response.data.message;
      showErrorToast(validationErrors);
    } else {
      let errorMessage = "An error occurred. Please try again later.";
      showErrorToast(errorMessage);
    }
  }
};

/*********************************** 
@Purpose : Used to delete expense
@Parameter : payload

**********************************/
export const deleteExpenseHandler = (payload) => async (dispatch) => {
  return swal({
    title: "Are you sure, you want to delete this expense deatil?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      try {
        const response = await ApiServices.deleteApi(
          URL.API_URL + API.DELETE_USER_EXPENSE_BY_ID,
          payload
        );
        if (response.status === 1) {
          dispatch({
            type: ACTION.DELETE_EXPENSE,
            deleteExpenseSet: response.data,
          });
          showSuccessToast(response.message);
        }
        return response;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          let validationErrors = error.response.data.message;
          showErrorToast(validationErrors);
        } else {
          let errorMessage = "An error occurred. Please try again later.";
          showErrorToast(errorMessage);
        }
      }
    }
  });
};
