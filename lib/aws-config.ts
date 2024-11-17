import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      mandatorySignIn: true,
      cookieStorage: {
        domain: 'localhost',
        path: '/',
        expires: 365,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    API: {
      endpoints: [
        {
          name: 'api',
          endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
          region: process.env.NEXT_PUBLIC_AWS_REGION,
          custom_header: async () => {
            try {
              const session = await Amplify.Auth.currentSession();
              return {
                Authorization: `Bearer ${session.getAccessToken().getJwtToken()}`,
                'Content-Type': 'application/json'
              };
            } catch (error) {
              console.error('Error getting access token:', error);
              return {};
            }
          }
        }
      ]
    }
  });
};
