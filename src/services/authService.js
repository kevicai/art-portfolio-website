import axios from "axios";
import jwt_decode from "jwt-decode";
import blogsService from "./blogsService";
import userService from "./userService";

const baseUrl = "/api";

const signup = async (credentials) => {
  try {
    const response = await axios.post(baseUrl + "/signup", credentials);

    if (response.data) {
      const user = response.data;
      window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
      blogsService.setToken(user.token);
      console.log("signup success");

      window.localStorage.setItem("loggedUser", JSON.stringify(response.data));

      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl + "/login", credentials);

    const user = response.data;
    window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
    blogsService.setToken(user.token);
    console.log("login success");

    window.localStorage.setItem("loggedUser", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
};

const checkLogin = () => {
  const loggedUserJSON = window.localStorage.getItem("loggedUser");
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);

    userService.setToken(user.token);
    blogsService.setToken(user.token);

    // check token expiration
    // console.log(jwt_decode(user.token));
    const exp = jwt_decode(user.token).exp;

    console.log("token expire in " + (exp * 1000 - Date.now()));
    if (Date.now() >= exp * 1000) {
      window.localStorage.clear();
      return false;
    }

    return true;
  } else {
    return false;
  }
};

// eslint-disable-next-line
const authService = { signup, login, checkLogin };

export default authService;