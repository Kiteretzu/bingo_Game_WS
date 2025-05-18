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
  isGameStarted?: Maybe<Scalars['Boolean']['output']>;
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
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  receiver: FUser;
  sender: FUser;
  status: Scalars['String']['output'];
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
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  authUser?: Maybe<User>;
  bingoPlayerRecords?: Maybe<BingoPlayerRecords>;
  friends: Array<Maybe<FUser>>;
  gameHistory: Array<Maybe<BingoGame>>;
  getFriendRequest: Array<Maybe<FriendRequest>>;
  leaderboard: Array<LeaderboardEntry>;
  user?: Maybe<User>;
  validGameId: Scalars['Boolean']['output'];
};


export type QueryBingoPlayerRecordsArgs = {
  profileId: Scalars['String']['input'];
};


export type QueryFriendsArgs = {
  googleId?: InputMaybe<Scalars['String']['input']>;
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


export type QueryValidGameIdArgs = {
  gameId: Scalars['String']['input'];
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


export type GetAllFriendRequestsQuery = { __typename?: 'Query', getFriendRequest: Array<{ __typename?: 'FriendRequest', id: string, createdAt: string, status: string, sender: { __typename?: 'FUser', googleId: string, displayName?: string | null, avatar?: string | null } } | null> };

export type GetFriendsQueryVariables = Exact<{
  googleId: Scalars['String']['input'];
}>;


export type GetFriendsQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'FUser', googleId: string, displayName?: string | null, avatar?: string | null } | null> };

export type ValidGameIdQueryVariables = Exact<{
  gameId: Scalars['String']['input'];
}>;


export type ValidGameIdQuery = { __typename?: 'Query', validGameId: boolean };

export type AcceptFriendRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type AcceptFriendRequestMutation = { __typename?: 'Mutation', acceptFriendRequest?: { __typename?: 'FriendRequest', id: string, status: string } | null };

export type DeclineFriendRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type DeclineFriendRequestMutation = { __typename?: 'Mutation', declineFriendRequest?: { __typename?: 'FriendRequest', id: string, status: string } | null };

export type SendFriendRequestMutationVariables = Exact<{
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest?: { __typename?: 'FriendRequest', id: string, status: string, createdAt: string } | null };


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
  getFriendRequest {
    id
    createdAt
    status
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
export const GetFriendsDocument = gql`
    query getFriends($googleId: String!) {
  friends(googleId: $googleId) {
    googleId
    displayName
    avatar
  }
}
    `;

/**
 * __useGetFriendsQuery__
 *
 * To run a query within a React component, call `useGetFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsQuery({
 *   variables: {
 *      googleId: // value for 'googleId'
 *   },
 * });
 */
export function useGetFriendsQuery(baseOptions: Apollo.QueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables> & ({ variables: GetFriendsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
      }
export function useGetFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
        }
export function useGetFriendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
        }
export type GetFriendsQueryHookResult = ReturnType<typeof useGetFriendsQuery>;
export type GetFriendsLazyQueryHookResult = ReturnType<typeof useGetFriendsLazyQuery>;
export type GetFriendsSuspenseQueryHookResult = ReturnType<typeof useGetFriendsSuspenseQuery>;
export type GetFriendsQueryResult = Apollo.QueryResult<GetFriendsQuery, GetFriendsQueryVariables>;
export const ValidGameIdDocument = gql`
    query validGameId($gameId: String!) {
  validGameId(gameId: $gameId)
}
    `;

/**
 * __useValidGameIdQuery__
 *
 * To run a query within a React component, call `useValidGameIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidGameIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidGameIdQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useValidGameIdQuery(baseOptions: Apollo.QueryHookOptions<ValidGameIdQuery, ValidGameIdQueryVariables> & ({ variables: ValidGameIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValidGameIdQuery, ValidGameIdQueryVariables>(ValidGameIdDocument, options);
      }
export function useValidGameIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValidGameIdQuery, ValidGameIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValidGameIdQuery, ValidGameIdQueryVariables>(ValidGameIdDocument, options);
        }
export function useValidGameIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ValidGameIdQuery, ValidGameIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ValidGameIdQuery, ValidGameIdQueryVariables>(ValidGameIdDocument, options);
        }
export type ValidGameIdQueryHookResult = ReturnType<typeof useValidGameIdQuery>;
export type ValidGameIdLazyQueryHookResult = ReturnType<typeof useValidGameIdLazyQuery>;
export type ValidGameIdSuspenseQueryHookResult = ReturnType<typeof useValidGameIdSuspenseQuery>;
export type ValidGameIdQueryResult = Apollo.QueryResult<ValidGameIdQuery, ValidGameIdQueryVariables>;
export const AcceptFriendRequestDocument = gql`
    mutation acceptFriendRequest($requestId: String!) {
  acceptFriendRequest(requestId: $requestId) {
    id
    status
  }
}
    `;
export type AcceptFriendRequestMutationFn = Apollo.MutationFunction<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;

/**
 * __useAcceptFriendRequestMutation__
 *
 * To run a mutation, you first call `useAcceptFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptFriendRequestMutation, { data, loading, error }] = useAcceptFriendRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useAcceptFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>(AcceptFriendRequestDocument, options);
      }
export type AcceptFriendRequestMutationHookResult = ReturnType<typeof useAcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationResult = Apollo.MutationResult<AcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationOptions = Apollo.BaseMutationOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;
export const DeclineFriendRequestDocument = gql`
    mutation declineFriendRequest($requestId: String!) {
  declineFriendRequest(requestId: $requestId) {
    id
    status
  }
}
    `;
export type DeclineFriendRequestMutationFn = Apollo.MutationFunction<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>;

/**
 * __useDeclineFriendRequestMutation__
 *
 * To run a mutation, you first call `useDeclineFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineFriendRequestMutation, { data, loading, error }] = useDeclineFriendRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useDeclineFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>(DeclineFriendRequestDocument, options);
      }
export type DeclineFriendRequestMutationHookResult = ReturnType<typeof useDeclineFriendRequestMutation>;
export type DeclineFriendRequestMutationResult = Apollo.MutationResult<DeclineFriendRequestMutation>;
export type DeclineFriendRequestMutationOptions = Apollo.BaseMutationOptions<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>;
export const SendFriendRequestDocument = gql`
    mutation sendFriendRequest($from: String!, $to: String!) {
  sendFriendRequest(from: $from, to: $to) {
    id
    status
    createdAt
  }
}
    `;
export type SendFriendRequestMutationFn = Apollo.MutationFunction<SendFriendRequestMutation, SendFriendRequestMutationVariables>;

/**
 * __useSendFriendRequestMutation__
 *
 * To run a mutation, you first call `useSendFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendFriendRequestMutation, { data, loading, error }] = useSendFriendRequestMutation({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useSendFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendFriendRequestMutation, SendFriendRequestMutationVariables>(SendFriendRequestDocument, options);
      }
export type SendFriendRequestMutationHookResult = ReturnType<typeof useSendFriendRequestMutation>;
export type SendFriendRequestMutationResult = Apollo.MutationResult<SendFriendRequestMutation>;
export type SendFriendRequestMutationOptions = Apollo.BaseMutationOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>;