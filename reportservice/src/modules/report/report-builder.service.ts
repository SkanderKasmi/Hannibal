// src/modules/report/report-builder.service.ts
import { Injectable } from '@nestjs/common';
import { MetricsSnapshotDto } from '../../interfaces/metrics-snapshot.interface';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportBuilderService {
  /**
   * Build a PDF buffer from metrics timeseries.
   */
  async buildPdfReport(input: {
    title: string;
    vmName?: string;
    resourceGroupName?: string;
    from: Date;
    to: Date;
    metrics: MetricsSnapshotDto[];
  }): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    const endPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    // Header
    doc.fontSize(18).text(input.title, { align: 'center' });
    doc.moveDown();

    if (input.vmName) {
      doc.fontSize(12).text(`VM: ${input.vmName}`);
    }
    if (input.resourceGroupName) {
      doc.fontSize(12).text(`Resource Group: ${input.resourceGroupName}`);
    }
    doc
      .fontSize(10)
      .text(
        `Period: ${input.from.toISOString()} → ${input.to.toISOString()}`,
      );
    doc.moveDown();

    // Simple stats summary
    const cpuAvg =
      input.metrics.reduce((s, m) => s + m.cpuLoad, 0) /
      (input.metrics.length || 1);
    const memAvg =
      input.metrics.reduce((s, m) => s + m.memoryUsagePercent, 0) /
      (input.metrics.length || 1);
    const diskAvg =
      input.metrics.reduce((s, m) => s + m.diskUsedPercent, 0) /
      (input.metrics.length || 1);

    doc.fontSize(12).text('Summary:', { underline: true });
    doc
      .fontSize(10)
      .text(`Average CPU Load: ${cpuAvg.toFixed(2)} %`)
      .text(`Average Memory Usage: ${memAvg.toFixed(2)} %`)
      .text(`Average Disk Usage: ${diskAvg.toFixed(2)} %`);
    doc.moveDown();

    // Table header
    doc.fontSize(12).text('Samples:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(9);

    doc.text(
      'Timestamp                      CPU%   MEM%   DISK%   NetRx   NetTx',
    );
    doc.moveDown(0.3);

    input.metrics.forEach((m) => {
      doc.text(
        `${m.timestamp.padEnd(28)} ${m.cpuLoad
          .toFixed(1)
          .padStart(5)} ${m.memoryUsagePercent
          .toFixed(1)
          .padStart(6)} ${m.diskUsedPercent
          .toFixed(1)
          .padStart(7)} ${m.networkRx
          .toFixed(0)
          .padStart(7)} ${m.networkTx.toFixed(0).padStart(7)}`,
      );
    });

    doc.end();
    return endPromise;
  }

  /**
   * Build an Excel buffer from metrics timeseries.
   */
  async buildExcelReport(input: {
    title: string;
    vmName?: string;
    resourceGroupName?: string;
    from: Date;
    to: Date;
    metrics: MetricsSnapshotDto[];
  }): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Hannibal Platform';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Metrics');

    sheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 24 },
      { header: 'CPU %', key: 'cpuLoad', width: 10 },
      { header: 'Memory %', key: 'memoryUsagePercent', width: 12 },
      { header: 'Disk %', key: 'diskUsedPercent', width: 10 },
      { header: 'Network Rx', key: 'networkRx', width: 14 },
      { header: 'Network Tx', key: 'networkTx', width: 14 },
      { header: 'OS', key: 'os', width: 16 },
      { header: 'VM ID', key: 'vmId', width: 26 },
      { header: 'RG ID', key: 'resourceGroupId', width: 26 },
    ];

    input.metrics.forEach((m) => sheet.addRow(m));

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
