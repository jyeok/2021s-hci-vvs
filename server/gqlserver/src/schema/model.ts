import { objectType, asNexusMethod, enumType } from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

export const Record = objectType({
  name: 'Record',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('path')
    t.nonNull.string('title')
    t.nonNull.int('size')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.string('tag')
    t.string('memo')
    t.int('isLocked')

    t.field('preview', {
      type: Preview,
      resolve: (parent, args, context: Context) => {
        return context.prisma.record
          .findUnique({
            where: { id: parent.id },
          })
          .preview()
      },
    })

    t.nonNull.string('voice')
    t.nonNull.list.nonNull.field('content', {
      type: TextBlock,
      resolve: (parent, _, context: Context) => {
        return context.prisma.record
          .findUnique({
            where: { id: parent.id },
          })
          .content()
      },
    })
  },
})

export const TextBlock = objectType({
  name: 'TextBlock',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('content')

    t.nonNull.int('isMine')
    t.nonNull.int('isHighlighted') // FIXME: Integer?
    t.nonNull.int('isModified')

    t.nonNull.float('reliability')

    t.nonNull.string('start')
    t.nonNull.string('end')

    t.list.nonNull.field('schedule', {
      type: Schedule,
      resolve: (parent, _, context: Context) => {
        return context.prisma.schedule.findMany({
          where: {
            textBlockId: parent.id,
          },
        })
      },
    })

    t.field('record', {
      type: Record,
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .record()
      },
    })

    t.field('preview', {
      type: Preview,
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock
          .findUnique({
            where: { id: parent.id },
          })
          .preview()
      },
    })
  },
})

export const Preview = objectType({
  name: 'Preview',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('voice')

    t.list.nonNull.field('excerpt', {
      type: TextBlock,
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .excerpt()
      },
    })

    t.field('record', {
      type: Record,
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .record()
      },
    })
  },
})

export const Schedule = objectType({
  name: 'Schedule',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('date')
    t.nonNull.string('memo')

    t.field('source', {
      type: TextBlock,
      resolve: (parent, args, context: Context) => {
        return context.prisma.schedule
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .source()
      },
    })
  },
})

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

export const Model = [Record, TextBlock, Preview, Schedule, DateTime]

export default Model
