import { CognitoUserPool } from "amazon-cognito-identity-js"

const userPool = new CognitoUserPool({
  UserPoolId: "ap-south-2_7rxT0xxhb", // your user pool id
  ClientId: "ovni93i9pb89vos671tj87cml", // your app client id
})

export default userPool
