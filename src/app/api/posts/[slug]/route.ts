import { PostsContext } from '@/features/posts/posts.context'
import { PostInputSchema, PostService } from '@/features/posts/posts.service'
import { serverContext } from '@/utils/context'
import * as S from '@effect/schema/Schema'
import { Context, Effect } from "effect"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic' // defaults to auto


type Params = { slug: string }

const main = (params: Params)=>  Effect.gen(function* (_) {
   const parsedParams = yield* _(S.parse(PostInputSchema)(params))
   const postsService = yield* _(PostService)
   const posts = postsService.getPostProgram(parsedParams)
   const postsEither = yield* _(Effect.either(posts))
   return yield* _(Effect.match(postsEither, {
        onFailure: (error) => {
            if (error._tag === 'ExistsSyncError') {
                return NextResponse.json(error, { status: 404 })
            }
            return NextResponse.json(error, { status: 500 })
        }, 
        onSuccess: (post) => {
            return NextResponse.json(post, { status: 200 })
        }
    }))
})

export async function GET(req: NextRequest, { params }: { params: Params }) {
    const res = await Effect.runPromise(Effect.provide(main(params), Context.merge(serverContext, PostsContext)))

    console.log('THIS HERE', res)
    return res
}