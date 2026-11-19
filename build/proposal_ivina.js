// Đề xuất hợp tác Riche Law × iVINA — A4 dọc, tiếng Việt. Số liệu là ước tính để thảo luận.
const fs = require('fs');
const { d, C, r, p, cell, table, line, logo, ADDR } = require('./common');

const W = 11906, M = 680, CW = W - 2 * M;
const RED = 'C62828';

const bullet = (runs, lvl = 0) => new d.Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  numbering: { reference: 'dots', level: lvl },
  spacing: { before: 0, after: 30, line: 240 },
});
const t = (s, o = {}) => r(s, { pt: 8.5, ...o });
const b = (s, o = {}) => r(s, { pt: 8.5, b: true, ...o });
const h2 = (no, s) => p([r(no + '  ', { pt: 11, b: true, color: C.gold }), r(s, { pt: 11, b: true, color: C.green })],
  { before: 160, after: 70, keepNext: true, border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: C.gold, space: 2 } } });
const para = (runs, o = {}) => p(Array.isArray(runs) ? runs : [runs], { after: 60, line: 250, align: d.AlignmentType.JUSTIFIED, ...o });

// generic data table: header row navy, body rows with thin lines
const grid = (widths, head, rows, o = {}) => {
  const bd = { top: line(C.line, 4), bottom: line(C.line, 4), left: line(C.line, 4), right: line(C.line, 4) };
  const mk = (content, w, i, isHead, fill) => cell(
    (Array.isArray(content) ? content : [content]).map((c) => (typeof c === 'string'
      ? p(r(c, { pt: isHead ? 7.5 : (o.pt || 7.5), b: isHead || (i === 0 && o.firstBold), color: isHead ? C.white : C.ink }), { after: 0, line: 235 })
      : c)),
    { w, fill: isHead ? C.green : fill, borders: bd, m: { top: 50, bottom: 50, left: 80, right: 70 } });
  return table(widths, [
    head.map((h, i) => mk(h, widths[i], i, true)),
    ...rows.map((row, ri) => row.map((c, i) => mk(c, widths[i], i, false, o.zebra && ri % 2 ? 'F6F8FB' : undefined))),
  ], { repeatHeader: true });
};
const cp = (runs) => p(Array.isArray(runs) ? runs : [runs], { after: 20, line: 235 });   // cell paragraph
const ct = (s, o = {}) => r(s, { pt: 7.5, ...o });

// ---------------- Header ----------------
const LG = 1350;
const header = table([LG, CW - LG], [[
  cell([p(logo(64), { after: 0, align: d.AlignmentType.CENTER })], { w: LG, fill: C.white, vAlign: d.VerticalAlign.CENTER,
    m: { top: 40, bottom: 40, left: 40, right: 40 },
    borders: { top: line(C.green, 12), bottom: line(C.green, 12), left: line(C.green, 12), right: line(C.green, 12) } }),
  cell([
    p(r('ĐỀ XUẤT HỢP TÁC', { pt: 8, b: true, color: C.goldLight, sp: 30 }), { after: 20 }),
    p([r('RICHE LAW  ×  iVINA', { pt: 17, b: true, color: C.white, sp: 20 })], { after: 20 }),
    p(r('“Hiểu luật Việt Nam bằng chính tiếng Việt” — Gói sản phẩm Luật + Tiếng Việt + Văn hóa cho người nước ngoài', { pt: 8, color: C.paleGreenText }), { after: 0 }),
  ], { w: CW - LG, fill: C.green, vAlign: d.VerticalAlign.CENTER, m: { top: 120, bottom: 120, left: 240, right: 200 } }),
]]);

const meta = p([
  b('Kính gửi: ', { pt: 8 }), t('Công ty Cổ phần Đầu tư Giáo dục và Đào tạo Quốc tế iVINA', { pt: 8 }),
], { before: 100, after: 10 });
const metaB = p([b('Bên đề xuất: ', { pt: 8 }), t('Công ty TNHH Đầu tư Riche Law', { pt: 8 }), t('     |     Hà Nội, ngày 19 tháng 11 năm 2026', { pt: 8, color: C.muted })], { after: 20 });
const meta2 = p(t('Căn cứ: Biên bản họp ngày 07/11/2026 về trao đổi voucher, xây dựng sản phẩm kết hợp và hợp tác độc quyền thử nghiệm 03 tháng.', { pt: 7.5, color: C.muted }), { after: 40 });

