import { Console, Context, Data, Effect, Layer, pipe } from "effect";
import * as S from '@effect/schema/Schema'
import { TFileSystem } from "@/utils/filesystem";

const PostService = Context.Tag<{ getPostsProgram: typeof getPostsProgram, getPostProgram: typeof getPostProgram }>()

const metadataSchema = S.struct({
    title: S.optional(S.string),
    slug: S.optional(S.string),
    date: S.optional(S.string),
    tags: S.optional(S.array(S.string)),
    description: S.optional(S.string),
    image: S.optional(S.string),
})
const PostsSchema = S.array(metadataSchema)

const getPostsProgram = Effect.gen(function* (_) {
    const FS = yield* _(TFileSystem)
    const files = yield* _(FS.readDir('src/app/_posts'))
    const resolvedFiles = yield* _(Effect.all(
        files.map(file => Effect.gen(function* (_) {
            const content = yield* _(FS.readFileSync(`src/app/_posts/${file}`))
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
    yield* _(FS.existsSync(`src/app/_posts/${slug}.mdx`))
    const postFile = yield* _(FS.readFileSync(`src/app/_posts/${slug}.mdx`))

    const res = yield* _(S.parse(PostSchema)({ source: postFile.toString() }))
    yield* _(Console.log(res))
    return res
})

const PostServiceLive = PostService.of({
    getPostsProgram,
    getPostProgram,
})

export {PostService, PostsSchema, PostServiceLive, PostSchema, PostInputSchema }

function extractMdxMeta(content: Buffer): Promise<S.Schema.To<typeof metadataSchema>> {
    return Promise.resolve({
        title: 'test',
        slug: 'test',
        date: 'test',
        tags: ['test'],
        description: 'test',
        image: 'test',
    })
}
