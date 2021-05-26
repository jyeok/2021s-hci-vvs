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
      type: 'Record',
      resolve: (_p, _a, context: Context) => {
        return context.prisma.record.findMany()
      },
    })

    t.nullable.field('recordById', {
      type: 'Record',
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
      type: 'Record',
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
      type: 'TextBlock',
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock.findMany()
      },
    })

    t.nullable.field('textBlockById', {
      type: 'TextBlock',
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
      type: 'TextBlock',
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
      type: 'Preview',
      resolve: (parent, args, context: Context) => {
        return context.prisma.preview.findMany()
      },
    })

    t.nullable.field('previewById', {
      type: 'Preview',
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
      type: 'Preview',
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
      type: 'Schedule',
      resolve: (parent, args, context: Context) => {
        return context.prisma.schedule.findMany()
      },
    })

    t.nullable.field('scheduleById', {
      type: 'Schedule',
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
      type: 'Schedule',
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
    t.nonNull.string('hellow', {
      resolve: (parent, _, context: Context) => {
        return 'hello!'
      },
    })
    // t.nonNull.field('signupUser', {
    //   type: 'User',
    //   args: {
    //     data: nonNull(
    //       arg({
    //         type: 'UserCreateInput',
    //       }),
    //     ),
    //   },
    //   resolve: (_, args, context: Context) => {
    //     const postData = args.data.posts?.map((post) => {
    //       return { title: post.title, content: post.content || undefined }
    //     })
    //     return context.prisma.user.create({
    //       data: {
    //         name: args.data.name,
    //         email: args.data.email,
    //         posts: {
    //           create: postData,
    //         },
    //       },
    //     })
    //   },
    // })
    // t.field('createDraft', {
    //   type: 'Post',
    //   args: {
    //     data: nonNull(
    //       arg({
    //         type: 'PostCreateInput',
    //       }),
    //     ),
    //     authorEmail: nonNull(stringArg()),
    //   },
    //   resolve: (_, args, context: Context) => {
    //     return context.prisma.post.create({
    //       data: {
    //         title: args.data.title,
    //         content: args.data.content,
    //         author: {
    //           connect: { email: args.authorEmail },
    //         },
    //       },
    //     })
    //   },
    // })
    // t.field('togglePublishPost', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: async (_, args, context: Context) => {
    //     try {
    //       const post = await context.prisma.post.findUnique({
    //         where: { id: args.id || undefined },
    //         select: {
    //           published: true,
    //         },
    //       })
    //       return context.prisma.post.update({
    //         where: { id: args.id || undefined },
    //         data: { published: !post?.published },
    //       })
    //     } catch (e) {
    //       throw new Error(
    //         `Post with ID ${args.id} does not exist in the database.`,
    //       )
    //     }
    //   },
    // })
    // t.field('incrementPostViewCount', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: (_, args, context: Context) => {
    //     return context.prisma.post.update({
    //       where: { id: args.id || undefined },
    //       data: {
    //         viewCount: {
    //           increment: 1,
    //         },
    //       },
    //     })
    //   },
    // })
    // t.field('deletePost', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: (_, args, context: Context) => {
    //     return context.prisma.post.delete({
    //       where: { id: args.id },
    //     })
    //   },
    // })
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
      type: 'Preview',
      resolve: (parent, args, context: Context) => {
        return context.prisma.record
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .preview()
      },
    })

    t.nonNull.string('voice')
    t.nonNull.list.nonNull.field('content', {
      type: 'TextBlock',
      resolve: (parent, _, context: Context) => {
        return context.prisma.record
          .findUnique({
            where: { id: parent.id || undefined },
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

    t.int('isMine')
    t.int('isHighlighted') // FIXME: Integer?
    t.int('isModified')

    t.nonNull.float('reliability')

    t.nonNull.string('start')
    t.nonNull.string('end')

    t.field('record', {
      type: 'Record',
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
      type: 'Preview',
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

    t.nonNull.list.nonNull.field('excerpt', {
      type: 'TextBlock',
      resolve: (parent, args, context: Context) => {
        return context.prisma.textBlock.findMany({
          where: { id: parent.id },
        })
      },
    })

    t.field('record', {
      type: 'Record',
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

    t.field('source', {
      type: 'TextBlock',
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
    t.nonNull.int('id')
    t.nonNull.string('path')
    t.nonNull.string('title')
    t.nonNull.string('size')
    t.string('tag')
    t.string('memo')

    t.nonNull.string('voice')

    t.nonNull.field('preview', { type: 'PreviewCreateInput' })
    t.nonNull.list.nonNull.field('content', { type: 'TextBlockCreateInput' })
  },
})

const TextBlockCreateInput = inputObjectType({
  name: 'TextBlockCreateInput',
  definition(t) {
    t.nonNull.int('id')
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
    t.nonNull.int('id')
    t.nonNull.string('voice')
  },
})

const ScheduleCreateInput = inputObjectType({
  name: 'ScheduleCreateInput',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('date')
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
