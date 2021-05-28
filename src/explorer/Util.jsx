export const fileToFilemap = (files) =>
  files
    ? files.map((e) => ({
        id: e.id,
        name: e.title,
        size: Number.isInteger(e.size) ? Number.parseInt(e.size, 10) : 0,
        isDir: false,
        modDate: e.updatedAt,
        createDate: e.createdAt,
        tag: e.tag,
        memo: e.memo,
        preview: e.preview,
      }))
    : [];

export const getFolderChain = () => [
  { id: "xcv", name: "Demo", isDir: true },
  { id: "abdd", name: "zzz", isDir: true },
  { id: "asdfasdf", name: "ohno", isDir: true },
];

export default {
  fileToFilemap,
  getFolderChain,
};
