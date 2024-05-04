import http from 'http'
import router from "@/router";

const requestListener: http.RequestListener = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    if(req.method === 'OPTIONS') {
        res.end()
    } else {
        router.lookup(req, res)
    }
}

if (import.meta.env.PROD) {
    const host = import.meta.env.VITE_APP_HOST || '127.0.0.1'
    const port = import.meta.env.VITE_APP_PORT || '5000'
    const server = http.createServer(requestListener)

    server.listen(port, () => {
        console.log(`🚀 Server ready at ${host}:${port}`)
    })
}
export const viteNodeApp = requestListener
