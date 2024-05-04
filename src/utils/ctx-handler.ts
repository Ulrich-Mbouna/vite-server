const replacer = (key, value) =>  typeof value === 'bigint' ? value.toString() : value
export default (callback: (arg0: any) => any) => {
    return async (ctx: any) => {
        let data = null
        let statusCode = 200

        try{
            data = await callback(ctx)
        } catch (err) {
            statusCode = err.statusCode || 500
            data = {
                name: err.name,
                message: err.message,
                stack: err.stack
            }
        }

        data = JSON.stringify(data,replacer)

        return{
            statusCode,
            data
        }
    }
}
