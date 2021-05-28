# 2021S HCI proejct - VVS

## Running our Project

To run our frontend server, run:

```bash
# in project root
yarn
yarn start
```

To run our GraphQL server (at http://localhost:4000), First set up our database:

```bash
# in server/gqlserver
npm install
npx prisma migrate dev --name init
npx prisma db seed --preview-feature
```

And run:

```bash
npm run dev
```

To run local (temporary) file server in your computer, run:

```bash
# in server/fileserver
node fileserver.js
```

## External APIs/Libraries

[File Manager](https://github.com/OpusCapita/filemanager)

[Voice Recorder](https://www.npmjs.com/package/react-voice-recorder)

[chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react)

[prisma GraphQL Sevrer Example](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql)

[audio-react-recorder] (https://github.com/hackingbeauty/react-mic)

[react-h5-audio-player] (https://github.com/lhz516/react-h5-audio-player)

## Documentation (TBC)

[react-showroom](https://github.com/OpusCapita/react-showroom-client)

[storybook](https://storybook.js.org)

[mockplus](https://www.mockplus.com)

[ML APIs](https://www.saltlux.ai)
