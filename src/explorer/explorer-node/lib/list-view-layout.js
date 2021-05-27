'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fecha = require('fecha');

var _fecha2 = _interopRequireDefault(_fecha);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _translations = require('./translations');

var _translations2 = _interopRequireDefault(_translations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABLET_WIDTH = 1024;
var MOBILE_WIDTH = 640;

function formatSize(viewLayoutOptions, _ref) {
  var cellData = _ref.cellData,
      columnData = _ref.columnData,
      columnIndex = _ref.columnIndex,
      dataKey = _ref.dataKey,
      isScrolling = _ref.isScrolling,
      rowData = _ref.rowData,
      rowIndex = _ref.rowIndex;

  if (typeof cellData !== 'undefined' && viewLayoutOptions.humanReadableSize) {
    return (0, _filesize2.default)(cellData);
  }

  return cellData || '—';
}

function formatDate(viewLayoutOptions, _ref2) {
  var cellData = _ref2.cellData,
      columnData = _ref2.columnData,
      columnIndex = _ref2.columnIndex,
      dataKey = _ref2.dataKey,
      isScrolling = _ref2.isScrolling,
      rowData = _ref2.rowData,
      rowIndex = _ref2.rowIndex;

  if (cellData) {
    var dateTimePattern = viewLayoutOptions.dateTimePattern;

    return _fecha2.default.format(new Date().setTime(cellData), dateTimePattern);
  }

  return '';
}

var listViewLayout = function listViewLayout(viewLayoutOptions) {
  var getMessage = _translations2.default.bind(null, viewLayoutOptions.locale);
  return [{
    elementType: 'Column',
    elementProps: {
      key: "name",
      dataKey: "name",
      width: 48,
      label: getMessage('title'),
      flexGrow: 1,
      cellRenderer: {
        elementType: 'NameCell',
        callArguments: [viewLayoutOptions]
      },
      headerRenderer: {
        elementType: 'HeaderCell',
        callArguments: [viewLayoutOptions]
      },
      disableSort: false
    }
  }, {
    elementType: 'Column',
    elementProps: {
      key: "size",
      width: 100,
      dataKey: "size",
      label: getMessage('fileSize'),
      flexGrow: viewLayoutOptions.width > TABLET_WIDTH ? 1 : 0,
      cellRenderer: {
        elementType: 'Cell',
        callArguments: [(0, _extends3.default)({}, viewLayoutOptions, { getData: formatSize })]
      },
      headerRenderer: {
        elementType: 'HeaderCell',
        callArguments: [viewLayoutOptions]
      },
      disableSort: true
    }
  }, viewLayoutOptions.width > MOBILE_WIDTH && {
    elementType: 'Column',
    elementProps: {
      key: "modifiedTime",
      width: 100,
      dataKey: "modifiedTime",
      label: getMessage('lastModified'),
      flexGrow: 1,
      cellRenderer: {
        elementType: 'Cell',
        callArguments: [(0, _extends3.default)({}, viewLayoutOptions, { getData: formatDate })]
      },
      headerRenderer: {
        elementType: 'HeaderCell',
        callArguments: [viewLayoutOptions]
      },
      disableSort: false
    }
  }];
};

exports.default = listViewLayout;