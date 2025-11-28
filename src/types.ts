import * as cdk from "aws-cdk-lib";

export interface PlatformStackConfig {
  project: string;
  domain: string;
  websiteSourcePath?: string;
}

export interface PlatformStackProps extends cdk.StackProps {
  config: PlatformStackConfig;
}
