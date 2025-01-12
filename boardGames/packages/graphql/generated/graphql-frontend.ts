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
  Players?: Maybe<Array<Maybe<BingoProfile>>>;
  gameWinnerId?: Maybe<Scalars['String']['output']>;
  gameboards?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  id: Scalars['String']['output'];
  matchHistory?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  tossWinnerId?: Maybe<Scalars['String']['output']>;
  winMethod?: Maybe<Win_Method>;
};

export type BingoPlayerRecords = {
  __typename?: 'BingoPlayerRecords';
  id: Scalars['String']['output'];
  player1Id: Scalars['String']['output'];
  player2Id: Scalars['String']['output'];
  ratio?: Maybe<Scalars['JSON']['output']>;
};

export type BingoProfile = {
  __typename?: 'BingoProfile';
  doubleKill_count?: Maybe<Scalars['Int']['output']>;
  firstBlood_count?: Maybe<Scalars['Int']['output']>;
  gameHistory?: Maybe<Array<Maybe<BingoGame>>>;
  id: Scalars['String']['output'];
  league?: Maybe<Leagues>;
  lines_count?: Maybe<Scalars['Int']['output']>;
  losses?: Maybe<Scalars['Int']['output']>;
  mmr?: Maybe<Scalars['Int']['output']>;
  perfectionist_count?: Maybe<Scalars['Int']['output']>;
  preferredBoards?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  rampage_count?: Maybe<Scalars['Int']['output']>;
  totalMatches?: Maybe<Scalars['Int']['output']>;
  tripleKill_count?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  wins?: Maybe<Scalars['Int']['output']>;
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

export type Query = {
  __typename?: 'Query';
  authUser?: Maybe<User>;
  bingoGame?: Maybe<BingoGame>;
  bingoPlayerRecord?: Maybe<BingoPlayerRecords>;
  bingoPlayerRecords?: Maybe<Array<Maybe<BingoPlayerRecords>>>;
  user?: Maybe<User>;
};


export type QueryBingoGameArgs = {
  id: Scalars['String']['input'];
};


export type QueryBingoPlayerRecordArgs = {
  player1Id: Scalars['String']['input'];
  player2Id: Scalars['String']['input'];
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
  googleId: Scalars['String']['output'];
};

export enum Win_Method {
  Abandon = 'ABANDON',
  Bingo = 'BINGO',
  Resignation = 'RESIGNATION'
}

export type GetAuthProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthProfileQuery = { __typename?: 'Query', authUser?: { __typename?: 'User', displayName?: string | null, email?: string | null, avatar?: string | null, bingoProfile?: { __typename?: 'BingoProfile', totalMatches?: number | null, wins?: number | null, losses?: number | null, league?: Leagues | null } | null } | null };

export type GetServerPlayerProfileQueryVariables = Exact<{
  googleId: Scalars['String']['input'];
}>;


export type GetServerPlayerProfileQuery = { __typename?: 'Query', user?: { __typename?: 'User', googleId: string, displayName?: string | null, avatar?: string | null, bingoProfile?: { __typename?: 'BingoProfile', id: string, mmr?: number | null, league?: Leagues | null } | null } | null };


export const GetAuthProfileDocument = gql`
    query getAuthProfile {
  authUser {
    displayName
    email
    avatar
    bingoProfile {
      totalMatches
      wins
      losses
      league
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