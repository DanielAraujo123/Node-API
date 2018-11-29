'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.json());

app.get('/', function (req, res, next) {
    return res.status(200).send({ 'test': 'deu bom' });
});

app.listen(3030);
console.log('ta rodando na porta : ', 3030);