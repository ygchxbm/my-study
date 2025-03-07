import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserStore = defineStore("UserStore", () => {
    const user = ref(null);

    const getUser = () => {
        const storedUser = localStorage.getItem("user");
        user.value = storedUser ? JSON.parse(storedUser) : null;
        return user.value;
    };

    const setUser = (data) => {
        if (data) {
            user.value = data;
            localStorage.setItem("user", JSON.stringify(user.value));
        } else {
            console.error("Invalid user data");
        }
    };

    const removeUser = () => {
        user.value = null;
        localStorage.removeItem("user");
    };

    const token = ref("");

    const getToken = () => {
        const storedUser = localStorage.getItem("token");
        token.value = storedUser ? JSON.parse(storedUser) : null;
        return token.value;
    };

    const setToken = (data) => {
        if (data) {
            token.value = data;
            localStorage.setItem("token", JSON.stringify(token.value));
        } else {
            console.error("Invalid token data");
        }
    };

    const removeToken = () => {
        token.value = "";
        localStorage.removeItem("token");
    };

    return {
        user, // 暴露 user，以便外部可以直接访问
        getUser,
        setUser,
        removeUser,
        token,
        getToken,
        setToken,
        removeToken,
    };
});
