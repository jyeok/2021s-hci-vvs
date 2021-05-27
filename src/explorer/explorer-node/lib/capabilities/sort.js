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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (apiOptions, actions) {
  var updateNotifications = actions.updateNotifications,
      getResource = actions.getResource,
      getNotifications = actions.getNotifications,
      getSortState = actions.getSortState;

  return {
    id: 'sort',
    shouldBeAvailable: function shouldBeAvailable() {
      return true;
    },
    handler: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var sortBy = _ref2.sortBy,
            sortDirection = _ref2.sortDirection;
        var id;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = getResource().id;
                _context.prev = 1;
                return _context.abrupt('return', _api2.default.getChildrenForId(apiOptions, { id: id, sortBy: sortBy, sortDirection: sortDirection }));

              case 5:
                _context.prev = 5;
                _context.t0 = _context['catch'](1);

                (0, _onFailError2.default)({
                  getNotifications: getNotifications,
                  notificationId: 'rename',
                  updateNotifications: updateNotifications
                });
                return _context.abrupt('return', null);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[1, 5]]);
      }));

      return function handler(_x) {
        return _ref.apply(this, arguments);
      };
    }()
  };
};