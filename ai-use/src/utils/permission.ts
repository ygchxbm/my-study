import router from "@/router";
import {useUserStore} from "@/store/useUserStore";

router.beforeEach((to) => {
    const {getUser} = useUserStore();
    const user = getUser();
    if (!user && to.name !== "login") {
        return {name: "login"}
    }
})
