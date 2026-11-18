// Trilingual (VI · EN · ZH) price list, A4 portrait, 2 sides. All prices = 4x the previous list.
const fs = require('fs');
const { d, C, r, p, cell, table, line } = require('./common');

const W = 11906, H = 16838, M = 540;
const CW = W - 2 * M;

const S = { vi: 8, en: 7, zh: 7 };     // type sizes per language
const TICK = '✓ ';

// one item, three languages: VI on top, EN and ZH below in muted colour
const item = ([vi, en, zh], o = {}) => {
  const k = o.small ? 0.87 : 1, ln = o.small ? 0.94 : 1;
  return [
  p([r(o.x ? '✕ ' : TICK, { pt: 6.5 * k, b: true, color: o.x ? 'B9B2A4' : C.greenMid }), r(vi, { pt: S.vi * k, b: !!o.b, color: o.x ? '8F8A80' : C.ink })],
    { after: 0, line: Math.round(228 * ln), indent: { left: 150, hanging: 150 } }),
  p(r(en, { pt: S.en * k, color: C.muted }), { after: 0, line: Math.round(220 * ln), indent: { left: 150 } }),
  p(r(zh, { pt: S.zh * k, color: C.muted }), { after: o.after ?? 70, line: Math.round(220 * ln), indent: { left: 150 } }),
];};
const tri = ([vi, en, zh], o = {}) => [
  p(r(vi, { pt: o.pt || 8.5, b: true, color: o.color || C.green }), { after: 0, line: 230 }),
  p(r(`${en}  ·  ${zh}`, { pt: o.sub || 6.5, color: o.subColor || C.muted }), { after: o.after ?? 80, line: 220 }),
];
const label = (t, color = C.gold) => p(r(t, { pt: 6.5, b: true, color, sp: 20, caps: true }), { after: 40 });

// ---------- Header band ----------
const header = table([CW], [[cell([
  p([r('RICHE LAW', { pt: 18, b: true, color: C.white, sp: 40 }),
     r('    Bảng giá dịch vụ  ·  Service Price List  ·  服务价目表', { pt: 9, color: 'E8C98F' }),
     r('      richelaw.vn', { pt: 9, b: true, color: C.white })], { after: 40 }),
  p(r('Pháp lý · Kế toán · Nhân sự cho doanh nghiệp tại Việt Nam   |   Legal · Accounting · HR for businesses in Vietnam   |   越南企业法律·会计·人事服务',
    { pt: 6.5, color: C.paleGreenText }), { after: 0 }),
], { w: CW, fill: C.green, m: { top: 170, bottom: 150, left: 220, right: 220 } })]]);

const SW = Math.floor(CW / 4), SL = CW - 3 * SW;
const statCell = (n, vi, en, zh, w) => cell([
  p(r(n, { pt: 17, b: true, color: C.green }), { after: 0, line: 220 }),
  p(r(vi, { pt: 7, b: true, color: C.ink }), { after: 0, line: 220 }),
  p(r(`${en} · ${zh}`, { pt: 6.5, color: C.muted }), { after: 0, line: 220 }),
], { w, fill: C.goldSoft, m: { top: 130, bottom: 130, left: 220, right: 100 } });
const stats = table([SW, SW, SW, SL], [[
  statCell('15 năm', 'đồng hành đối tác trong nước', '15 years with domestic partners', '15年服务本土企业', SW),
  statCell('5 năm', 'phục vụ khách hàng nước ngoài', '5 years serving foreign clients', '5年服务外资客户', SW),
  statCell('200+', 'doanh nghiệp nước ngoài tin dùng', 'foreign-invested enterprises', '200余家外资企业', SW),
  statCell('VI · EN · 中文', 'hỗ trợ 3 ngôn ngữ', 'trilingual support', '三语服务', SL),
]]);

