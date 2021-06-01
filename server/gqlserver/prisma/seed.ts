import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const record1: Prisma.RecordCreateInput = {
  path: 'root-aaa.mp3',
  title: '기업A-미팅1',
  size: 1023,
  tag: '',
  memo: '납품 관련',
  voice:
    'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
}
const record2: Prisma.RecordCreateInput = {
  path: 'root-abc.mp3',
  title: 'COVID-19와 포스트 판데믹',
  size: 1011,
  tag: '코로나19 4차산업혁명',
  memo: '',
  voice: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
}
const record3: Prisma.RecordCreateInput = {
  path: 'root-123.mp3',
  title: 'XX식품 영업의 건',
  size: 1113,
  tag: '영업 식품 ',
  memo: '서류를 잘 써가는 게 중요함. 회사 파악 필수.',
  voice: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
}
const record4: Prisma.RecordCreateInput = {
  path: 'aaa-123.mp4',
  title: 'B기업 결제 건',
  size: 1023,
  tag: '',
  memo: '',
  voice: 'naver.com',
}

const textBlock1: Prisma.TextBlockCreateInput = {
  content:
    '3월 13일 오늘 회의 주제는 납품이 미뤄지고 있는 상황에 우리가 취할 수 있는 대책을 찾아보는 것입니다.',
  isMine: 0,
  isHighlighted: 0,
  isModified: 0,
  reliability: 0.998,
  start: '00:00',
  end: '00:05',
}

const textBlock2: Prisma.TextBlockCreateInput = {
  content: '오늘 그 얘기를 드디어 하시나요? 납품 문제가 심각합니다.',
  isMine: 1,
  isHighlighted: 0,
  isModified: 0,
  reliability: 0.776,
  start: '00:06',
  end: '00:07',
}
const textBlock3: Prisma.TextBlockCreateInput = {
  content:
    '중국에서 원재료가 아예 수입이 되지 않는다고 합니다. 이 부품의 재료가 수급이 안되면 필연적으로 우리가 목표한 만큼 제품을 생산할 수 없을 것입니다. ',
  isMine: 0,
  isHighlighted: 0,
  isModified: 0,
  reliability: 0.5,
  start: '00:08',
  end: '00:12',
}
const textBlock4: Prisma.TextBlockCreateInput = {
  content: '어디 누구 좋은 의견 없나?',
  isMine: 0,
  isHighlighted: 0,
  isModified: 0,
  reliability: 0.4,
  start: '00:13',
  end: '00:14',
}

const textBlock5: Prisma.TextBlockCreateInput = {
  content: '제가 한 번 이야기해보겠습니다.',
  isMine: 0,
  isHighlighted: 0,
  isModified: 0,
  reliability: 0.3,
  start: '00:15',
  end: '00:19',
}
const textBlock6: Prisma.TextBlockCreateInput = {
  content:
    '오늘의 수업 주제는 코로나19 판데믹과 그 이후의 세계입니다. 요즘 코로나19가 일상이 되었고 이제 사람들은 마스크를 끼는 게 일상이 되어버렸죠. 이런 상황에서 우리는 어떻게 대처해야 할까요?',
  isMine: 0,
  isHighlighted: 0,
  isModified: 0,
  reliability: 0.889,
  start: '00:00',
  end: '00:19',
}
const textBlock7: Prisma.TextBlockCreateInput = {
  content: '아마도 이전으로는 돌아가기 힘들지 않을까요? ',
  isMine: 1,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.998,
  start: '00:19',
  end: '00:20',
}
const textBlock8: Prisma.TextBlockCreateInput = {
  content:
    '오 좋아요 김서은 학생. 혹시 왜 이전으로 돌아가기 힘든지 들어볼 수 있을까요?',
  isMine: 0,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.976,
  start: '00:20',
  end: '00:22',
}
const textBlock9: Prisma.TextBlockCreateInput = {
  content:
    '일단 너무 많은 것들이 변했습니다. 일단 경제적인 측면에서부터만 봐도 그전과 상당히 다른 양상을 띄고 있죠. 또, 재택근무가 일상이 되었고 기업들은 오프라인 시험이 아닌, 온라인 시험으로 전환했습니다. 또, 배달음식 산업의 성장과 더불어 밀키트 같은 상품들도 빠른 속도로 발전해 오고 있구요. ',
  isMine: 1,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.998,
  start: '00:23',
  end: '00:35',
}
const textBlock10: Prisma.TextBlockCreateInput = {
  content:
    '안녕하세요. 저번에 말씀드렸던 공장 증설에 대해 여쭙고 싶어서 이렇게 전화드렸습니다. 저는 AA식품 김철수 대리입니다.',
  isMine: 0,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.834,
  start: '00:01',
  end: '00:03',
}
const textBlock11: Prisma.TextBlockCreateInput = {
  content:
    '네 안녕하세요. 안그래도 제가 먼저 전화드리려고 했는데 먼저 연락주셔서 감사합니다. 혹시 어떤 게 궁금하셔서 연락하셨을까요?',
  isMine: 1,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.734,
  start: '00:04',
  end: '00:08',
}
const textBlock12: Prisma.TextBlockCreateInput = {
  content:
    '보내주신 견적서를 보면 A부지의 공사일수를 더 길게 잡으셨더라구요. 그 이유를 혹시 알 수 있을까요? 또, B부지가 준공될 때 A부지도 함께 준공되었으면 하는데, 어려우실까요? 사실 다른 회사에서도 견적서를 보내주셨는데, 그 회사는 더 빨리 완공될 수 있다고 하더라구요. 혹시라도 앞에 공사가 밀려있어서 그런 거라면 수주하기 어려울 것 같습니다.',
  isMine: 0,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.687,
  start: '00:09',
  end: '00:18',
}
const textBlock13: Prisma.TextBlockCreateInput = {
  content:
    'A부지는 산의 경사면에 위치해 있어서 지반 다지는 데 더 오래 걸려서 그렇게 견적서를 보내드렸습니다. 혹시 아주 급한 일이시라면 B의 공사가 끝날 때 최대한 A부지의 공사도 끝내겠습니다. 사실 공사를 할 때 중요한 게 시간보다는 내구성 아닙니까? 저희 회사가 내구성은 자부합니다.',
  isMine: 1,
  isModified: 0,
  isHighlighted: 0,
  reliability: 0.687,
  start: '00:19',
  end: '00:29',
}

