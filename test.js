const assert = require('node:assert');
const { calc, round, fmt } = require('./calc.js');

const tok = s => s.match(/\d+\.?\d*|[÷×−+]/g);

assert.strictEqual(calc(tok('2+3×4')), 14);      // × before +
assert.strictEqual(calc(tok('10−3−2')), 5);      // left to right
assert.strictEqual(calc(tok('8÷2÷2')), 2);
assert.strictEqual(calc(tok('7')), 7);
assert.strictEqual(calc(tok('0.1+0.2')), 0.30000000000000004);
assert.strictEqual(round(calc(tok('0.1+0.2'))), 0.3);
assert.strictEqual(calc(tok('5÷0')), Infinity);

assert.strictEqual(fmt('1234567'), '1,234,567');
assert.strictEqual(fmt('-1234.5'), '-1,234.5');
assert.strictEqual(fmt('0.'), '0.');
assert.strictEqual(fmt(''), '0');
assert.strictEqual(fmt('1e+21'), '1e+21');

console.log('ok');
