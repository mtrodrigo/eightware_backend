import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { User } from "../models/User";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
}

const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}

passport.use(
  new JwtStrategy(jwtConfig, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub)

        if (user) {
            return done(null, user)
        } else {
            return done (null, false)
        }
    } catch (error) {
        return done(error, false)
    }
  })
)

export default passport
