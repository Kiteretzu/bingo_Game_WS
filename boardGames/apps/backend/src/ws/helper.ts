import { GetServerPlayerProfileDocument } from '@repo/graphql/types/client';
import jwt from 'jsonwebtoken';
import { DECODED_TOKEN } from 'types';
const { request } = require('graphql-request');



export async function getPlayerData(token: string): Promise<any> {
  try {
    // Decode the JWT token to extract googleId
    const googleId = (jwt.verify(token, process.env.JWT_SECRET!) as DECODED_TOKEN).googleId;
    
    // Prepare the variables for the GraphQL query
    const variables = { googleId };

    // Fetch the player data from the server using the GraphQL request
    const playerData = await request("http://localhost:8080/graphql", GetServerPlayerProfileDocument, variables);

    return playerData;
  } catch (error) {
    console.error('Error fetching player data:', error);
    return null; // or handle error accordingly
  }
}