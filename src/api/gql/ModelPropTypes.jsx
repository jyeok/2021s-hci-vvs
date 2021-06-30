import PropTypes from "prop-types";

export const FileData = {
  id: PropTypes.string,
  name: PropTypes.string,
  ext: PropTypes.string,
  size: PropTypes.number,
  isDir: PropTypes.bool,
  isHidden: PropTypes.bool,
  isEncrypted: PropTypes.bool,
  modDate: PropTypes.string,
  createDate: PropTypes.string,
  tag: PropTypes.string,
  memo: PropTypes.string,
};

export const Record = {
  id: PropTypes.number,
  path: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  tag: PropTypes.string,
  memo: PropTypes.string,
  isLocked: PropTypes.number,
  voice: PropTypes.string,
};

export const Preview = {
  id: PropTypes.number,
  voice: PropTypes.string,
};

export const TextBlock = {
  id: PropTypes.number,
  content: PropTypes.string,
  isMine: PropTypes.number,
  isHighlighted: PropTypes.number,
  isModified: PropTypes.number,
  reliability: PropTypes.number,
  start: PropTypes.string,
  end: PropTypes.string,
};

export const Schedule = {
  id: PropTypes.number,
  date: PropTypes.string,
  memo: PropTypes.string,
};
