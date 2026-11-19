// Đề án hợp tác Riche Law × iVINA — chương trình voucher "Tiếng Việt pháp lý" (A4 dọc, tiếng Việt).
// Số liệu là ước tính trung bình thị trường Hà Nội để thảo luận.
const fs = require('fs');
const { d, C, r, p, cell, table, line, logo, ADDR } = require('./common');

const W = 11906, M = 720, CW = W - 2 * M;
const RED = 'C62828';
const ZEBRA = 'F6F8FB';

// ---------- small building blocks ----------
const t = (s, o = {}) => r(s, { pt: 9, ...o });
const b = (s, o = {}) => r(s, { pt: 9, b: true, ...o });
const para = (runs, o = {}) => p(Array.isArray(runs) ? runs : [runs], { after: 80, line: 262, align: d.AlignmentType.JUSTIFIED, ...o });
const bullet = (runs, lvl = 0) => new d.Paragraph({
  children: Array.isArray(runs) ? runs : [runs], numbering: { reference: 'dots', level: lvl },
  spacing: { before: 0, after: 40, line: 255 },
});
const h1 = (no, s, o = {}) => p([r(no + '  ', { pt: 13, b: true, color: C.gold }), r(s, { pt: 13, b: true, color: C.green })],
  { before: o.first ? 120 : 260, after: 100, keepNext: true, pbb: o.pbb,
    border: { bottom: { style: d.BorderStyle.SINGLE, size: 8, color: C.gold, space: 3 } } });
const h3 = (s) => p(r(s, { pt: 10, b: true, color: C.green }), { before: 140, after: 60, keepNext: true });
const gap = (after = 100) => p(r('', { pt: 2 }), { after });

const bd = (c = C.line, s = 4) => ({ top: line(c, s), bottom: line(c, s), left: line(c, s), right: line(c, s) });
const cp = (runs, o = {}) => p(Array.isArray(runs) ? runs : [runs], { after: o.after ?? 30, line: 245, ...o });
const ct = (s, o = {}) => r(s, { pt: 8, ...o });

// data table: navy header row (repeats across pages), thin lines, optional zebra
function grid(widths, head, rows, o = {}) {
  const mk = (content, w, i, isHead, fill) => cell(
    (Array.isArray(content) ? content : [content]).map((c) => (typeof c === 'string'
      ? cp(r(c, { pt: isHead ? 8 : (o.pt || 8), b: isHead || (i === 0 && o.firstBold), color: isHead ? C.white : C.ink }), { after: 0 })
      : c)),
    { w, fill: isHead ? C.green : fill, borders: bd(), m: { top: 60, bottom: 60, left: 100, right: 80 } });
  return table(widths, [
    head.map((h, i) => mk(h, widths[i], i, true)),
    ...rows.map((row, ri) => row.map((c, i) => mk(c, widths[i], i, false, o.zebra && ri % 2 ? ZEBRA : undefined))),
  ], { repeatHeader: true });
}

// highlighted call-out box
const box = (children, o = {}) => table([CW], [[cell(children, {
  w: CW, fill: o.fill || C.goldSoft, m: { top: 140, bottom: 120, left: 200, right: 200 },
  borders: { top: line(o.border || C.gold, 6), bottom: line(o.border || C.gold, 6), right: line(o.border || C.gold, 6),
    left: { style: d.BorderStyle.SINGLE, size: 28, color: o.border || C.gold } },
})]]);

// voucher card: navy tag column + key/value rows
function voucher(v) {
  const TAG = 1700, KW = 1900, VW = CW - TAG - KW;
  const rows = v.rows.map(([k, val], i) => [
    cell([cp(ct(k, { b: true, color: C.green }), { after: 0 })], { w: KW, fill: i % 2 ? ZEBRA : C.white, borders: bd(), m: { top: 60, bottom: 60, left: 100, right: 60 } }),
    cell((Array.isArray(val) ? val : [val]).map((x) => (typeof x === 'string' ? cp(ct(x), { after: 20 }) : x)),
      { w: VW, fill: i % 2 ? ZEBRA : C.white, borders: bd(), m: { top: 60, bottom: 60, left: 100, right: 80 } }),
  ]);
  const title = [
    cell([
      p([r(v.title, { pt: 11, b: true, color: C.green })], { after: 10 }),
      p(r(v.sub, { pt: 8, color: C.muted }), { after: 0 }),
    ], { w: KW + VW, span: 2, fill: C.goldSoft, borders: bd(C.gold, 6), m: { top: 90, bottom: 80, left: 140, right: 100 } }),
  ];
  // first row: navy tag (spans all rows) + title; subsequent rows: key/value
  const inner = new d.Table({
    width: { size: CW, type: d.WidthType.DXA }, columnWidths: [TAG, KW, VW],
    borders: { top: line(C.green, 6), bottom: line(C.green, 6), left: line(C.green, 6), right: line(C.green, 6), insideHorizontal: line(C.line, 4), insideVertical: line(C.line, 4) },
    rows: [
      new d.TableRow({ cantSplit: true, children: [
        new d.TableCell({
          rowSpan: rows.length + 1, width: { size: TAG, type: d.WidthType.DXA },
          shading: { type: d.ShadingType.CLEAR, color: 'auto', fill: C.green }, verticalAlign: d.VerticalAlign.CENTER,
          margins: { top: 100, bottom: 100, left: 80, right: 80 },
          children: [
            p(r(v.code, { pt: 22, b: true, color: C.goldLight }), { after: 0, align: d.AlignmentType.CENTER }),
            p(r(v.issuer, { pt: 7, b: true, color: C.white, sp: 10 }), { after: 140, align: d.AlignmentType.CENTER }),
            p(r('TRỊ GIÁ', { pt: 6.5, b: true, color: C.paleGreenText, sp: 20 }), { after: 0, align: d.AlignmentType.CENTER }),
            p(r(v.value, { pt: 10.5, b: true, color: C.white }), { after: 0, align: d.AlignmentType.CENTER }),
            ...(v.valueNote ? [p(r(v.valueNote, { pt: 6.5, color: C.paleGreenText }), { after: 0, line: 230, align: d.AlignmentType.CENTER })] : []),
          ],
        }),
        ...title,
      ] }),
      ...rows.map((rw) => new d.TableRow({ cantSplit: true, children: rw })),
    ],
  });
  // wrap in a one-row table that cannot split, so each card stays on one page
  return table([CW], [[cell([inner, p(r('', { pt: 1 }), { after: 0, line: 20 })], { w: CW, m: { top: 0, bottom: 0, left: 0, right: 0 } })]]);
}

