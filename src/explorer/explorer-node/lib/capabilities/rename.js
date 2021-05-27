'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _sanitizeFilename = require('sanitize-filename');

var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

var _onFailError = require('../utils/onFailError');

var _onFailError2 = _interopRequireDefault(_onFailError);

var _iconsSvg = require('../icons-svg');

var _iconsSvg2 = _interopRequireDefault(_iconsSvg);

var _translations = require('../translations');

var _translations2 = _interopRequireDefault(_translations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var label = 'rename';

function _handler(apiOptions, actions) {
  var _this = this;

  var showDialog = actions.showDialog,
      hideDialog = actions.hideDialog,
      navigateToDir = actions.navigateToDir,
      updateNotifications = actions.updateNotifications,
      getSelectedResources = actions.getSelectedResources,
      getResource = actions.getResource,
      getNotifications = actions.getNotifications;


  var getMessage = _translations2.default.bind(null, apiOptions.locale);
  var localeLabel = getMessage(label);

  var rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      initialValue: getSelectedResources()[0].name,
      onHide: hideDialog,
      onSubmit: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(name) {
          var selectedResources, resourceChildren, alreadyExists, result, resource;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  selectedResources = getSelectedResources();
                  _context.prev = 1;
                  _context.next = 4;
                  return _api2.default.getChildrenForId(apiOptions, { id: selectedResources[0].parentId });

                case 4:
                  resourceChildren = _context.sent;
                  alreadyExists = resourceChildren.some(function (o) {
                    return o.name === name;
                  });

                  if (!alreadyExists) {
                    _context.next = 10;
                    break;
                  }

                  return _context.abrupt('return', getMessage('fileExist', { name: name }));

                case 10:
                  hideDialog();
                  _context.next = 13;
                  return _api2.default.renameResource(apiOptions, selectedResources[0].id, name);

                case 13:
                  result = _context.sent;
                  resource = getResource();

                  navigateToDir(resource.id, result.body.id, false);

                case 16:
                  return _context.abrupt('return', null);

                case 19:
                  _context.prev = 19;
                  _context.t0 = _context['catch'](1);

                  hideDialog();
                  (0, _onFailError2.default)({
                    getNotifications: getNotifications,
                    label: localeLabel,
                    notificationId: label,
                    updateNotifications: updateNotifications
                  });
                  console.log(_context.t0);
                  return _context.abrupt('return', null);

                case 25:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this, [[1, 19]]);
        }));

        return function onSubmit(_x) {
          return _ref.apply(this, arguments);
        };
      }(),
      onValidate: function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(name) {
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (name) {
                    _context2.next = 4;
                    break;
                  }

                  return _context2.abrupt('return', getMessage('emptyName'));

                case 4:
                  if (!(name.length >= 255)) {
                    _context2.next = 8;
                    break;
                  }

                  return _context2.abrupt('return', getMessage('tooLongFolderName'));

                case 8:
                  if (!(name.trim() !== (0, _sanitizeFilename2.default)(name.trim()))) {
                    _context2.next = 10;
                    break;
                  }

                  return _context2.abrupt('return', getMessage('folderNameNotAllowedCharacters'));

                case 10:
                  return _context2.abrupt('return', null);

                case 11:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this);
        }));

        return function onValidate(_x2) {
          return _ref2.apply(this, arguments);
        };
      }(),
      inputLabelText: getMessage('newName'),
      headerText: getMessage('rename'),
      submitButtonText: localeLabel,
      cancelButtonText: getMessage('cancel')
    }
  };
  showDialog(rawDialogElement);
}

exports.default = function (apiOptions, actions) {
  var localeLabel = (0, _translations2.default)(apiOptions.locale, label);
  var getSelectedResources = actions.getSelectedResources;

  return {
    id: label,
    icon: { svg: _iconsSvg2.default.rename },
    label: localeLabel,
    shouldBeAvailable: function shouldBeAvailable(apiOptions) {
      var selectedResources = getSelectedResources();
      return selectedResources.length === 1 && selectedResources.every(function (r) {
        return r.capabilities.canRename;
      });
    },
    availableInContexts: ['row', 'toolbar'],
    handler: function handler() {
      return _handler(apiOptions, actions);
    }
  };
};