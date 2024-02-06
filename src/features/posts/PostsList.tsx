import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Effect } from "effect";
import Link from "next/link";
import { IPostsSchema } from "./posts.service";
import Image from "next/image";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { BrutalistClickArea } from "@/components/ui/BrutalistClickArea";

type PostListProps = {
  posts: IPostsSchema;
  to: (post: IPostsSchema[0]) => string;
};
export function PostsList({ posts, to }: PostListProps) {
  return (
    <div className="flex flex-col grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.slug} href={to(post)} className="group">
          <div className="pt-2 flex flex-col justify-between fh-full">
            <h4 className="text-gray-500 text-sm font-medium tracking-wide uppercase">
              {post.date}
            </h4>
            <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 group-hover:text-blue-500 line-clamp-4">
              {post.title}
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-2 line-clamp-3">
              {post.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
