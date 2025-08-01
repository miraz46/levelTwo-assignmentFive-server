import { envVars } from "../config/env"
import bcrypt from "bcryptjs"
import { User } from "../modules/user/user.model";
import { BlockedStatus, IUser, Role } from "../modules/user/user.interface";


export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("Super Admin already exist");
            return
        }
        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));


        const payload: IUser = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.ADMIN,
            blockedStatus: BlockedStatus.UNBLOCKED,
        }
        const superAdmin = await User.create(payload);
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
}