import axios from "axios";

export function current_user() {
  return axios.get(`${process.env.REACT_APP_API_URL}/uth/is_signed_in.json`, {
    withCredentials: true
  });
}

export function get_users() {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/v1/users.json`)
    .then(res => res.data);
}

export function get_username(id) {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/v1/${id}/user.json`)
    .then(res => res.data);
}

export function hasReviewedBook(user_id, book_id) {
  return axios
    .get(
      `${process.env.REACT_APP_API_URL}/v1/${user_id}/${book_id}/bookreviewed.json`
    )
    .then(res => res);
}
