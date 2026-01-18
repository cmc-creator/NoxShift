import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export function ExportButtons({ onExportPDF, onExportExcel, onPrint }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onExportPDF}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 text-red-300 rounded-xl transition-all flex items-center gap-2 font-semibold"
        title="Export to PDF"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
      
      <button
        onClick={onExportExcel}
        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/40 text-green-300 rounded-xl transition-all flex items-center gap-2 font-semibold"
        title="Export to Excel"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span className="hidden sm:inline">Excel</span>
      </button>
      
      <button
        onClick={onPrint}
        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border-2 border-purple-500/40 text-purple-300 rounded-xl transition-all flex items-center gap-2 font-semibold"
        title="Print Schedule (Ctrl+P)"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </button>
    </div>
  );
}

export async function exportToPDF(elementId: string, filename: string = 'schedule.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#0f172a',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}

export function exportToExcel(data: any[], filename: string = 'schedule.csv') {
  if (!data.length) return;

  // Convert to CSV
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
