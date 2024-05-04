import ctxHandler from "../utils/ctx-handler.ts";

export default ctxHandler((ctx: { message: any }) => {
    return {
        message: ctx.message
    }
})
