import { Router } from "express";
import passport from "passport";
import { PASSPORT_AUTH_USER } from "types";

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const { token } = req.user as PASSPORT_AUTH_USER;
    // Redirect with the token or send it as JSON, but not both.
    res.redirect(`http://localhost:5173/profile?token=${token}`);
  }
);
 
authRouter.get(
  '/amazing',
  passport.authenticate('jwt', { session: false }), // Use Passport-JWT
  (req, res) => {
    res.json({ message: 'You are authenticated!', user: req.user });
  }
);

export default authRouter;