// ---------------- Cover header ----------------
const LG = 1450;
const header = table([LG, CW - LG], [[
  cell([p(logo(70), { after: 0, align: d.AlignmentType.CENTER })], { w: LG, fill: C.white, vAlign: d.VerticalAlign.CENTER,
    m: { top: 40, bottom: 40, left: 40, right: 40 }, borders: bd(C.green, 12) }),
  cell([
    p(r('ĐỀ ÁN HỢP TÁC & TRIỂN KHAI VOUCHER', { pt: 8, b: true, color: C.goldLight, sp: 30 }), { after: 20 }),
    p(r('RICHE LAW  ×  iVINA', { pt: 18, b: true, color: C.white, sp: 20 }), { after: 30 }),
    p([r('Chương trình “Tiếng Việt pháp lý — Ký gì, hiểu nấy”', { pt: 10, b: true, color: C.white })], { after: 10 }),
    p(r('Ưu đãi độc quyền dành cho khách hàng Riche Law · Know what you sign · 签之前，看得懂', { pt: 8, color: C.paleGreenText }), { after: 0 }),
  ], { w: CW - LG, fill: C.green, vAlign: d.VerticalAlign.CENTER, m: { top: 130, bottom: 130, left: 260, right: 200 } }),
]]);

const meta = [
  p([b('Kính gửi: ', { pt: 8.5 }), t('Công ty Cổ phần Đầu tư Giáo dục và Đào tạo Quốc tế iVINA', { pt: 8.5 })], { before: 120, after: 10 }),
  p([b('Bên đề xuất: ', { pt: 8.5 }), t('Công ty TNHH Đầu tư Riche Law  ·  ' + ADDR.VI, { pt: 8.5 })], { after: 10 }),
  p([b('Căn cứ: ', { pt: 8.5 }), t('Biên bản họp ngày 07/11/2026 (trao đổi voucher điện tử, sản phẩm kết hợp Luật + Tiếng Việt, đối tác độc quyền, thử nghiệm 03 tháng).', { pt: 8.5 })], { after: 10 }),
  p([b('Ngày: ', { pt: 8.5 }), t('Hà Nội, 19/11/2026', { pt: 8.5 })], { after: 40 }),
];

// ---------------- 0. Tóm tắt ----------------
const summary = [
  h1('★', 'Tóm tắt đề án', { first: true }),
  box([
    cp([b('Ý tưởng: ', { color: C.green }), t('Không tặng “khóa học tiếng Việt” chung chung. iVINA thiết kế riêng cho khách Riche Law chương trình '),
      b('“Tiếng Việt pháp lý — Ký gì, hiểu nấy”'), t(': giúp giám đốc, quản lý, chuyên gia nước ngoài '),
      b('tự đọc hiểu những giấy tờ mà pháp luật Việt Nam bắt buộc phải lập bằng tiếng Việt'),
      t(' — giấy chứng nhận doanh nghiệp, hóa đơn, tờ khai thuế, báo cáo tài chính, biên bản kỷ luật, hợp đồng thuê nhà — trên chính giấy tờ của họ.')], { after: 60, align: d.AlignmentType.JUSTIFIED }),
    cp([b('Độc quyền: ', { color: C.green }), t('Chương trình chỉ trao qua Riche Law, iVINA không bán lẻ ra ngoài trong thời gian hợp tác → '),
      b('ưu đãi chỉ khách Riche Law mới có', { color: RED }), t(', trở thành lý do để khách chọn Riche Law thay vì đơn vị khác.')], { after: 60, align: d.AlignmentType.JUSTIFIED }),
    cp([b('Chiều ngược lại: ', { color: C.green }), t('iVINA trao cho học viên voucher '), b('“Kiểm tra cư trú & lao động hợp pháp”'),
      t(' của Riche Law — giúp học viên tránh bị phạt, bị buộc rời Việt Nam, tức là giúp iVINA giữ học viên.')], { after: 60, align: d.AlignmentType.JUSTIFIED }),
    cp([b('Mỗi bên tự chịu chi phí voucher của mình, không chia doanh thu. ', { color: C.green }),
      t('Riche Law được tăng tỷ lệ chốt đơn và tỷ lệ gia hạn; iVINA được học viên mới đã “học thử” và có nhu cầu thật.')], { after: 0, align: d.AlignmentType.JUSTIFIED }),
  ]),
  gap(80),
  grid([2100, 3300, CW - 2100 - 3300], ['Mã', 'Voucher', 'Trao cho ai · khi nào'], [
    ['V1 · iVINA', 'Đọc hiểu giấy tờ công ty của bạn', 'Khách thành lập công ty / đăng ký đầu tư (IRC, ERC) — khi bàn giao giấy chứng nhận'],
    ['V2 · iVINA', 'Đọc tờ khai thuế & báo cáo tài chính trước khi ký', 'Khách dịch vụ kế toán – thuế (gói Basic trở lên) — trước kỳ ký tờ khai đầu tiên'],
    ['V3 · iVINA', 'Quản lý nhân sự Việt đúng luật — bằng tiếng Việt', 'Khách gói Standard, Premium có quản lý người nước ngoài — khi ký gói / tuyển nhân viên Việt đầu tiên'],
    ['V4 · iVINA', 'Tiếng Việt hành chính cho chuyên gia mới sang', 'Khách gói Giấy phép lao động — khi bàn giao giấy phép'],
    ['V5 · Riche Law', 'Kiểm tra cư trú & lao động hợp pháp 15 phút', 'Học viên nước ngoài của iVINA — khi ghi danh / giữa khóa'],
    ['V6 · Riche Law', 'Giảm 10% dịch vụ pháp lý đầu tiên', 'Học viên iVINA cần giấy phép lao động, thẻ tạm trú, gia hạn, quyết toán thuế'],
  ], { firstBold: true, zebra: true }),
];

