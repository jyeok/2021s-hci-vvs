import { intArg, list, nonNull, objectType, stringArg, arg } from 'nexus'

import { Context } from '../context'
import { Record, TextBlock, Preview, Schedule } from './model'
import {
  RecordCreateInput,
  RecordUpdateInput,
  TextBlockCreateInput,
  TextBlockUpdateInput,
  PreviewCreateInput,
  ScheduleCreateInput,
} from './input'

import { TextRank } from '../util/summarization'

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('addRecord', {
      type: Record,
      args: {
        data: arg({ type: nonNull(RecordCreateInput) }),
      },
      resolve: (_, args, context: Context) => {
        const { content, ...rest } = args.data

        return context.prisma.record.create({
          data: {
            ...rest,
            content: {
              create: content || undefined,
            },
          },
        })
      },
    })

    t.field('uploadRecord', {
      type: Record,
      args: {
        path: nonNull(stringArg()),
        title: nonNull(stringArg()),
        size: nonNull(intArg()),
        voice: nonNull(stringArg()),
      },
      resolve: (_, args, context: Context) => {
        const data = {
          path: args.path,
          title: args.title,
          size: args.size,
          tag: '',
          memo: '',
          isLocked: 0,
          voice: args.voice,
        }

        return context.prisma.record.create({
          data,
        })
      },
    })

    t.field('deleteRecordById', {
      type: Record,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.record.delete({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.field('deleteRecordByPath', {
      type: Record,
      args: {
        path: nonNull(stringArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.record.delete({
          where: {
            path: args.path,
          },
        })
      },
    })

    t.field('updateRecord', {
      type: Record,
      args: {
        id: nonNull(intArg()),
        data: arg({ type: RecordUpdateInput }),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.record.update({
          where: { id: args.id },
          data: {
            path: args.data?.path || undefined,
            title: args.data?.title || undefined,
            size: args.data?.size || undefined,
            tag: args.data?.tag || undefined,
            memo: args.data?.memo || undefined,
            isLocked: args.data?.isLocked || undefined,
            voice: args.data?.voice || undefined,
          },
        })
      },
    })

    t.field('addTextBlock', {
      type: TextBlock,
      args: {
        data: arg({ type: nonNull(TextBlockCreateInput) }),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.textBlock.create({
          data: args.data,
        })
      },
    })

    t.field('updateTextBlock', {
      type: TextBlock,
      args: {
        id: nonNull(intArg()),
        data: arg({ type: nonNull(TextBlockUpdateInput) }),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock.update({
          where: { id: args.id },
          data: {
            content: args.data.content || undefined,
            isMine:
              typeof args.data.isMine === 'number'
                ? args.data.isMine
                : undefined,
            isHighlighted:
              typeof args.data.isHighlighted === 'number'
                ? args.data.isHighlighted
                : undefined,
            isModified: 1,
            reliability: args.data.reliability || undefined,
            start: args.data.start || undefined,
            end: args.data.end || undefined,
          },
        })
      },
    })

    t.field('deleteTextBlockById', {
      type: TextBlock,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.textBlock.delete({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.field('connectTextBlocksToPreview', {
      type: Preview,
      args: {
        textBlockId: nonNull(list(nonNull(intArg()))),
        previewId: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        const connectData = args.textBlockId.map((e) => ({
          id: e,
        }))

        return context.prisma.preview.update({
          where: {
            id: args.previewId,
          },
          data: {
            excerpt: {
              connect: connectData,
            },
          },
        })
      },
    })

    t.field('connectTextBlocksToRecord', {
      type: Record,
      args: {
        recordId: nonNull(intArg()),
        textBlockId: nonNull(list(nonNull(intArg()))),
      },
      resolve: (_, args, context: Context) => {
        const connectData = args.textBlockId.map((e: number) => ({
          id: e,
        }))
        return context.prisma.record.update({
          where: {
            id: args.recordId,
          },
          data: {
            content: {
              connect: connectData,
            },
          },
        })
      },
    })

    // t.field('generateTextBlock', {
    //   type: Record,
    //   args: {
    //     recordId: nonNull(intArg()),
    //   },
    //   resolve: (parent, args, context: Context) => {
    //     return context.prisma.record
    //       .findUnique({
    //         where: {
    //           id: args.recordId,
    //         },
    //       })
    //       .then((e) => {
    //         console.log(e)
    //         //TODO: generate....
    //       })
    //   },
    // })

    t.field('addPreview', {
      type: Preview,
      args: {
        data: arg({ type: nonNull(PreviewCreateInput) }),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview.create({
          data: args.data,
        })
      },
    })

    t.field('connectPreviewToRecord', {
      type: Preview,
      args: {
        previewId: nonNull(intArg()),
        recordId: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview.update({
          where: { id: args.previewId },
          data: {
            record: {
              connect: { id: args.recordId },
            },
          },
        })
      },
    })

    t.field('generatePreview', {
      type: Preview,
      args: {
        recordId: nonNull(intArg()),
      },
      resolve: async (_, args, context: Context) => {
        const textBlocks = await context.prisma.textBlock.findMany({
          where: {
            record: {
              id: args.recordId,
            },
          },
        })

        const textBlockList = textBlocks.map((e) => ({
          content: e.content,
          id: e.id,
        }))

        const textBlockContents = textBlockList.map((e) => e.content)
        const sum = new TextRank(textBlockContents)
        const [excerpt, index] = sum.getSummarizedOneText()

        const start = Math.max(0, index - 1)
        const end = Math.min(index + 1, textBlockList.length - 1)
        const connect = []

        for (let i = start; i < end + 1; i++) {
          connect.push({
            id: textBlockList[i].id,
          })
        }

        return context.prisma.preview.create({
          data: {
            voice: '',
            record: {
              connect: {
                id: args.recordId,
              },
            },
            excerpt: {
              connect: connect,
            },
          },
        })
      },
    })

    t.field('deleteScheduleById', {
      type: Schedule,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.schedule.delete({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.field('addSchedule', {
      type: Schedule,
      args: {
        data: arg({ type: nonNull(ScheduleCreateInput) }),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.schedule.create({
          data: {
            date: args.data.date,
            memo: args.data.memo,
          },
        })
      },
    })
  },
})

export default Mutation
