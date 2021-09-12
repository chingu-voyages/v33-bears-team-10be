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
}
