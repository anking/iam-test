//import * as AWS from 'aws-sdk/global';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';


export default class Cognito {

  static poolData = {
      UserPoolId: 'us-west-2_Eq24319p4',
    ClientId: '2niq4u4cjli5ce9hftkgvmto4q'
  };


  static auth = (username: string, password: string) => {

    const userData = {
      Username: username,
      Pool: new AmazonCognitoIdentity.CognitoUserPool(Cognito.poolData),
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    let returnPromise = new Promise<AmazonCognitoIdentity.CognitoUserSession>((resolve, reject) => {

      let authenticationData = new AmazonCognitoIdentity.AuthenticationDetails({ Username: username, Password: password })

      cognitoUser.authenticateUser(authenticationData, {
        onSuccess: resolve,
        onFailure: reject
      });      
    });

    return returnPromise;
  }


  //Get current cognito user
  static getUser = (): AmazonCognitoIdentity.CognitoUser | null => new AmazonCognitoIdentity.CognitoUserPool(Cognito.poolData).getCurrentUser();

  //Get access token for current user
  static getAccessToken = (): Promise<AmazonCognitoIdentity.CognitoAccessToken> => {

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(Cognito.poolData);

    const cognitoUser = userPool.getCurrentUser();

    let returnPromise = new Promise<AmazonCognitoIdentity.CognitoAccessToken>((resolve, reject) => {

      if (cognitoUser !== null) {
        cognitoUser.getSession((err: any, session: AmazonCognitoIdentity.CognitoUserSession) => {

          //console.log('session validity: ' + session.isValid());

          if (err) {
            alert(err.message || JSON.stringify(err));
            reject(err.message);
          }
          resolve(session.getAccessToken());
        });
      }
    });

    return returnPromise;;
  }
}