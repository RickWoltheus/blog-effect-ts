import { Context, Effect } from "effect";
import { TFetcher } from "./request";
import fetch from 'cross-fetch'
import { ExistsSyncError, ReadDirError, ReadFileSyncError, TFileSystem } from "./filesystem";
import NodeFS from 'node:fs';

export const serverContext = Context.empty().pipe(
    Context.add(TFetcher, TFetcher.of({ fetch: fetch })),
    Context.add(TFileSystem, TFileSystem.of({
        readFileSync: (path) => Effect.try({
            try: () => NodeFS.readFileSync(path),
            catch: (error) => new ReadFileSyncError({ message: 'File does not exist' }),
        }),
        readDir: (path) => Effect.async<never, ReadDirError, string[]>((resume) => {
            NodeFS.readdir(path, (error, data) => {
              if (error) {
                resume(Effect.fail(new ReadDirError({ message: 'Could not read dir: ' + error })))
              } else {
                resume(Effect.succeed(data))
              }
            })
        }),
        existsSync: (path) => Effect.try({
            try: () => NodeFS.existsSync(path),
            catch: (error) => new ExistsSyncError({ message: 'File does not exist' }),
        })
    })),
)