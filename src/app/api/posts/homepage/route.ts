
import { PostsContext } from "@/features/posts/posts.context"
import { PostService, PostsSchema } from "@/features/posts/posts.service"
import { serverContext } from "@/utils/context"
import { Context, Effect, Layer, pipe } from "effect"
import { NextResponse } from "next/server"
import * as S from '@effect/schema/Schema'

export const dynamic = 'force-dynamic' // defaults to auto


const main = Effect.gen(function* (_) {
    const postsService = yield* _(PostService)
    const results = Effect.all([postsService.getFeaturedPosts, postsService.getOtherPosts])
    const failureOrSuccess = yield* _(Effect.either(results))

    return yield* _(Effect.match(failureOrSuccess, {
         onFailure: (error) => {
            return NextResponse.json(error, { status: 500 })
         }, 
         onSuccess: (results) => NextResponse.json({ featured: results[0], other: results[1] }, { status: 200 })
     }))
 })


export const PostsGETResultSchema = S.struct({
    featured: PostsSchema,
    other: PostsSchema
})
type PostsGETResult = S.Schema.To<typeof PostsGETResultSchema>

export async function GET() {
    const res = await Effect.runPromise(Effect.provide(main, Context.merge(serverContext, PostsContext)))

    return res
}