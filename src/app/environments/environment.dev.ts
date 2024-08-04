export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: '6c6393cb-1fed-44de-bd78-0365519efc82',
      authority: 'https://login.microsoftonline.com/common',
    },
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
