'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readLocalFile = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var readLocalFile = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              var uploadInput = document.createElement("input");

              uploadInput.addEventListener('change', function (_) {
                var file = uploadInput.files[0];
                resolve({
                  type: file.type,
                  name: file.name,
                  file: file
                });
              });

              // This input element in IE11 becomes visible after it is added on the page
              // Hide an input element
              uploadInput.style.visibility = 'hidden';

              uploadInput.type = "file";
              document.body.appendChild(uploadInput);
              uploadInput.click();
              document.body.removeChild(uploadInput);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function readLocalFile() {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.readLocalFile = readLocalFile;