// ---------- Section heading ----------
const section = (no, vi, en, zh) => p([
  r(no + '  ', { pt: 13, b: true, color: C.gold }),
  r(vi, { pt: 12, b: true, color: C.green }),
  r(`   ${en}  ·  ${zh}`, { pt: 8, b: true, color: C.muted }),
], { before: 140, after: 70, keepNext: true, border: { bottom: { style: d.BorderStyle.SINGLE, size: 8, color: C.gold, space: 3 } } });

// ---------- Why Riche Law strip ----------
const WW = Math.floor(CW / 4), WL = CW - 3 * WW;
const whyCell = (vi, en, zh, w, first) => cell([
  p([r('◆ ', { pt: 7, color: C.gold }), r(vi, { pt: 8, b: true, color: C.white })], { after: 10, line: 225 }),
  p(r(en, { pt: 6.5, color: C.paleGreenText }), { after: 0, line: 215 }),
  p(r(zh, { pt: 6.5, color: C.paleGreenText }), { after: 0, line: 215 }),
], { w, fill: C.green, m: { top: 130, bottom: 130, left: first ? 220 : 120, right: 100 } });
const why = table([WW, WW, WW, WL], [[
  whyCell('Một đầu mối duy nhất', 'One point of contact', '一站式对接', WW, true),
  whyCell('Giá trọn gói, không phát sinh', 'Fixed price, no surprises', '全包价格，无隐藏费用', WW),
  whyCell('Chủ động nhắc hạn tuân thủ', 'Proactive compliance reminders', '主动合规提醒', WW),
  whyCell('Mạng lưới ngân hàng, KCN', 'Bank & industrial-park network', '银行及工业园合作网络', WL),
]]);

