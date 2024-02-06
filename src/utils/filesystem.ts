import { Context, Data, Effect } from 'effect'
import { UnknownException } from 'effect/Cause'

type TFSArgs = { 
    readFileSync: (path: string) => Effect.Effect<never, ReadFileSyncError | UnknownException, Buffer>
    existsSync: (path: string) => Effect.Effect<never, ExistsSyncError, boolean>
    readDir: (path: string) => Effect.Effect<never, ReadDirError, string[]>
}

export class ReadDirError extends Data.TaggedError("ReadFileSyncError")<{
    message?: string
}> {}

export class ReadFileSyncError extends Data.TaggedError("ReadFileSyncError")<{
    message?: string
}> {}
 
export class ExistsSyncError extends Data.TaggedError("ExistsSyncError")<{
    message?: string
}> {}

export const TFileSystem = Context.Tag<TFSArgs>('IFS')