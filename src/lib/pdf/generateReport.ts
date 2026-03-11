import jsPDF from 'jspdf';
import { CalculationResults, CalculatorData } from '../calculator/types';
import { UK_REGIONS, WALL_TYPES, FUEL_TYPES, HOUSE_TYPES, TARGET_U_VALUE } from '../calculator/constants';
import ewiproLogoUrl from '@/assets/ewipro-logo.png';
import ewiproSignetUrl from '@/assets/ewipro-signet.png';

// Colors
const NAVY = [25, 45, 75] as const;
const GREEN = [47, 133, 90] as const;
const EMERALD = [5, 150, 105] as const;
const RED = [220, 53, 69] as const;
const GREY = [120, 120, 120] as const;
const LIGHT_GREY = [245, 245, 245] as const;
const WHITE = [255, 255, 255] as const;

async function loadImageBase64(url: string): Promise<{ base64: string; width: number; height: number } | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject();
      reader.readAsDataURL(blob);
    });
    const dims: { width: number; height: number } = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 200, height: 80 });
      img.src = base64;
    });
    return { base64, ...dims };
  } catch {
    return null;
  }
}

function drawRoundedRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  r: number,
  fill: readonly [number, number, number],
  stroke?: readonly [number, number, number]
) {
  doc.setFillColor(fill[0], fill[1], fill[2]);
  if (stroke) {
    doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, w, h, r, r, 'FD');
  } else {
    doc.roundedRect(x, y, w, h, r, r, 'F');
  }
}

function drawCircle(
  doc: jsPDF,
  cx: number, cy: number, radius: number,
  fill: readonly [number, number, number]
) {
  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.circle(cx, cy, radius, 'F');
}

function drawGradientLine(
  doc: jsPDF,
  x1: number, y1: number, x2: number, y2: number,
  steps: number,
  fromColor: readonly [number, number, number],
  toColor: readonly [number, number, number]
) {
  const dx = (x2 - x1) / steps;
  const dy = (y2 - y1) / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const r = Math.round(fromColor[0] + (toColor[0] - fromColor[0]) * t);
    const g = Math.round(fromColor[1] + (toColor[1] - fromColor[1]) * t);
    const b = Math.round(fromColor[2] + (toColor[2] - fromColor[2]) * t);
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(3);
    doc.line(x1 + dx * i, y1 + dy * i, x1 + dx * (i + 1), y1 + dy * (i + 1));
  }
}

function drawBuildingSilhouette(doc: jsPDF, cx: number, y: number, houseTypeId: string) {
  doc.setFillColor(...NAVY);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.8);

  const w = 28;
  const baseY = y + 24;

  switch (houseTypeId) {
    case 'bungalow': {
      // Low wide shape
      const roofPeak = y + 4;
      const wallTop = y + 10;
      doc.triangle(cx - w / 2 - 3, wallTop, cx, roofPeak, cx + w / 2 + 3, wallTop, 'F');
      doc.rect(cx - w / 2, wallTop, w, baseY - wallTop, 'F');
      // Door
      doc.setFillColor(...WHITE);
      doc.rect(cx - 2.5, baseY - 8, 5, 8, 'F');
      // Windows
      doc.rect(cx - w / 2 + 3, wallTop + 4, 6, 5, 'F');
      doc.rect(cx + w / 2 - 9, wallTop + 4, 6, 5, 'F');
      break;
    }
    case 'semi-detached': {
      // Two joined halves
      const roofPeak = y + 2;
      const wallTop = y + 10;
      // Left half
      doc.triangle(cx - w / 2, wallTop, cx, roofPeak, cx, wallTop, 'F');
      doc.rect(cx - w / 2, wallTop, w / 2, baseY - wallTop, 'F');
      // Right half (slightly different shade)
      doc.setFillColor(45, 65, 95);
      doc.triangle(cx, wallTop, cx, roofPeak, cx + w / 2, wallTop, 'F');
      doc.rect(cx, wallTop, w / 2, baseY - wallTop, 'F');
      // Door & windows
      doc.setFillColor(...WHITE);
      doc.rect(cx - 3, baseY - 8, 5, 8, 'F');
      doc.rect(cx - w / 2 + 3, wallTop + 3, 5, 4, 'F');
      doc.rect(cx + w / 2 - 8, wallTop + 3, 5, 4, 'F');
      break;
    }
    case 'terraced':
    case 'end-terrace': {
      // Row of connected units
      const wallTop = y + 6;
      doc.rect(cx - w / 2 - 4, wallTop, w + 8, baseY - wallTop, 'F');
      // Flat roof line
      doc.setFillColor(35, 55, 85);
      doc.rect(cx - w / 2 - 4, wallTop, w + 8, 3, 'F');
      // Doors & windows
      doc.setFillColor(...WHITE);
      doc.rect(cx - 2, baseY - 7, 4, 7, 'F');
      doc.rect(cx - w / 2 - 1, wallTop + 5, 4, 4, 'F');
      doc.rect(cx + w / 2 - 3, wallTop + 5, 4, 4, 'F');
      // Divider lines
      doc.setDrawColor(...WHITE);
      doc.setLineWidth(0.3);
      doc.line(cx - w / 4, wallTop, cx - w / 4, baseY);
      doc.line(cx + w / 4, wallTop, cx + w / 4, baseY);
      break;
    }
    default: {
      // Detached — tall with peaked roof
      const roofPeak = y;
      const wallTop = y + 10;
      doc.triangle(cx - w / 2 - 2, wallTop, cx, roofPeak, cx + w / 2 + 2, wallTop, 'F');
      doc.rect(cx - w / 2, wallTop, w, baseY - wallTop, 'F');
      // Chimney
      doc.rect(cx + w / 4, roofPeak + 1, 3, 6, 'F');
      // Door
      doc.setFillColor(...WHITE);
      doc.rect(cx - 2.5, baseY - 8, 5, 8, 'F');
      // Windows (two floors)
      doc.rect(cx - w / 2 + 3, wallTop + 2, 5, 4, 'F');
      doc.rect(cx + w / 2 - 8, wallTop + 2, 5, 4, 'F');
      doc.rect(cx - w / 2 + 3, wallTop + 9, 5, 4, 'F');
      doc.rect(cx + w / 2 - 8, wallTop + 9, 5, 4, 'F');
      break;
    }
  }
}

