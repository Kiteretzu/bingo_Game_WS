import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import prisma from './prisma'; // Your prisma instance

export const configurePassport = () => {
    // Google OAuth strategy
    
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;

    // **MAKE USER TABLE IN DATABASE

    // Check if the user exists in the database
    
    // let user = await prisma.user.findUnique({ where: { googleId: id } });
    
    // if (!user) {
    //     // If user doesn't exist, create a new one
    //     user = await prisma.user.create({
    //         data: {
    //             googleId: id,
    //             displayName,
    //             email: emails[0].value, // Assuming the first email is the primary one
    //         }
    //     });
    // }

    // // Create a JWT token
    // const token = jwt.sign({ id: user.id, displayName: user.displayName, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // done(null, token);
}));
    // JWT Strategy for protecting routes
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
    }, (jwtPayload, done) => {
        return done(null, jwtPayload);
    }));

};