// ---------------- 1. Vấn đề ----------------
const s1 = [
  h1('1', 'Vì sao voucher “học tiếng Việt” thông thường không giúp chốt đơn'),
  bullet([b('Là thứ “nên có”, không phải “phải có”. '), t('Khách đến Riche Law để giải quyết thủ tục; khóa tiếng Việt tặng kèm không gắn với vấn đề họ đang gặp, nên không làm họ quyết định nhanh hơn.')]),
  bullet([b('Không khác biệt. '), t('Trung tâm nào cũng có thể giảm giá khóa học; đối thủ của Riche Law cũng có thể tặng tương tự.')]),
  bullet([b('Trao sai thời điểm. '), t('Voucher phát lúc ký hợp đồng thường bị quên; khách chỉ quan tâm khi gặp đúng tình huống cần dùng.')]),
  bullet([b('Giá trị mơ hồ. '), t('“Giảm 20%” không cho khách biết họ nhận được gì cụ thể.')]),
  para([t('Kết luận: voucher iVINA chỉ có giá trị khi nó '), b('giải quyết một việc khách bắt buộc phải làm', { color: C.green }),
    t(', mà nếu làm sai sẽ bị phạt, thua kiện hoặc mất tiền.')], { before: 60 }),
];

// ---------------- 2. Sự cần thiết ----------------
const s2 = [
  h1('2', 'Sự “cần thiết”: những việc pháp luật bắt buộc làm bằng tiếng Việt'),
  para([t('Doanh nghiệp có vốn nước ngoài tại Việt Nam '), b('không có lựa chọn'), t(' về ngôn ngữ ở các việc dưới đây. Người nước ngoài hoặc phụ thuộc hoàn toàn vào phiên dịch, kế toán, nhân viên — hoặc tự hiểu được. Đây là chỗ voucher iVINA trở thành “cần”.')]),
  grid([2400, 2650, CW - 2400 - 2650], ['Việc bắt buộc', 'Căn cứ pháp lý', 'Rủi ro khi người nước ngoài không hiểu'], [
    ['Sổ sách, chứng từ kế toán, báo cáo tài chính', 'Luật Kế toán 2015, Điều 11: chữ viết dùng trong kế toán là tiếng Việt', 'Giám đốc ký báo cáo tài chính, tờ khai thuế không đọc được nhưng vẫn chịu trách nhiệm pháp lý'],
    ['Hóa đơn điện tử', 'Nghị định 123/2020/NĐ-CP: chữ viết trên hóa đơn là tiếng Việt', 'Ký duyệt, xuất hóa đơn sai mà không phát hiện; bị truy thu, phạt'],
    ['Kỷ luật, chấm dứt hợp đồng với nhân viên', 'Bộ luật Lao động 2019, Điều 122; Nghị định 145/2020: phải họp, lập biên bản đúng trình tự', 'Sai trình tự → quyết định kỷ luật bị tuyên trái luật, công ty phải nhận lại người lao động và bồi thường'],
    ['Hồ sơ nộp cơ quan Nhà nước; tranh chấp tại tòa', 'Bộ luật Tố tụng dân sự 2015, Điều 20: tiếng nói, chữ viết trong tố tụng là tiếng Việt', 'Khi tranh chấp, bản tiếng Việt là căn cứ; bản dịch sai là bất lợi cho khách'],
    ['Biển hiệu, quảng cáo, nhãn hàng hóa', 'Luật Quảng cáo 2012, Điều 18 và 34; Nghị định 43/2017/NĐ-CP', 'Bị phạt, phải làm lại biển hiệu, nhãn hàng'],
    ['Đời sống của chuyên gia: tạm trú, thuê nhà, ngân hàng', 'Luật Cư trú, Luật Xuất nhập cảnh; hợp đồng thuê nhà thường chỉ có bản tiếng Việt', 'Quên khai báo tạm trú, ký hợp đồng thuê nhà bất lợi, mất tiền cọc'],
  ], { firstBold: true, zebra: true, pt: 7.8 }),
  para([b('Khách nghĩ gì: ', { color: C.green }), t('“Tôi đang ký những thứ tôi không đọc được.” — đây là nỗi lo thật, ít ai nói ra, và chưa đơn vị luật nào giải quyết. Riche Law + iVINA giải quyết đúng nỗi lo đó.')], { before: 80 }),
];

