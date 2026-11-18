// Invitation letter — English, A5 landscape, 2 sides
const fs = require('fs');
const { d, C, r, p, cell, table, line, spacer } = require('./common');

const W = 11906, H = 8391, M = 510;       // A5 landscape, ~0.9 cm margins
const CW = W - 2 * M;                      // content width

// ---------- Side 1: brand panel + letter ----------
const LW = 3300, RW = CW - LW;

const stat = (num, label) => [
  p(r(num, { pt: 24, b: true, color: C.white }), { after: 0, line: 220 }),
  p(r(label, { pt: 8, color: C.paleGreenText }), { after: 230 }),
];

const left = cell([
  p(r('RICHE LAW', { pt: 15, b: true, color: C.white, sp: 40 }), { after: 0 }),
  p(r('Legal · Accounting · HR', { pt: 7.5, color: 'E8C98F', sp: 10 }), { after: 0 }),
  p(r('for foreign investors in Vietnam', { pt: 7.5, color: 'E8C98F' }), {
    after: 260, border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: C.gold, space: 8 } },
  }),
  ...stat('15 years', 'serving domestic partners and enterprises'),
  ...stat('5 years', 'dedicated to foreign-invested clients'),
  ...stat('200+', 'foreign-invested enterprises served'),
  p(r('Tiếng Việt · English · 中文', { pt: 7.5, b: true, color: C.white }), { before: 40, after: 0 }),
], { w: LW, fill: C.green, m: { top: 300, bottom: 200, left: 300, right: 260 } });

const body = (t) => p(r(t, { pt: 9 }), { after: 100, line: 258, align: d.AlignmentType.JUSTIFIED });

const right = cell([
  p(r('INVITATION TO PARTNER', { pt: 7.5, b: true, color: C.gold, sp: 30 }), { after: 40 }),
  p(r('Your trusted legal partner for investing in Vietnam', { pt: 16, b: true, color: C.green }), { after: 60, line: 250 }),
  p(r('', { pt: 2 }), { after: 120, border: { bottom: { style: d.BorderStyle.SINGLE, size: 12, color: C.gold, space: 1 } }, indent: { right: RW - 1300 } }),
  p(r('Dear Valued Partners,', { pt: 9.5, b: true }), { after: 80 }),
  body('Vietnam rewards investors who move fast, and penalises those who misstep. Investment certificates, tax filings, social insurance and work permits all follow local rules that change often and are written in Vietnamese. Riche Law Investment Co., Ltd. warmly invites your company to partner with us, so that you can focus on growing your business while we take care of the legal side of investing in Vietnam: from the first licence to the first invoice, and every compliance deadline after that.'),
  body('Built on 15 years of work with Vietnamese partners and 5 years serving foreign investors, Riche Law today supports more than 200 foreign-invested enterprises. We offer one point of contact, fixed all-inclusive pricing with no surprises, and a team that works with you in English and Chinese.'),
  body('We would be delighted to discuss how we can support your plans in Vietnam.'),
  p(r('Sincerely,', { pt: 9 }), { before: 20, after: 10 }),
  p(r('Board of Directors', { pt: 10, b: true, color: C.green }), { after: 0 }),
  p(r('Riche Law Investment Co., Ltd. · Hanoi, Vietnam', { pt: 8, color: C.muted }), { after: 140 }),
  p([
    r('OUR PROMISE   ', { pt: 7.5, b: true, color: C.gold, sp: 20 }),
    r('One point of contact  ·  One fixed price  ·  No surprises', { pt: 8.5, b: true, color: C.green }),
  ], { after: 0, shade: C.goldSoft, border: { left: { style: d.BorderStyle.SINGLE, size: 18, color: C.gold, space: 6 } }, indent: { left: 120 } }),
], { w: RW, m: { top: 260, bottom: 60, left: 420, right: 120 } });

const side1 = table([LW, RW], [[left, right]], { heights: [H - 2 * M - 300] });