// ---------- Side 1: FDI retainer packages ----------
const plans = [
  {
    tier: ['Gói cơ bản', 'Basic', '基础版'], name: 'Basic', m: '23.600.000', y: '20.060.000',
    desc: ['Duy trì tuân thủ cơ bản cho doanh nghiệp đã thành lập', 'Core compliance for established companies', '已成立企业的基础合规维护'],
    head: ['Bao gồm', 'Includes', '包含'],
    inc: [
      ['Kê khai thuế hàng tháng (GTGT, TNCN, TNDN)', 'Monthly tax filings (VAT, PIT, CIT)', '每月纳税申报（增值税、个税、企业所得税）'],
      ['Báo cáo tài chính cuối năm', 'Year-end financial statements', '年度财务报表'],
      ['Nhắc hạn nộp thuế và báo cáo', 'Tax and reporting deadline reminders', '纳税及报告截止日提醒'],
      ['Tư vấn pháp lý qua Zalo/email (2 lượt/tháng)', 'Legal advice via Zalo/email (2 queries/month)', 'Zalo/邮件法律咨询（每月2次）'],
      ['Cập nhật thay đổi pháp luật liên quan', 'Updates on relevant legal changes', '相关法规变动更新'],
    ],
    exc: [
      ['Thay đổi ĐKKD / giấy phép con', 'Registration amendments / sub-licences', '登记变更／分项许可'],
      ['Giấy phép lao động / thẻ tạm trú', 'Work permits / TRC', '工作许可证／临时居留卡'],
      ['BHXH và quản lý nhân sự', 'Social insurance & HR', '社会保险及人事管理'],
    ],
  },
  {
    tier: ['Gói tiêu chuẩn', 'Standard', '标准版'], name: 'Standard', m: '58.000.000', y: '49.300.000', popular: true,
    desc: ['Pháp lý, kế toán, nhân sự cho doanh nghiệp vận hành ổn định', 'Legal, accounting and HR for steady operations', '稳定运营所需的法律、会计、人事服务'],
    head: ['Tất cả gói Basic, cộng thêm', 'Everything in Basic, plus', '含基础版全部内容，另加'],
    inc: [
      ['Thay đổi ĐKKD (miễn phí 2 lần/năm)', 'Registration amendments (2 free per year)', '营业登记变更（每年免费2次）', true],
      ['GPLĐ và thẻ tạm trú cho 1 người nước ngoài/năm', 'Work permit & TRC for 1 foreigner per year', '每年1名外籍员工工作许可证及临时居留卡', true],
      ['Kê khai và đóng BHXH hàng tháng', 'Monthly social insurance filing & payment', '每月社保申报及缴纳'],
      ['Tư vấn pháp lý không giới hạn (Zalo/email)', 'Unlimited legal advice (Zalo/email)', '不限次法律咨询（Zalo/邮件）'],
      ['Soạn, rà soát hợp đồng cơ bản (4 bộ/năm)', 'Standard contract drafting & review (4 sets/year)', '常用合同起草及审核（每年4套）'],
      ['Giám sát tuân thủ, cảnh báo rủi ro', 'Compliance monitoring & risk alerts', '合规监控及风险预警'],
      ['Hỗ trợ song ngữ Việt – Anh – Trung', 'Vietnamese–English–Chinese support', '越、英、中三语服务'],
    ],
    exc: [
      ['IRC/ERC và giấy phép đầu tư', 'IRC/ERC & investment licences', '投资登记证／企业登记证及投资许可'],
      ['M&A, chuyển nhượng vốn', 'M&A, capital transfer', '并购、股权转让'],
    ],
  },
  {
    tier: ['Gói cao cấp', 'Premium', '高级版'], name: 'Premium', m: '112.000.000', y: '95.200.000',
    desc: ['Giải pháp toàn diện cho nhà đầu tư nước ngoài và dự án lớn', 'Full solution for foreign investors & large projects', '面向外国投资者及大型项目的全面方案'],
    head: ['Tất cả gói Standard, cộng thêm', 'Everything in Standard, plus', '含标准版全部内容，另加'],
    inc: [
      ['IRC/ERC và giấy phép đầu tư trọn gói', 'Full IRC/ERC & investment licensing', '投资登记证、企业登记证及投资许可全包', true],
      ['GPLĐ và thẻ tạm trú không giới hạn số người', 'Work permits & TRCs, unlimited headcount', '工作许可证及临时居留卡，人数不限', true],
      ['Tư vấn M&A, chuyển nhượng vốn, tái cấu trúc', 'M&A, capital transfer & restructuring', '并购、股权转让及重组咨询'],
      ['Giấy phép con, ngành nghề có điều kiện', 'Sub-licences & conditional business lines', '分项许可及附条件经营行业'],
      ['Soạn, rà soát hợp đồng không giới hạn', 'Unlimited contract drafting & review', '不限次合同起草及审核'],
      ['Chuyên viên pháp lý riêng', 'Dedicated legal officer', '专属法律顾问'],
      ['Đại diện làm việc với cơ quan Nhà nước', 'Representation before authorities', '代表客户对接政府机关'],
      ['Hỗ trợ pháp lý khẩn cấp 24/7', '24/7 emergency legal support', '7×24小时法律紧急支援'],
    ],
    exc: [],
  },
];

