export default async (req: Request) => {
    let body = []

    const requestMethods = ['POST','DELETE','PATCH','PUT']

    if(requestMethods.includes(req.method)) {
        for await (const chunk of req) {
            body += chunk
        }

        if(req.headers['content-type']?.includes('application/json')) {
            body = JSON.parse(body)
        }
    }

    return body
}
