# 2021S HCI proejct - VVS

## Target Platform

이 프로젝트는 녹음 기능을 통해 업무나 메모해야 할 방대한 정보를 다루는 사람을 위하여 설게되었다. 따라서 우리는 핸디하게 사용할 수 있는 스마트폰 애플리케이션 대신, 랩탑 환경을 가정하였다. 오디오 스트림과 데이터를 다루는 방식에 대한 호환성 문제로 이 프로젝트는 마이크와 스피커가 존재하는 노트북 환경에서 `Google Chrome`을 이용하여 접속한다. 또한 현재 개발 상황상 정식 배포를 진행하지 않았으므로 테스팅은 로컬 서버를 이용하며 구동 방식은 아래에 후술하였다.

## Software

### Frontend

이 프로젝트에는 다양한 머신러닝 알고리즘이 포함되었다. 이 알고리즘들은 무료로 공개되어 있는 Public API이며 프론트엔드에서 REST API를 사용하여 이용하였다. 다만 Public API들이 User Key를 이용하여 authentication을 하는데, 요금 청구 가능성이 있는 Google Cloud Speech Service의 경우 credential 파일을 별도로 제출하였다.

프론트엔드 개발에는 `React`를 사용하였고 상태 관리를 위한 라이브러리로 자주 사용되는 `Redux` 대신 `Apollo`와 `GraphQL`을 사용하여 하나의 엔드포인트를 가진 백엔드 서버로부터 필요한 정보를 가져왔다. 애플리케이션 특성상 재사용 가능한 라이브러리를 다량 사용하여 변형하였으며 파일 관리, 녹음, UI 등에서 써드파티 라이브러리를 사용하였다.

### Backend

프로젝트 특성상 파일서버와 별도 백엔드 서버가 모두 필요하지만 범위상 파일서버를 만들기보다는 음성 데이터를 base64 encoding하여 백엔드 서버에 인라인으로 직접 저장하였다. 데이터베이스 스키마로는 개발 및 테스트 용도로 가장 간편히 사용할 수 있는 `SQLite3`을 적용하였으며 ORM Framework로는 `Prisma`를, 그리고 `GraphQL` schema를 Type-safe하게 지정하기 위해 `nexusjs`를 사용하였다. 또한 1분 이상 음성에 대한 음성 번역 지원을 위해 `express`를 사용하여 Google STT를 사용하기 위한 서버를 따로 설정하였으며, 해당 서버에 `socket.io`를 통해 양방향 스트리밍 음성 인식 모듈을 현재 테스트하고 있다.

### Running our Project (Sequential)

1. Cloning Repository

```bash
git clone https://github.com/jyeok/2021s-hci-vvs.git
```

2. Install Frontend Dependencies and Start Server

```bash
# in project root
yarn
yarn start
```

3. SETUP GOOGLE API KEY
   별도로 첨부해 드린 crdential 파일을 다운받은 후 아래 명령어를 입력해 주세요.

```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credential/file" # MAC or Linux
$env:GOOGLE_APPLICATION_CREDENTIALS="path/to/credential/file" # Window Powershell
set GOOGLE_APPLICATION_CREDENTIALS="path/to/credential/file" # Window CMD
```

4. Install Backend Dependencies and run

```bash
# in server/gqlserver
npm install
npx prisma migrate dev --name init
npx prisma db seed --preview-feature
npm run dev
```

```bash
# in server/proxy
npm install
node index.js
```

```bash
# in server/textserver
npm install
node index.js
```

## External APIs/Libraries

[Chonky](https://chonky.io/docs/2.x/)

[Voice Recorder](https://www.npmjs.com/package/react-voice-recorder)

[chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react)

[prisma GraphQL Sevrer Example](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql)

[react-h5-audio-player](https://github.com/lhz516/react-h5-audio-player)

[react-mic] (https://github.com/hackingbeauty/react-mic)

[material-ui-dropzone](https://yuvaleros.github.io/material-ui-dropzone/)

[material-ui](https://material-ui.com/)

[Text Comprehension API](https://www.saltlux.ai)

[Speech-to-Text API](https://cloud.google.com/speech-to-text/)

## Documentation (TBC)

[storybook](https://storybook.js.org)

[mockplus](https://www.mockplus.com)
