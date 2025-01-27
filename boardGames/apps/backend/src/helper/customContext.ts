import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { DECODED_TOKEN } from "types";
import { BingoProfile, client, User } from "@repo/db/client";
import { ContextParams } from "graphql-passport/lib/buildContext";
import { verifyToken } from "helper";

export interface CustomContext {
  req: Request;
  res: Response;
  getUser: () => Promise<User & BingoProfile | null>;
  isAuthenticated: () => Promise<boolean>;
  isUnauthenticated: () => Promise<boolean>;
  // authenticate?: <UserObjectType extends {}>(
  //   strategyName: string,
  //   options?: object
  // ) => Promise<AuthenticateReturn<UserObjectType>>;
}

export const customContext = ({ req, res }: ContextParams) => {
  /**
   * A function to authenticate using a given Passport strategy.
   */
  //   const authenticate = <UserObjectType extends {}>(
  //     strategyName: string,
  //     options: object = {}
  //   ): Promise<AuthenticateReturn<UserObjectType>> => {
  //     return new Promise((resolve, reject) => {
  //       passport.authenticate(strategyName, options, (err: any, user: UserObjectType, info: any) => {
  //         if (err) {
  //           return reject(
  //             new GraphQLError("Authentication failed", {
  //               extensions: { error: err },
  //             })
  //           );
  //         }
  //         resolve({ user, info, error: null });
  //       })(req, res);
  //     });
  //   };

  const getUser = async () => {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new GraphQLError("Authorization header is missing", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      // Extract the token
      const token = header.split(" ")[1];

      // Verify the JWT token
      console.log('thisis token', token)
     const decodedToken = verifyToken(token) // always in tryCatch

      // Fetch the user from the database using the decoded token
      const user = await client.user.findUnique({
        where: {
         googleId: decodedToken.googleId,
        },
        include: {
          bingoProfile: true,
        },
      });

      console.log("Auth User profile", {user})

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      return user; // Return the authenticated user
    } catch (error: any) {
      throw new GraphQLError("Authentication failed", {
        extensions: {
          code: "UNAUTHENTICATED",
          error: error.message,
        },
      });
    }
  };

  const isAuthenticated = async (): Promise<boolean> => {
    try {
      const user = await getUser();
      return !!user; // Returns true if user exists (authenticated)
    } catch (error) {
      return false; // Returns false if JWT verification fails (unauthenticated)
    }
  };

  const isUnauthenticated = async (): Promise<boolean> => {
    try {
      const user = await getUser();
      return !user; // Returns true if no user exists (unauthenticated)
    } catch (error) {
      return true; // Returns true if JWT verification fails (unauthenticated)
    }
  };

  return {
    req,
    res,
    // authenticate,
    getUser,
    isAuthenticated,
    isUnauthenticated,
    // logout,
  };
};

export default customContext;
