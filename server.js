require('dotenv').config()
const http = require('http')

const PORT = process.env.PORT || 3000
const HOSTNAME = process.env.HOST || '0.0.0.0'

const server = http.createServer()

server.on('listening', function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
server.on('request', function (req, res) {
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method not allowed\n')
    return
  }

  const path = req.url
  const uri = `${process.env.OSS_ENDPOINT}${path}`
  http.get(uri, (result) => {
    if (!!result.headers[`x-oss-meta-${process.env.IS_SENSITIVE_META_NAME}`]) {
      result.destroy()
      const text = 'Forbidden\n'
      res.writeHead(403, {
        ...result.headers,
        'content-type': 'text/plain',
        'content-length': text.length,
      })
      res.end(text)
      return
    }
    res.writeHead(result.statusCode, result.headers)
    result.pipe(res)
  })
})

server.listen(PORT, HOSTNAME)