const PG = 140, PW = Math.floor((CW - 2 * PG) / 3), PL = CW - 2 * PG - 2 * PW;
const planCell = (pl, w) => {
  const fill = pl.popular ? C.greenSoft : C.white;
  const kids = [
    p(r(pl.popular ? 'PHỔ BIẾN NHẤT · MOST POPULAR · 最受欢迎' : ' ', { pt: 6, b: true, color: C.seal, sp: 10 }), { after: 0 }),
    p(r(pl.name, { pt: 13, b: true, color: C.green }), { after: 0 }),
    p(r(pl.tier.join(' · '), { pt: 6.5, b: true, color: C.gold }), { after: 40 }),
    p(r(pl.desc[0], { pt: 6.5, color: C.ink }), { after: 0, line: 215 }),
    p(r(`${pl.desc[1]} · ${pl.desc[2]}`, { pt: 6, color: C.muted }), { after: 80, line: 215 }),
    p([r(pl.m, { pt: 17, b: true, color: C.ink }), r(' VNĐ/tháng', { pt: 6.5, b: true, color: C.muted })], { after: 0, line: 220 }),
    p(r('VND per month · 越南盾/月', { pt: 6, color: C.muted }), { after: 40 }),
    p([r('Trả theo năm −15%: ', { pt: 6.5, color: C.ink }), r(pl.y + ' VNĐ/tháng', { pt: 6.5, b: true, color: C.green })], { after: 0, shade: C.goldSoft }),
    p(r('Annual billing −15% · 按年付款优惠15%', { pt: 6, color: C.muted }), { after: 100, shade: C.goldSoft }),
    label(pl.head.join(' · '), C.muted),
    ...pl.inc.flatMap((t) => item(t, { b: t[3], after: 90 })),
    ...(pl.exc.length ? [p(r('', { pt: 2 }), { after: 30, border: { top: line(C.line, 4) } })] : []),
    ...pl.exc.flatMap((t) => item(t, { x: true, after: 50 })),
  ];
  return cell(kids, {
    w, fill, m: { top: 160, bottom: 120, left: 160, right: 130 },
    borders: {
      top: line(pl.popular ? C.green : C.line, pl.popular ? 14 : 6), bottom: line(pl.popular ? C.green : C.line, pl.popular ? 14 : 6),
      left: line(pl.popular ? C.green : C.line, pl.popular ? 14 : 6), right: line(pl.popular ? C.green : C.line, pl.popular ? 14 : 6),
    },
  });
};
const gapCell = (w) => cell([p(r('', { pt: 2 }), { after: 0 })], { w, m: { top: 0, bottom: 0, left: 0, right: 0 } });
const plansTable = table([PW, PG, PW, PG, PL], [[planCell(plans[0], PW), gapCell(PG), planCell(plans[1], PW), gapCell(PG), planCell(plans[2], PL)]]);

const note = (vi, en, zh, big) => p([
  r(vi, { pt: big ? 7.5 : 6.5, color: C.ink }), r(`  ·  ${en}  ·  ${zh}`, { pt: big ? 7 : 6, color: C.muted }),
], { after: big ? 50 : 30, line: 220 });

const side1 = [
  header,
  p(r('', { pt: 2 }), { after: 80 }),
  stats,
  p(r('', { pt: 2 }), { after: 60 }),
  section('01', 'Gói pháp lý trọn gói cho doanh nghiệp FDI', 'FDI retainer packages', '外资企业法律全包服务'),
  plansTable,
  p(r('', { pt: 2 }), { after: 60 }),
  note('Giá chưa gồm phí, lệ phí Nhà nước (thanh toán theo thực tế).', 'Government fees excluded, charged at cost', '不含政府规费，按实际收取', true),
  note('Áp dụng cho doanh nghiệp có vốn đầu tư nước ngoài tại Việt Nam.', 'For foreign-invested enterprises in Vietnam', '适用于越南外商投资企业', true),
  note('Hợp đồng tối thiểu 12 tháng.', 'Minimum contract term 12 months', '合同期限至少12个月', true),
  p(r('', { pt: 2 }), { after: 120 }),
  why,
];

// ---------- Side 2: Work permit + Startup combo ----------
const priceTag = (amount, unitVi, unitEn, unitZh, chips, w) => cell([
  label('Phí trọn gói · Package fee · 全包费用', C.gold),
  p([r(amount, { pt: 16, b: true, color: C.green }), r(' ' + unitVi, { pt: 7, b: true, color: C.muted })], { after: 0, line: 220 }),
  p(r(`${unitEn} · ${unitZh}`, { pt: 6, color: C.muted }), { after: 80 }),
  ...chips.flatMap(([vi, en, zh, hot]) => [
    p(r(vi, { pt: hot ? 7 : 6.5, b: true, color: hot ? 'C62828' : C.green }), { after: 0, line: 215 }),
    p(r(`${en} · ${zh}`, { pt: 6, b: !!hot, color: hot ? 'C62828' : C.muted }), { after: 60, line: 215 }),
  ]),
], { w, fill: C.goldSoft, m: { top: 140, bottom: 120, left: 160, right: 120 }, borders: { top: line(C.gold, 8), bottom: line(C.gold, 8), left: line(C.gold, 8), right: line(C.gold, 8) } });

