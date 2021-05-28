import { React } from "react";
import { FullFileBrowser } from "chonky";
import PropTypes from "prop-types";

import { Record } from "proptypes/ModelPropTypes";

export const MyFileBrowser = (props) => {
  const { data } = props;

  const files = data.allRecords.map((e) => ({
    id: e.id,
    name: e.title,
    isDir: false,
  }));

  const folderChain = [{ id: "xcv", name: "Demo", isDir: true }];
  return (
    <div style={{ height: 600 }}>
      <FullFileBrowser files={files} folderChain={folderChain} />
    </div>
  );
};

export default MyFileBrowser;

const { preview, voice, content, ...recordShape } = Record;

MyFileBrowser.propTypes = {
  data: PropTypes.shape({
    allRecords: PropTypes.arrayOf(PropTypes.shape(recordShape)),
  }).isRequired,
};
