import { ChonkyActions } from "chonky";

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
    // eslint-disable-next-line
    console.log("e :>> ", e);
    f.setOpen(true);
  }
};

export const extraActions = [
  ChonkyActions.CreateFolder,
  ChonkyActions.UploadFiles,
  ChonkyActions.DownloadFiles,
  ChonkyActions.DeleteFiles,
];

export default {
  onFileAction,
  extraActions,
};
