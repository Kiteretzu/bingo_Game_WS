import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BingoGame: ResolverTypeWrapper<BingoGame>;
  BingoGameTier: BingoGameTier;
  BingoPlayerRecords: ResolverTypeWrapper<BingoPlayerRecords>;
  BingoProfile: ResolverTypeWrapper<BingoProfile>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  FUser: ResolverTypeWrapper<FUser>;
  FriendRequest: ResolverTypeWrapper<FriendRequest>;
  FriendRequestStatus: FriendRequestStatus;
  Friendship: ResolverTypeWrapper<Friendship>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LeaderboardEntry: ResolverTypeWrapper<LeaderboardEntry>;
  Leagues: Leagues;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  Win_method: Win_Method;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BingoGame: BingoGame;
  BingoPlayerRecords: BingoPlayerRecords;
  BingoProfile: BingoProfile;
  Boolean: Scalars['Boolean']['output'];
  FUser: FUser;
  FriendRequest: FriendRequest;
  Friendship: Friendship;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  LeaderboardEntry: LeaderboardEntry;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  User: User;
};

export type BingoGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['BingoGame'] = ResolversParentTypes['BingoGame']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameEndedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gameLoserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameWinnerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameboards?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  loserMMR?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  matchHistory?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  players?: Resolver<Array<Maybe<ResolversTypes['BingoProfile']>>, ParentType, ContextType>;
  tier?: Resolver<ResolversTypes['BingoGameTier'], ParentType, ContextType>;
  tossWinnerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  winMMR?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  winMethod?: Resolver<Maybe<ResolversTypes['Win_method']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BingoPlayerRecordsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BingoPlayerRecords'] = ResolversParentTypes['BingoPlayerRecords']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastPlayedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player1Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player1Wins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  player2Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player2Wins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalMatches?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BingoProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['BingoProfile'] = ResolversParentTypes['BingoProfile']> = {
  doubleKill_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  firstBlood_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gameHistory?: Resolver<Array<Maybe<ResolversTypes['BingoGame']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['Leagues'], ParentType, ContextType>;
  lines_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  losses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  mmr?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perfectionist_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  preferredBoards?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  rampage_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalMatches?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tripleKill_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['FUser'] = ResolversParentTypes['FUser']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  googleId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FriendRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['FriendRequest'] = ResolversParentTypes['FriendRequest']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['FUser'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['FUser'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FriendshipResolvers<ContextType = any, ParentType extends ResolversParentTypes['Friendship'] = ResolversParentTypes['Friendship']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user1?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user1Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user2?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user2Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LeaderboardEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeaderboardEntry'] = ResolversParentTypes['LeaderboardEntry']> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mmr?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptFriendRequest?: Resolver<Maybe<ResolversTypes['FriendRequest']>, ParentType, ContextType, RequireFields<MutationAcceptFriendRequestArgs, 'requestId'>>;
  declineFriendRequest?: Resolver<Maybe<ResolversTypes['FriendRequest']>, ParentType, ContextType, RequireFields<MutationDeclineFriendRequestArgs, 'requestId'>>;
  removeFriend?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveFriendArgs, 'googleId'>>;
  sendFriendRequest?: Resolver<Maybe<ResolversTypes['FriendRequest']>, ParentType, ContextType, RequireFields<MutationSendFriendRequestArgs, 'from' | 'to'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  bingoPlayerRecords?: Resolver<Maybe<ResolversTypes['BingoPlayerRecords']>, ParentType, ContextType, RequireFields<QueryBingoPlayerRecordsArgs, 'profileId'>>;
  friends?: Resolver<Array<Maybe<ResolversTypes['FUser']>>, ParentType, ContextType, Partial<QueryFriendsArgs>>;
  gameHistory?: Resolver<Array<Maybe<ResolversTypes['BingoGame']>>, ParentType, ContextType, Partial<QueryGameHistoryArgs>>;
  getFriendRequest?: Resolver<Array<Maybe<ResolversTypes['FriendRequest']>>, ParentType, ContextType>;
  leaderboard?: Resolver<Array<ResolversTypes['LeaderboardEntry']>, ParentType, ContextType, RequireFields<QueryLeaderboardArgs, 'limit'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'googleId'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bingoProfile?: Resolver<Maybe<ResolversTypes['BingoProfile']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friends?: Resolver<Maybe<Array<Maybe<ResolversTypes['FUser']>>>, ParentType, ContextType>;
  googleId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  receivedRequests?: Resolver<Maybe<Array<Maybe<ResolversTypes['FriendRequest']>>>, ParentType, ContextType>;
  sentRequests?: Resolver<Maybe<Array<Maybe<ResolversTypes['FriendRequest']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BingoGame?: BingoGameResolvers<ContextType>;
  BingoPlayerRecords?: BingoPlayerRecordsResolvers<ContextType>;
  BingoProfile?: BingoProfileResolvers<ContextType>;
  FUser?: FUserResolvers<ContextType>;
  FriendRequest?: FriendRequestResolvers<ContextType>;
  Friendship?: FriendshipResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LeaderboardEntry?: LeaderboardEntryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