// ---------------- 1. Vì sao cần thay đổi cách làm voucher ----------------
const s1 = [
  h2('1', 'Vấn đề: voucher giảm giá chung chung chưa tạo được giá trị'),
  para([t('Phương án ban đầu (tư vấn giấy phép lao động + giảm 20% khóa tiếng Việt hoặc trải nghiệm văn hóa) là '), b('giảm giá cho một thứ khách chưa chắc cần'),
    t('. Khách nước ngoài không mua “học tiếng Việt”; họ cần '), b('hiểu và xử lý được giấy tờ, công việc, đời sống bằng tiếng Việt', { color: C.green }),
    t(' — mà bản tiếng Việt mới là bản có giá trị pháp lý. Văn phòng luật không dạy được tiếng, trung tâm tiếng Việt không tư vấn được luật. '),
    b('Chỉ khi Riche Law và iVINA cùng làm, nhu cầu này mới được đáp ứng trọn vẹn.')]),
];

// ---------------- 2. USP ----------------
const usp = table([CW], [[cell([
  p(r('USP CHUNG', { pt: 7.5, b: true, color: C.gold, sp: 30 }), { after: 30 }),
  p(r('Luật sư và giáo viên cùng đồng hành — người nước ngoài sống và làm việc hợp pháp, tự tin từ ngày đầu tại Việt Nam.', { pt: 10.5, b: true, color: C.green }), { after: 60, line: 250 }),
  table([Math.floor((CW - 360) / 3), Math.floor((CW - 360) / 3), CW - 360 - 2 * Math.floor((CW - 360) / 3)], [[
    ...[
      ['Học trên chính giấy tờ của khách', 'Giáo trình dựng từ hợp đồng lao động, giấy phép lao động, hợp đồng thuê nhà, phiếu lương của chính học viên.'],
      ['Đúng lúc cần', 'Ưu đãi được kích hoạt theo sự kiện: có giấy phép → học tiếng theo tình huống; có thẻ tạm trú → gói gia đình.'],
      ['Hai chuyên gia một buổi học', 'Ở các buổi then chốt, luật sư Riche Law và giáo viên iVINA cùng đứng lớp.'],
    ].map(([hh, tt], i, arr) => cell([
      p(r(hh, { pt: 8.5, b: true, color: C.ink }), { after: 20 }),
      p(r(tt, { pt: 7.5, color: C.muted }), { after: 0, line: 235 }),
    ], { w: i < 2 ? Math.floor((CW - 360) / 3) : CW - 360 - 2 * Math.floor((CW - 360) / 3), m: { top: 40, bottom: 40, left: i ? 120 : 0, right: 80 } })),
  ]]),
], { w: CW, fill: C.goldSoft, m: { top: 140, bottom: 120, left: 180, right: 180 },
  borders: { top: line(C.gold, 8), bottom: line(C.gold, 8), left: { style: d.BorderStyle.SINGLE, size: 24, color: C.gold }, right: line(C.gold, 8) } })]]);

// ---------------- 3. Khách hàng & nhu cầu ----------------
const s3 = [
  h2('2', 'Khách hàng mục tiêu và nhu cầu thật'),
  grid([2150, 3900, CW - 2150 - 3900], ['Đối tượng', 'Nỗi lo', 'Điều họ muốn'], [
    ['Chủ đầu tư, Tổng giám đốc', 'Ký hợp đồng, quyết định, văn bản cơ quan Nhà nước bằng tiếng Việt mà không đọc được', 'Hiểu mình đang ký gì; làm ăn lâu dài, không vướng'],
    ['Quản lý người nước ngoài', 'Xử lý kỷ luật, tăng ca, nghỉ việc sai luật → tranh chấp lao động; khó giao tiếp với nhân viên Việt', 'Được đội ngũ tôn trọng, không bị kiện'],
    ['Chuyên gia mới sang', 'Tạm trú, thuê nhà, ngân hàng, thuế dồn dập; rào cản ngôn ngữ hằng ngày', 'Ổn định nhanh, không bị phạt'],
    ['Gia đình chuyên gia', 'Vợ/chồng, con khó hòa nhập — lý do lớn khiến chuyên gia bỏ về sớm', 'Cả nhà yên tâm sống tại Việt Nam'],
    ['Học viên iVINA', 'Không chắc visa, giấy phép, thẻ tạm trú, thuế của mình có đúng luật', 'Được kiểm tra nhanh, có người tin cậy hỏi'],
  ], { firstBold: true, zebra: true }),
];