// ---------------- 3. Định vị ----------------
const s3 = [
  h1('3', 'Định vị chương trình: “Tiếng Việt pháp lý — Ký gì, hiểu nấy”'),
  grid([2700, CW - 2700], ['Yếu tố', 'Cách làm để khách thấy cần và hứng thú'], [
    ['Học trên chính giấy tờ của khách', 'Giáo trình là giấy chứng nhận, hóa đơn, tờ khai, hợp đồng của chính công ty khách (khi khách đồng ý) — học xong là hiểu ngay giấy tờ của mình, không học lý thuyết.'],
    ['Kết quả cầm được trong tay', 'Mỗi khách nhận “Sổ tay song ngữ giấy tờ công ty của bạn”: từng giấy tờ, từng ô quan trọng, giải nghĩa Việt – Anh hoặc Việt – Trung, kèm 100 thuật ngữ pháp lý – kế toán – lao động thường gặp.'],
    ['Ngắn, đúng lúc', 'Chỉ 1–3 buổi 90 phút, tổ chức tại văn phòng khách hoặc online, trao đúng thời điểm khách sắp phải ký hoặc sắp phải xử lý việc đó.'],
    ['Hai chuyên gia', 'Giáo viên iVINA dạy ngôn ngữ; ở buổi then chốt có chuyên viên Riche Law giải thích ý nghĩa pháp lý — điều mà trung tâm tiếng Việt hay văn phòng luật riêng lẻ không làm được.'],
    ['Độc quyền', 'Chỉ trao qua Riche Law; ghi rõ trên voucher “Ưu đãi dành riêng cho khách hàng Riche Law”. iVINA không bán lẻ chương trình này cho đơn vị khác trong thời gian hợp tác.'],
    ['Giá trị bằng tiền', 'Ghi “Quà tặng trị giá 2.400.000đ” thay vì “giảm 20%”; kèm “Chứng nhận hoàn thành” của iVINA — chuyên gia nước ngoài thích có chứng nhận.'],
  ], { firstBold: true, zebra: true }),
];

// ---------------- 4. Voucher do Riche Law trao ----------------
const V1 = voucher({ code: 'V1', issuer: 'RICHE LAW TRAO · iVINA DẠY', value: '2.400.000đ', valueNote: '2 buổi + sổ tay',
  title: 'Đọc hiểu giấy tờ công ty của bạn', sub: 'Your company documents, explained · 读懂贵公司的证照文件',
  rows: [
    ['Dành cho', 'Giám đốc, chủ đầu tư nước ngoài của khách thành lập công ty, đăng ký đầu tư (IRC, ERC), thay đổi đăng ký.'],
    ['Thời điểm trao', 'Ngay khi Riche Law bàn giao giấy chứng nhận — lúc khách vừa cầm trên tay giấy tờ toàn tiếng Việt.'],
    ['Nội dung', ['Buổi 1 (iVINA): đọc giấy chứng nhận đăng ký đầu tư, đăng ký doanh nghiệp, điều lệ — các ô quan trọng: vốn, ngành nghề, người đại diện, thời hạn.',
      'Buổi 2 (iVINA + Riche Law 30 phút): hóa đơn mẫu, con dấu, thông báo thuế, công văn thường gặp; những chữ ký nào giám đốc phải tự chịu trách nhiệm.']],
    ['Khách nhận được', '“Sổ tay song ngữ giấy tờ công ty của bạn” + 100 thuật ngữ + chứng nhận hoàn thành + giảm 20% khóa tiếng Việt đầy đủ tại iVINA.'],
    ['Vì sao khách cần', 'Lần đầu sở hữu công ty ở nước khác, mọi giấy tờ đều bằng tiếng Việt. Khách muốn tự kiểm soát, không phải hỏi phiên dịch mỗi lần.'],
    ['Câu chốt khi tư vấn', [cp([ct('“Ngoài giấy phép, Riche Law tặng anh/chị 2 buổi để tự đọc hiểu chính giấy tờ công ty mình — ưu đãi chỉ khách Riche Law có.”', { b: true, color: C.green })]),
      cp(ct('EN: “Beyond the licence, we make sure you can read and understand your own company documents — only for Riche Law clients.”', { color: C.muted })),
      cp(ct('ZH: “除了办好执照，我们还让您亲自读懂贵公司的证照文件——仅限Riche Law客户。”', { color: C.muted }))]],
  ] });

const V2 = voucher({ code: 'V2', issuer: 'RICHE LAW TRAO · iVINA DẠY', value: '1.500.000đ', valueNote: '1 buổi + checklist',
  title: 'Đọc tờ khai thuế & báo cáo tài chính trước khi ký', sub: 'Read before you sign: tax returns & financial statements · 签字前看懂报税表与财报',
  rows: [
    ['Dành cho', 'Giám đốc, kế toán trưởng người nước ngoài của khách dùng dịch vụ kế toán – thuế (gói Basic, Standard, Premium).'],
    ['Thời điểm trao', 'Trước kỳ ký tờ khai thuế quý đầu tiên hoặc báo cáo tài chính năm đầu tiên.'],
    ['Nội dung', 'iVINA: từ vựng và cấu trúc tờ khai GTGT, TNDN, TNCN, báo cáo tài chính. Riche Law (30 phút): 20 chỉ tiêu phải nhìn trước khi ký, dấu hiệu bất thường cần hỏi lại kế toán.'],
    ['Khách nhận được', '“Checklist 20 điểm trước khi ký” song ngữ + giải nghĩa tờ khai của chính công ty khách + giảm 20% khóa đầy đủ.'],
    ['Vì sao khách cần', 'Luật Kế toán bắt buộc dùng tiếng Việt; giám đốc là người ký và chịu trách nhiệm, kể cả khi kế toán làm sai.'],
    ['Câu chốt khi tư vấn', [cp(ct('“Anh/chị là người ký và chịu trách nhiệm. Riche Law giúp anh/chị đọc được tờ khai trước khi ký — không phải tin hoàn toàn vào người khác.”', { b: true, color: C.green })),
      cp(ct('EN: “You sign it, you’re responsible for it. We help you read it first.”', { color: C.muted }))]],
  ] });

