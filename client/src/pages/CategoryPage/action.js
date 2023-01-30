import API from "../../api/Routes";
import swal from "sweetalert";
import ACTION from "../../actions";
import { toast } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../../utils/Functions";

import URL from "../../config/index";
import ApiServices from "../../services/Api.services";

/*********************************** 
@Purpose : Used to  Add Category 
@Parameter : payload

**********************************/

export const addCategoryHandler = (payload) => async (dispatch) => {
  try {
    const response = await ApiServices.postApi(
      URL.API_URL + API.ADD_CATEGORY,
      payload
    );
    if (response.status === 1) {
      dispatch({
        type: ACTION.ADD_CATEGORY,
        addCategorySet: response.data,
      });
      showSuccessToast(response.message);
    }
    return response;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      let validationErrors = error.response.data.message;
      showErrorToast(validationErrors);
    } else {
      let errorMessage = "An error occurred. Please try again later.";
      showErrorToast(errorMessage);
    }
  }
};

/*********************************** 
@Purpose : Used to category Listing
@Parameter : payload

**********************************/

export const categoryListing = (payload) => async (dispatch) => {
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
        API.GET_USER_CATEGORY +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize;
    }
    if (payload.page && payload.pageSize && payload.searchField) {
      apiLink =
        URL.API_URL +
        API.GET_USER_CATEGORY +
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
        API.GET_USER_CATEGORY +
        `?page=` +
        payload.page +
        `&pageSize=` +
        payload.pageSize +
        `&sort=` +
        payload.sort;
    }

    const response = await ApiServices.getApi(apiLink);

    dispatch({
      type: ACTION.CATEGORY_LISTING,
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

/*********************************** 
@Purpose : Used to update category
@Parameter : payload

**********************************/

export const updateCategoryHandler = (payload) => async (dispatch) => {
  try {
    const response = await ApiServices.putApi(
      URL.API_URL + API.UPDATE_CATEGORY,
      payload
    );
    if (response.data.status === 1) {
      dispatch({
        type: ACTION.UPDATE_CATEGORY,
        update_category: response.data,
      });
      showSuccessToast(response.data.message);
    } else {
      dispatch({
        type: ACTION.UPDATE_CATEGORY,
        update_category: response.data,
      });
      toast.error(response.data.message);
    }
    return response;
  } catch (error) {
    showErrorToast(error);
  }
};

/*********************************** 
@Purpose : Used to delete category
@Parameter : payload
 
**********************************/
export const deleteCategoryHandler = (payload) => async (dispatch) => {
  return swal({
    title: "Are you sure, you want to delete this category deatil?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      try {
        const response = await ApiServices.deleteApi(
          URL.API_URL + API.DELETE_USER_CATEGORY_BY_ID,
          payload
        );
        if (response.status === 1) {
          dispatch({
            type: ACTION.DELETE_CATEGORY,
            deleteCategorySet: response.data,
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
