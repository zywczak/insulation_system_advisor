import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResult, AssessmentAnswers } from '@/types/assessment';
import { SYSTEMS, FEATURE_LABELS } from '@/data/systems';

// ── Color Palette ──
const NAVY = [15, 23, 42] as const;
const BLUE = [59, 130, 246] as const;
const DARK_BLUE = [30, 64, 175] as const;
const WHITE = [255, 255, 255] as const;
const GRAY = [100, 116, 139] as const;
const LIGHT_GRAY = [226, 232, 240] as const;
const GREEN = [34, 197, 94] as const;
const AMBER = [245, 158, 11] as const;
const AMBER_BG = [255, 251, 235] as const;
const AMBER_BORDER = [253, 230, 138] as const;

// ── Sidebar / Layout Constants ──
const SIDEBAR_W = 65;
const RIGHT_X = SIDEBAR_W + 6;

// ── Helpers ──
function generateReportId(): string {
  const chars = '0123456789ABCDEF';
  let id = '';
  for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `RPT-${id}`;
}

/** Truncate text to fit within maxWidth (mm) */
function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && doc.getTextWidth(t + '...') > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + '...';
}

function drawTopAccentLine(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, w, 1.5, 'F');
}

function drawDarkSidebar(doc: jsPDF) {
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, SIDEBAR_W, h, 'F');
}

function drawCircularGauge(doc: jsPDF, cx: number, cy: number, radius: number, score: number, max: number) {
  const segments = 80;
  const trackWidth = 3;
  const pct = Math.min(score / max, 1);

  // Background track (grey)
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(trackWidth);
  for (let i = 0; i < segments; i++) {
    const a1 = -Math.PI / 2 + (i / segments) * 2 * Math.PI;
    const a2 = -Math.PI / 2 + ((i + 1) / segments) * 2 * Math.PI;
    doc.line(
      cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
      cx + radius * Math.cos(a2), cy + radius * Math.sin(a2)
    );
  }

  // Filled arc (blue)
  const filledSegments = Math.round(segments * pct);
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(trackWidth);
  for (let i = 0; i < filledSegments; i++) {
    const a1 = -Math.PI / 2 + (i / segments) * 2 * Math.PI;
    const a2 = -Math.PI / 2 + ((i + 1) / segments) * 2 * Math.PI;
    doc.line(
      cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
      cx + radius * Math.cos(a2), cy + radius * Math.sin(a2)
    );
  }

  // Center score text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(String(score), cx, cy + 2, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(`/ ${max}`, cx, cy + 6.5, { align: 'center' });
}

function drawGlassPill(doc: jsPDF, x: number, y: number, icon: string, label: string, value: string, maxW: number): number {
  const fullText = `${icon} ${label}: ${value}`;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  const textW = doc.getTextWidth(fullText);
  const tw = Math.min(textW + 8, maxW);

  // Glass background
  doc.saveGraphicsState();
  const gState = new (doc as any).GState({ opacity: 0.12 });
  doc.setGState(gState);
  doc.setFillColor(...BLUE);
  doc.roundedRect(x, y, tw, 7, 3, 3, 'F');
  doc.restoreGraphicsState();

  // Border
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, tw, 7, 3, 3, 'S');

  // Text (truncated if needed)
  doc.setTextColor(...DARK_BLUE);
  const displayText = truncateText(doc, fullText, tw - 6);
  doc.text(displayText, x + 3, y + 5);
  return tw;
}

function drawGradientBorder(doc: jsPDF, x: number, y: number, w: number) {
  const layers = 5;
  const layerH = 0.7;
  for (let i = 0; i < layers; i++) {
    doc.saveGraphicsState();
    const opacity = 1 - (i / layers) * 0.7;
    const gState = new (doc as any).GState({ opacity });
    doc.setGState(gState);
    doc.setFillColor(...BLUE);
    doc.rect(x, y + i * layerH, w, layerH, 'F');
    doc.restoreGraphicsState();
  }
}

function drawCard(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setFillColor(210, 215, 225);
  doc.roundedRect(x + 0.4, y + 0.6, w, h, 2, 2, 'F');
  doc.setFillColor(...WHITE);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y, w, h, 2, 2, 'S');
}

