import { BingoProfile, Prisma, User } from "@repo/db/client"; // Import Prisma types
import { profile } from "console";

declare global {
  namespace Express {
    interface Request {
      token: string,
      user?: {
        profile: User & BingoProfile;
        token: string;
      } | null;
    }
  }
}