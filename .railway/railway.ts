import { defineRailway, github, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const cLearningPlatform = service("c-learning-platform", {
    source: github("quantickr/c-learning-platform", { checkSuites: false }),
    dockerfile: { path: "Dockerfile" },
    replicas: { "sfo": 1 },
    env: {
      NIXPACKS_NO_MUSL: preserve(),
      NODE_ENV: preserve(),
      RAPIDAPI_HOST: preserve(),
      PORT: "3000"
    },
  });

  return project("meticulous-achievement", {
    resources: [cLearningPlatform],
  });
});
