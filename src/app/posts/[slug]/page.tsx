
import { TFetcher, fetchGeneric } from "@/utils/request";
import { Context, Effect, pipe } from "effect";
import { MDXRemote } from "next-mdx-remote/rsc";
import fetch from 'cross-fetch'
import { notFound,  } from 'next/navigation'
import * as S from '@effect/schema/Schema'

import { serverContext } from "@/utils/context";
import { PostSchema, PostsSchema } from "@/features/posts/posts.service";

const mainGetPostEffect = (slug: string) => Effect.provide(Effect.gen(function* (_) {
    return yield* _(fetchGeneric(PostSchema, `http://localhost:3000/api/posts/${slug}`, { next: { revalidate: 3600 } } ))
}), serverContext)

const mainGetPostsEffect = Effect.provide(Effect.gen(function* (_) {
    return yield* _(fetchGeneric(PostsSchema, `http://localhost:3000/api/posts`, { next: { revalidate: 3600 } } ))
}), serverContext)

const ParamsScheme = S.struct({
    slug: S.string
})

export async function generateStaticParams() {
    return Effect.runPromise(mainGetPostsEffect.pipe(Effect.map(files => {
        return files.map(file => ({ slug: file.slug?.replace(/\.mdx$/, '') }))
    })))
}

export default async function PostPage({params}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    const parsedSearchParams = Effect.runSync(S.parse(ParamsScheme)(params))
    const res = await Effect.runPromise(mainGetPostEffect(parsedSearchParams.slug))

    if(res?.source === undefined){
        return notFound()
    }

    return (
      <div>
        <MDXRemote source={res.source} />
      </div>
    )
  }

