import { NixpacksConfig } from '@railway/railway-config';

export default {
  build: {
    builder: "DOCKERFILE",
    dockerfilePath: "./Dockerfile"
  },
  deploy: {
    startCommand: "node server.js",
    restartPolicyType: "ON_FAILURE",
    restartPolicyMaxRetries: 10
  }
};
