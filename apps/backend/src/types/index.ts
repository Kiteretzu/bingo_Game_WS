import { BingoProfile, User } from "@repo/db/client";

export interface PASSPORT_AUTH_USER {
    profile: User & BingoProfile,
    token: string
}

// being used when you decode a jwt token
export interface DECODED_TOKEN {
    googleId: string
    email: string
}
