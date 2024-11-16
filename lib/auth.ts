'use client';

import { Auth } from 'aws-amplify';
import { configureAmplify } from './aws-config';

configureAmplify();

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  groups: string[];
}

export const signIn = async ({ email, password }: AuthCredentials) => {
  try {
    const user = await Auth.signIn(email, password);
    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'] || [];
    return { 
      user: {
        email: user.attributes.email,
        groups: userGroups,
      },
      error: null 
    };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'] || [];
    return { 
      user: {
        email: user.attributes.email,
        groups: userGroups,
      },
      error: null 
    };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const { user } = await getCurrentUser();
    return user?.groups.includes('Admin') || false;
  } catch {
    return false;
  }
};