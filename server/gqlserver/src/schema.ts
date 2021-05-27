import { makeSchema } from 'nexus'

import Query from './schema/query'
import Mutation from './schema/mutation'
import Input from './schema/input'
import Model from './schema/model'

export const schema = makeSchema({
  types: [Query, Mutation, ...Input, ...Model],
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
