export const utility = () => {
    /**
     * Retrieves the role based on the role priority.
     * @param {string} rolePriority - The priority of the role.
     * @returns {string} - The name of the role.
     */
    const getRole = (rolePriority: string): string => {
        switch (rolePriority) {
            case "1":
                return "Admin";
            case "2":
                return "Manager";
            case "3":
                return "Employee";
            case "4":
                return "Channel Partner";
            default:
                return "";
        }
    };

    /**
     * Gets the value associated with a key from local storage.
     * @param {string} key - The key for which to retrieve the value from local storage.
     * @returns {any | null} - The value associated with the key, or null if the key is not found.
     */
    const getLocalStorage = (key: string): any | null => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null && storedValue !== 'undefined') {
            try {
                return JSON.parse(storedValue);
            } catch (err) {
                console.error(`Error parsing ${key} from localStorage:`, err);
            }
        }
        return null;
    };

    /**
     * Removes a key-value pair from local storage.
     * @param {string} key - The key to be removed from local storage.
     * @returns {void}
     */
    const remLocalStorage = (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.error(`Error removing ${key} from localStorage:`, err);
        }
    };

    /**
     * Sets a key-value pair in local storage.
     * @param {string} key - The key to be set in local storage.
     * @param {any} value - The value associated with the key.
     * @returns {void}
     */
    const setLocalStorage = (key: string, value: any): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error(`Error setting ${key} in localStorage:`, err);
        }
    };

    return {
        getRole,
        getLocalStorage,
        remLocalStorage,
        setLocalStorage
    };
};
