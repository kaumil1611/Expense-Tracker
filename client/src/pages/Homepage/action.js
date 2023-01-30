import API from "../../api/Routes";

import ACTION from "../../actions";
import { toast } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../../utils/Functions";

import URL from "../../config/index";
import ApiServices from "../../services/Api.services";

export const expense_category_details = (payload) => async (dispatch) => {
  try {
    let apiLink;
    if (
      payload.page &&
      payload.pageSize &&
      !payload.categoryId &&
      !payload.sort
    ) {
      apiLink =
        URL.API_URL +
        API.GET_EXPENSE_CATEGORY +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize;
    }
    if (payload.page && payload.pageSize && payload.categoryId) {
      apiLink =
        URL.API_URL +
        API.GET_EXPENSE_CATEGORY +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize +
        `&categoryId=` +
        payload.categoryId;
    }
    if (
      payload.page &&
      payload.pageSize &&
      payload.sort &&
      !payload.categoryId
    ) {
      apiLink =
        URL.API_URL +
        API.GET_EXPENSE_CATEGORY +
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