const groupCell = (title, items, w) => cell([
  ...tri(title, { pt: 7.5, sub: 6, after: 60 }),
  ...items.flatMap((t) => item(t, { after: 30, small: true })),
], { w, m: { top: 100, bottom: 50, left: 120, right: 90 }, borders: { top: line(C.line, 6), bottom: line(C.line, 6), left: line(C.line, 6), right: line(C.line, 6) } });

const giftsBlock = (gifts, w) => {
  const half = Math.ceil(gifts.length / 2), GW = Math.floor((w - 280) / 2), GW2 = w - 280 - GW - 0;
  const g = ([vi, en, zh, q]) => [
    p([r('★ ', { pt: 6.5, color: C.gold }), r(vi, { pt: 7, b: true, color: C.ink }), r('  ' + q, { pt: 6.5, b: true, color: C.gold })],
      { after: 0, line: 220, indent: { left: 150, hanging: 150 } }),
    p(r(`${en} · ${zh}`, { pt: 6, color: C.muted }), { after: 25, line: 205, indent: { left: 150 } }),
  ];
  return cell([
    p([r('Quà tặng kèm gói', { pt: 8.5, b: true, color: C.ink }), r('   Free gifts · 免费赠品', { pt: 7, b: true, color: C.gold })], { after: 30 }),
    table([GW, 0 + 280, GW2].map((x) => x), [[
      cell(gifts.slice(0, half).flatMap(g), { w: GW, m: { top: 0, bottom: 0, left: 0, right: 0 } }),
      cell([p(r('', { pt: 2 }), { after: 0 })], { w: 280, m: { top: 0, bottom: 0, left: 0, right: 0 } }),
      cell(gifts.slice(half).flatMap(g), { w: GW2, m: { top: 0, bottom: 0, left: 0, right: 0 } }),
    ]]),
  ], { w: w + 280, fill: C.goldSoft, m: { top: 80, bottom: 30, left: 140, right: 140 }, borders: { top: line(C.gold, 8), bottom: line(C.gold, 8), left: line(C.gold, 8), right: line(C.gold, 8) } });
};

function packageBlock(pk) {
  const TW = 2250, G = 100, GC = Math.floor((CW - TW - 3 * G) / 3), GL = CW - TW - 3 * G - 2 * GC;
  const top = table([TW, G, GC, G, GC, G, GL], [[
    priceTag(...pk.price, TW), gapCell(G),
    groupCell(pk.groups[0][0], pk.groups[0][1], GC), gapCell(G),
    groupCell(pk.groups[1][0], pk.groups[1][1], GC), gapCell(G),
    groupCell(pk.groups[2][0], pk.groups[2][1], GL),
  ]]);
  const giftW = CW - 280;
  return [
    section(pk.no, ...pk.title),
    top,
    p(r('', { pt: 2 }), { after: 50 }),
    table([CW], [[giftsBlock(pk.gifts, giftW)]]),
    p(r('', { pt: 2 }), { after: 20 }),
    p(r('Điều kiện áp dụng · Terms · 适用条件', { pt: 6, b: true, color: C.muted, caps: true, sp: 10 }), { after: 0 }),
    ...pk.terms.map(([vi, en, zh]) => note('– ' + vi, en, zh)),
  ];
}

