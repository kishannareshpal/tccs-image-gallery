import { useLocalStorage } from "react-use-storage";
import { isEmpty } from "lodash";

/**
 * A custom hook that builds on useLocalStorage to retrieve, parse and save
 * the currently logged in user from local storage
 */

/**
 * User type definition
 * @typedef {object} User
 * @property {string} id - The user's Id
 * @property {string} fullName - The user's full name
 * @property {string} username - The user's username
 * @property {string} email - The user's email address
 * @property {string} token - The user's auth token
 */

/**
 * Save or retrieve the user from localStorage.
 *
 * @property {User} user - the user details if authenticated or an empty object if not.
 * @property {boolean} isAuthenticated - whether or not the user is authenticated.
 * @property {function} setUser - save user to localStorage. Used for registering/loging in.
 * @property {function} removeUser - remove user from localStorage. Used for signing out.
 */
const useUser = () => {
    const [user, setUser, removeUser] = useLocalStorage("user", {});

    const isAuthenticated = !isEmpty(user);
    return {
        user,
        isAuthenticated,
        setUser,
        removeUser
    };
};

export default useUser;
