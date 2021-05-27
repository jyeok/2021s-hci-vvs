'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createFolder = require('./create-folder');

var _createFolder2 = _interopRequireDefault(_createFolder);

var _deleteResource = require('./delete-resource');

var _deleteResource2 = _interopRequireDefault(_deleteResource);

var _download = require('./download');

var _download2 = _interopRequireDefault(_download);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _rename = require('./rename');

var _rename2 = _interopRequireDefault(_rename);

var _sort = require('./sort');

var _sort2 = _interopRequireDefault(_sort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var capabilities = [_createFolder2.default, _rename2.default, _download2.default, _upload2.default, _deleteResource2.default, _sort2.default];

/**
 * Actions' fields list:
 *  showDialog,
 *  hideDialog,
 *  navigateToDir,
 *  updateNotifications,
 *  getSelection,
 *  getSelectedResources,
 *  getResource,
 *  getResourceChildren,
 *  getResourceLocation,
 *  getNotifications,
 *  getSortState
 *
 *  Called from FileNavigator (componentDidMount() and componentWillReceiveProps())
 *
 * @param apiOptions
 * @param {object} actions
 * @returns {array}
 */

exports.default = function (apiOptions, actions) {
  return capabilities.map(function (capability) {
    return capability(apiOptions, actions);
  });
};