const workPermit = {
  no: '02', title: ['Gói Giấy Phép Lao Động An Tâm', 'Work Permit Package', '安心工作许可证套餐'],
  lead: ['Khám sức khỏe, lý lịch tư pháp và giấy phép lao động trong một gói; Riche Law lo toàn bộ giấy tờ phía Việt Nam.',
    'Health check, criminal record and work permit in one package, handled end to end.', '体检、无犯罪记录及工作许可证一站式办理。'],
  price: ['1.600', 'USD/người', 'per person', '每人', [
    ['Khoảng 20 ngày làm việc', 'About 20 working days', '约20个工作日'],
    ['Đã gồm lệ phí cấp GPLĐ', 'Government fee included', '含政府规费'],
    ['Thanh toán VNĐ theo tỷ giá', 'Paid in VND at the day’s rate', '按当日汇率以越南盾支付'],
  ]],
  groups: [
    [['1. Giấy tờ cá nhân', 'Personal documents', '个人文件'], [
      ['Khám sức khỏe tại bệnh viện đủ điều kiện, có người đi cùng', 'Health check at an approved hospital, accompanied', '指定医院体检，专人陪同'],
      ['Lý lịch tư pháp Việt Nam (nếu đã cư trú tại VN)', 'Vietnamese criminal record (if previously resident)', '越南无犯罪记录（如曾在越居住）'],
      ['Hướng dẫn bằng cấp, xác nhận kinh nghiệm, LLTP nước ngoài', 'Checklist for degrees, experience letters, home record', '指导准备学历、经验证明及本国无犯罪记录'],
      ['Dịch thuật, chứng thực giấy tờ tại Việt Nam', 'Translation & certification in Vietnam', '在越南办理翻译及公证'],
    ]],
    [['2. Cấp giấy phép lao động', 'Work permit application', '申请工作许可证'], [
      ['Tư vấn diện cấp phép: quản lý, giám đốc, chuyên gia, kỹ thuật', 'Right category: manager, director, expert, technician', '评估类别：管理人员、总经理、专家、技术人员'],
      ['Soạn toàn bộ hồ sơ cho doanh nghiệp và người lao động', 'All employer and employee forms prepared', '为企业及员工准备全部文件'],
      ['Nộp hồ sơ, theo dõi, xử lý yêu cầu bổ sung', 'Filing, tracking, responding to requests', '递交、跟进并处理补件'],
      ['Lệ phí cấp giấy phép lao động', 'Government fee included', '含工作许可证规费'],
      ['Nhận và giao giấy phép tận nơi', 'Permit delivered to your office', '领证并送达贵司'],
    ]],
    [['3. Sau khi có giấy phép', 'After approval', '获批之后'], [
      ['Hướng dẫn khai báo tạm trú', 'Temporary residence registration guide', '指导办理暂住登记'],
      ['Nhắc gia hạn trước 60 ngày qua Zalo, WeChat, email', 'Renewal reminder 60 days ahead (Zalo, WeChat, email)', '到期前60天通过Zalo、微信、邮件提醒续签'],
      ['Lưu bản scan hồ sơ cho lần gia hạn', 'Digital copies kept for renewal', '保存电子档案以备续签'],
    ]],
  ],
  gifts: [
    ['Lớp tiếng Việt giao tiếp', 'Survival Vietnamese course', '越南语日常会话课', '4 buổi online · 4 sessions'],
    ['Tư vấn thẻ tạm trú', 'Temporary Residence Card advice', '临时居留卡咨询', 'Giảm 10% · 10% off'],
    ['Tư vấn thuế thu nhập cá nhân', 'Personal income tax for expats', '外籍人士个人所得税咨询', '1 buổi · 1 session'],
    ['Tư vấn BHXH cho người nước ngoài', 'Social insurance for foreign staff', '外籍员工社保咨询', '1 buổi · 1 session'],
    ['Mẫu hợp đồng lao động song ngữ', 'Bilingual employment contract', '双语劳动合同范本', '1 bộ · 1 set'],
    ['Tư vấn thuê, mua nhà', 'Housing advice: renting & buying', '租房、购房咨询', '1 buổi · 1 session'],
    ['Visa cho gia đình', 'Visas for spouse & children', '家属签证咨询', 'Tư vấn · Advice'],
    ['Cẩm nang sống và làm việc tại VN', 'Living & working in Vietnam handbook', '越南生活工作指南', 'Ebook'],
  ],
  terms: [
    ['Cấp mới GPLĐ tại Hà Nội; gia hạn, cấp lại, xác nhận miễn GPLĐ báo giá riêng.', 'New permits in Hanoi; renewals, re-issues, exemptions quoted separately', '适用河内新办；续签、补办、免办另行报价'],
    ['Chưa gồm hợp pháp hóa lãnh sự, giấy tờ nước ngoài, chuyển phát quốc tế. Thời gian tính từ khi đủ giấy tờ; quà tặng dùng trong 6 tháng.', 'Excludes legalisation, foreign documents, courier; gifts valid 6 months', '不含领事认证、境外文件及快递；赠品6个月内有效'],
  ],
};

