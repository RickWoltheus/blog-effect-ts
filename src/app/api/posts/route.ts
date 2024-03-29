
import { PostsContext } from "@/features/posts/posts.context"
import { PostService, PostsSchema } from "@/features/posts/posts.service"
import { serverContext } from "@/utils/context"
import { Context, Effect, Layer, pipe } from "effect"
import { NextResponse } from "next/server"
import * as S from '@effect/schema/Schema'

export const dynamic = 'force-dynamic' // defaults to auto


const main = Effect.gen(function* (_) {
    const postsService = yield* _(PostService)
    const failureOrSuccess = yield* _(Effect.either(postsService.getPostsProgram))

    return yield* _(Effect.match(failureOrSuccess, {
         onFailure: (error) => {
            return NextResponse.json(error, { status: 500 })
         }, 
         onSuccess: (result) => NextResponse.json(result, { status: 200 })
     }))
 })


export async function GET() {
    const res = await Effect.runPromise(Effect.provide(main, Context.merge(serverContext, PostsContext)))

    return res
}