This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## CurseForge API-Key
To use the service you have to provide a [CurseForge API-Key](https://docs.curseforge.com/rest-api/#authentication).
Create a file `qs.config.ts` in the root directory of this project with following content:

```ts
const config = {
    curseforge_api_key:
        "<<API-KEY>>",
};
export { config };
```

## Deployment
Run:
```bash
./deploy.sh #.\deploy.bat on Windows
```
The script will instantiate a container with the app running and pass the docker daemon to it.
Now the app can deploy new containers on the host.

It is possible to specify the docker image, container name and host port in the script.


## Development
For HotReload it is recommended to execute the server locally.
> Docker resp. docker daemon still has to run to deploy container

Gather dependencies:
```bash
npm install
```
Run the dev build
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.