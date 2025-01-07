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
  BingoPlayerRecords: ResolverTypeWrapper<BingoPlayerRecords>;
  BingoProfile: ResolverTypeWrapper<BingoProfile>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Leagues: Leagues;
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
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Query: {};
  String: Scalars['String']['output'];
  User: User;
};

export type BingoGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['BingoGame'] = ResolversParentTypes['BingoGame']> = {
  bingoId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bingoProfile?: Resolver<Maybe<ResolversTypes['BingoProfile']>, ParentType, ContextType>;
  gameWinnerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gameboards?: Resolver<Maybe<Array<Maybe<ResolversTypes['JSON']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matchHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['JSON']>>>, ParentType, ContextType>;
  player1Id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  player2Id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tossWinnerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  winMethod?: Resolver<Maybe<ResolversTypes['Win_method']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BingoPlayerRecordsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BingoPlayerRecords'] = ResolversParentTypes['BingoPlayerRecords']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player1Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player2Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ratio?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BingoProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['BingoProfile'] = ResolversParentTypes['BingoProfile']> = {
  doubleKill_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  firstBlood_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gameHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['BingoGame']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  league?: Resolver<Maybe<ResolversTypes['Leagues']>, ParentType, ContextType>;
  lines_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  losses?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  mmr?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  perfectionist_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  preferredBoards?: Resolver<Maybe<Array<Maybe<ResolversTypes['JSON']>>>, ParentType, ContextType>;
  rampage_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalMatches?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tripleKill_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wins?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  bingoGame?: Resolver<Maybe<ResolversTypes['BingoGame']>, ParentType, ContextType, RequireFields<QueryBingoGameArgs, 'id'>>;
  bingoPlayerRecord?: Resolver<Maybe<ResolversTypes['BingoPlayerRecords']>, ParentType, ContextType, RequireFields<QueryBingoPlayerRecordArgs, 'player1Id' | 'player2Id'>>;
  bingoPlayerRecords?: Resolver<Maybe<Array<Maybe<ResolversTypes['BingoPlayerRecords']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'googleId'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bingoProfile?: Resolver<Maybe<ResolversTypes['BingoProfile']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  googleId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BingoGame?: BingoGameResolvers<ContextType>;
  BingoPlayerRecords?: BingoPlayerRecordsResolvers<ContextType>;
  BingoProfile?: BingoProfileResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

