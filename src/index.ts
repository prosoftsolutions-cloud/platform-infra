import * as cdk from "aws-cdk-lib";
import { PromoDeployStack } from "./stack";

export function Deploy(): cdk.App {
  const app = new cdk.App();

  new PromoDeployStack(app, "PromoDeployStack", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
  });

  return app;
}

// Run deployment when executed directly
const app = Deploy();
app.synth();
