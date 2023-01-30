import API from "../../api/Routes";
import { showSuccessToast, showErrorToast } from "../../utils/Functions";
import URL from "../../config/index";
import axios from "axios";

/*********************************** 
@Purpose : Used to  Add user Data 
@Parameter : payload

**********************************/

export const registerUser = (payload) => async (dispatch) => {
  try {
    const response = await axios({
      method: "post",
      url: URL.API_URL + API.REGISTER,
      headers: {
        "Content-type": "application/json",
      },
      data: JSON.stringify(payload),
    });
    if (response.status === 200) {
      showSuccessToast("Register Successfully");
    }
    showErrorToast(response.data.error);
    return response;
  } catch (err) {
    showErrorToast("Invalid Data");
  }
};

// export const registerUser = (payload) => async (dispatch) => {
//   try {
//     await axios({
//       method: "post",
//       url: URL.API_URL + API.REGISTER,
//       headers: {
//         "Content-type": "application/json",
//       },
//       data: JSON.stringify(payload),
//     })
//       .then((response) => {
//         if (response.status === 200) {
//           showSuccessToast("Register Successfully");
//         }
//         showErrorToast(response.data.error);
//       })
//       .catch((err) => showErrorToast(err));
//   } catch (err) {
//     showErrorToast("Invalid Data");
//   }
// };
