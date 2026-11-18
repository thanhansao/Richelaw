#!/bin/bash
# usage: build/render.sh output/file.docx  -> renders PNG pages to scratch
f="$1"; out=/tmp/claude-0/-home-user-Richelaw/ebdfbb65-04c4-523b-8092-de6350df6a34/scratchpad/render
mkdir -p "$out"; zip -d "$f" '*/' >/dev/null 2>&1 || true
soffice --headless --convert-to pdf --outdir "$out" "$f" >/dev/null 2>&1
b=$(basename "$f" .docx); pdfinfo "$out/$b.pdf" | grep Pages
rm -f "$out/$b"-*.png; pdftoppm -png -r 90 "$out/$b.pdf" "$out/$b"; ls "$out/$b"-*.png
