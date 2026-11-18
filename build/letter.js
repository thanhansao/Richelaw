// Invitation letter — A5 landscape, 2 sides, in English, Vietnamese and Chinese
const fs = require('fs');
const { d, C, r, p, cell, table, line } = require('./common');
const T = require('./letter_text');

const W = 11906, H = 8391, M = 510;       // A5 landscape, ~0.9 cm margins
const CW = W - 2 * M;
const LW = 3300, RW = CW - LW;
const RED = 'C62828';

function build(t) {
  const k = t.scale || 1;                  // per-language body size factor
  // ---------- Side 1: brand panel + letter ----------
  const stat = (num, label) => [
    p(r(num, { pt: 24, b: true, color: C.white }), { after: 0, line: 220 }),
    p(r(label, { pt: 8, color: C.paleGreenText }), { after: 220 }),
  ];
  const left = cell([
    p(r('RICHE LAW', { pt: 15, b: true, color: C.white, sp: 40 }), { after: 0 }),
    p(r(t.tag1, { pt: 7.5, color: 'E8C98F', sp: 10 }), { after: 0 }),
    p(r(t.tag2, { pt: 7.5, color: 'E8C98F' }), {
      after: 240, border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: C.gold, space: 8 } },
    }),
    ...t.stats.flatMap(([n, l]) => stat(n, l)),
    p(r('Tiếng Việt · English · 中文', { pt: 7.5, b: true, color: C.white }), { before: 20, after: 20 }),
    p(r('richelaw.vn', { pt: 8.5, b: true, color: 'E8C98F' }), { after: 0 }),
  ], { w: LW, fill: C.green, m: { top: 280, bottom: 160, left: 300, right: 260 } });

  const body = (s) => p(r(s, { pt: 9 * k }), { after: 80, line: 252, align: d.AlignmentType.JUSTIFIED });
  const right = cell([
    p(r(t.eyebrow, { pt: 7.5, b: true, color: C.gold, sp: 30 }), { after: 30 }),
    p(r(t.title, { pt: 15.5, b: true, color: C.green }), { after: 40, line: 245 }),
    p(r('', { pt: 2 }), { after: 100, border: { bottom: { style: d.BorderStyle.SINGLE, size: 12, color: C.gold, space: 1 } }, indent: { right: RW - 1300 } }),
    p(r(t.dear, { pt: 9.5, b: true }), { after: 70 }),
    ...t.body.map(body),
    p(r(t.closing, { pt: 9 * k }), { before: 0, after: 10 }),
    p(r(t.signer, { pt: 10, b: true, color: C.green }), { after: 0 }),
    p(r(t.signerSub, { pt: 8, color: C.muted }), { after: 110 }),
    p([
      r(t.promiseLabel + '   ', { pt: 7.5, b: true, color: C.gold, sp: 20 }),
      r(t.promise, { pt: 8.5, b: true, color: C.green }),
    ], { after: 70, shade: C.goldSoft, border: { left: { style: d.BorderStyle.SINGLE, size: 18, color: C.gold, space: 6 } }, indent: { left: 120 } }),
    p(r(t.discount, { pt: 10, b: true, color: RED }), { after: 0 }),
  ], { w: RW, m: { top: 240, bottom: 40, left: 420, right: 120 } });

  const side1 = table([LW, RW], [[left, right]], { heights: [H - 2 * M - 300] });

  // ---------- Side 2: needs → answers, packages, contact ----------
  const GAP = 120, CARD = Math.floor((CW - 2 * GAP) / 3), CW3 = CW - 2 * GAP - 2 * CARD;
  const card = ([n, h, s], w) => cell([
    p([r(n + '  ', { pt: 13, b: true, color: C.gold }), r(h, { pt: 9.5, b: true, color: C.green })], { after: 60, line: 230 }),
    p(r(s, { pt: 8.5 * k, color: C.ink }), { after: 0, line: 258 }),
  ], { w, fill: C.greenSoft, m: { top: 160, bottom: 160, left: 180, right: 150 } });
  const gap = () => cell([p(r('', { pt: 2 }), { after: 0 })], { w: GAP, m: { top: 0, bottom: 0, left: 0, right: 0 } });
  const cardRow = (a, b, c) => [card(a, CARD), gap(), card(b, CARD), gap(), card(c, CW3)];
  const widths = [CARD, GAP, CARD, GAP, CW3];
  const grid = table(widths, [
    cardRow(...t.needs.slice(0, 3).map((x, i) => [`0${i + 1}`, ...x])),
    widths.map((w) => cell([p(r('', { pt: 1 }), { after: 0, line: 120 })], { w, m: { top: 0, bottom: 0, left: 0, right: 0 } })),
    cardRow(...t.needs.slice(3).map((x, i) => [`0${i + 4}`, ...x])),
  ]);

  const PW = Math.floor(CW / 5), PL = CW - 4 * PW;
  const pk = ([name, price, unit], w, hot) => cell([
    p(r(name, { pt: 7, b: true, color: C.gold, caps: true, sp: 10 }), { after: 20 }),
    p(r(price, { pt: 12.5, b: true, color: hot ? RED : C.green }), { after: 0 }),
    p(r(unit, { pt: 7, b: !!hot, color: hot ? RED : C.muted }), { after: 0 }),
  ], { w, m: { top: 60, bottom: 60, left: 130, right: 80 } });
  const packages = table([PW, PW, PW, PW, PL], [[
    ...t.pkgs.slice(0, 4).map((x) => pk(x, PW)), pk(t.pkgs[4], PL, true),
  ]]);

  const lbl = (s) => r(s, { pt: 8, color: C.paleGreenText });
  const val = (s) => r(s, { pt: 9.5, b: true, color: C.white });
  const contactBar = table([CW], [[cell([
    p([
      r(t.talk + '   ', { pt: 8, b: true, color: 'E8C98F', sp: 20 }),
      lbl(t.hotline), val('0973 239 802'),
      lbl('     Email: '), val('nhom2lkd@gmail.com'),
      lbl('     Website: '), val('richelaw.vn'),
    ], { after: 0, align: d.AlignmentType.CENTER }),
  ], { w: CW, fill: C.green, m: { top: 140, bottom: 140, left: 120, right: 120 } })]]);

  const side2 = [
    p(r(t.why, { pt: 7.5, b: true, color: C.gold, sp: 30 }), { after: 30, pbb: true }),
    p([r(t.head1, { pt: 16, b: true, color: C.green }), r(t.head2, { pt: 16, b: true, color: C.gold })], { after: 150 }),
    grid,
    p(r('', { pt: 2 }), { after: 150 }),
    p([r(t.pkgNote, { pt: 7.5, b: true, color: C.muted }), r('   ' + t.discount, { pt: 7.5, b: true, color: RED })], {
      after: 40, border: { top: line(C.gold, 8) },
    }),
    packages,
    p(r('', { pt: 2 }), { after: 130 }),
    contactBar,
  ];

  return new d.Document({
    creator: 'Riche Law', title: t.docTitle,
    styles: { default: { document: { run: { font: 'Montserrat', size: 18 } } } },
    sections: [{
      properties: {
        page: {
          size: { width: H, height: W, orientation: d.PageOrientation.LANDSCAPE },
          margin: { top: M, bottom: M, left: M, right: M, header: 200, footer: 200 },
        },
      },
      children: [side1, ...side2],
    }],
  });
}

fs.mkdirSync('output', { recursive: true });
for (const [code, t] of Object.entries(T)) {
  d.Packer.toBuffer(build(t)).then((b) => {
    fs.writeFileSync(`output/Riche_Law_Thu_Moi_${code}_A5.docx`, b);
    console.log('letter', code, 'ok');
  });
}
