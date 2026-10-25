(function () {
  const exprEl = document.querySelector('#expr bdi');
  const resultEl = document.getElementById('result');
  const pad = document.getElementById('pad');
  const keys = [...pad.querySelectorAll('[data-k]')];
  const eqKey = keys.find(k => k.dataset.k === '=');

  let t = [];        // completed tokens, always ending in a pending operator, or empty
  let cur = '0';     // number being typed, or the last result
  let fresh = true;  // nothing typed since the last operator
  let hint = '';     // the small line after '='
  let done = false;  // last press was '='

  const isOp = v => '÷×−+'.includes(v);

  // the expression as it stands; a pending operator with no operand doesn't count yet
  const tokens = () => (fresh && t.length > 1 ? t.slice(0, -1) : [...t, cur]);

  // a bad token must never throw into the UI
  function value() {
    try { return calc(tokens()); } catch { return NaN; }
  }

  function render() {
    const v = value();
    const bad = cur === 'Error' || !isFinite(v);
    exprEl.textContent = hint || t.join(' ');
    resultEl.textContent = cur === 'Error' ? 'Error' : bad ? fmt(cur) : fmt(String(round(v)));
    eqKey.classList.toggle('live', !bad && t.length > 0);
    fit();
  }

  // long numbers shrink instead of spilling out of the glass
  function fit() {
    resultEl.style.fontSize = '';
    const base = parseFloat(getComputedStyle(resultEl).fontSize);
    const room = resultEl.clientWidth || 1;
    const used = resultEl.scrollWidth;
    if (used > room) resultEl.style.fontSize = Math.max(base * 0.45, base * room / used) + 'px';
  }

  function start() { t = []; cur = '0'; fresh = true; hint = ''; done = false; }
  const edit = () => { fresh = false; hint = ''; };

  const press = {
    digit: d => {
      if (done) start();
      // shortcut: 15 typed digits, upgrade to exponent entry only if asked
      if (fresh && cur.replace('-', '').length >= 15 && cur !== '0') return;
      cur = cur === '0' ? d : cur + d;
      edit();
    },
    '.': () => {
      if (done) start();
      if (!cur.includes('.')) cur += '.';
      edit();
    },
    op: o => {
      done = false;
      hint = '';
      // swap the pending operator only when no new number has been entered
      if (fresh && t.length) t[t.length - 1] = o;
      else { t.push(cur, o); cur = '0'; }
      fresh = true;
    },
    '%': () => { cur = String(round(+cur / 100)); edit(); },
    '±': () => { if (cur !== '0' && cur !== 'Error') cur = cur[0] === '-' ? cur.slice(1) : '-' + cur; edit(); },
    '⌫': () => { if (cur !== 'Error') cur = cur.length > 1 ? cur.slice(0, -1) : '0'; edit(); },
    AC: start,
    '=': () => {
      if (done || !t.length) return;
      const shown = tokens();
      const v = value();
      hint = shown.join(' ') + ' =';
      t = [];
      cur = isFinite(v) ? String(round(v)) : 'Error';
      done = true;
      fresh = true;
    },
  };

  // one dispatch path for pointer and keyboard
  function hit(v) {
    if (cur === 'Error' && v !== 'AC') return;
    press[isOp(v) ? 'op' : press[v] ? v : 'digit'](v);
    render();
  }

  pad.addEventListener('click', e => {
    const k = e.target.closest('[data-k]');
    if (k) hit(k.dataset.k);
  });

  addEventListener('keydown', e => {
    const v = ({ '*': '×', '/': '÷', '-': '−', Enter: '=', Escape: 'AC', Delete: 'AC', Backspace: '⌫' })[e.key] ?? e.key;
    const k = keys.find(k => k.dataset.k === v);
    if (!k) return;
    e.preventDefault();
    hit(v);
    // flash the matching key so a keyboard press is visible
    k.classList.add('hit');
    setTimeout(() => k.classList.remove('hit'), 110);
  });

  render();
})();
