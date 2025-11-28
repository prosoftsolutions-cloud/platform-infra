import * as cdk from "aws-cdk-lib";
import { PlatformStack } from "./platform-stack";
import { PlatformStackConfig } from "./types";

export interface DeployProps {
  region: string;
  awsAccount: string;
  cdkBucket: string;
  config: PlatformStackConfig;
}

export function Deploy(props: DeployProps): cdk.App {
  const { region, awsAccount, cdkBucket, config } = props;

  const app = new cdk.App();

  new PlatformStack(app, "PromoDeployStack", {
    env: {
      account: awsAccount,
      region: region,
    },
    synthesizer: new cdk.DefaultStackSynthesizer({
      fileAssetsBucketName: cdkBucket,
    }),
    config,
  });

  return app;
}

// Run deployment when executed directly
const app = Deploy({
  region: process.env.CDK_DEFAULT_REGION || "us-east-1",
  awsAccount: process.env.CDK_DEFAULT_ACCOUNT || "",
  cdkBucket: process.env.CDK_BUCKET || "",
  config: {
    project: process.env.PROJECT_NAME || "trackmybaby",
    domain: process.env.DOMAIN || "trackmybaby.now",
    websiteSourcePath: process.env.WEBSITE_SOURCE_PATH || "./website",
  },
});
app.synth();
