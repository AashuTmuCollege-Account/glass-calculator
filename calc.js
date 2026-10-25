const ops = {
  '÷': (a, b) => a / b,
  '×': (a, b) => a * b,
  '−': (a, b) => a - b,
  '+': (a, b) => a + b,
};

// × and ÷ bind tighter than + and −, like One UI's basic mode
function calc(t) {
  const nums = [+t[0]];
  const loose = [];
  for (let i = 1; i < t.length; i += 2) {
    const op = t[i];
    if (op === '×' || op === '÷') nums.push(ops[op](nums.pop(), +t[i + 1]));
    else { loose.push(op); nums.push(+t[i + 1]); }
  }
  return loose.reduce((a, op, i) => ops[op](a, nums[i + 1]), nums[0]);
}

// 0.1 + 0.2 has to read 0.3
const round = n => +n.toPrecision(12);

// digits as typed stay digits; only the grouping is cosmetic
function fmt(s) {
  if (!s || /e/i.test(s)) return s || '0';
  const [int, dec] = s.replace('-', '').split('.');
  return (s[0] === '-' ? '-' : '') + int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec === undefined ? '' : '.' + dec);
}

if (typeof module !== 'undefined') module.exports = { calc, round, fmt };
