import ctxHandler from "../../../utils/ctx-handler.ts";
import useRethink from "../../../composables/use-rethink.ts";
import {r} from "rethinkdb-ts";
import createError from "../../../utils/create-error.ts";

export default ctxHandler(async ctx => {
    const {connect}  =  useRethink();
    const id = ctx.params.id;
    const db = await connect();
    const found = await r.table('users')
        .get(id)
        .run(db)

    if(!found) {
        createError({
            statusCode: 404,
            message: "User with id ${id} does not exist"
        })
    }
    const doc = await r.table('users')
        .get(id)
        .delete()
        .run(db)

    await db.close()

    if(doc.deleted !== 1) {
        createError({
            statusCode: 500,
            message: 'Deleted user failed'
        })
    }

    return doc
})
