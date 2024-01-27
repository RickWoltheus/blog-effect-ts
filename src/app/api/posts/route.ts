
import { PostsContext } from "@/features/posts/posts.context"
import { PostService } from "@/features/posts/posts.service"
import { serverContext } from "@/utils/context"
import { Context, Effect, Layer, pipe } from "effect"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' // defaults to auto

const main = Effect.gen(function* (_) {
    const postsService = yield* _(PostService)
    const postsEither = yield* _(Effect.either(postsService.getPostsProgram))
    return yield* _(Effect.match(postsEither, {
         onFailure: (error) => {
            return NextResponse.json(error, { status: 500 })
         }, 
         onSuccess: (post) => NextResponse.json(post, { status: 200 })
     }))
 })

export async function GET() {
    const res = await Effect.runPromise(Effect.provide(main, Context.merge(serverContext, PostsContext)))

    return res
}