// ---------------- 4. Sản phẩm ----------------
const PWs = [1950, 2950, 2700, CW - 1950 - 2950 - 2700];
const s4 = [
  h2('3', 'Năm sản phẩm hợp tác đề xuất'),
  grid(PWs, ['Sản phẩm', 'Nội dung Riche Law + iVINA', 'Giá đề xuất / giá trị', 'Chia doanh thu (ước tính)'], [
    [[cp(ct('① Hạ cánh an toàn 90 ngày', { b: true })), cp(ct('Nâng cấp gói giấy phép lao động · chuyên gia mới sang', { color: C.muted }))],
      [cp(ct('RL: giấy phép lao động trọn gói, tư vấn thẻ tạm trú, rà soát hợp đồng thuê nhà, 1 buổi thuế TNCN–BHXH.')),
        cp(ct('iVINA: 6 buổi 1-1 tiếng Việt theo tình huống (90 phút) + 1 buổi định hướng văn hóa nơi làm việc + voucher 20% khóa tiếp theo.'))],
      [cp([ct('1.800 USD/người', { b: true, color: C.green }), ct(' (gói giấy phép lẻ: 1.600 USD)')]), cp(ct('Phần iVINA trị giá ~4.400.000đ + voucher ~3.000.000đ', { color: C.muted }))],
      [cp(ct('Chênh lệch 200 USD ≈ 5.200.000đ:')), cp(ct('iVINA 3.900.000đ · RL 1.300.000đ (soạn giáo trình từ hồ sơ, điều phối)'))]],
    [[cp(ct('② Lãnh đạo đội ngũ Việt — đúng luật', { b: true })), cp(ct('Quản lý nước ngoài · gắn gói Standard, Premium', { color: C.muted }))],
      [cp(ct('12 buổi: 8 buổi “Tiếng Việt cho nhà quản lý” (iVINA) + 4 chuyên đề luật lao động: kỷ luật, tăng ca, chấm dứt hợp đồng, thưởng Tết (RL + iVINA cùng đứng lớp).'))],
      [cp([ct('1-1: 18.000.000đ/người', { b: true, color: C.green })]), cp([ct('Nhóm 3–5: 9.000.000đ/người', { b: true, color: C.green })]),
        cp(ct('Premium: tặng 1 suất nhóm/năm · Standard: giảm 20%', { color: C.muted }))],
      [cp(ct('iVINA 55% · RL 45%')), cp(ct('Suất tặng Premium: RL trả iVINA 4.950.000đ/suất', { color: C.muted }))]],
    [[cp(ct('③ Hội thảo “Văn hóa kinh doanh Việt — đúng luật”', { b: true })), cp(ct('Nhà đầu tư mới · thu hút khách', { color: C.muted }))],
      [cp(ct('Hằng tháng, 2 giờ, 20–30 khách. iVINA: quan hệ, thể diện, quà Tết, đàm phán. RL: giới hạn pháp lý về quà tặng, hợp đồng song ngữ, làm việc với cơ quan Nhà nước.'))],
      [cp([ct('Miễn phí cho khách', { b: true, color: C.green })]), cp(ct('Chi phí ~6.000.000đ/buổi (teabreak, quảng cáo, in ấn); tổ chức tại văn phòng hai bên', { color: C.muted }))],
      [cp(ct('Chi phí chia 50/50 (~3.000.000đ/bên/tháng); khách tiềm năng dùng chung'))]],
    [[cp(ct('④ Cả gia đình cùng hội nhập', { b: true })), cp(ct('Vợ/chồng, con của chuyên gia', { color: C.muted }))],
      [cp(ct('RL: thẻ tạm trú cho người phụ thuộc (vợ/chồng + tối đa 2 con), tư vấn thủ tục nhập học cho con.')),
        cp(ct('iVINA: 1 ngày trải nghiệm văn hóa cho cả gia đình + 4 buổi nhóm tiếng Việt cho vợ/chồng.'))],
      [cp([ct('900 USD/gia đình', { b: true, color: C.green })]), cp(ct('Thẻ tạm trú lẻ ~250 USD/người; phần iVINA trị giá ~4.400.000đ', { color: C.muted }))],
      [cp(ct('iVINA 3.800.000đ · RL phần còn lại (chưa gồm lệ phí Nhà nước)'))]],
    [[cp(ct('⑤ Kiểm tra pháp lý 15 phút', { b: true })), cp(ct('Học viên iVINA · voucher chiều ngược lại', { color: C.muted }))],
      [cp(ct('RL kiểm tra visa, giấy phép lao động, thẻ tạm trú, thuế TNCN của học viên; phát hiện rủi ro thì tư vấn hướng xử lý.'))],
      [cp([ct('Miễn phí', { b: true, color: C.green }), ct(' · dịch vụ phát sinh giảm 10%')])],
      [cp(ct('Phí giới thiệu 10% hợp đồng đầu tiên, áp dụng hai chiều (RL → iVINA và iVINA → RL)'))]],
  ], { pt: 7.5 }),
  p(t('Giả định ước tính: 1 USD ≈ 26.000đ; buổi 1-1 (90 phút) 600.000đ; buổi nhóm 300.000đ/người; trải nghiệm văn hóa 800.000đ/người; khóa 30 buổi ~15.000.000đ. Hai bên điều chỉnh theo giá niêm yết thực tế.', { pt: 6.5, color: C.muted }), { before: 40, after: 0, line: 230 }),
];

