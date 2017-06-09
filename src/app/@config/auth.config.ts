interface AuthConfiguration {
  domain: string;
  clientID: string;
  redirectUri: string;
  responseType: string;
  audience: string;
  issuer: string;
  tenant: string;
  scope: string;
  algorithms: [string];
  lock: any;
}

export const myConfig: AuthConfiguration = {
  domain: process.env.AUTH0_BASE_DOMAIN_ONLY,
  clientID: process.env.AUTH0_CLIENT_ID,
  redirectUri: process.env.AUTH_CB,
  responseType: 'token id_token',
  audience: 'https://bee-companion.com/api',
  issuer: process.env.AUTH0_BASE_DOMAIN,
  tenant: 'bee-companion',
  scope: 'openid profile email',
  algorithms: ['RS256'],
  lock: {
    socialButtonStyle: 'small',
    theme: {
      logo: '../assets/img/mainlogo_hd.png',
      primaryColor: '#F6DD3B',
      foregroundColor: '#000000',
      labeledSubmitButton: false
    },
    languageDictionary: {
      title: 'Bee Companion'
    },
    additionalSignUpFields: [
      {
        name: 'first_name',
        placeholder: 'your first name',
        validator: (name) => {
          return {
            valid: name.length >= 3,
            hint: 'Must have 3 or more chars' // optional
          };
        }
      },
      {
        name: 'last_name',
        placeholder: 'your last name',
        validator: (name) => {
          return {
            valid: name.length >= 3,
            hint: 'Must have 3 or more chars' // optional
          };
        }
      }
    ]
  }
};

export const postConfig = {
  method: 'POST',
  urlForgotPassword: process.env.AUTH0_BASE_DOMAIN + 'dbconnections/change_password',
  urlLogin: process.env.AUTH0_BASE_DOMAIN + 'oauth/ro',
  headers: {
    'content-type': 'application/json'
  },
  body: {
    client_id: process.env.AUTH0_CLIENT_ID,
    email: '',
    connection: 'Username-Password-Authentication'
  },
  json: true
};

export const necessaryRoles = ['Beekeeper', 'Supporter', 'Admin'];