const V3 = voucher({ code: 'V3', issuer: 'RICHE LAW TRAO · iVINA DẠY', value: '4.500.000đ', valueNote: '3 buổi · Premium: 2 người',
  title: 'Quản lý nhân sự Việt đúng luật — bằng tiếng Việt', sub: 'Manage your Vietnamese team the legal way · 依法管理越南员工',
  rows: [
    ['Dành cho', 'Tổng giám đốc, quản lý người nước ngoài của khách gói Standard (1 người) và Premium (2 người).'],
    ['Thời điểm trao', 'Khi ký gói Standard/Premium, hoặc khi khách tuyển nhân viên người Việt đầu tiên.'],
    ['Nội dung', ['Buổi 1 (iVINA): tiếng Việt giao tiếp quản lý hằng ngày — giao việc, khen, góp ý, cách xưng hô theo văn hóa Việt.',
      'Buổi 2 (iVINA + luật sư Riche Law cùng đứng lớp): họp xử lý kỷ luật đúng trình tự Điều 122 Bộ luật Lao động; cách nói, cách lập biên bản.',
      'Buổi 3 (iVINA): đối thoại tại nơi làm việc, thông báo nội quy, tăng ca, thưởng Tết — nói sao cho đúng luật và được nhân viên tôn trọng.']],
    ['Khách nhận được', 'Bộ kịch bản song ngữ: họp kỷ luật, thông báo nghỉ việc, đối thoại định kỳ + mẫu biên bản + chứng nhận + giảm 20% khóa “Tiếng Việt cho nhà quản lý”.'],
    ['Vì sao khách cần', 'Sai trình tự kỷ luật là nguyên nhân phổ biến khiến doanh nghiệp thua tranh chấp lao động; quản lý không nói được tiếng Việt khó giữ uy tín với đội ngũ.'],
    ['Câu chốt khi tư vấn', [cp(ct('“Chỉ một quyết định sa thải sai thủ tục là công ty có thể phải bồi thường nhiều tháng lương. Gói này kèm 3 buổi để quản lý của anh/chị tự xử lý đúng luật, bằng tiếng Việt.”', { b: true, color: C.green })),
      cp(ct('EN: “One wrongful dismissal can cost months of salary. We train your managers to handle it right — in Vietnamese.”', { color: C.muted }))]],
  ] });

const V4 = voucher({ code: 'V4', issuer: 'RICHE LAW TRAO · iVINA DẠY', value: '1.200.000đ', valueNote: '2 buổi',
  title: 'Tiếng Việt hành chính cho chuyên gia mới sang', sub: 'Survival admin Vietnamese for new arrivals · 新到专家生活行政越南语',
  rows: [
    ['Dành cho', 'Chuyên gia nước ngoài được Riche Law làm giấy phép lao động (thay cho quà “4 buổi tiếng Việt online” hiện tại).'],
    ['Thời điểm trao', 'Cùng lúc bàn giao giấy phép lao động.'],
    ['Nội dung', 'Buổi 1: khai báo tạm trú, làm việc với công an phường, đọc hợp đồng thuê nhà của chính khách. Buổi 2: ngân hàng, khám bệnh, giao thông, nơi làm việc.'],
    ['Khách nhận được', 'Thẻ “câu nói cứu nguy” song ngữ bỏ túi + giải nghĩa hợp đồng thuê nhà + giảm 20% khóa giao tiếp.'],
    ['Vì sao khách cần', 'Tuần đầu ở Việt Nam là lúc chuyên gia bối rối nhất; quên khai báo tạm trú hoặc ký hợp đồng thuê nhà bất lợi là chuyện thường gặp.'],
    ['Câu chốt khi tư vấn', cp(ct('“Riche Law không chỉ làm giấy phép, mà lo cho chuyên gia của anh/chị ổn định ngay tuần đầu.”', { b: true, color: C.green }))],
  ] });

const s4 = [
  h1('4', 'Bộ voucher Riche Law trao cho khách (iVINA thực hiện)', { pbb: true }),
  para([t('Mỗi voucher gắn với một việc bắt buộc, trao đúng thời điểm, có kết quả cầm được trong tay. Tất cả đều kèm '), b('giảm 20% khóa tiếng Việt đầy đủ tại iVINA'), t(' để khách học tiếp.')]),
  V1, gap(140), V2, gap(140), V3, gap(140), V4,
];