export async function generateEWIReport(data: CalculatorData, results: CalculationResults): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Get reference data
  const houseType = HOUSE_TYPES.find(h => h.id === data.houseType);
  const region = UK_REGIONS.find(r => r.id === data.region);
  const fuelType = FUEL_TYPES.find(f => f.id === data.fuelType);

  // Load assets in parallel
  const [logoData, signetData] = await Promise.all([
    loadImageBase64(ewiproLogoUrl),
    loadImageBase64(ewiproSignetUrl),
  ]);

  // ── 1. WATERMARK (signet at 3% opacity) ──
  if (signetData) {
    const gState = new (doc as any).GState({ opacity: 0.03 });
    doc.saveGraphicsState();
    doc.setGState(gState);
    const signetSize = 160;
    const signetX = (pageWidth - signetSize) / 2;
    const signetY = (pageHeight - signetSize) / 2;
    doc.addImage(signetData.base64, 'PNG', signetX, signetY, signetSize, signetSize);
    doc.restoreGraphicsState();
  }

  // ── 2. NAVY HEADER BAR ──
  const headerH = 40;
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, headerH, 'F');

  // ── 3. LOGO (float on dark bar) + Title ──
  let logoBottomY = headerH;
  if (logoData) {
    const targetH = 22;
    const scaledW = (logoData.width / logoData.height) * targetH;
    const logoX = margin;
    const logoY = (headerH - targetH) / 2;
    doc.addImage(logoData.base64, 'PNG', logoX, logoY, scaledW, targetH);
    logoBottomY = logoY + targetH;
  }

  // Title + date on dark bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text('Property Energy Audit', pageWidth - margin, headerH / 2 - 2, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 210, 220);
  doc.text(
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    pageWidth - margin,
    headerH / 2 + 7,
    { align: 'right' }
  );

  // ── 4. SIDEBAR — Property Snapshot (right side) ──
  const sidebarW = 55;
  const sidebarX = pageWidth - margin - sidebarW;
  const sidebarY = headerH + 6;
  const sidebarH = 90;
  const mainContentRight = sidebarX - 6;

  drawRoundedRect(doc, sidebarX, sidebarY, sidebarW, sidebarH, 3, [240, 245, 250]);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Property Snapshot', sidebarX + sidebarW / 2, sidebarY + 10, { align: 'center' });

  // Divider
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.6);
  doc.line(sidebarX + 6, sidebarY + 14, sidebarX + sidebarW - 6, sidebarY + 14);

  let sy = sidebarY + 22;

  // Building
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text('BUILDING', sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(houseType?.name || '-', sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text(`${data.wallArea} m\u00b2 wall area`, sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 10;

  // Location
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text('LOCATION', sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(region?.name || '-', sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text(`HDD: ${region?.hdd || '-'}`, sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 10;

  // Energy
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text('ENERGY', sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(fuelType?.name || '-', sidebarX + sidebarW / 2, sy, { align: 'center' });
  sy += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text(`@ ${data.fuelPrice} ${fuelType?.unit || ''}`, sidebarX + sidebarW / 2, sy, { align: 'center' });

  // ── 5. SUMMARY CARDS (left/center area) ──
  let y = headerH + 10;
  const leftW = mainContentRight - margin;
  const cardW = (leftW - 4) / 2;
  const cardH = 36;

  // Card 1: Annual Savings
  drawRoundedRect(doc, margin, y, cardW, cardH, 3, [240, 253, 244]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text('Annual Savings', margin + cardW / 2, y + 10, { align: 'center' });
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text(`\u00a3${results.annualSavingsPounds.toLocaleString()}`, margin + cardW / 2, y + 22, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text('/year', margin + cardW / 2, y + 29, { align: 'center' });

  // Card 2: CO₂ Reduction
  const card2X = margin + cardW + 4;
  drawRoundedRect(doc, card2X, y, cardW, cardH, 3, [240, 253, 244]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  // Render "CO2 Reduction" with subscript-style "2"
  const co2Label = 'CO2 Reduction';
  doc.text(co2Label, card2X + cardW / 2, y + 10, { align: 'center' });
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  const co2Tonnes = (results.co2ReductionKg / 1000).toFixed(2);
  doc.text(`${co2Tonnes} t`, card2X + cardW / 2, y + 22, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 130, 100);
  doc.text(`= ${results.treesEquivalent} trees planted`, card2X + cardW / 2, y + 29, { align: 'center' });

  y += cardH + 6;

  // Card 3: 25-Year Net Profit (full width of left area)
  drawRoundedRect(doc, margin, y, leftW, cardH, 3, [209, 250, 229]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text('25-Year Net Profit', margin + leftW / 2, y + 10, { align: 'center' });
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text(`\u00a3${results.netProfit25Years.toLocaleString()}`, margin + leftW / 2, y + 24, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...EMERALD);
  doc.text(`${results.lifetimeROI}% ROI`, margin + leftW / 2, y + 32, { align: 'center' });

  y += cardH + 14;

  // ── 6. BUILDING SILHOUETTE + THE TRANSFORMATION ──
  const contentWidth = pageWidth - margin * 2;
  const silhouetteCx = margin + 20;
  drawBuildingSilhouette(doc, silhouetteCx, y, data.houseType);

  // Label under silhouette
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(houseType?.name || '', silhouetteCx, y + 30, { align: 'center' });

  // "The Transformation" title next to silhouette
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('The Transformation', margin + 45, y + 4);

  // U-value bar
  const barX = margin + 45;
  const barEndX = pageWidth - margin;
  const barW = barEndX - barX;
  const barH = 8;
  const barY = y + 10;

  drawRoundedRect(doc, barX, barY, barW, barH, 4, LIGHT_GREY);

  const uBefore = results.uValueBefore;
  const uAfter = results.uValueAfter;
  const improvement = ((uBefore - uAfter) / uBefore) * 100;
  const fillW = barW * (improvement / 100);
  drawRoundedRect(doc, barX, barY, fillW, barH, 4, GREEN);

  // Red circle (before)
  drawCircle(doc, barX - 2, barY + barH / 2, 8, RED);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(`${uBefore}`, barX - 2, barY + barH / 2 - 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('W/m\u00b2K', barX - 2, barY + barH / 2 + 3, { align: 'center' });

  // Green circle (after)
  drawCircle(doc, barEndX + 2, barY + barH / 2, 8, EMERALD);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(`${uAfter}`, barEndX + 2, barY + barH / 2 - 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('W/m\u00b2K', barEndX + 2, barY + barH / 2 + 3, { align: 'center' });

  // Caption
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...GREY);
  doc.text(
    `Achieved with ${data.insulationThickness}mm Grey EPS insulation (target: ${TARGET_U_VALUE} W/m\u00b2K)`,
    barX + barW / 2,
    barY + barH + 8,
    { align: 'center' }
  );

  y = barY + barH + 20;

  // ── 7. INVESTMENT TIMELINE (gradient infographic) ──
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Investment Timeline', margin, y);
  y += 12;

  const tlStartX = margin + 20;
  const tlEndX = pageWidth - margin - 20;
  const tlMidX = tlStartX + (tlEndX - tlStartX) * (results.paybackYears / 25);
  const tlY = y + 8;

  // Gradient line (grey → green)
  drawGradientLine(doc, tlStartX, tlY, tlEndX, tlY, 40, [180, 180, 180], GREEN);

  // Node 1: Today (r=5)
  drawCircle(doc, tlStartX, tlY, 5, NAVY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Today', tlStartX, tlY - 9, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text(`\u00a3${results.estimatedCost.toLocaleString()}`, tlStartX, tlY + 11, { align: 'center' });
  doc.text('Investment', tlStartX, tlY + 16, { align: 'center' });

  // Node 2: Break-even (r=7)
  drawCircle(doc, tlMidX, tlY, 7, GREEN);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text(`Year ${results.paybackYears}`, tlMidX, tlY - 11, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  doc.text('Break', tlMidX, tlY - 1, { align: 'center' });
  doc.text('even', tlMidX, tlY + 3, { align: 'center' });

  // Node 3: Year 25 (r=10 — biggest)
  drawCircle(doc, tlEndX, tlY, 10, GREEN);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text('Year 25', tlEndX, tlY - 14, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(`\u00a3${results.netProfit25Years.toLocaleString()}`, tlEndX, tlY + 1, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Net Profit', tlEndX, tlY + 6, { align: 'center' });

  y = tlY + 28;

  // ── 8. WHY EWI PRO? (energy reduction visualization) ──
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why EWI Pro?', margin, y);
  y += 8;

  const vizY = y;
  const vizH = 30;
  const maxBarW = 70;
  const beforeW = maxBarW;
  const afterW = maxBarW * (results.totalEnergyAfter / results.totalEnergyBefore);
  const barGap = 30;

  // Before bar (grey)
  const beforeX = margin;
  drawRoundedRect(doc, beforeX, vizY, beforeW, vizH, 2, [200, 200, 200]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('BEFORE', beforeX + beforeW / 2, vizY + 10, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`${results.totalEnergyBefore.toLocaleString()}`, beforeX + beforeW / 2, vizY + 19, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('kWh/year', beforeX + beforeW / 2, vizY + 25, { align: 'center' });

  // Arrow with percentage
  const arrowStartX = beforeX + beforeW + 4;
  const arrowEndX = arrowStartX + barGap - 8;
  const arrowY = vizY + vizH / 2;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(1.5);
  doc.line(arrowStartX, arrowY, arrowEndX, arrowY);
  // Arrowhead
  doc.setFillColor(...GREEN);
  doc.triangle(arrowEndX, arrowY - 2.5, arrowEndX + 4, arrowY, arrowEndX, arrowY + 2.5, 'F');
  // Percentage label
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text(`-${results.totalSavingsPercentage}%`, arrowStartX + (barGap - 8) / 2, arrowY - 5, { align: 'center' });

  // After bar (green, proportionally smaller)
  const afterX = beforeX + beforeW + barGap;
  drawRoundedRect(doc, afterX, vizY + (vizH - vizH * (afterW / beforeW)) / 2, afterW, vizH * (afterW / beforeW), 2, GREEN);
  const afterBarH = vizH * (afterW / beforeW);
  const afterBarY = vizY + (vizH - afterBarH) / 2;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('AFTER', afterX + afterW / 2, afterBarY + afterBarH / 2 - 3, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`${results.totalEnergyAfter.toLocaleString()}`, afterX + afterW / 2, afterBarY + afterBarH / 2 + 4, { align: 'center' });

  y = vizY + vizH + 14;

  // ── 9. FOOTER / DISCLAIMER ──
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Building Regs Compliant \u00b7 PAS2030 Standard', pageWidth / 2, y, { align: 'center' });

  y += 6;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(160, 160, 160);
  const disclaimer = 'This report provides estimates based on standard calculations and typical UK conditions. Actual savings may vary based on property-specific factors, occupancy patterns, and energy prices. EPC estimates are indicative — a formal assessment requires a certified energy assessor.';
  const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(splitDisclaimer, margin, y);

  // Save
  doc.save('EWI-Property-Energy-Audit.pdf');
}
