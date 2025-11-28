#!/usr/bin/env node

import { deployWebsite } from "../deploy-website";
import { getWebsiteBucketName } from "../website-bucket-name";

function printUsage(): void {
  console.log(`
Usage: upload-website --domain <domain> [--profile <profile>] [--path <websitePath>]

Options:
  --domain, -d   Domain name (required) - used to generate bucket name
  --profile, -p  AWS profile name (optional, uses default credentials if not specified)
  --path, -w     Path to website folder (optional, default: "website")
  --help, -h     Show this help message

Examples:
  upload-website --domain example.com
  upload-website --domain example.com --profile pss
  upload-website --domain example.com --profile pss --path ./dist
`);
}

function parseArgs(args: string[]): { domain?: string; profile?: string; websitePath?: string } {
  const result: { domain?: string; profile?: string; websitePath?: string } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--domain":
      case "-d":
        result.domain = nextArg;
        i++;
        break;
      case "--profile":
      case "-p":
        result.profile = nextArg;
        i++;
        break;
      case "--path":
      case "-w":
        result.websitePath = nextArg;
        i++;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
    }
  }

  return result;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.domain) {
    console.error("Error: --domain is required\n");
    printUsage();
    process.exit(1);
  }

  const bucketName = getWebsiteBucketName(args.domain);

  console.log(`Domain: ${args.domain}`);
  console.log(`Bucket: ${bucketName}`);
  if (args.profile) {
    console.log(`Profile: ${args.profile}`);
  }
  console.log(`Website path: ${args.websitePath || "website"}`);
  console.log("");

  await deployWebsite({
    bucketName,
    profile: args.profile,
    websitePath: args.websitePath,
  });
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