// ---------------- 5. Voucher do iVINA trao ----------------
const V5 = voucher({ code: 'V5', issuer: 'iVINA TRAO · RICHE LAW LÀM', value: '1.000.000đ', valueNote: '15 phút + phiếu kết quả',
  title: 'Kiểm tra cư trú & lao động hợp pháp', sub: 'Legal status check for foreigners · 外国人居留与工作合法性检查',
  rows: [
    ['Dành cho', 'Mọi học viên nước ngoài của iVINA; nhân viên nước ngoài của doanh nghiệp gửi người học tại iVINA.'],
    ['Thời điểm trao', 'Khi ghi danh khóa học, và nhắc lại giữa khóa.'],
    ['Nội dung', 'Riche Law kiểm tra 8 điểm: loại visa có đúng với hoạt động thực tế; hạn visa; giấy phép lao động hoặc xác nhận miễn; thẻ tạm trú; khai báo tạm trú; cư trú thuế 183 ngày; BHXH; giấy tờ cho vợ/chồng, con.'],
    ['Khách nhận được', 'Phiếu kết quả xanh – vàng – đỏ cho từng điểm, kèm hướng xử lý.'],
    ['Vì sao khách cần', 'Làm việc không có giấy phép lao động: người lao động có thể bị phạt 15–25 triệu đồng và trục xuất; doanh nghiệp bị phạt 30–75 triệu đồng (Nghị định 12/2022/NĐ-CP). Ở từ 183 ngày phải quyết toán thuế trên thu nhập toàn cầu. Nhiều người không biết mình đang vi phạm.'],
    ['Lợi ích cho iVINA', 'Học viên vướng pháp lý có thể phải rời Việt Nam giữa khóa → iVINA mất học viên. Voucher này giúp iVINA giữ học viên và tăng uy tín.'],
  ] });

const V6 = voucher({ code: 'V6', issuer: 'iVINA TRAO · RICHE LAW LÀM', value: 'Giảm 10%', valueNote: 'dịch vụ đầu tiên',
  title: 'Ưu đãi dịch vụ pháp lý đầu tiên', sub: 'First legal service 10% off · 首次法律服务9折',
  rows: [
    ['Dành cho', 'Học viên iVINA và doanh nghiệp của họ cần: giấy phép lao động, thẻ tạm trú, gia hạn, chuyển đổi visa, quyết toán thuế TNCN, rà soát hợp đồng lao động.'],
    ['Thời điểm trao', 'Sau buổi kiểm tra V5 nếu có điểm vàng/đỏ, hoặc khi học viên nhận được việc làm.'],
    ['Lợi ích cho Riche Law', 'Khách nước ngoài đúng đối tượng, đã có nhu cầu cụ thể — tỷ lệ chốt cao hơn khách từ quảng cáo.'],
  ] });

const s5 = [
  h1('5', 'Bộ voucher iVINA trao cho học viên (Riche Law thực hiện)'),
  V5, gap(140), V6,
];

// ---------------- 6. Kịch bản tư vấn ----------------
const s6 = [
  h1('6', 'Kịch bản tư vấn: dùng voucher để tăng tỷ lệ chốt đơn'),
  para([t('Voucher chỉ giúp chốt đơn khi được đưa ra '), b('đúng lúc trong buổi tư vấn'), t(' và gắn với nỗi lo khách vừa nói ra. Quy trình đề xuất cho chuyên viên tư vấn Riche Law:')]),
  grid([1500, 4100, CW - 1500 - 4100], ['Bước', 'Chuyên viên làm gì / nói gì', 'Mẫu câu tiếng Anh'], [
    ['1. Hỏi', 'Hỏi về người sẽ ký giấy tờ: “Ai trong công ty sẽ ký hóa đơn, tờ khai thuế, quyết định nhân sự? Người đó đọc được tiếng Việt không?”', '“Who will sign invoices and tax returns? Can they read Vietnamese?”'],
    ['2. Khơi nỗi lo', 'Nêu sự thật: kế toán, hóa đơn, biên bản kỷ luật bắt buộc bằng tiếng Việt; người ký chịu trách nhiệm.', '“By law these documents must be in Vietnamese — and the signer is responsible.”'],
    ['3. Giới thiệu dịch vụ', 'Trình bày gói Riche Law như bình thường (giấy phép, kế toán, Standard/Premium).', '—'],
    ['4. Đưa voucher', 'Đưa voucher in sẵn tên khách: “Khách Riche Law được tặng chương trình Tiếng Việt pháp lý trị giá … — chỉ có tại Riche Law.”', '“As a Riche Law client, you receive our exclusive Legal Vietnamese programme, worth …”'],
    ['5. Tạo lý do quyết định sớm', 'Số suất có hạn trong giai đoạn thử nghiệm (ví dụ 40 suất đến 28/02/2027); áp dụng khi ký hợp đồng trong tháng.', '“Limited places during our launch period, for contracts signed this month.”'],
    ['6. Chốt & đặt lịch', 'Khi khách ký, đặt luôn lịch buổi 1 với iVINA ngay tại chỗ.', '“Let’s book your first session now.”'],
  ], { firstBold: true, zebra: true }),
  h3('Trả lời các phản đối thường gặp'),
  grid([3000, CW - 3000], ['Khách nói', 'Chuyên viên trả lời'], [
    ['“Tôi có phiên dịch / kế toán rồi.”', 'Rất tốt — chương trình không thay phiên dịch, mà giúp anh/chị kiểm tra lại được những gì mình ký. Người ký vẫn là anh/chị.'],
    ['“Tôi không có thời gian học tiếng.”', 'Chỉ 1–3 buổi, tại văn phòng anh/chị hoặc online, học ngay trên giấy tờ công ty mình — không phải khóa học dài.'],
    ['“Tôi không ở Việt Nam lâu.”', 'Vậy càng cần hiểu đúng những gì đã ký trước khi rời đi; sổ tay song ngữ dùng được cả khi anh/chị ở nước ngoài.'],
    ['“Đơn vị khác rẻ hơn.”', 'Đơn vị khác chỉ làm thủ tục. Riche Law làm thủ tục và giúp anh/chị tự kiểm soát giấy tờ sau đó — chương trình này chỉ có ở Riche Law.'],
  ], { firstBold: true, zebra: true }),
];

