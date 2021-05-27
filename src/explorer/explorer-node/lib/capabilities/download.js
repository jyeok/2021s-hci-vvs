'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _handler = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(apiOptions, actions) {
    var updateNotifications, getSelectedResources, getNotifications, getMessage, notificationId, notificationChildId, onStart, onSuccess, onProgress, resources, quantity, _resources$, id, name, downloadUrl, archiveName, content;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            updateNotifications = actions.updateNotifications, getSelectedResources = actions.getSelectedResources, getNotifications = actions.getNotifications;
            getMessage = _translations2.default.bind(null, apiOptions.locale);
            notificationId = label;
            notificationChildId = (0, _nanoid2.default)();

            onStart = function onStart(_ref2) {
              var archiveName = _ref2.archiveName,
                  quantity = _ref2.quantity;

              var notifications = getNotifications();
              var notification = _notifications2.default.getNotification(notifications, notificationId);

              var childElement = {
                elementType: 'NotificationProgressItem',
                elementProps: {
                  title: getMessage('creatingName', { name: archiveName }),
                  progress: 0
                }
              };

              var newChildren = _notifications2.default.addChild(notification && notification.children || [], notificationChildId, childElement);
              var newNotification = {
                title: quantity > 1 ? getMessage('zippingItems', { quantity: quantity }) : getMessage('zippingItem'),
                children: newChildren
              };

              var newNotifications = notification ? _notifications2.default.updateNotification(notifications, notificationId, newNotification) : _notifications2.default.addNotification(notifications, notificationId, newNotification);

              updateNotifications(newNotifications);
            };

            onSuccess = function onSuccess(_) {
              var notifications = getNotifications();
              var notification = _notifications2.default.getNotification(notifications, notificationId);
              var notificationChildrenCount = notification.children.length;
              var newNotifications = void 0;

              if (notificationChildrenCount > 1) {
                newNotifications = _notifications2.default.updateNotification(notifications, notificationId, {
                  children: _notifications2.default.removeChild(notification.children, notificationChildId)
                });
              } else {
                newNotifications = _notifications2.default.removeNotification(notifications, notificationId);
              }
              updateNotifications(newNotifications);
            };

            onProgress = function onProgress(progress) {
              var notifications = getNotifications();
              var notification = _notifications2.default.getNotification(notifications, notificationId);
              var child = _notifications2.default.getChild(notification.children, notificationChildId);

              var newChild = (0, _extends3.default)({}, child, {
                element: (0, _extends3.default)({}, child.element, {
                  elementProps: (0, _extends3.default)({}, child.element.elementProps, {
                    progress: progress
                  })
                })
              });
              var newChildren = _notifications2.default.updateChild(notification.children, notificationChildId, newChild);
              var newNotifications = _notifications2.default.updateNotification(notifications, notificationId, { children: newChildren });
              updateNotifications(newNotifications);
            };

            _context.prev = 7;
            resources = getSelectedResources();
            quantity = resources.length;

            if (!(quantity === 1)) {
              _context.next = 18;
              break;
            }

            _resources$ = resources[0], id = _resources$.id, name = _resources$.name;
            downloadUrl = apiOptions.apiRoot + '/download?items=' + id;
            // check if the file is available and trigger native browser saving prompt
            // if server is down the error will be catched and trigger relevant notification

            _context.next = 15;
            return _api2.default.getResourceById(apiOptions, id);

          case 15:
            (0, _download.promptToSaveBlob)({ name: name, downloadUrl: downloadUrl });
            _context.next = 25;
            break;

          case 18:
            // multiple resources -> download as a single archive
            archiveName = apiOptions.archiveName || 'archive.zip';

            onStart({ archiveName: archiveName, quantity: quantity });
            _context.next = 22;
            return _api2.default.downloadResources({ resources: resources, apiOptions: apiOptions, onProgress: onProgress });

          case 22:
            content = _context.sent;

            setTimeout(onSuccess, 1000);
            (0, _download.promptToSaveBlob)({ content: content, name: archiveName });

          case 25:
            _context.next = 31;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context['catch'](7);

            (0, _onFailError2.default)({
              getNotifications: getNotifications,
              label: getMessage(label),
              notificationId: notificationId,
              updateNotifications: updateNotifications
            });
            console.log(_context.t0);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 27]]);
  }));

  return function _handler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _notifications = require('../utils/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _download = require('../utils/download');

var _onFailError = require('../utils/onFailError');

var _onFailError2 = _interopRequireDefault(_onFailError);

var _nanoid = require('nanoid');

var _nanoid2 = _interopRequireDefault(_nanoid);

var _iconsSvg = require('../icons-svg');

var _iconsSvg2 = _interopRequireDefault(_iconsSvg);

var _translations = require('../translations');

var _translations2 = _interopRequireDefault(_translations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var label = 'download';

exports.default = function (apiOptions, actions) {
  var localeLabel = (0, _translations2.default)(apiOptions.locale, label);
  var getSelectedResources = actions.getSelectedResources;

  return {
    id: label,
    icon: { svg: _iconsSvg2.default.fileDownload },
    label: localeLabel,
    shouldBeAvailable: function shouldBeAvailable(apiOptions) {
      var selectedResources = getSelectedResources();

      return selectedResources.length > 0 && !selectedResources.some(function (r) {
        return r.type === 'dir';
      }) && selectedResources.every(function (r) {
        return r.capabilities.canDownload;
      });
    },
    availableInContexts: ['row', 'toolbar'],
    handler: function handler() {
      return _handler(apiOptions, actions);
    }
  };
};