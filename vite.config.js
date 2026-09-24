import { defineConfig, loadEnv } from 'vite';

// Serves the Vercel function in api/lead.js during `npm run dev`, reading secrets from .env
function leadApiDev() {
  return {
    name: 'lead-api-dev',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''));
      server.middlewares.use('/api/lead', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/lead.js');
        await handler(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [leadApiDev()],
});
