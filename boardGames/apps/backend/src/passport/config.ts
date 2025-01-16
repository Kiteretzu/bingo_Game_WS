import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client"; // Your Prisma client or database client

// Configure Passport
export const configurePassport = () => {
  // Google OAuth2 Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.CALLBACK_URL!,
      },
      async (accessToken, refreshToken, profile, done) => {
        const { id, displayName } = profile;
        console.log('IN PASSPORT!!!!',)
        try {
          // Check if the user exists in the database
          let user = await client.user.findUnique({
            where: { googleId: id },
            include: { bingoProfile: true }, // Example, modify if needed
          });

          // If user does not exist, create a new one
          if (!user) {
            user = await client.user.create({
              data: {
                googleId: id,
                displayName,
                email: profile._json.email,
                avatar: profile._json.picture,
                bingoProfile: { create: {} }, // Create BingoProfile if necessary
              },
              include: { bingoProfile: true },
            });
          }

          // Generate JWT token for the user
          const token = jwt.sign(
            { googleId: user.googleId, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
          );

          // Send the user and token in the done callback
          return done(null, { user, token });
        } catch (error) {
          console.error("Error during Google OAuth:", error);
          return done(error, false);
        }
      }
    )
  );

  // JWT Strategy to protect routes
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (jwtPayload, done) => {
        try {
          console.log('JWT Payload:', jwtPayload); // Optional: Debugging

          // Find user by JWT payload
          const user = await client.user.findUnique({
            where: { googleId: jwtPayload.id },
          });

          // If no user found, return false
          if (!user) return done(null, false);

          // If user found, return user
          return done(null, user);
        } catch (error) {
          console.error("Error validating JWT:", error);
          return done(error, false);
        }
      }
    )
  );
};