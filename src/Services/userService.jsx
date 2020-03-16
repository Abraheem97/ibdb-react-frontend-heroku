import axios from "axios";

export function current_user() {
  return axios.get("http://localhost:3001/auth/is_signed_in.json", {
    withCredentials: true
  });
}

export function get_users() {
  return axios.get("http://localhost:3001/v1/users.json");
}