const startup = {
  no: '03', title: ['Combo Khởi Nghiệp An Tâm', 'Startup Combo', '安心创业套餐'],
  lead: ['Từ giấy phép đến hóa đơn đầu tiên, kèm tư vấn pháp lý, quản trị và marketing 6 tháng đầu. Một đầu mối, một mức giá.',
    'From licence to first invoice, plus 6 months of support.', '从执照到首张发票，附赠6个月支持。'],
  price: ['20.000.000', 'VNĐ', 'VND · Vietnamese-owned companies', '越南盾 · 越南资本企业', [
    ['DN nước ngoài: Báo giá sau – Giá cạnh tranh', 'Foreign companies: quote on request, competitive pricing', '外资企业：另行报价，价格具竞争力', true],
    ['5–7 ngày làm việc', '5–7 working days', '5–7个工作日'],
    ['Công ty TNHH · Cổ phần', 'LLC · Joint stock company', '有限公司·股份公司'],
    ['Không phát sinh trong phạm vi gói', 'No extra cost within scope', '套餐范围内无额外费用'],
  ]],
  groups: [
    [['1. Thủ tục thành lập', 'Company formation', '公司设立'], [
      ['Tư vấn loại hình, tên, ngành nghề, vốn điều lệ', 'Entity type, name, business lines, capital', '企业类型、名称、经营范围、注册资本'],
      ['Kiểm tra địa chỉ trụ sở hợp lệ (căn hộ chung cư)', 'Head-office address check (apartment rules)', '核查注册地址合规（公寓限制）'],
      ['Soạn điều lệ và toàn bộ hồ sơ ĐKKD', 'Charter & full registration dossier', '公司章程及全套登记文件'],
      ['Danh sách thành viên/cổ đông, chủ sở hữu hưởng lợi', 'Member list & beneficial owner declaration', '股东名册及实际受益人申报'],
      ['Nộp hồ sơ, nhận Giấy chứng nhận ĐKDN', 'Filing & Enterprise Registration Certificate', '递交申请并领取企业登记证'],
    ]],
    [['2. Sẵn sàng hoạt động', 'Ready to operate', '即刻运营'], [
      ['Dấu tròn pháp nhân', 'Company seal', '公司公章'],
      ['Biển công ty mica', 'Acrylic company signboard', '亚克力公司招牌'],
      ['Tài khoản ngân hàng số đẹp (MB, Techcombank)', 'Premium-number bank account', '靓号银行账户（MB、Techcombank）'],
      ['Chữ ký số 36 tháng', 'Digital signature, 36 months', '数字签名36个月'],
      ['Hóa đơn điện tử 500 số', '500 e-invoices', '电子发票500张'],
      ['Hồ sơ thuế ban đầu (online)', 'Initial tax registration (online)', '初始税务登记（线上）'],
    ]],
    [['3. Thuế, kế toán, BHXH quý đầu', 'Tax, accounting, SI: first quarter', '首季度税务、会计、社保'], [
      ['Kê khai thuế quý đầu', 'First-quarter tax filings', '首季度纳税申报'],
      ['Kế toán, sổ sách quý đầu', 'First-quarter bookkeeping', '首季度记账'],
      ['Đăng ký đơn vị, kê khai BHXH quý đầu', 'Social insurance registration & filings', '社保登记及首季度申报'],
      ['Lịch tuân thủ năm đầu, nhắc hạn qua Zalo trước 7 ngày', 'Year-one compliance calendar, reminders 7 days ahead', '首年合规日历，提前7天提醒'],
    ]],
  ],
  gifts: [
    ['Tư vấn pháp lý thường xuyên', 'Ongoing legal advice', '常年法律咨询', '6 tháng · 6 months'],
    ['Tư vấn quản trị nội bộ', 'Internal governance + templates', '内部治理咨询＋范本', '1 buổi + bộ mẫu'],
    ['Tư vấn marketing khởi nghiệp', 'Startup marketing + Fanpage feature', '创业营销咨询＋专页推介', '1 buổi + 1 bài'],
    ['Tra cứu nhãn hiệu sơ bộ', 'Preliminary trademark search', '商标初步检索', '1 nhãn · 1 nhóm'],
    ['Tủ sách pháp lý doanh nghiệp', 'Business law library', '企业法律书库', 'Sách in + ebook'],
    ['Rà soát bản quyền phần mềm', 'Software licence checklist', '软件版权自查清单', 'Checklist'],
    ['Kết nối đối tác', 'Banks, offices, industrial parks', '银行、写字楼、工业园对接', 'Theo nhu cầu · On request'],
    ['Ưu đãi gia hạn kế toán 12 tháng', '12-month accounting renewal', '续签12个月会计服务', 'Giảm 10% · 10% off'],
  ],
  terms: [
    ['Áp dụng cho doanh nghiệp vốn Việt Nam, ngành nghề không cần giấy phép con.', 'Vietnamese-owned companies, no sub-licence lines', '适用越南资本企业、无需分项许可的行业'],
    ['Ngành có điều kiện: báo giá riêng. DN vốn nước ngoài: báo giá sau, giá cạnh tranh.', 'Conditional lines quoted separately; foreign companies: competitive pricing', '附条件行业另行报价；外资企业价格具竞争力'],
  ],
};

