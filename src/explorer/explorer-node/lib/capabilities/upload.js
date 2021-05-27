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
    var navigateToDir, updateNotifications, getResource, getNotifications, getMessage, notificationId, notificationChildId, prevResourceId, onStart, onProgress, resource, file, response, newResource, notifications, notification, notificationChildrenCount, newNotifications;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            navigateToDir = actions.navigateToDir, updateNotifications = actions.updateNotifications, getResource = actions.getResource, getNotifications = actions.getNotifications;
            getMessage = _translations2.default.bind(null, apiOptions.locale);
            notificationId = label;
            notificationChildId = (0, _nanoid2.default)();
            prevResourceId = getResource().id;

            onStart = function onStart(_ref2) {
              var name = _ref2.name,
                  size = _ref2.size;

              var notifications = getNotifications();
              var notification = _notifications2.default.getNotification(notifications, notificationId);
              var childElement = {
                elementType: 'NotificationProgressItem',
                elementProps: {
                  title: name,
                  progress: 0,
                  icon: (0, _icons.getIcon)({ name: name })
                }
              };

              var newChildren = _notifications2.default.addChild(notification && notification.children || [], notificationChildId, childElement);
              var newNotification = {
                title: newChildren.length > 1 ? getMessage('uploadingItems', { quantity: newChildren.length }) : getMessage('uploadingItem'),
                children: newChildren
              };

              var newNotifications = notification ? _notifications2.default.updateNotification(notifications, notificationId, newNotification) : _notifications2.default.addNotification(notifications, notificationId, newNotification);

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

            resource = getResource();
            _context.prev = 8;
            _context.next = 11;
            return (0, _upload.readLocalFile)(true);

          case 11:
            file = _context.sent;

            onStart({ name: file.name, size: file.file.size });
            _context.next = 15;
            return _api2.default.uploadFileToId({ apiOptions: apiOptions, parentId: resource.id, file: file, onProgress: onProgress });

          case 15:
            response = _context.sent;
            newResource = (0, _common.normalizeResource)(response.body[0]);
            notifications = getNotifications();
            notification = _notifications2.default.getNotification(notifications, notificationId);
            notificationChildrenCount = notification.children.length;
            newNotifications = void 0;

            if (notificationChildrenCount > 1) {
              newNotifications = _notifications2.default.updateNotification(notifications, notificationId, {
                children: _notifications2.default.removeChild(notification.children, notificationChildId)
              });
            } else {
              newNotifications = _notifications2.default.removeNotification(notifications, notificationId);
            }
            updateNotifications(newNotifications);
            if (prevResourceId === resource.id) {
              navigateToDir(resource.id, newResource.id, false);
            }
            _context.next = 30;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context['catch'](8);

            (0, _onFailError2.default)({
              getNotifications: getNotifications,
              label: getMessage(label),
              notificationId: notificationId,
              updateNotifications: updateNotifications
            });
            console.log(_context.t0);

          case 30:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[8, 26]]);
  }));

  return function _handler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _notifications = require('../utils/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _icons = require('../icons');

var _nanoid = require('nanoid');

var _nanoid2 = _interopRequireDefault(_nanoid);

var _onFailError = require('../utils/onFailError');

var _onFailError2 = _interopRequireDefault(_onFailError);

var _upload = require('../utils/upload');

var _iconsSvg = require('../icons-svg');

var _iconsSvg2 = _interopRequireDefault(_iconsSvg);

var _translations = require('../translations');

var _translations2 = _interopRequireDefault(_translations);

var _common = require('../utils/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var label = 'upload';

exports.default = function (apiOptions, actions) {
  var localeLabel = (0, _translations2.default)(apiOptions.locale, label);
  var getResource = actions.getResource;

  return {
    id: label,
    icon: { svg: _iconsSvg2.default.fileUpload },
    label: localeLabel,
    shouldBeAvailable: function shouldBeAvailable(apiOptions) {
      var resource = getResource();
      if (!resource || !resource.capabilities) {
        return false;
      }
      return resource.capabilities.canAddChildren;
    },
    availableInContexts: ['files-view', 'new-button'],
    handler: function handler() {
      return _handler(apiOptions, actions);
    }
  };
};