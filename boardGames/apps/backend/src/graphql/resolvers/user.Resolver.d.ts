export declare const userResolvers: {
    JSON: import("graphql").GraphQLScalarType<unknown, unknown>;
    Query: {
        authUser: () => {
            id: string;
            name: string;
            password: string;
            isStudent: boolean;
            userType: string;
            validEmail: boolean;
            email: string;
            gender: string;
            createdAt: string;
            guardianContactNo: string;
            otp: null;
        };
        user: (_: unknown, { userId }: {
            userId: string;
        }) => {
            id: string;
            name: string;
            password: string;
            isStudent: boolean;
            userType: string;
            validEmail: boolean;
            email: string;
            gender: string;
            createdAt: string;
            guardianContactNo: string;
            otp: null;
        };
        test: (_parent: unknown, args: {
            message: any;
        }) => Promise<string>;
    };
};
//# sourceMappingURL=user.Resolver.d.ts.map