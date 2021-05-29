import { inputObjectType } from 'nexus'

export const RecordCreateInput = inputObjectType({
  name: 'RecordCreateInput',
  definition(t) {
    t.nonNull.string('path')
    t.nonNull.string('title')
    t.nonNull.int('size')
    t.nonNull.string('tag')
    t.nonNull.string('memo')
    t.nonNull.string('voice')

    t.list.nonNull.field('content', { type: TextBlockCreateInput })
  },
})

export const TextBlockCreateInput = inputObjectType({
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

export const PreviewCreateInput = inputObjectType({
  name: 'PreviewCreateInput',
  definition(t) {
    t.nonNull.string('voice')
  },
})

export const ScheduleCreateInput = inputObjectType({
  name: 'ScheduleCreateInput',
  definition(t) {
    t.nonNull.string('date')
    t.nonNull.string('memo')
  },
})

export const RecordUpdateInput = inputObjectType({
  name: 'RecordUpdateInput',
  definition(t) {
    t.string('path')
    t.string('title')
    t.int('size')
    t.string('tag')
    t.string('memo')
    t.int('isLocked')
    t.string('voice')
  },
})

export const TextBlockUpdateInput = inputObjectType({
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

export const ScheduleUpdateInput = inputObjectType({
  name: 'ScheduleUpdateInput',
  definition(t) {
    t.string('date')
    t.string('memo')
  },
})

export const Input = [
  RecordCreateInput,
  RecordUpdateInput,
  TextBlockCreateInput,
  TextBlockUpdateInput,
  PreviewCreateInput,
  ScheduleCreateInput,
  ScheduleUpdateInput,
]

export default Input
