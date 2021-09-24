import { useLocalStorage } from "react-use-storage";
import { isEmpty } from "lodash";

/**
 * A custom hook that builds on useLocalStorage to retrieve, parse and save
 * the currently logged in user from local storage
 */

/**
 * User object type definition
 *
 * @typedef {object} User
 * @property {string} id User's id
 * @property {string} first_name User's first name
 * @property {string} last_name User's last name
 * @property {string} email User's email address
 * @property {string} username User's username
 * @property {string} created_at User's account creation date
 * @property {string} updated_at User's account update date
 * @property {string} full_name User's full name
 * @property {string} token User's auth token
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
