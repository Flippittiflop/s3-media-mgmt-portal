import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    },
  });
};