function drawRadarChart(doc: jsPDF, cx: number, cy: number, radius: number, data: { label: string; value: number }[]) {
  const n = data.length;
  if (n < 3) return;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  // Grid rings
  for (let ring = 1; ring <= 4; ring++) {
    const r = (radius * ring) / 4;
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.15);
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    for (let i = 0; i < n; i++) {
      doc.line(pts[i][0], pts[i][1], pts[(i + 1) % n][0], pts[(i + 1) % n][1]);
    }
  }

  // Axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.1);
    doc.line(cx, cy, cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }

  // Data points
  const polyPts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = radius * data[i].value;
    polyPts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  // Glow layer
  doc.saveGraphicsState();
  let gState = new (doc as any).GState({ opacity: 0.06 });
  doc.setGState(gState);
  doc.setFillColor(...BLUE);
  const glowPts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = radius * data[i].value * 1.15;
    glowPts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  for (let i = 1; i < n - 1; i++) {
    doc.triangle(glowPts[0][0], glowPts[0][1], glowPts[i][0], glowPts[i][1], glowPts[i + 1][0], glowPts[i + 1][1], 'F');
  }
  doc.restoreGraphicsState();

  // Gradient fill layers
  const layers = [0.25, 0.18, 0.1];
  const scales = [1, 0.75, 0.5];
  for (let l = 0; l < layers.length; l++) {
    doc.saveGraphicsState();
    gState = new (doc as any).GState({ opacity: layers[l] });
    doc.setGState(gState);
    doc.setFillColor(...BLUE);
    const lPts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      const r = radius * data[i].value * scales[l];
      lPts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    for (let i = 1; i < n - 1; i++) {
      doc.triangle(lPts[0][0], lPts[0][1], lPts[i][0], lPts[i][1], lPts[i + 1][0], lPts[i + 1][1], 'F');
    }
    doc.restoreGraphicsState();
  }

  // Outline
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.6);
  for (let i = 0; i < n; i++) {
    doc.line(polyPts[i][0], polyPts[i][1], polyPts[(i + 1) % n][0], polyPts[(i + 1) % n][1]);
  }

  // Data point circles
  for (const pt of polyPts) {
    doc.setFillColor(...WHITE);
    doc.circle(pt[0], pt[1], 1.2, 'F');
    doc.setFillColor(...BLUE);
    doc.circle(pt[0], pt[1], 0.7, 'F');
  }

  // Labels — increased offset to avoid collision
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const labelDist = radius + 10;
    const lx = cx + labelDist * Math.cos(angle);
    const ly = cy + labelDist * Math.sin(angle);
    const align = Math.cos(angle) < -0.3 ? 'right' : Math.cos(angle) > 0.3 ? 'left' : 'center';
    // Adjust bottom labels upward slightly to not collide with next section
    const yOffset = Math.sin(angle) > 0.5 ? -1 : 1;
    doc.text(data[i].label, lx, ly + yOffset, { align: align as any });
  }
}

function drawCertSeal(doc: jsPDF, cx: number, cy: number, r: number) {
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, r, 'S');
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r - 2, 'S');

  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('TECHNICAL', cx, cy - 3, { align: 'center' });
  doc.text('APPROVAL', cx, cy + 0.5, { align: 'center' });
  doc.setFontSize(3.5);
  doc.setFont('helvetica', 'normal');
  doc.text('EWI PRO CERTIFIED', cx, cy + 4, { align: 'center' });
}

function drawCautionBox(doc: jsPDF, x: number, y: number, w: number, text: string): number {
  // Set font BEFORE measuring text
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(text, w - 20);
  const h = lines.length * 3.8 + 14;

  // Amber tint background
  doc.setFillColor(...AMBER_BG);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setDrawColor(...AMBER_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 2, 2, 'S');

  // Warning icon — use simple text "!" instead of broken unicode
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...AMBER);
  doc.text('!', x + 6, y + 7);

  // Header
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 120, 10);
  doc.text('Important Notice', x + 12, y + 7);

  // Body
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(lines, x + 12, y + 13);

  return y + h + 4;
}

function drawStrengthBar(doc: jsPDF, x: number, y: number, score: number, maxWidth: number) {
  const barH = 4;
  const pct = Math.min(score / 100, 1);
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(x, y, maxWidth, barH, 2, 2, 'F');
  if (pct > 0) {
    doc.setFillColor(...BLUE);
    doc.roundedRect(x, y, Math.max(maxWidth * pct, 4), barH, 2, 2, 'F');
  }
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(`${score}`, x + maxWidth + 3, y + 3.5);
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  // On page 1, footer starts after sidebar
  const footerLeftX = 14;
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.3);
  doc.line(footerLeftX, pageH - 16, pageW - 14, pageH - 16);
  doc.setFontSize(6.5);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('EWI Pro  |  www.ewipro.com', footerLeftX, pageH - 11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 14, pageH - 11, { align: 'right' });
}