// ---------------- 7. Vận hành ----------------
const s7 = [
  h1('7', 'Quy trình vận hành voucher'),
  grid([700, 3000, 2600, CW - 700 - 3000 - 2600], ['#', 'Việc', 'Phụ trách', 'Thời hạn'], [
    ['1', 'Sự kiện kích hoạt (bàn giao giấy phép, ký gói, ghi danh học…)', 'Bên trao voucher', '—'],
    ['2', 'Phát voucher điện tử có mã riêng, ghi tên khách, giá trị bằng tiền, hạn dùng', 'Bên trao voucher', 'Trong 1 ngày làm việc'],
    ['3', 'Xin đồng ý bằng văn bản của khách trước khi chia sẻ giấy tờ làm giáo trình (hoặc dùng bản đã che thông tin)', 'Riche Law', 'Trước buổi 1'],
    ['4', 'Đặt lịch buổi đầu, gửi bên thực hiện thông tin cần thiết', 'Bên trao voucher', 'Trong 3 ngày làm việc'],
    ['5', 'Thực hiện buổi học / buổi kiểm tra; ghi nhận phản hồi', 'Bên thực hiện', 'Theo lịch'],
    ['6', 'Báo cáo mã đã dùng, tỷ lệ chuyển đổi; đề xuất khóa / dịch vụ tiếp theo', 'Hai bên', 'Hằng tháng'],
  ], { zebra: true }),
  h3('Điều kiện voucher'),
  bullet(t('Hạn dùng 90 ngày kể từ ngày phát; mỗi khách 1 voucher mỗi loại; không quy đổi thành tiền.')),
  bullet(t('V3 có thể chuyển cho quản lý khác trong cùng công ty khách; các voucher khác không chuyển nhượng.')),
  bullet(t('Giảm 20% áp dụng trên học phí iVINA; giảm 10% áp dụng trên phí dịch vụ Riche Law (không gồm lệ phí Nhà nước); không cộng dồn với ưu đãi khác trên cùng một khoản phí.')),
  bullet(t('Bảo mật: iVINA ký cam kết bảo mật thông tin khách hàng; chỉ sử dụng giấy tờ khi khách đồng ý (tuân thủ quy định về bảo vệ dữ liệu cá nhân, Nghị định 13/2023/NĐ-CP).')),
];

// ---------------- 8. Chi phí & hiệu quả ----------------
const s8 = [
  h1('8', 'Chi phí mỗi bên tự chịu và hiệu quả kỳ vọng (ước tính 3 tháng)'),
  grid([1600, 1700, 1800, 2100, CW - 1600 - 1700 - 1800 - 2100], ['Voucher', 'Số lượng', 'Chi phí/voucher', 'Tổng chi phí', 'Bên chịu'], [
    ['V1', '8', '~700.000đ', '5.600.000đ', 'iVINA (giáo viên) · RL soạn sổ tay'],
    ['V2', '10', '~350.000đ', '3.500.000đ', 'iVINA · RL 30 phút'],
    ['V3', '10', '~1.050.000đ', '10.500.000đ', 'iVINA · RL 1 buổi luật sư'],
    ['V4', '12', '~700.000đ', '8.400.000đ', 'iVINA'],
    ['V5', '60', '~200.000đ (thời gian)', '12.000.000đ', 'Riche Law'],
    ['V6', '12 hợp đồng', '10% × ~20.000.000đ', '24.000.000đ', 'Riche Law'],
  ], { firstBold: true, zebra: true }),
  gap(80),
  grid([2700, 3300, CW - 2700 - 3300], ['', 'Riche Law', 'iVINA'], [
    ['Chi phí ước tính', '~36.000.000đ (V5, V6) + thời gian chuyên viên cho V1–V3', '~28.000.000đ (V1–V4)'],
    ['Doanh thu thêm ước tính', ['Tăng tỷ lệ chốt khách FDI từ ~25% lên ~35% (giả định 30 lượt tư vấn/quý → +3 hợp đồng, ~125 triệu)',
      '12 hợp đồng từ học viên iVINA (~240 triệu)'], ['10 học viên chuyển sang khóa đầy đủ (25% của 40 voucher × ~15 triệu sau giảm 20% → ~120 triệu)',
      'Tăng giữ chân học viên nhờ V5']],
    ['Giá trị lâu dài', 'Khách gắn bó → gia hạn giấy phép lao động, thẻ tạm trú, dịch vụ kế toán hằng tháng', 'Nguồn học viên doanh nghiệp ổn định, đúng nhu cầu'],
  ], { firstBold: true, zebra: true }),
  h3('Chỉ số đánh giá sau 3 tháng'),
  bullet([b('Tỷ lệ dùng voucher ≥ 60% '), t('(số mã đã dùng / số mã đã phát).')]),
  bullet([b('Tỷ lệ chốt đơn của Riche Law tăng ≥ 10 điểm % '), t('ở nhóm khách được giới thiệu voucher so với nhóm không giới thiệu.')]),
  bullet([b('Tỷ lệ chuyển sang khóa đầy đủ tại iVINA ≥ 25%; '), t('tỷ lệ học viên V5 chuyển thành hợp đồng Riche Law ≥ 20%.')]),
  bullet([b('Điểm hài lòng ≥ 4,5/5 '), t('cho từng voucher.')]),
];

