const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: 'us-east-1_wg7K76bMO',
    ClientId: '73ggn27qdb9qjrqbepr8ndshkn'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

let userDetails = {};

exports.handler = async (event) => {

    const user = {
        email: event.email,
        password: event.password
    };

    const userData = {
        Username: user.email,
        Pool: userPool
    };

    const authenticationData = {
        Username: user.email,
        Password: user.password,
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    const login = await new Promise((resolve, reject) => {

        cognitoUser.authenticateUser(authenticationDetails, {

            onSuccess: function (result) {

                resolve(

                    userDetails = {

                        name: result.idToken.payload.name,
                        user_id: result.idToken.payload.sub,
                        token: result.idToken.jwtToken

                    });

            },

            onFailure: function (error) {

                reject(error.message || JSON.stringify(error));

            }

        });

    });

    return login;

};
