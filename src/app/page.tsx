import { FeaturedPostsList } from "@/features/posts/FeaturedPostsList";
import { PostsList } from "@/features/posts/PostsList";
import { serverContext } from "@/utils/context";
import { fetchGeneric } from "@/utils/request";
import { Effect } from "effect";
import { PostsGETResultSchema } from "./api/posts/homepage/route";
import { SocialIcon } from "react-social-icons";

const mainGetPostsEffect = Effect.provide(
  Effect.gen(function* (_) {
    return yield* _(
      fetchGeneric(
        PostsGETResultSchema,
        `http://localhost:3000/api/posts/homepage`,
        {
          next: { revalidate: 3600 },
        },
      ),
    );
  }),
  serverContext,
);

export default async function Home() {
  const res = await Effect.runPromise(mainGetPostsEffect);

  return (
    <main className="flex items-center justify-center flex-col">
      <div className="max-w-screen-lg">
        <div className="flex gap-4 mb-12">
          <div className=" bg-gray-100 border-2 rounded-md p-4 flex-1">
            <h3 className="text-2xl font-bold pb-2">About me</h3>
            <p>I am a Frontend Engineer</p>
          </div>
          <div className=" bg-gray-100 border-2 rounded-md p-4 flex-1">
            <h3 className="text-2xl font-bold pb-2">Find me here</h3>
            <div className="flex gap-2">
              <SocialIcon network="github" />
              <SocialIcon network="twitter" />
              <SocialIcon network="linkedin" />
            </div>
          </div>
        </div>
        <h3 className="text-5xl font-bold pb-6">Featured posts</h3>
        <FeaturedPostsList
          posts={res.featured}
          to={(post) => `/posts/${post.slug?.replace(/\.mdx$/, "")}`}
        />
        <h3 className=" text-xl font-bold pb-6 pt-6">or others...</h3>
        <PostsList
          posts={res.other}
          to={(post) => `/posts/${post.slug?.replace(/\.mdx$/, "")}`}
        />
      </div>
    </main>
  );
}
