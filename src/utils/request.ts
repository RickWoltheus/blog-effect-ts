

import * as S from '@effect/schema/Schema'
import { Console, Context, Effect } from "effect";

export interface IFetcher {
  fetch: typeof fetch
}

type IFetchArgs = Parameters<typeof fetch>

export const TFetcher = Context.Tag<IFetcher>('IFetcher')

export class JsonError {
  readonly _tag = "JSONError";
  constructor(readonly error: unknown) {}
}

export class FetchError {
  readonly _tag = 'FetchError'
  constructor(readonly error: unknown) {}
}

export function fetchEffect(...args: IFetchArgs) {
  return TFetcher.pipe(
    Effect.flatMap((fetcher) => {
      return Effect.tryPromise({
        try: async () => {
          const test = await fetcher.fetch(...args);
          return test;

        },
        catch: (error) => {
          return new FetchError(error);
        },
      })
    })
  )
}

function jsonEffect(response: Response) {
  return Effect.tryPromise({
    try: () => response.json(),
    catch: (error) => {
      return new JsonError(error);
    },
  })
}

function parseEffect<T>(schema: S.Schema<T>) {
  return S.parse(schema)
}


export function fetchGeneric<T>(schema: S.Schema<T> | null, ...args: IFetchArgs) {
  return fetchEffect(...args).pipe(
    Effect.flatMap(jsonEffect),
    Effect.tap(Console.debug),
    schema ? Effect.flatMap(parseEffect(schema)) : Effect.map((x) => x),

  )
}
