/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";
import { BlockedStatus } from "../modules/user/user.interface";

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email })

            if (!isUserExist) {
                return done(null, false, { message: "User does not exist" })
            }

            const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match" })
            }
            if (isUserExist.blockedStatus === BlockedStatus.BLOCKED) {
                return done(null, false, { message: `User is ${isUserExist.blockedStatus}` })
            }
            if (isUserExist.driverInfo?.suspended === true) {
                return done(null, false, { message: "Driver account is suspended." })
            }

            return done(null, isUserExist)


        } catch (error) {
            done(error)
        }
    })
)

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        done(error)
    }
})