const preview1: Prisma.PreviewCreateInput = {
  voice: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
}
const preview2: Prisma.PreviewCreateInput = {
  voice: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
}

const preview3: Prisma.PreviewCreateInput = {
  voice: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
}

const schedule1: Prisma.ScheduleCreateInput = {
  date: '2020-03-13',
  memo: 'A 거래처 미팅',
}
const schedule2: Prisma.ScheduleCreateInput = {
  date: '2021-02-12',
  memo: '교수님 면담',
}

const records = [record1, record2, record3, record4]
const textblocks = [
  textBlock1,
  textBlock2,
  textBlock3,
  textBlock4,
  textBlock5,
  textBlock6,
  textBlock7,
  textBlock8,
  textBlock9,
  textBlock10,
  textBlock11,
  textBlock12,
  textBlock13,
]
const previews = [preview1, preview2, preview3]
const schedules = [schedule1, schedule2]

async function main() {
  console.log(`Start seeding ...`)

  for (let index = 0; index < records.length; index++) {
    const element = records[index]
    const res = await prisma.record.create({
      data: element,
    })

    console.log(`Created record with id: ${res.id}`)
  }

  for (let i = 0; i < textblocks.length; i++) {
    const element = textblocks[i]
    const res = await prisma.textBlock.create({ data: element })

    console.log(`Created textBlock with id : ${res.id}`)
  }

  for (let i = 0; i < previews.length; i++) {
    const element = previews[i]
    const res = await prisma.preview.create({ data: element })

    console.log(`Created preview with id : ${res.id}`)
  }
  for (let i = 0; i < schedules.length; i++) {
    const element = schedules[i]
    const res = await prisma.schedule.create({ data: element })

    console.log(`Created schedule with id : ${res.id}`)
  }

  // TODO: connect : 데이터베이스 항목들끼리 연결.

  const recordandtext = await prisma.record.update({
    where: {
      id: 1,
    },
    data: {
      content: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      },
    },
  })
  const record2andtext = await prisma.record.update({
    where: {
      id: 2,
    },
    data: {
      content: { connect: [{ id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }] },
    },
    include: {
      content: true,
    },
  })
  const record3andtext = await prisma.record.update({
    where: {
      id: 3,
    },
    data: {
      content: { connect: [{ id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }] },
    },
  })

  for (let i = 1; i < 4; i++) {
    const recordPreview = await prisma.record.update({
      where: {
        id: i,
      },
      data: {
        preview: { connect: { id: i } },
      },
    })
  }
  for (let i = 1; i < 3; i++) {
    const textBlockSchedule = await prisma.textBlock.update({
      where: {
        id: i,
      },
      data: {
        schedule: {
          connect: { id: i },
        },
      },
    })
    const textBlockPreview = await prisma.textBlock.update({
      where: {
        id: i,
      },
      data: {
        preview: { connect: { id: i } },
      },
    })
  }
  const preview1andtextblock = await prisma.preview.update({
    where: {
      id: 1,
    },
    data: {
      excerpt: { connect: { id: 1 } },
    },
  })
  const preview2andtextblock = await prisma.preview.update({
    where: {
      id: 2,
    },
    data: {
      excerpt: { connect: { id: 9 } },
    },
  })
  const preview3andtextblock = await prisma.preview.update({
    where: {
      id: 3,
    },
    data: {
      excerpt: { connect: [{ id: 10 }, { id: 13 }] },
    },
  })
  for (let i = 1; i < 4; i++) {
    const previewandrecord = await prisma.preview.update({
      where: {
        id: i,
      },
      data: {
        record: { connect: { id: i } },
      },
    })
  }
  for (let i = 1; i < 3; i++) {
    const scheduleandtextBlock = await prisma.schedule.update({
      where: {
        id: i,
      },
      data: {
        source: { connect: { id: i } },
      },
    })
  }
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
