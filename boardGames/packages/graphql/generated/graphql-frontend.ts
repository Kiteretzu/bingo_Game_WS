import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type BingoGame = {
  __typename?: 'BingoGame';
  createdAt?: Maybe<Scalars['String']['output']>;
  gameEndedAt?: Maybe<Scalars['String']['output']>;
  gameId: Scalars['String']['output'];
  gameLoserId?: Maybe<Scalars['String']['output']>;
  gameWinnerId?: Maybe<Scalars['String']['output']>;
  gameboards: Array<Maybe<Scalars['JSON']['output']>>;
  loserMMR?: Maybe<Scalars['Int']['output']>;
  matchHistory: Array<Maybe<Scalars['JSON']['output']>>;
  players: Array<Maybe<BingoProfile>>;
  tier: BingoGameTier;
  tossWinnerId?: Maybe<Scalars['String']['output']>;
  winMMR?: Maybe<Scalars['Int']['output']>;
  winMethod?: Maybe<Win_Method>;
};

export enum BingoGameTier {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export type BingoPlayerRecords = {
  __typename?: 'BingoPlayerRecords';
  id: Scalars['String']['output'];
  lastPlayedAt: Scalars['String']['output'];
  player1Id: Scalars['String']['output'];
  player1Wins: Scalars['Int']['output'];
  player2Id: Scalars['String']['output'];
  player2Wins: Scalars['Int']['output'];
  totalMatches: Scalars['Int']['output'];
};

export type BingoProfile = {
  __typename?: 'BingoProfile';
  doubleKill_count: Scalars['Int']['output'];
  firstBlood_count: Scalars['Int']['output'];
  gameHistory: Array<Maybe<BingoGame>>;
  id: Scalars['String']['output'];
  league: Leagues;
  lines_count: Scalars['Int']['output'];
  losses: Scalars['Int']['output'];
  mmr: Scalars['Int']['output'];
  perfectionist_count: Scalars['Int']['output'];
  preferredBoards: Array<Maybe<Scalars['JSON']['output']>>;
  rampage_count: Scalars['Int']['output'];
  totalMatches: Scalars['Int']['output'];
  tripleKill_count: Scalars['Int']['output'];
  wins: Scalars['Int']['output'];
};

export type FUser = {
  __typename?: 'FUser';
  avatar?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  googleId: Scalars['String']['output'];
};

export type FriendRequest = {
  __typename?: 'FriendRequest';
  id: Scalars['String']['output'];
  sender: User;
};

export enum FriendRequestStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Friendship = {
  __typename?: 'Friendship';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user1?: Maybe<User>;
  user1Id: Scalars['String']['output'];
  user2?: Maybe<User>;
  user2Id: Scalars['String']['output'];
};

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mmr: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
};

export enum Leagues {
  Bronze = 'BRONZE',
  Diamond = 'DIAMOND',
  Gold = 'GOLD',
  Grandmaster = 'GRANDMASTER',
  Master = 'MASTER',
  Platinum = 'PLATINUM',
  Silver = 'SILVER'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptFriendRequest?: Maybe<FriendRequest>;
  declineFriendRequest?: Maybe<FriendRequest>;
  removeFriend?: Maybe<Scalars['Boolean']['output']>;
  sendFriendRequest?: Maybe<FriendRequest>;
};


export type MutationAcceptFriendRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationDeclineFriendRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationRemoveFriendArgs = {
  googleId: Scalars['String']['input'];
};


export type MutationSendFriendRequestArgs = {
  googleId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  authUser?: Maybe<User>;
  bingoPlayerRecords?: Maybe<BingoPlayerRecords>;
  friendRequests: Array<Maybe<FriendRequest>>;
  friends: Array<Maybe<FUser>>;
  gameHistory: Array<Maybe<BingoGame>>;
  leaderboard: Array<LeaderboardEntry>;
  user?: Maybe<User>;
};


export type QueryBingoPlayerRecordsArgs = {
  profileId: Scalars['String']['input'];
};


