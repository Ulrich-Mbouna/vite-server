import useRethink from "../../composables/use-rethink.ts";
import ctxHandler from "../../utils/ctx-handler.ts";
import {r} from 'rethinkdb-ts'
import createError from "../../utils/create-error.ts";

export default ctxHandler(async (ctx) => {
    const { connect } = useRethink()

    const slug = ctx.params.slug
    const db = await connect()

    const searchQuery = {
        slug
    }

    const doc = await r.table('users')
        .filter(searchQuery)
        .nth(0)
        .default(null)
        .run(db)

    await db.close()

    if(!doc) {
        createError({
            statusCode: 404,
            message: `User with slug ${slug} does not exist`
        })
    }

    return doc

})