// ══════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════
export async function generatePdf(
  results: AssessmentResult,
  answers: AssessmentAnswers,
  logoDataUrl: string | null,
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const totalPages = 3;
  const reportId = generateReportId();
  const rightColW = pageW - RIGHT_X - 10;

  // ═══════════════════════ PAGE 1 ═══════════════════════
  drawDarkSidebar(doc);
  drawTopAccentLine(doc);

  // ── Sidebar content ──
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', 10, 18, 44, 22);
    } catch {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text('EWI Pro', SIDEBAR_W / 2, 30, { align: 'center' });
    }
  } else {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('EWI Pro', SIDEBAR_W / 2, 30, { align: 'center' });
  }

  // Sidebar divider
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.3);
  doc.line(15, 48, SIDEBAR_W - 15, 48);

  // Report ID
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('REPORT ID', SIDEBAR_W / 2, 58, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(reportId, SIDEBAR_W / 2, 65, { align: 'center' });

  // Issue date
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('ISSUE DATE', SIDEBAR_W / 2, 78, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(new Date().toLocaleDateString('en-GB'), SIDEBAR_W / 2, 85, { align: 'center' });

  // Confidential tag
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('CONFIDENTIAL', SIDEBAR_W / 2, pageH - 30, { align: 'center' });

  // ── Right column ──
  let y = 12;

  // Title
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('External Wall Insulation', RIGHT_X, y + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text('Technical Assessment', RIGHT_X, y + 13);
  y += 22;

  // ── Project Parameters Card ──
  const params: [string, string][] = [
    ['Building Type', answers.buildingType || 'Not specified'],
    ['Building Height', answers.buildingHeight ? `${answers.buildingHeight}m` : 'Not specified'],
    ['Fire Requirements', answers.fireRequirements.length > 0 ? answers.fireRequirements.join(', ') : 'None'],
    ['Fire Class', answers.fireClass || 'N/A'],
    ['Wall Type', answers.wallType || 'Not specified'],
    ['Building Age', answers.buildingAge || 'Not specified'],
    ['Moisture Issues', answers.moistureSymptoms.length > 0 ? answers.moistureSymptoms.join(', ') : 'None reported'],
    ['Thickness Limit', answers.hasThicknessLimit ? `${answers.maxThickness}mm` : 'No limit'],
    ['Cost Priority', answers.priorityCost >= 4 ? 'High' : 'Standard'],
  ];

  const paramH = params.length * 5.5 + 6;
  drawCard(doc, RIGHT_X, y, rightColW, paramH);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLUE);
  doc.text('PROJECT PARAMETERS', RIGHT_X + 5, y + 5);

  let py = y + 10;
  doc.setFontSize(7.5);
  params.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text(`${label}:`, RIGHT_X + 5, py);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(value, RIGHT_X + 45, py);
    py += 5.5;
  });
  y += paramH + 5;

  // ── Hero Recommendation Card ──
  const primary = results.recommendations.find((r) => r.tier === 'primary');
  if (primary) {
    const sys = SYSTEMS[primary.system.systemId];
    const prosCount = Math.min(sys.pros.length, 3);
    const consCount = Math.min(sys.cons.length, 2);
    const cardH = 78 + prosCount * 4.5 + consCount * 4.5;

    drawCard(doc, RIGHT_X, y, rightColW, cardH);
    drawGradientBorder(doc, RIGHT_X, y, rightColW);

    // System name (truncated to fit) + star icon
    let hy = y + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('*', RIGHT_X + 5, hy); // ASCII star instead of broken unicode

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    const maxNameW = rightColW - 42;
    const nameLines: string[] = doc.splitTextToSize(sys.fullName, maxNameW);
    const displayLines = nameLines.slice(0, 2); // max 2 lines
    doc.text(displayLines, RIGHT_X + 12, hy);

    // #1 RECOMMENDED badge
    const badge = '#1 RECOMMENDED';
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    const bw = doc.getTextWidth(badge) + 6;
    doc.setFillColor(...BLUE);
    doc.roundedRect(RIGHT_X + rightColW - bw - 5, hy - 5, bw, 6, 2, 2, 'F');
    doc.setTextColor(...WHITE);
    doc.text(badge, RIGHT_X + rightColW - bw - 5 + 3, hy - 1);

    // Circular gauge
    hy += 10;
    drawCircularGauge(doc, RIGHT_X + 20, hy + 10, 9, primary.system.totalScore, 100);

    // Glass-morphism pills — stacked vertically to avoid overflow
    const pillMaxW = rightColW - 50;
    const pillX = RIGHT_X + 40;
    drawGlassPill(doc, pillX, hy, 'L', 'Lambda', `${sys.lambdaValue} W/mK`, pillMaxW);
    drawGlassPill(doc, pillX, hy + 9, 'F', 'Fire', sys.fireClass, pillMaxW);
    drawGlassPill(doc, pillX, hy + 18, '$', 'Cost', `${sys.typicalCostRange[0]}-${sys.typicalCostRange[1]}/m2`, pillMaxW);

    hy += 32;

    // Key Strengths
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text('Key Strengths', RIGHT_X + 5, hy);
    hy += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    sys.pros.slice(0, prosCount).forEach((str) => {
      doc.setTextColor(...GREEN);
      doc.text('+', RIGHT_X + 7, hy); // ASCII checkmark replacement
      doc.setTextColor(...GRAY);
      const truncStr = truncateText(doc, str, rightColW - 20);
      doc.text(truncStr, RIGHT_X + 13, hy);
      hy += 4.5;
    });

    hy += 2;

    // Considerations
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text('Considerations', RIGHT_X + 5, hy);
    hy += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    sys.cons.slice(0, consCount).forEach((str) => {
      doc.setTextColor(...AMBER);
      doc.text('!', RIGHT_X + 7, hy); // ASCII warning replacement
      doc.setTextColor(...GRAY);
      const truncStr = truncateText(doc, str, rightColW - 20);
      doc.text(truncStr, RIGHT_X + 13, hy);
      hy += 4.5;
    });
  }

  addFooter(doc, 1, totalPages);

  // ═══════════════════════ PAGE 2 ═══════════════════════
  doc.addPage();
  drawTopAccentLine(doc);
  y = 10;

  // ── Radar Chart ──
  if (primary) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text('PERFORMANCE PROFILE', 16, y + 6);
    doc.setFillColor(...BLUE);
    doc.rect(16, y + 8, 40, 0.7, 'F');

    const sys = SYSTEMS[primary.system.systemId];
    const radarData = Object.entries(sys.features).map(([key, val]) => ({
      label: FEATURE_LABELS[key] || key,
      value: val,
    }));
    // Center radar in page, increase space for labels
    drawRadarChart(doc, pageW / 2, y + 48, 28, radarData);
    y += 92; // More space so bottom labels don't overlap next section

    // ── System Components ──
    const compEntries = Object.entries(sys.components);
    if (compEntries.length > 0) {
      const compCardH = compEntries.length * 5.5 + 12;
      drawCard(doc, 14, y, pageW - 28, compCardH);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BLUE);
      doc.text('SYSTEM COMPONENTS', 20, y + 6);

      let cy2 = y + 12;
      doc.setFontSize(7);
      const compLabels: Record<string, string> = {
        primer: 'Primer',
        adhesive: 'Adhesive',
        basecoat: 'Basecoat',
        mesh: 'Reinforcement Mesh',
        reinforcementDiscs: 'Reinforcement Discs',
        topcoatPrimer: 'Topcoat Primer',
        topcoat: 'Topcoat / Render',
      };
      compEntries.forEach(([key, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NAVY);
        doc.text(`${compLabels[key] || key}:`, 20, cy2);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAY);
        const truncVal = truncateText(doc, value, pageW - 80);
        doc.text(truncVal, 58, cy2);
        cy2 += 5.5;
      });
      y += compCardH + 4;
    }

    // ── Technical Notes ──
    const techNotes = sys.technicalNotes;
    if (techNotes && techNotes.length > 0) {
      const notesCardH = techNotes.length * 5 + 12;
      drawCard(doc, 14, y, pageW - 28, notesCardH);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BLUE);
      doc.text('TECHNICAL NOTES', 20, y + 6);

      let ny = y + 12;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      techNotes.forEach((note) => {
        doc.setTextColor(...GREEN);
        doc.text('•', 20, ny);
        doc.setTextColor(...GRAY);
        const truncNote = truncateText(doc, note, pageW - 50);
        doc.text(truncNote, 25, ny);
        ny += 5;
      });
      y += notesCardH + 4;
    }
  }

  // ── Alternatives ──
  const alternatives = results.recommendations.filter((r) => r.tier !== 'primary' && r.tier !== 'viable');
  if (alternatives.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text('ALTERNATIVE & ASPIRATIONAL OPTIONS', 16, y);
    doc.setFillColor(...BLUE);
    doc.rect(16, y + 1.5, 60, 0.7, 'F');
    y += 8;

    alternatives.forEach((rec) => {
      const sys = SYSTEMS[rec.system.systemId];
      const tierLabel = rec.tier === 'alternative' ? 'Strong Alternative' : 'Aspirational Upgrade';
      drawCard(doc, 14, y - 2, pageW - 28, 16);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NAVY);
      doc.text(sys.fullName, 20, y + 4);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...GRAY);
      doc.text(tierLabel, 20, y + 9);
      drawStrengthBar(doc, pageW - 60, y + 1, rec.system.totalScore, 32);
      y += 20;
    });
    y += 2;
  }

  addFooter(doc, 2, totalPages);

  // ═══════════════════════ PAGE 3 ═══════════════════════
  doc.addPage();
  drawTopAccentLine(doc);
  y = 10;

  // ── Scoring Breakdown Table ──
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('SCORING BREAKDOWN', 16, y);
  doc.setFillColor(...BLUE);
  doc.rect(16, y + 1.5, 40, 0.7, 'F');
  y += 6;

  const topScore = results.ranking.length > 0 ? results.ranking[0].totalScore : 0;

  autoTable(doc, {
    startY: y + 2,
    head: [['System', 'Base', 'Adj.', 'Total', '']],
    body: results.ranking.map((r) => [
      SYSTEMS[r.systemId].name,
      String(r.baseScore),
      `${r.contextualAdjustment >= 0 ? '+' : ''}${r.contextualAdjustment}`,
      String(r.totalScore),
      r.totalScore === topScore ? 'V' : '', // ASCII checkmark
    ]),
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5,
      lineColor: [240, 242, 245] as [number, number, number],
      lineWidth: 0,
    },
    headStyles: {
      fillColor: [NAVY[0], NAVY[1], NAVY[2]] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontSize: 7.5,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] as [number, number, number],
    },
    columnStyles: {
      4: { textColor: [GREEN[0], GREEN[1], GREEN[2]] as [number, number, number], fontStyle: 'bold', halign: 'center', cellWidth: 10 },
    },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 3) {
        const row = results.ranking[data.row.index];
        if (row && row.totalScore === topScore) {
          data.cell.styles.textColor = [BLUE[0], BLUE[1], BLUE[2]] as [number, number, number];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { left: 16, right: 16 },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ── Excluded Systems ──
  if (results.excluded.length > 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text('EXCLUDED SYSTEMS', 16, y);
    y += 5;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    results.excluded.forEach((ex) => {
      doc.text(`X  ${SYSTEMS[ex.systemId].name}: ${ex.humanReason}`, 20, y);
      y += 5;
    });
    y += 6;
  }

  // ── Caution Disclaimer (draw first so we know its height) ──
  const disclaimer =
    'This report is a preliminary automated assessment based on user-provided data. It does not replace a professional on-site survey. Final system specification must be verified by an EWI Pro technical consultant to ensure compliance with local building regulations and structural requirements.';
  const cautionBoxW = pageW - 28;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const cautionLines: string[] = doc.splitTextToSize(disclaimer, cautionBoxW - 16);
  const cautionBoxH = 12 + cautionLines.length * 3.5;
  drawCautionBox(doc, 14, y, cautionBoxW, disclaimer);
  const cautionBottomY = y + cautionBoxH;

  // ── Cert Seal (placed below caution box, right side) ──
  const sealR = 12;
  const sealCY = Math.min(cautionBottomY + sealR + 6, pageH - 18);
  drawCertSeal(doc, pageW - 28, sealCY, sealR);

  addFooter(doc, 3, totalPages);

  doc.save('EWI-Pro-Technical-Assessment.pdf');
}
