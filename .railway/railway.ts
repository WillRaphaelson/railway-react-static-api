import { defineRailway, github, project, service } from 'railway/iac';

export default defineRailway(() => {
  const api = service('api', {
    source: github('WillRaphaelson/railway-react-static-api', { branch: 'main', rootDirectory: '/api' }),
    healthcheck: '/health',
    env: { PORT: '3001', NODE_ENV: 'production' },
  });
  const web = service('web', {
    source: github('WillRaphaelson/railway-react-static-api', { branch: 'main', rootDirectory: '/web' }),
    healthcheck: '/health',
    env: { API_HOST: api.env.RAILWAY_PRIVATE_DOMAIN, API_PORT: '3001' },
  });
  return project('react-static-api', { resources: [api, web] });
});
