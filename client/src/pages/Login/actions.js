import {
  setItem,
  showSuccessToast,
  showErrorToast,
} from "../../utils/Functions";

import URL from "../../config/index";
import API from "../../api/Routes";
import ACTION from "../../actions/index";
import axios from "axios";
import persistor from "../../persistStore";

/******************** 
     @Purpose : Used for Login
     @Parameter : 
     *******************/

export const login = (payload) => async (dispatch) => {
  try {
    const response = await axios({
      method: "post",
      url: URL.API_URL + API.LOGIN,
      headers: {
        "Content-type": "application/json",
      },
      data: JSON.stringify(payload),
    });
    if (response.status === 201) {
      showSuccessToast(response.data.message);
      let userData = response?.data?.user;
      userData["token"] = response?.data?.token;
      setItem("User", JSON.stringify(userData));
    }
    return response;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      showErrorToast(error.response.data.error);
    } else {
      showErrorToast(error);
    }
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("User");
  persistor.pause();
  persistor.flush().then(() => {
    return persistor.purge();
  });
  dispatch({ type: ACTION.USER_LOGOUT });
  showSuccessToast("Logout Successfully");
};