export type QueryFriendsArgs = {
  googleId: Scalars['String']['input'];
};


export type QueryGameHistoryArgs = {
  bingoProfileId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLeaderboardArgs = {
  limit: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  googleId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  bingoProfile?: Maybe<BingoProfile>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  friends?: Maybe<Array<Maybe<FUser>>>;
  googleId: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  receivedRequests?: Maybe<Array<Maybe<FriendRequest>>>;
  sentRequests?: Maybe<Array<Maybe<FriendRequest>>>;
};

export enum Win_Method {
  Abandon = 'ABANDON',
  Bingo = 'BINGO',
  Resignation = 'RESIGNATION'
}

export type GetAuthProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthProfileQuery = { __typename?: 'Query', authUser?: { __typename?: 'User', googleId: string, displayName?: string | null, email?: string | null, avatar?: string | null, bingoProfile?: { __typename?: 'BingoProfile', id: string, totalMatches: number, wins: number, losses: number, league: Leagues, gameHistory: Array<{ __typename?: 'BingoGame', gameId: string, gameWinnerId?: string | null, createdAt?: string | null, gameEndedAt?: string | null, winMethod?: Win_Method | null, tier: BingoGameTier, gameLoserId?: string | null, winMMR?: number | null, loserMMR?: number | null } | null> } | null } | null };

export type GetServerPlayerProfileQueryVariables = Exact<{
  googleId: Scalars['String']['input'];
}>;


export type GetServerPlayerProfileQuery = { __typename?: 'Query', user?: { __typename?: 'User', googleId: string, displayName?: string | null, avatar?: string | null, bingoProfile?: { __typename?: 'BingoProfile', id: string, mmr: number, league: Leagues, losses: number, wins: number, totalMatches: number } | null } | null };

export type GetLeaderboardPlayersQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
}>;


export type GetLeaderboardPlayersQuery = { __typename?: 'Query', leaderboard: Array<{ __typename?: 'LeaderboardEntry', id: string, mmr: number, rank: number, displayName: string }> };

