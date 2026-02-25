export default () => ({
  port: process.env.PORT || 3000,
  openRouterApiKey: process.env.OPEN_ROUTER_API_KEY || '',
});
