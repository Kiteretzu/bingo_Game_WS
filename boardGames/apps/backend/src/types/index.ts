import { BingoProfile, User } from "@repo/db/client";

export interface PASSPORT_AUTH_USER {
    profile: User & BingoProfile,
    token: string
}

export interface DECODED_TOKEN {
    googleId: string
    email: string
}