const footer = table([CW], [[cell([
  p([
    r('LIÊN HỆ · CONTACT · 联系我们     ', { pt: 7.5, b: true, color: 'E8C98F', sp: 10 }),
    r('Hotline / Zalo: ', { pt: 7.5, color: C.paleGreenText }), r('0973 239 802', { pt: 10, b: true, color: C.white }),
    r('     Email: ', { pt: 7.5, color: C.paleGreenText }), r('nhom2lkd@gmail.com', { pt: 10, b: true, color: C.white }),
    r('     Website: ', { pt: 7.5, color: C.paleGreenText }), r('richelaw.vn', { pt: 10, b: true, color: C.white }),
  ], { after: 20, align: d.AlignmentType.CENTER }),
  p(r('Công ty TNHH Đầu tư Riche Law · Riche Law Investment Co., Ltd. · Hà Nội, Việt Nam', { pt: 6.5, color: C.paleGreenText }), { after: 0, align: d.AlignmentType.CENTER }),
], { w: CW, fill: C.green, m: { top: 120, bottom: 110, left: 160, right: 160 } })]]);

const side2 = [
  ...packageBlock(workPermit).map((x, i) => (i === 0 ? section(workPermit.no, ...workPermit.title, true) : x)),
  ...packageBlock(startup),
  p(r('', { pt: 2 }), { after: 100 }),
  footer,
];
// first heading of side 2 starts a new page
side2[0] = p([
  r('02  ', { pt: 13, b: true, color: C.gold }),
  r(workPermit.title[0], { pt: 12, b: true, color: C.green }),
  r(`   ${workPermit.title[1]}  ·  ${workPermit.title[2]}`, { pt: 8, b: true, color: C.muted }),
], { pbb: true, before: 0, after: 90, keepNext: true, border: { bottom: { style: d.BorderStyle.SINGLE, size: 8, color: C.gold, space: 3 } } });

const doc = new d.Document({
  creator: 'Riche Law', title: 'Riche Law — Bảng giá dịch vụ / Service Price List / 服务价目表',
  styles: { default: { document: { run: { font: 'Montserrat', size: 15 } } } },
  sections: [{
    properties: { page: { size: { width: W, height: H }, margin: { top: M, bottom: M, left: M, right: M, header: 200, footer: 200 } } },
    children: [...side1, ...side2],
  }],
});

d.Packer.toBuffer(doc).then((b) => {
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/Riche_Law_Bang_Gia_VI-EN-ZH_A4.docx', b);
  console.log('pricelist ok');
});