// ---------- Side 2: needs → answers, packages, contact ----------
const needs = [
  ['01', 'Enter the market without delays', 'IRC, ERC and investment licences handled end to end, including sub-licences for conditional business lines.'],
  ['02', 'Know the full cost up front', 'Fixed, all-inclusive packages. Nothing extra within the package scope, with one point of contact.'],
  ['03', 'Work in your own language', 'Vietnamese, English and Chinese. Reminders and updates via Zalo, WeChat or email.'],
  ['04', 'Never miss a deadline', 'Monthly tax and social insurance filings, year-end financial statements, compliance monitoring and risk alerts.'],
  ['05', 'Bring your people to Vietnam', 'Work permits and Temporary Residence Cards, health checks, criminal records and family visas in about 20 working days.'],
  ['06', 'Grow and restructure safely', 'M&A, capital transfers and restructuring, representation before authorities and 24/7 emergency support.'],
];
const GAP = 120, CARD = Math.floor((CW - 2 * GAP) / 3), CW3 = CW - 2 * GAP - 2 * CARD;
const card = ([n, h, t], w) => cell([
  p([r(n + '  ', { pt: 13, b: true, color: C.gold }), r(h, { pt: 9.5, b: true, color: C.green })], { after: 70, line: 230 }),
  p(r(t, { pt: 8.5, color: C.ink }), { after: 0, line: 264 }),
], { w, fill: C.greenSoft, m: { top: 190, bottom: 190, left: 190, right: 160 } });
const gap = () => cell([p(r('', { pt: 2 }), { after: 0 })], { w: GAP, m: { top: 0, bottom: 0, left: 0, right: 0 } });
const cardRow = (a, b, c) => [card(a, CARD), gap(), card(b, CARD), gap(), card(c, CW3)];
const grid = table([CARD, GAP, CARD, GAP, CW3], [
  cardRow(needs[0], needs[1], needs[2]),
  [...Array(5)].map((_, i) => cell([p(r('', { pt: 1 }), { after: 0, line: 150 })], { w: [CARD, GAP, CARD, GAP, CW3][i], m: { top: 0, bottom: 0, left: 0, right: 0 } })),
  cardRow(needs[3], needs[4], needs[5]),
]);

const pk = (name, price, unit, w) => cell([
  p(r(name, { pt: 7.5, b: true, color: C.gold, caps: true, sp: 20 }), { after: 20 }),
  p(r(price, { pt: 14, b: true, color: C.green }), { after: 0 }),
  p(r(unit, { pt: 7.5, color: C.muted }), { after: 0 }),
], { w, m: { top: 80, bottom: 80, left: 160, right: 100 } });

const PW = Math.floor(CW / 4);
const packages = table([PW, PW, PW, CW - 3 * PW], [[
  pk('Basic retainer', '23,600,000', 'VND / month', PW),
  pk('Standard retainer', '58,000,000', 'VND / month', PW),
  pk('Premium retainer', '112,000,000', 'VND / month', PW),
  pk('Work permit package', '1,600', 'USD / person', CW - 3 * PW),
]]);

const contactBar = table([CW], [[cell([
  p([
    r('LET’S TALK   ', { pt: 8, b: true, color: 'E8C98F', sp: 20 }),
    r('Hotline / Zalo: ', { pt: 9, color: C.paleGreenText }),
    r('0973 239 802', { pt: 10.5, b: true, color: C.white }),
    r('      Email: ', { pt: 9, color: C.paleGreenText }),
    r('nhom2lkd@gmail.com', { pt: 10.5, b: true, color: C.white }),
  ], { after: 0, align: d.AlignmentType.CENTER }),
], { w: CW, fill: C.green, m: { top: 160, bottom: 160, left: 160, right: 160 } })]]);

const side2 = [
  p(r('WHY FOREIGN INVESTORS CHOOSE RICHE LAW', { pt: 7.5, b: true, color: C.gold, sp: 30 }), { after: 30, pbb: true }),
  p([r('What you need in Vietnam, ', { pt: 17, b: true, color: C.green }), r('and how we deliver it', { pt: 17, b: true, color: C.gold })], { after: 180 }),
  grid,
  p(r('', { pt: 2 }), { after: 200 }),
  p(r('Packages for foreign-invested enterprises · 15% off with annual billing · Government fees not included', { pt: 7.5, b: true, color: C.muted }), {
    after: 60, border: { top: line(C.gold, 8) }, before: 0,
  }),
  packages,
  p(r('', { pt: 2 }), { after: 200 }),
  contactBar,
];

const doc = new d.Document({
  creator: 'Riche Law', title: 'Invitation to Partner — Riche Law',
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

d.Packer.toBuffer(doc).then((b) => {
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/Riche_Law_Invitation_Letter_EN_A5.docx', b);
  console.log('letter ok');
});
