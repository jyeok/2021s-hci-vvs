import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { context, Context } from './context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
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

const Mutation = objectType({
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
            isMine: args.data.isMine || undefined,
            isHighlighted: args.data.isHighlighted || undefined,
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

    // t.field('generatePreview', {
    //   type: Preview,
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
    //         // TODO: Generate....
    //       })
    //   },
    // })

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

const Record = objectType({
  name: 'Record',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('path')
    t.nonNull.string('title')
    t.nonNull.string('size')
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

const TextBlock = objectType({
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

const Preview = objectType({
  name: 'Preview',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('voice')

    t.field('excerpt', {
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

const Schedule = objectType({
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

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const RecordCreateInput = inputObjectType({
  name: 'RecordCreateInput',
  definition(t) {
    t.nonNull.string('path')
    t.nonNull.string('title')
    t.nonNull.string('size')
    t.nonNull.string('tag')
    t.nonNull.string('memo')
    t.nonNull.string('voice')

    t.list.nonNull.field('content', { type: TextBlockCreateInput })
  },
})

const TextBlockCreateInput = inputObjectType({
  name: 'TextBlockCreateInput',
  definition(t) {
    t.nonNull.string('content')
    t.nonNull.int('isMine')
    t.nonNull.int('isHighlighted')
    t.nonNull.int('isModified')
    t.nonNull.float('reliability')
    t.nonNull.string('start')
    t.nonNull.string('end')
  },
})

const PreviewCreateInput = inputObjectType({
  name: 'PreviewCreateInput',
  definition(t) {
    t.nonNull.string('voice')
  },
})

const ScheduleCreateInput = inputObjectType({
  name: 'ScheduleCreateInput',
  definition(t) {
    t.nonNull.string('date')
    t.nonNull.string('memo')
  },
})

const RecordUpdateInput = inputObjectType({
  name: 'RecordUpdateInput',
  definition(t) {
    t.string('path')
    t.string('title')
    t.string('size')
    t.string('tag')
    t.string('memo')
    t.int('isLocked')
    t.string('voice')
  },
})

const TextBlockUpdateInput = inputObjectType({
  name: 'TextBlockUpdateInput',
  definition(t) {
    t.string('content')
    t.int('isMine')
    t.int('isHighlighted')
    t.float('reliability')
    t.string('start')
    t.string('end')
  },
})

const ScheduleUpdateInput = inputObjectType({
  name: 'ScheduleUpdateInput',
  definition(t) {
    t.string('date')
    t.string('memo')
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    SortOrder,
    DateTime,
    Record,
    TextBlock,
    Preview,
    Schedule,
    TextBlockCreateInput,
    RecordCreateInput,
    PreviewCreateInput,
    ScheduleCreateInput,
    RecordUpdateInput,
    TextBlockUpdateInput,
    ScheduleUpdateInput,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
