'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _findIndex2 = require('lodash/findIndex');

var _findIndex3 = _interopRequireDefault(_findIndex2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addNotification(notifications, id, props) {
  var index = (0, _findIndex3.default)(notifications, function (o) {
    return o.id === id;
  });
  if (index !== -1) {
    console.error('Can\'t add notification: ' + id + ' already exists');
    return notifications;
  }
  return notifications.concat([(0, _extends3.default)({ id: id, children: props.children || [] }, props)]);
}

function updateNotification(notifications, id, props) {
  return notifications.map(function (o) {
    if (o.id !== id) {
      return o;
    }

    return (0, _extend3.default)({}, o, props);
  });
}

function getNotification(notifications, id) {
  return (0, _find3.default)(notifications, function (o) {
    return o.id === id;
  });
}

function removeNotification(notifications, id) {
  return notifications.filter(function (o) {
    return o.id !== id;
  });
}

function addChild(notificationChildren, id, element) {
  return notificationChildren.concat([{ id: id, element: element }]);
}

function removeChild(notificationChildren, id) {
  return notificationChildren.filter(function (o) {
    return o.id !== id;
  });
}

function updateChild(notificationChildren, id, element) {
  return notificationChildren.map(function (o) {
    if (o.id !== id) {
      return o;
    }

    return (0, _extend3.default)({}, o, (0, _extends3.default)({ id: id }, element));
  });
}

function getChild(notificationChildren, id) {
  return (0, _find3.default)(notificationChildren, function (o) {
    return o.id === id;
  });
}

exports.default = {
  addNotification: addNotification,
  updateNotification: updateNotification,
  removeNotification: removeNotification,
  getNotification: getNotification,
  addChild: addChild,
  removeChild: removeChild,
  updateChild: updateChild,
  getChild: getChild
};