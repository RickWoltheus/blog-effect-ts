import { Context } from "effect"
import { PostService, PostServiceLive } from "./posts.service"

export const PostsContext = Context.empty().pipe(
    Context.add(PostService, PostService.of(PostServiceLive)),
)