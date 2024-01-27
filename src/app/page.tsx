import { PostsSchema } from "@/features/posts/posts.service";
import { serverContext } from "@/utils/context";
import { fetchGeneric } from "@/utils/request";
import { Effect, pipe } from "effect";
import Link from "next/link";

const mainGetPostsEffect = Effect.provide(Effect.gen(function* (_) {
  const posts = yield* _(fetchGeneric(PostsSchema, `http://localhost:3000/api/posts`, { next: { revalidate: 3600 } } ).pipe(Effect.either))
  return yield* _(Effect.match(posts, {
    onFailure:  e => {
      throw e
    },
    onSuccess: (posts) => posts
  }))
}), serverContext)

export default async function Home() {
  const res = await Effect.runPromise(mainGetPostsEffect)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {res.map(post => <Link key={post.slug} href={`/posts/${post.slug?.replace(/\.mdx$/, '')}`}>{post.slug}</Link>)}
    </main>
  );
}
