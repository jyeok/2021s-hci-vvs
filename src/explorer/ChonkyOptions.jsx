import { ChonkyActions } from "chonky";

export const onFileAction = (e, f) => {
  // eslint-disable-next-line
  console.log("event, function :>> ", e, f); // development purpose

  switch (e.id) {
    case ChonkyActions.EnableGridView.id:
    case ChonkyActions.EnableListView.id:
      f.refetch();
      break;

    case ChonkyActions.MouseClickFile.id:
      console.log("file :>> ", e.payload.file);
      break;

    default:
      break;
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
