import { client } from "@repo/db/client";
import { Router, Request, Response } from "express";

const adminRouter = Router();

type AccCreation = {
    displayName: string;
    isAdmin: boolean
};


adminRouter.post("/create", async (req: Request, res: any) => {
    // Validate incoming request data
    const {displayName, isAdmin} :AccCreation = req.body
    

    if (!isAdmin) {
        return res.status(400).json({ error: "Invalid input. `displayName` is required and should be a non-empty string." });
    }

    // Simulating account creation logic
    try {
       const newAccount = await client.user.create({
        data: {
            displayName: displayName,
            isAdmin: isAdmin
        }
       })

        // Respond with the created account
        return res.status(201).json({
            message: "Account successfully created!",
            account: newAccount,
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while creating the account. Please try again later.",
        });
    }
});

export default adminRouter;