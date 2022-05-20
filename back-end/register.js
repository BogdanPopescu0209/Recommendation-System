const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: 'us-east-1_wg7K76bMO',
    ClientId: '73ggn27qdb9qjrqbepr8ndshkn'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.handler = async (event) => {

      const newUser = {
          
        email: event.email,
        name: event.name,
        password: event.password
        
    };

    const attributeList = [];

    const dataEmail = {
        
        Name: 'email',
        Value: newUser.email
        
    };

    const dataPersonalName = {
        
        Name: 'name',
        Value: newUser.name
        
    };

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    const attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);

    attributeList.push(attributeEmail);
    attributeList.push(attributePersonalName);

    const register = await new Promise((resolve, reject) => {
        
        userPool.signUp(newUser.email, newUser.password, attributeList, null, function (error, result) {
            
            if (error) {
                
                return reject(error.message || JSON.stringify(error));
                
            }
            
            return resolve(result);
            
        });
        
    });

    return register;
    
};
