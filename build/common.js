// Shared helpers for Riche Law Word documents
const d = require('docx');

const C = {
  green: '1B4D3E', greenSoft: 'E6EFEA', greenMid: '2D6A55',
  gold: 'B8873B', goldSoft: 'FBF3E4', ink: '1C2420', muted: '5E6A63',
  line: 'D9DFD9', seal: 'B3261E', white: 'FFFFFF', paleGreenText: 'CFE3D9',
};

// Montserrat for Latin/Vietnamese, a CJK font for Chinese characters
const FONT = { ascii: 'Montserrat', hAnsi: 'Montserrat', cs: 'Montserrat', eastAsia: 'Microsoft YaHei' };

const r = (text, o = {}) => new d.TextRun({
  text, font: FONT, size: Math.round((o.pt || 9) * 2), bold: !!o.b, color: o.color || C.ink,
  characterSpacing: o.sp, allCaps: o.caps, break: o.br,
});

const p = (runs, o = {}) => new d.Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  alignment: o.align || d.AlignmentType.LEFT,
  spacing: { before: o.before || 0, after: o.after ?? 40, line: o.line || 240, lineRule: d.LineRuleType.AUTO },
  indent: o.indent,
  keepNext: o.keepNext,
  pageBreakBefore: o.pbb,
  border: o.border,
  shading: o.shade ? { type: d.ShadingType.CLEAR, color: 'auto', fill: o.shade } : undefined,
});

const NB = { style: d.BorderStyle.NONE, size: 0, color: 'auto' };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };
const cellNoBorders = { top: NB, bottom: NB, left: NB, right: NB };
const line = (color = C.line, size = 4) => ({ style: d.BorderStyle.SINGLE, size, color });

function cell(children, o = {}) {
  return new d.TableCell({
    children,
    width: { size: o.w, type: d.WidthType.DXA },
    shading: o.fill ? { type: d.ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    margins: o.m || { top: 100, bottom: 100, left: 140, right: 140 },
    borders: o.borders || cellNoBorders,
    verticalAlign: o.vAlign || d.VerticalAlign.TOP,
    columnSpan: o.span,
  });
}

function table(widths, rows, o = {}) {
  return new d.Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: d.WidthType.DXA },
    columnWidths: widths,
    borders: o.borders || noBorders,
    rows: rows.map((cells, i) => new d.TableRow({
      children: cells,
      cantSplit: true,
      height: o.heights && o.heights[i] ? { value: o.heights[i], rule: d.HeightRule.ATLEAST } : undefined,
    })),
  });
}

const spacer = (after = 80) => p(r('', { pt: 2 }), { after });

module.exports = { d, C, FONT, r, p, cell, table, line, spacer, NB, cellNoBorders, noBorders };
