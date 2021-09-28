// eslint-disable-next-line no-unused-vars
import defaultAxios, { AxiosResponse } from "axios";

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

/* -------------------------------------------------------------------------- */
/*                            Authentication Routes                           */
/* -------------------------------------------------------------------------- */

/**
 * Authenticate a user with email/username and password.
 *
 * @param {string} emailUsername User's email address or username
 * @param {string} password User's password
 * @returns {Promise<AxiosResponse<any>>}
 */
const login = (emailUsername, password) =>
    axios.post("login", {
        email_username: emailUsername,
        password
    });

/**
 * Create a new user
 *
 * @param {string} firstName User's first name
 * @param {string} lastName User's last name
 * @param {string} email User's email address or username
 * @param {string} username User's username
 * @param {string} password User's password
 * @returns {Promise<AxiosResponse<any>>}
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
 * @returns {Promise<AxiosResponse<any>>}
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

/* -------------------------------------------------------------------------- */
/*                                Photos Routes                               */
/* -------------------------------------------------------------------------- */

const postGalleryPhotos = (galleryId, formData, token) =>
    axios.post(`galleries/${galleryId}/photos`, formData, {
        headers: {
            Authorization: `bearer ${token}`
        }
    });

const deletePhoto = (photoId, token) =>
    axios.post(
        "galleries/photos/delete",
        {
            photo_id: photoId
        },
        {
            headers: {
                Authorization: `bearer ${token}`
            }
        }
    );

/* -------------------------------------------------------------------------- */
/*                               Gallery Routes                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetch all galleries
 * @returns {Promise<AxiosResponse<any>>}
 */
const getAllGalleries = () => axios.get("galleries");

const getGallery = id => axios.get(`galleries/${id}`);

const deleteGallery = (galleryId, token) =>
    axios.post(
        "galleries/delete",
        {
            gallery_id: galleryId
        },
        {
            headers: {
                Authorization: `bearer ${token}`
            }
        }
    );

const postGallery = (data, token) =>
    axios.post("galleries", data, {
        headers: {
            Authorization: `bearer ${token}`
        }
    });

/* -------------------------------------------------------------------------- */
/*                                 User Routes                                */
/* -------------------------------------------------------------------------- */

/**
 * Fetch the user profile and return their information, as well as the galleries it owns
 * @param {string} username user's username
 * @returns {Promise<AxiosResponse<any>>}
 */
const getUserProfile = username => axios.get(`users/${username}`);

export default {
    API_BASE_URL,
    axios,
    login,
    register,
    logout,
    getUserProfile,
    getGallery,
    postGallery,
    postGalleryPhotos,
    deletePhoto,
    deleteGallery,
    getAllGalleries
};
