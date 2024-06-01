import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
  templates,
} from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

const countries = introspect.graphql({
  apiNamespace: 'countries',
  url: 'https://countries.trevorblades.com/'
});

configureWunderGraphApplication({
  apis: [countries],
  server,
  operations,
  generate: {
    codeGenerators: [
      {
        templates: [templates.typescript.client],
        path: '../../packages/generated-wundergraph'
      }
    ],
  },
  authentication: {
    tokenBased: {
      providers: [
        {
          userInfoEndpoint: process.env.NODE_ENV === 'production'
            ? 'https://next.visioncreator.works/auth/userinfo'
            : 'http://localhost:3000/auth/userinfo',
        },
      ],
    },
  },
  cors: {
    ...cors.allowAll,
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? [
          "https://next.visioncreator.works",
        ]
        : [
          "http://localhost:3000",
          new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
        ],
  },
  security: {
    enableGraphQLEndpoint:
      process.env.NODE_ENV !== "production" ||
      process.env.GITPOD_WORKSPACE_ID !== undefined,
  },
  options: {
    publicNodeUrl: process.env.NODE_ENV === 'production' ? 'https://next-visioncreator.fly.dev' : 'http://localhost:9991'
  },
  authorization: {
    roles: ["authenticated"],
  },
});
