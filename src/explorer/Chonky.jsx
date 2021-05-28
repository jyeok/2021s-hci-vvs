import { React } from "react";
import { FullFileBrowser } from "chonky";

import PropTypes from "prop-types";

export const MyFileBrowser = (props) => {
  const data = { ...props };

  const files = data.data.allRecords.map((e) => ({
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

MyFileBrowser.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};
