import { Console, Context, Data, Effect, Layer, pipe } from "effect";
import * as S from '@effect/schema/Schema'
import { TFileSystem } from "@/utils/filesystem";
import extractMdxMeta from "extract-mdx-metadata";
import { map } from "effect/Either";

const PostService = Context.Tag<{ 
    getPostsProgram: typeof getPostsProgram, 
    getPostProgram: typeof getPostProgram, 
    getFeaturedPosts: typeof getFeaturedPosts
    getOtherPosts: typeof getOtherPosts
}>()

const metadataSchema = S.struct({
    title: S.optional(S.string),
    slug: S.optional(S.string),
    date: S.optional(S.string),
    tags: S.optional(S.array(S.string)),
    description: S.optional(S.string),
    featured: S.optional(S.boolean),
    image: S.optional(S.string),
    colSpan: S.optional(S.number),
})
const PostsSchema = S.array(metadataSchema)
type IPostsSchema = S.Schema.To<typeof PostsSchema>

const getPostsProgram = Effect.gen(function* (_) {
    const FS = yield* _(TFileSystem)
    const files = yield* _(pipe(FS.readDir('public/_posts'), Effect.map(files => files.filter(file => file.endsWith('.mdx')))))
    const resolvedFiles = yield* _(Effect.all(
        files.map(file => Effect.gen(function* (_) {
            const content = yield* _(FS.readFileSync(`public/_posts/${file}`))
            const metadata = yield* _(Effect.tryPromise(() => extractMdxMeta(content)))

           return yield* _(S.parse(metadataSchema)({
                ...metadata,
                slug: file.replace('.mdx', ''),
            }))
        }),
        { concurrency: 10 }
    )))
    return  resolvedFiles
})

const PostSchema = S.struct({
    source: S.string,
})

const PostInputSchema = S.struct({
    slug: S.string,
})

const getPostProgram = ({slug}: S.Schema.To<typeof PostInputSchema>) => Effect.gen(function* (_) {
    const FS = yield* _(TFileSystem)
    yield* _(FS.existsSync(`public/_posts/${slug}.mdx`))
    const postFile = yield* _(FS.readFileSync(`public/_posts/${slug}.mdx`))

    const res = yield* _(S.parse(PostSchema)({ source: postFile.toString() }))
    yield* _(Console.log(res))
    return res
})

const getFeaturedPosts = Effect.gen(function* (_) {
    const posts = yield* _(getPostsProgram)
    const filteredPosts = posts.filter(post => post?.featured)
    const sortedPosts = filteredPosts.sort((a, b) => {
        if (!a?.date || !b?.date) return 0
        return a?.date > b?.date ? -1 : 1;
    })
    const limitedPosts = sortedPosts.slice(0, 3)

    return limitedPosts
})

const getOtherPosts = Effect.gen(function* (_) {
    const posts = yield* _(getPostsProgram)
    const featuredPosts = yield* _(getFeaturedPosts)
    const filteredPosts = posts.filter(post => !featuredPosts.find(featuredPost => featuredPost.title === post.title))
    const sortedPosts = filteredPosts.sort((a, b) => {
        if (!a?.date || !b?.date) return 0
        return a?.date > b?.date ? -1 : 1;
    })


    return sortedPosts
})


const PostServiceLive = PostService.of({
    getPostsProgram,
    getPostProgram,
    getFeaturedPosts,
    getOtherPosts,
})


export type { IPostsSchema }
export {PostService, PostsSchema, PostServiceLive, PostSchema, PostInputSchema, getFeaturedPosts }