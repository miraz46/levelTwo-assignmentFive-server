import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { RidesRoutes } from "../modules/ride/ride.route";
import { DriversRoutes } from "../modules/driver/driver.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/rides",
        route: RidesRoutes
    },
    {
        path: "/drivers",
        route: DriversRoutes
    },

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})