// ---------------- 5. Cơ chế voucher ----------------
const s5 = [
  h2('4', 'Cơ chế voucher: đúng lúc, đúng người, dễ dùng'),
  bullet([b('Kích hoạt theo sự kiện: '), t('có giấy phép lao động → voucher “tiếng Việt theo tình huống”; có thẻ tạm trú → voucher gia đình; khách tuyển nhân viên Việt đầu tiên → voucher khóa quản lý.')]),
  bullet([b('Ghi giá trị bằng tiền, '), t('ví dụ “Quà tặng trị giá 4.400.000đ” thay vì “giảm 20%”.')]),
  bullet([b('Đặt lịch giúp khách: '), t('Riche Law hẹn sẵn buổi học đầu tiên với iVINA, khách không phải tự liên hệ.')]),
  bullet([b('Mã riêng cho từng khách, '), t('hạn dùng 90 ngày, mỗi người 1 voucher mỗi loại, không quy đổi tiền, không cộng dồn với ưu đãi khác trên cùng một khoản phí.')]),
];

// ---------------- 6. Thử nghiệm 3 tháng ----------------
const KW = [3150, 1500, 2000, CW - 3150 - 1500 - 2000];
const s6 = [
  h2('5', 'Thử nghiệm 03 tháng (01/12/2026 – 28/02/2027): mục tiêu và doanh thu ước tính'),
  grid(KW, ['Chỉ tiêu', 'Mục tiêu', 'Doanh thu ước tính', 'Phần của iVINA'], [
    ['① Hạ cánh an toàn 90 ngày', '10 khách', '18.000 USD (~468 triệu)', '39.000.000đ'],
    ['② Lãnh đạo đội ngũ Việt', '2 nhóm, 6 người', '54.000.000đ', '29.700.000đ'],
    ['③ Hội thảo hằng tháng', '3 buổi, 60 khách', 'Tạo 10 khách tiềm năng', '– 9.000.000đ (chi phí)'],
    ['④ Cả gia đình cùng hội nhập', '3 gia đình', '2.700 USD (~70 triệu)', '11.400.000đ'],
    ['⑤ Kiểm tra pháp lý 15 phút', '40 lượt → 8 hợp đồng', '~160.000.000đ (RL)', '16.000.000đ (phí giới thiệu)'],
    ['Khóa tiếp theo từ voucher 20%', '4 khóa', '~48.000.000đ (iVINA)', '48.000.000đ'],
  ], { firstBold: true, zebra: true }),
  p([t('Tổng phần của iVINA ước tính: ', { pt: 8 }), b('~135.000.000đ / 3 tháng', { pt: 8, color: C.green }),
    t('. Chỉ số đánh giá thêm: tỷ lệ dùng voucher ≥ 60%, điểm hài lòng ≥ 4,5/5, tỷ lệ khách chuyển đổi chéo giữa hai bên.', { pt: 8 })], { before: 50, after: 0, line: 245 }),
];

