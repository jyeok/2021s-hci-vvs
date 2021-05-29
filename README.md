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

## External APIs/Libraries

[Chonky] (https://chonky.io/docs/2.x/)

[Voice Recorder](https://www.npmjs.com/package/react-voice-recorder)

[chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react)

[prisma GraphQL Sevrer Example](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql)

[react-h5-audio-player] (https://github.com/lhz516/react-h5-audio-player)

[react-mic] (https://github.com/hackingbeauty/react-mic)

[material-ui-dropzone](https://yuvaleros.github.io/material-ui-dropzone/)

[material-ui](https://material-ui.com/)

[ML APIs](https://www.saltlux.ai)

## Documentation (TBC)

[storybook](https://storybook.js.org)

[mockplus](https://www.mockplus.com)
