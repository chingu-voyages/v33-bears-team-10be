import { Request } from 'express';

export type User = {
    id: string;
    accessToken: string;
    displayName: string;
    profileImage: string;
    product: string;
};

export interface RequestWithUser extends Request {
    user?: User;
    isAuthenticated(): boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: {
        offset?: string,
        limit?: string,
    };
}
