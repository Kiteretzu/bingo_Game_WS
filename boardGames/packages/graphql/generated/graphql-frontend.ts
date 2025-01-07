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
  bingoId?: Maybe<Scalars['String']['output']>;
  bingoProfile?: Maybe<BingoProfile>;
  gameWinnerId?: Maybe<Scalars['String']['output']>;
  gameboards?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  id: Scalars['String']['output'];
  matchHistory?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  player1Id?: Maybe<Scalars['String']['output']>;
  player2Id?: Maybe<Scalars['String']['output']>;
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

export type LandingPageQueryVariables = Exact<{ [key: string]: never; }>;


export type LandingPageQuery = { __typename?: 'Query', authUser?: { __typename?: 'User', displayName?: string | null, email?: string | null, avatar?: string | null, bingoProfile?: { __typename?: 'BingoProfile', totalMatches?: number | null, wins?: number | null, losses?: number | null, league?: Leagues | null } | null } | null };


export const LandingPageDocument = gql`
    query landingPage {
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
 * __useLandingPageQuery__
 *
 * To run a query within a React component, call `useLandingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLandingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLandingPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useLandingPageQuery(baseOptions?: Apollo.QueryHookOptions<LandingPageQuery, LandingPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LandingPageQuery, LandingPageQueryVariables>(LandingPageDocument, options);
      }
export function useLandingPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LandingPageQuery, LandingPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LandingPageQuery, LandingPageQueryVariables>(LandingPageDocument, options);
        }
export function useLandingPageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LandingPageQuery, LandingPageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LandingPageQuery, LandingPageQueryVariables>(LandingPageDocument, options);
        }
export type LandingPageQueryHookResult = ReturnType<typeof useLandingPageQuery>;
export type LandingPageLazyQueryHookResult = ReturnType<typeof useLandingPageLazyQuery>;
export type LandingPageSuspenseQueryHookResult = ReturnType<typeof useLandingPageSuspenseQuery>;
export type LandingPageQueryResult = Apollo.QueryResult<LandingPageQuery, LandingPageQueryVariables>;