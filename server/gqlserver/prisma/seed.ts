import { PrismaClient, Prisma } from '@prisma/client'

var crypto = require('crypto')

const flag = () => Math.floor(Math.random() * 10) % 2
const cond = () => flag() == 0

const randomPhrase = (len: number = 20) =>
  crypto.randomBytes(len).toString('hex')

const prisma = new PrismaClient()

const randomRecordData = () => {
  let res: Prisma.RecordCreateInput = {
    path: randomPhrase(),
    title: randomPhrase(),
    size: randomPhrase(),
    tag: cond() ? randomPhrase() : '',
    memo: cond() ? randomPhrase() : '',
    voice: randomPhrase(),
  }

  return res
}

const randomTextBlockData = () => {
  let res: Prisma.TextBlockCreateInput = {
    content: randomPhrase(),
    isMine: flag(),
    isHighlighted: flag(),
    isModified: flag(),
    reliability: Math.random(),
    start: randomPhrase(),
    end: randomPhrase(),
  }

  return res
}

const randomPreviewData = () => {
  let res: Prisma.PreviewCreateInput = {
    voice: randomPhrase(),
  }

  return res
}

const randomScheduleData = () => {
  let res: Prisma.ScheduleCreateInput = {
    date: new Date().toISOString().split('T')[0],
    memo: randomPhrase(),
  }

  return res
}

async function main() {
  console.log(`Start seeding ...`)
  for (let i = 0; i < 20; i++) {
    const record = await prisma.record.create({
      data: randomRecordData(),
    })
    console.log(`Created record with id: ${record.id}`)

    const textBlock = await prisma.textBlock.create({
      data: randomTextBlockData(),
    })
    console.log(`Created textblock with id: ${textBlock.id}`)

    const preview = await prisma.preview.create({
      data: randomPreviewData(),
    })
    console.log(`Created preview with id: ${preview.id}`)

    const schedule = await prisma.schedule.create({
      data: randomScheduleData(),
    })
    console.log(`Created schedule with id: ${schedule.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