// ---------------- 9. Cam kết & lộ trình ----------------
const s9 = [
  h1('9', 'Cam kết hai bên và lộ trình triển khai'),
  grid([CW / 2, CW / 2], ['iVINA cam kết', 'Riche Law cam kết'], [[
    [cp(ct('• Thiết kế chương trình “Tiếng Việt pháp lý” (V1–V4), giáo trình trên giấy tờ thực tế, sổ tay song ngữ.')),
      cp(ct('• Không bán lẻ chương trình này, không hợp tác tương tự với đơn vị luật khác trong thời gian hợp tác.')),
      cp(ct('• Bố trí giáo viên trong 5 ngày làm việc kể từ khi nhận lịch; dạy tại văn phòng khách hoặc online.')),
      cp(ct('• Bảo mật thông tin khách hàng; cấp chứng nhận hoàn thành.'))],
    [cp(ct('• Đưa voucher iVINA vào quy trình tư vấn và hợp đồng của các gói liên quan; giới thiệu iVINA là đối tác đào tạo tiếng Việt duy nhất.')),
      cp(ct('• Cung cấp chuyên viên/luật sư cho phần pháp lý của V1–V3; soạn nội dung sổ tay phần pháp lý.')),
      cp(ct('• Thực hiện V5 trong 5 ngày làm việc kể từ khi nhận đăng ký; áp dụng V6.')),
      cp(ct('• Báo cáo số liệu chốt đơn có/không có voucher hằng tháng.'))],
  ]]),
  gap(80),
  grid([2000, 5600, CW - 2000 - 5600], ['Thời gian', 'Công việc', 'Phụ trách'], [
    ['20 – 30/11/2026', 'Thống nhất đề án; ký thỏa thuận hợp tác độc quyền, cam kết chất lượng và bảo mật; thỏa thuận sử dụng tên, logo của nhau', 'Chị Trang, chị Phương'],
    ['01 – 10/12/2026', 'iVINA hoàn thiện giáo trình V1–V4, sổ tay song ngữ, 100 thuật ngữ; Riche Law soạn phần pháp lý và checklist', 'iVINA, Riche Law'],
    ['01 – 10/12/2026', 'Thiết kế voucher điện tử, mã theo dõi; tập huấn kịch bản tư vấn cho chuyên viên Riche Law', 'Thu Hằng, Duy Thành'],
    ['11/12/2026', 'Bắt đầu phát voucher', 'Hai bên'],
    ['Cuối mỗi tháng', 'Họp rà soát số liệu, điều chỉnh nội dung và kịch bản', 'Hai bên'],
    ['28/02/2027', 'Tổng kết thử nghiệm; quyết định gia hạn, mở rộng', 'Hai bên'],
  ], { firstBold: true, zebra: true }),
];

const note = p(t('Ghi chú: các con số là ước tính trung bình thị trường Hà Nội (buổi học 1-1 90 phút ~600.000đ; chi phí giáo viên ~350.000đ/buổi; khóa đầy đủ ~15.000.000đ) để làm cơ sở thảo luận. Căn cứ pháp lý nêu trong đề án cần được rà soát lại theo văn bản hiện hành tại thời điểm phát hành voucher.', { pt: 7.5, color: C.muted }),
  { before: 160, after: 120, line: 240, align: d.AlignmentType.JUSTIFIED });

const footer = table([CW], [[cell([
  p([r('RICHE LAW', { pt: 8.5, b: true, color: C.white, sp: 20 }),
     r('   Hotline / Zalo: ', { pt: 7.5, color: C.paleGreenText }), r('0973 239 802', { pt: 8.5, b: true, color: C.white }),
     r('   Email: ', { pt: 7.5, color: C.paleGreenText }), r('nhom2lkd@gmail.com', { pt: 8.5, b: true, color: C.white }),
     r('   Website: ', { pt: 7.5, color: C.paleGreenText }), r('richelaw.vn', { pt: 8.5, b: true, color: C.white })],
  { after: 10, align: d.AlignmentType.CENTER }),
  p(r(ADDR.VI, { pt: 7, color: C.paleGreenText }), { after: 0, align: d.AlignmentType.CENTER }),
], { w: CW, fill: C.green, m: { top: 90, bottom: 90, left: 120, right: 120 } })]]);

const pageFooter = new d.Footer({ children: [p([
  r('Riche Law × iVINA · Đề án “Tiếng Việt pháp lý”   ·   Trang ', { pt: 7, color: C.muted }),
  new d.TextRun({ children: [d.PageNumber.CURRENT], size: 14, color: C.muted, font: 'Montserrat' }),
], { after: 0, align: d.AlignmentType.RIGHT })] });

const doc = new d.Document({
  creator: 'Riche Law', title: 'Đề án hợp tác Riche Law × iVINA — Tiếng Việt pháp lý',
  styles: { default: { document: { run: { font: 'Montserrat', size: 18 } } } },
  numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: d.LevelFormat.BULLET, text: '•', alignment: d.AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 320, hanging: 220 } }, run: { color: C.gold } } }] }] },
  sections: [{
    properties: { page: { size: { width: W, height: 16838 }, margin: { top: M, bottom: M + 100, left: M, right: M, header: 300, footer: 360 } } },
    footers: { default: pageFooter },
    children: [header, ...meta, ...summary, ...s1, ...s2, ...s3, ...s4, ...s5, ...s6, ...s7, ...s8, ...s9, note, footer],
  }],
});

d.Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/De_Xuat_Hop_Tac_RicheLaw_iVINA.docx', buf);
  console.log('proposal ok');
});
