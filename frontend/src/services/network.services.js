import defaultAxios from "axios";

/**
 * Base url for api requests
 */
const API_BASE_URL = "http://localhost:8000/api";

/**
 * A new instance of axios with a custom config
 */
const axios = defaultAxios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    validateStatus(status) {
        return status < 500; // Only throw for server_errors
    }
});

/**
 * Authenticate a user with email/username and password.
 *
 * @param {string} emailUsername User's email address or username
 * @param {string} password User's password
 * @returns
 */
const login = (emailUsername, password) =>
    axios.post("login", {
        email_username: emailUsername,
        password
    });

/**
 * Authenticate a user with email/username and password.
 *
 * @param {string} firstName User's first name
 * @param {string} lastName User's last name
 * @param {string} email User's email address or username
 * @param {string} username User's username
 * @param {string} password User's password
 * @returns
 */
const register = (firstName, lastName, email, username, password) =>
    axios.post("register", {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password
    });

/**
 * Log out the current user
 *
 * @param {string} token User's token
 * @returns
 */
const logout = token =>
    axios.post(
        "logout",
        {},
        {
            headers: {
                Authorization: `bearer ${token}`
            }
        }
    );

export default {
    API_BASE_URL,
    axios,
    login,
    register,
    logout
};
