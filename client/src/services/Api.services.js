import axios from "axios";
import { getItem, showErrorToast } from "../utils/Functions";
import { paths } from "../Router/Constant";
import persistor from "../persistStore";

/******************* 
@Purpose : Object containing paths for application
@Parameter : {} 
******************/

class ApiRequestService {
  constructor(baseURL) {
    this.baseURL = process.env.REACT_APP_API_URL;
    this.axiosService = axios.create({
      baseURL,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        Authorization: getItem("accessToken"),
      },
    });

    this.axiosPutService = axios.create({
      baseURL: this.baseURL,
    });
  }

  isTokenExpired(error) {
    if (
      error?.status === 401 ||
      error?.data?.message === "INVALID_TOKEN" ||
      error?.data?.status === 0
    ) {
      showErrorToast(error?.data?.message);

      persistor.pause();
      persistor.flush().then(() => {
        return persistor.purge();
      });
      localStorage.clear();
      window.location.href = paths.login;
      return;
    }
    return error?.status === 401 || error?.data?.message === "Token expired.";
  }

  getApi(path, headers = {}, params = {}) {
    let isAuthorized = getItem("accessToken") ? true : false;
    return new Promise((resolve) => {
      this.axiosService
        .get(path, {
          headers: isAuthorized
            ? { ...headers, Authorization: getItem("accessToken") }
            : headers,
          params,
        })
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            data: res.data,
          });
        })
        .catch((error) => {
          this.isTokenExpired(error?.response) &&
            resolve({
              message: error?.response?.data?.message,
              status: error?.response?.data?.status,
            });
        });
    });
  }

  postApi(path, apiData, headers = {}) {
    let isAuthorized = getItem("accessToken") ? true : false;
    return new Promise((resolve, reject) => {
      this.axiosService
        .post(path, apiData, {
          headers: isAuthorized
            ? { ...headers, Authorization: getItem("accessToken") }
            : headers,
        })
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            data: res.data,
          });
        })
        .catch((error) => {
          if (this.isTokenExpired(error?.response)) {
            reject({
              message: error?.response?.data?.message,
              status: error?.response?.status,
            });
          } else {
            reject(error);
          }
        });
    });
  }
  deleteApi(path, apiData, headers = {}) {
    let isAuthorized = getItem("accessToken") ? true : false;
    return new Promise(async (resolve, reject) => {
      console.log(apiData, "apiDataapiData");
      try {
        let res = await this.axiosService.delete(path, {
          headers: isAuthorized
            ? { ...headers, Authorization: getItem("accessToken") }
            : headers,
          data: apiData,
        });

        resolve({
          message: res.data.message,
          status: res.data.status,
          data: res.data,
        });
      } catch (error) {
        if (this.isTokenExpired(error?.response)) {
          reject({
            message: error?.response?.data?.message,
            status: error?.response?.status,
          });
        } else {
          reject(error);
        }
      }
    });
  }

  putApi(path, apiData, headers = {}) {
    let isAuthorized = getItem("accessToken") ? true : false;
    return new Promise((resolve) => {
      this.axiosService
        .put(path, apiData, {
          headers: isAuthorized
            ? { ...headers, Authorization: getItem("accessToken") }
            : headers,
        })
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            data: res.data,
          });
        })
        .catch((error) => {
          this.isTokenExpired(error?.response) &&
            resolve({
              message: error?.response?.data?.message,
              status: error?.response?.data?.status,
            });
        });
    });
  }
}

export default new ApiRequestService();
