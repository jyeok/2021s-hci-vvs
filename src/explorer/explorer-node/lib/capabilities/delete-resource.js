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

var _onFailError = require('../utils/onFailError');

var _onFailError2 = _interopRequireDefault(_onFailError);

var _iconsSvg = require('../icons-svg');

var _iconsSvg2 = _interopRequireDefault(_iconsSvg);

var _translations = require('../translations');

var _translations2 = _interopRequireDefault(_translations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var label = 'remove';

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

  var selectedResources = getSelectedResources();

  var dialogFilesText = selectedResources.length > 1 ? selectedResources.length + ' ' + getMessage('files') : '"' + selectedResources[0].name + '"';

  var dialogNameText = getMessage('reallyRemove', { files: dialogFilesText });

  var rawDialogElement = {
    elementType: 'ConfirmDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
          var resource;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  hideDialog();
                  _context.prev = 1;
                  _context.next = 4;
                  return _api2.default.removeResources(apiOptions, selectedResources);

                case 4:
                  resource = getResource();

                  navigateToDir(resource.id, null, false);
                  _context.next = 12;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context['catch'](1);

                  (0, _onFailError2.default)({
                    getNotifications: getNotifications,
                    label: getMessage(label),
                    notificationId: 'delete',
                    updateNotifications: updateNotifications
                  });
                  console.log(_context.t0);

                case 12:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this, [[1, 8]]);
        }));

        return function onSubmit() {
          return _ref.apply(this, arguments);
        };
      }(),
      headerText: getMessage('remove'),
      messageText: dialogNameText,
      cancelButtonText: getMessage('cancel'),
      submitButtonText: getMessage('confirm')
    }
  };

  showDialog(rawDialogElement);
}

exports.default = function (apiOptions, actions) {
  var localeLabel = (0, _translations2.default)(apiOptions.locale, label);
  var getSelectedResources = actions.getSelectedResources;

  return {
    id: 'delete',
    icon: { svg: _iconsSvg2.default.delete },
    label: localeLabel,
    shouldBeAvailable: function shouldBeAvailable(apiOptions) {
      var selectedResources = getSelectedResources();

      if (!selectedResources.length) {
        return false;
      }

      return selectedResources.every(function (resource) {
        return resource.capabilities.canDelete;
      });
    },
    availableInContexts: ['row', 'toolbar'],
    handler: function handler() {
      return _handler(apiOptions, actions);
    }
  };
};