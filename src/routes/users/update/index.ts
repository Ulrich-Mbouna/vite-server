import ctxHandler from "../../../utils/ctx-handler.ts";
import useRethink from "../../../composables/use-rethink.ts";
import {r} from "rethinkdb-ts";
import createError from "../../../utils/create-error.ts";
import normalizeBody from "../../../utils/normalize-body.ts";

export default ctxHandler(async ctx => {
    const {connect} = useRethink()
    const id = ctx.params.id;
    const body = await normalizeBody(ctx.req)
    const db = await connect();

    const found = await r.table('users')
        .filter(r.row('slug').eq(body.slug))
        .filter(r.row('id').ne(id))
        .nth(0)
        .default(null)
        .run(db)

    if (found) {
        createError({
            statusCode: 404, message: 'slug ${body.slug} has already taken'
        })
    }
    const currentDocument = await r.table('users')
        .get(id)
        .run(db)
    const timestamp = Date.now()
    const updateQuery = {
        name: body.name, slug: body.slug, updatedAt: timestamp
    }
    const options = {...currentDocument, ...updateQuery}
    const doc = await r.table('users')
        .update(options, {returnChanges: true})
        .run(db)
    await db.close()

    if (doc.replaced !== 1) {
        createError({
            statusCode: 500, message: 'User update failed'
        })
    }

    return doc

})

