export default defineEventHandler((event) => {
  const headers = event.node.req.headers
  const forwardedFor = headers['x-forwarded-for']
  const realIp = headers['x-real-ip']

  return {
    ip: forwardedFor || realIp || event.node.req.socket.remoteAddress,
    userAgent: headers['user-agent'],
    requestTime: new Date().toISOString(),
    requestMethod: event.node.req.method,
    requestUrl: event.node.req.url,
    headers: {
      'x-forwarded-for': forwardedFor,
      'x-real-ip': realIp,
      'cf-connecting-ip': headers['cf-connecting-ip'],
      'cf-ipcountry': headers['cf-ipcountry']
    }
  }
})
