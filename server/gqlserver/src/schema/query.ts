import { intArg, nonNull, objectType, stringArg } from 'nexus'
import { Context } from '../context'
import { Record, TextBlock, Preview, Schedule, DateTime } from './model'

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nullable.list.nonNull.field('allRecords', {
      type: Record,
      resolve: (_p, _a, context: Context) => {
        return context.prisma.record.findMany()
      },
    })

    t.nullable.field('recordById', {
      type: Record,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_p, args, context: Context) => {
        return context.prisma.record.findUnique({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.nullable.field('recordByPath', {
      type: Record,
      args: {
        path: nonNull(stringArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.record.findFirst({
          where: {
            path: args.path,
          },
        })
      },
    })

    t.nullable.list.nonNull.field('allTextBlocks', {
      type: TextBlock,
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock.findMany()
      },
    })

    t.nullable.field('textBlockById', {
      type: TextBlock,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock.findUnique({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.nullable.list.nonNull.field('textBlocksByRecord', {
      type: TextBlock,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock.findMany({
          where: {
            recordId: args.id,
          },
        })
      },
    }) // TODO: test it

    t.nullable.list.nonNull.field('allPreviews', {
      type: Preview,
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview.findMany()
      },
    })

    t.nullable.field('previewById', {
      type: Preview,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview.findUnique({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.nullable.list.nonNull.field('previewByRecord', {
      type: Preview,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview.findMany({
          where: {
            recordId: args.id,
          },
        })
      },
    }) // TODO: test it

    t.nullable.list.nonNull.field('allSchedules', {
      type: Schedule,
      resolve: (parent, args, context: Context) => {
        return context.prisma.schedule.findMany()
      },
    })

    t.nullable.field('scheduleById', {
      type: Schedule,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.schedule.findUnique({
          where: {
            id: args.id,
          },
        })
      },
    })

    t.nullable.list.nonNull.field('scheduleByDate', {
      type: Schedule,
      args: {
        date: stringArg(),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.schedule.findMany({
          where: { date: args.date || undefined },
        })
      },
    })
  },
})

export default Query
