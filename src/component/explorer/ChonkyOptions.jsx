import {
  defineFileAction,
  ChonkyActions,
  ChonkyIconName,
  FileViewMode,
} from "chonky";

export const onFileAction = (e, f) => {
  const { id: eventId } = e;

  if (
    eventId === ChonkyActions.EnableGridView.id ||
    eventId === ChonkyActions.EnableListView.id
  ) {
    f.refetch();
  } else if (eventId === ChonkyActions.MouseClickFile.id) {
    const {
      payload: { file },
    } = e;

    const content = file.preview
      ? file.preview.excerpt.map((el) => ({
          content: el.content,
          isMine: el.isMine,
          isHighlighted: el.isHighlighted,
          isModified: el.isModified,
          reliability: el.reliability,
          start: el.start,
        }))
      : [];

    f.setCurrSelect({
      id: file.id,
      memo: file.memo,
      tag: file.tag,
      content,
    });
  } else if (eventId === ChonkyActions.UploadFiles.id) {
    f.setOpen(true);
  }
};

const myUpload = defineFileAction({
  id: "upload_files",
  button: {
    name: "녹음 업로드",
    toolbar: true,
    tooltip: "녹음을 업로드하세요!",
    icon: ChonkyIconName.upload,
  },
});

const myDelete = defineFileAction({
  id: "delete_files",
  requiresSelection: true,
  button: {
    name: "파일 삭제",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.trash,
  },
});

const myListView = defineFileAction({
  id: "enable_list_view",
  fileViewConfig: {
    mode: FileViewMode.List,
    entryHeight: 30,
  },
  button: {
    name: "리스트로 보기",
    toolbar: true,
    icon: ChonkyIconName.list,
    iconOnly: true,
  },
});

const myGridview = defineFileAction({
  id: "enable_grid_view",
  fileViewConfig: {
    mode: FileViewMode.Grid,
    entryWidth: 165,
    entryHeight: 130,
  },
  button: {
    name: "그리드 보기",
    toolbar: true,
    icon: ChonkyIconName.smallThumbnail,
    iconOnly: true,
  },
});

const SortFilesByName = defineFileAction({
  id: "sort_files_by_name",
  sortKeySelector: (file) => (file ? file.name.toLowerCase() : undefined),
  button: {
    name: "이름순",
    toolbar: true,
    group: "정렬",
  },
});

const SortFilesBySize = defineFileAction({
  id: "sort_files_by_size",
  sortKeySelector: (file) => (file ? file.size : undefined),
  button: {
    name: "크기순",
    toolbar: true,
    group: "정렬",
  },
});

const SortFilesByDate = defineFileAction({
  id: "sort_files_by_date",
  sortKeySelector: (file) => (file ? file.modDate : undefined),
  button: {
    name: "날짜순",
    toolbar: true,
    group: "정렬",
  },
});

const ToggleHiddenFiles = defineFileAction({
  id: "toggle_hidden_files",
  hotkeys: ["ctrl+h"],
  option: {
    id: "show_hidden_files",
    defaultValue: true,
  },
  button: {
    name: "숨김 파일 보기",
    toolbar: true,
    group: "정렬",
  },
});

export const extraActions = [
  myUpload,
  myDelete,
  myGridview,
  myListView,
  SortFilesByDate,
  SortFilesByName,
  SortFilesBySize,
  ToggleHiddenFiles,
];

export const actionsToDisable = [
  ChonkyActions.OpenSelection.id,
  ChonkyActions.SelectAllFiles.id,
  ChonkyActions.ClearSelection.id,
  ChonkyActions.ToggleShowFoldersFirst.id,
];

export default {
  onFileAction,
  extraActions,
  actionsToDisable,
};
