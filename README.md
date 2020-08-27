This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Set up functions configuration

```shell
firebase functions:config:set line.user_id="XXX"
firebase functions:config:get > .runtimeconfig.dev.json
```

## Set up firestore configuration

```shell
firebase firestore:indexes > firestore.indexes.json
```

## Set up emulators configuration

You must provide environment variables in `.runtimeconfig.json`

```
firebase emulators:start
```