export type GetGameHistoryQueryVariables = Exact<{
  bingoProfileId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetGameHistoryQuery = { __typename?: 'Query', gameHistory: Array<{ __typename?: 'BingoGame', gameId: string, gameWinnerId?: string | null, createdAt?: string | null, gameEndedAt?: string | null, winMethod?: Win_Method | null, tier: BingoGameTier, gameLoserId?: string | null, winMMR?: number | null, loserMMR?: number | null } | null> };

export type GetBingoPlayerRecordsQueryVariables = Exact<{
  profileId: Scalars['String']['input'];
}>;


export type GetBingoPlayerRecordsQuery = { __typename?: 'Query', bingoPlayerRecords?: { __typename?: 'BingoPlayerRecords', player1Id: string, player2Id: string, player1Wins: number, player2Wins: number, totalMatches: number } | null };

export type GetAllFriendRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllFriendRequestsQuery = { __typename?: 'Query', friendRequests: Array<{ __typename?: 'FriendRequest', sender: { __typename?: 'User', googleId: string, displayName?: string | null, avatar?: string | null } } | null> };


export const GetAuthProfileDocument = gql`
    query getAuthProfile {
  authUser {
    googleId
    displayName
    email
    avatar
    bingoProfile {
      id
      totalMatches
      wins
      losses
      league
      gameHistory {
        gameId
        gameWinnerId
        createdAt
        gameEndedAt
        winMethod
        tier
        gameLoserId
        winMMR
        loserMMR
      }
    }
  }
}
    `;

/**
 * __useGetAuthProfileQuery__
 *
 * To run a query within a React component, call `useGetAuthProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAuthProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetAuthProfileQuery, GetAuthProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthProfileQuery, GetAuthProfileQueryVariables>(GetAuthProfileDocument, options);
      }
export function useGetAuthProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthProfileQuery, GetAuthProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthProfileQuery, GetAuthProfileQueryVariables>(GetAuthProfileDocument, options);
        }
export function useGetAuthProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuthProfileQuery, GetAuthProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuthProfileQuery, GetAuthProfileQueryVariables>(GetAuthProfileDocument, options);
        }
export type GetAuthProfileQueryHookResult = ReturnType<typeof useGetAuthProfileQuery>;
export type GetAuthProfileLazyQueryHookResult = ReturnType<typeof useGetAuthProfileLazyQuery>;
export type GetAuthProfileSuspenseQueryHookResult = ReturnType<typeof useGetAuthProfileSuspenseQuery>;
export type GetAuthProfileQueryResult = Apollo.QueryResult<GetAuthProfileQuery, GetAuthProfileQueryVariables>;
export const GetServerPlayerProfileDocument = gql`
    query getServerPlayerProfile($googleId: String!) {
  user(googleId: $googleId) {
    googleId
    displayName
    avatar
    bingoProfile {
      id
      mmr
      league
      losses
      wins
      totalMatches
    }
  }
}
    `;

/**
 * __useGetServerPlayerProfileQuery__
 *
 * To run a query within a React component, call `useGetServerPlayerProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerPlayerProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerPlayerProfileQuery({
 *   variables: {
 *      googleId: // value for 'googleId'
 *   },
 * });
 */
export function useGetServerPlayerProfileQuery(baseOptions: Apollo.QueryHookOptions<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables> & ({ variables: GetServerPlayerProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables>(GetServerPlayerProfileDocument, options);
      }
export function useGetServerPlayerProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables>(GetServerPlayerProfileDocument, options);
        }
export function useGetServerPlayerProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables>(GetServerPlayerProfileDocument, options);
        }
export type GetServerPlayerProfileQueryHookResult = ReturnType<typeof useGetServerPlayerProfileQuery>;
export type GetServerPlayerProfileLazyQueryHookResult = ReturnType<typeof useGetServerPlayerProfileLazyQuery>;
export type GetServerPlayerProfileSuspenseQueryHookResult = ReturnType<typeof useGetServerPlayerProfileSuspenseQuery>;
export type GetServerPlayerProfileQueryResult = Apollo.QueryResult<GetServerPlayerProfileQuery, GetServerPlayerProfileQueryVariables>;
export const GetLeaderboardPlayersDocument = gql`
    query getLeaderboardPlayers($limit: Int!) {
  leaderboard(limit: $limit) {
    id
    mmr
    rank
    displayName
  }
}
    `;

/**
 * __useGetLeaderboardPlayersQuery__
 *
 * To run a query within a React component, call `useGetLeaderboardPlayersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaderboardPlayersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaderboardPlayersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetLeaderboardPlayersQuery(baseOptions: Apollo.QueryHookOptions<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables> & ({ variables: GetLeaderboardPlayersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables>(GetLeaderboardPlayersDocument, options);
      }
export function useGetLeaderboardPlayersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables>(GetLeaderboardPlayersDocument, options);
        }
export function useGetLeaderboardPlayersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables>(GetLeaderboardPlayersDocument, options);
        }
export type GetLeaderboardPlayersQueryHookResult = ReturnType<typeof useGetLeaderboardPlayersQuery>;
export type GetLeaderboardPlayersLazyQueryHookResult = ReturnType<typeof useGetLeaderboardPlayersLazyQuery>;
export type GetLeaderboardPlayersSuspenseQueryHookResult = ReturnType<typeof useGetLeaderboardPlayersSuspenseQuery>;
export type GetLeaderboardPlayersQueryResult = Apollo.QueryResult<GetLeaderboardPlayersQuery, GetLeaderboardPlayersQueryVariables>;
export const GetGameHistoryDocument = gql`
    query getGameHistory($bingoProfileId: String, $limit: Int) {
  gameHistory(bingoProfileId: $bingoProfileId, limit: $limit) {
    gameId
    gameWinnerId
    createdAt
    gameEndedAt
    winMethod
    tier
    gameLoserId
    winMMR
    loserMMR
  }
}
    `;

/**
 * __useGetGameHistoryQuery__
 *
 * To run a query within a React component, call `useGetGameHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGameHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGameHistoryQuery({
 *   variables: {
 *      bingoProfileId: // value for 'bingoProfileId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetGameHistoryQuery(baseOptions?: Apollo.QueryHookOptions<GetGameHistoryQuery, GetGameHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGameHistoryQuery, GetGameHistoryQueryVariables>(GetGameHistoryDocument, options);
      }
export function useGetGameHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGameHistoryQuery, GetGameHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGameHistoryQuery, GetGameHistoryQueryVariables>(GetGameHistoryDocument, options);
        }
export function useGetGameHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGameHistoryQuery, GetGameHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGameHistoryQuery, GetGameHistoryQueryVariables>(GetGameHistoryDocument, options);
        }
export type GetGameHistoryQueryHookResult = ReturnType<typeof useGetGameHistoryQuery>;
export type GetGameHistoryLazyQueryHookResult = ReturnType<typeof useGetGameHistoryLazyQuery>;
export type GetGameHistorySuspenseQueryHookResult = ReturnType<typeof useGetGameHistorySuspenseQuery>;
export type GetGameHistoryQueryResult = Apollo.QueryResult<GetGameHistoryQuery, GetGameHistoryQueryVariables>;
export const GetBingoPlayerRecordsDocument = gql`
    query getBingoPlayerRecords($profileId: String!) {
  bingoPlayerRecords(profileId: $profileId) {
    player1Id
    player2Id
    player1Wins
    player2Wins
    totalMatches
  }
}
    `;

/**
 * __useGetBingoPlayerRecordsQuery__
 *
 * To run a query within a React component, call `useGetBingoPlayerRecordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBingoPlayerRecordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBingoPlayerRecordsQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useGetBingoPlayerRecordsQuery(baseOptions: Apollo.QueryHookOptions<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables> & ({ variables: GetBingoPlayerRecordsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables>(GetBingoPlayerRecordsDocument, options);
      }
export function useGetBingoPlayerRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables>(GetBingoPlayerRecordsDocument, options);
        }
export function useGetBingoPlayerRecordsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables>(GetBingoPlayerRecordsDocument, options);
        }
export type GetBingoPlayerRecordsQueryHookResult = ReturnType<typeof useGetBingoPlayerRecordsQuery>;
export type GetBingoPlayerRecordsLazyQueryHookResult = ReturnType<typeof useGetBingoPlayerRecordsLazyQuery>;
export type GetBingoPlayerRecordsSuspenseQueryHookResult = ReturnType<typeof useGetBingoPlayerRecordsSuspenseQuery>;
export type GetBingoPlayerRecordsQueryResult = Apollo.QueryResult<GetBingoPlayerRecordsQuery, GetBingoPlayerRecordsQueryVariables>;
export const GetAllFriendRequestsDocument = gql`
    query getAllFriendRequests {
  friendRequests {
    sender {
      googleId
      displayName
      avatar
    }
  }
}
    `;

/**
 * __useGetAllFriendRequestsQuery__
 *
 * To run a query within a React component, call `useGetAllFriendRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllFriendRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllFriendRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllFriendRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>(GetAllFriendRequestsDocument, options);
      }
export function useGetAllFriendRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>(GetAllFriendRequestsDocument, options);
        }
export function useGetAllFriendRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>(GetAllFriendRequestsDocument, options);
        }
export type GetAllFriendRequestsQueryHookResult = ReturnType<typeof useGetAllFriendRequestsQuery>;
export type GetAllFriendRequestsLazyQueryHookResult = ReturnType<typeof useGetAllFriendRequestsLazyQuery>;
export type GetAllFriendRequestsSuspenseQueryHookResult = ReturnType<typeof useGetAllFriendRequestsSuspenseQuery>;
export type GetAllFriendRequestsQueryResult = Apollo.QueryResult<GetAllFriendRequestsQuery, GetAllFriendRequestsQueryVariables>;