// ---------------- 7. Lộ trình ----------------
const s7 = [
  h2('6', 'Lộ trình và phân công'),
  grid([2000, 5300, CW - 2000 - 5300], ['Thời gian', 'Công việc', 'Phụ trách'], [
    ['20 – 30/11/2026', 'Chốt đề xuất; ký thỏa thuận hợp tác độc quyền và cam kết chất lượng dịch vụ, gồm điều khoản sử dụng tên và logo của nhau', 'Chị Trang, chị Phương'],
    ['01 – 07/12/2026', 'Thiết kế voucher điện tử và mã theo dõi; iVINA soạn khung giáo trình “tiếng Việt theo tình huống pháp lý”', 'Thu Hằng, Duy Thành; giáo viên iVINA'],
    ['Từ 01/12/2026', 'Mở bán sản phẩm ①–⑤; hội thảo 1 (giữa tháng 12): “Thuê chuyên gia nước ngoài: giấy phép, thuế, văn hóa”', 'Hai bên'],
    ['Tháng 01/2027', 'Hội thảo 2: “Quà Tết — phong tục và giới hạn pháp lý” (trước Tết Đinh Mùi)', 'Hai bên'],
    ['Tháng 02/2027', 'Hội thảo 3: “Hợp đồng song ngữ — ký gì, hiểu gì”; 28/02 tổng kết số liệu, quyết định gia hạn', 'Hai bên'],
  ], { firstBold: true, zebra: true }),
];

const footer = table([CW], [[cell([
  p([r('RICHE LAW', { pt: 8.5, b: true, color: C.white, sp: 20 }),
     r('   Hotline / Zalo: ', { pt: 7.5, color: C.paleGreenText }), r('0973 239 802', { pt: 8.5, b: true, color: C.white }),
     r('   Email: ', { pt: 7.5, color: C.paleGreenText }), r('nhom2lkd@gmail.com', { pt: 8.5, b: true, color: C.white }),
     r('   Website: ', { pt: 7.5, color: C.paleGreenText }), r('richelaw.vn', { pt: 8.5, b: true, color: C.white })],
  { after: 10, align: d.AlignmentType.CENTER }),
  p(r(ADDR.VI, { pt: 7, color: C.paleGreenText }), { after: 0, align: d.AlignmentType.CENTER }),
], { w: CW, fill: C.green, m: { top: 90, bottom: 90, left: 120, right: 120 } })]]);

const note = p(t('Các con số trong đề xuất là ước tính trung bình thị trường Hà Nội để làm cơ sở thảo luận, sẽ được hai bên thống nhất trong thỏa thuận chính thức.', { pt: 7, color: C.muted }),
  { before: 80, after: 80, line: 230 });

const doc = new d.Document({
  creator: 'Riche Law', title: 'Đề xuất hợp tác Riche Law × iVINA',
  styles: { default: { document: { run: { font: 'Montserrat', size: 17 } } } },
  numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: d.LevelFormat.BULLET, text: '•', alignment: d.AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 300, hanging: 200 } }, run: { color: C.gold } } }] }] },
  sections: [{
    properties: { page: { size: { width: W, height: 16838 }, margin: { top: M, bottom: M, left: M, right: M, header: 300, footer: 300 } } },
    children: [header, meta, metaB, meta2, ...s1, p(r('', { pt: 2 }), { after: 60 }), usp, ...s3, ...s4, ...s5, ...s6, ...s7, note, footer],
  }],
});

d.Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/De_Xuat_Hop_Tac_RicheLaw_iVINA.docx', buf);
  console.log('proposal ok');
});
