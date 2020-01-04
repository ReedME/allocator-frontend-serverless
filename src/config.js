export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "ap-southeast-2",
      BUCKET: "notes-app-testing-reedme"
    },
    apiGateway: {
      REGION: "ap-southeast-2",
      URL: "https://q3nmtsh009.execute-api.ap-southeast-2.amazonaws.com/prod"
    },
    cognito: {
      REGION: "ap-southeast-2",
      USER_POOL_ID: "ap-southeast-2_oMnmJytf9",
      APP_CLIENT_ID: "1hsb62n0d10rgfr9tqh7k4oasv",
      IDENTITY_POOL_ID: "ap-southeast-2:d22b3d41-02f6-47eb-a851-52dc3d7d4774"
    }
  };