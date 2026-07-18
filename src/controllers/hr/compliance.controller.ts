import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { payrolls } from '../../models/hr/payroll.model.js';
import { users } from '../../models/hr/user.model.js';
import { eq, and, sql } from 'drizzle-orm';

export class ComplianceController {
  // 1. Get Summary
  getSummary = async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;
      if (!month || !year) throw new Error('Month and year are required');

      const summaryQuery = await db
        .select({
          totalEmployeePf: sql<number>`SUM(CAST(${payrolls.employeePf} AS numeric))`,
          totalEmployerPf: sql<number>`SUM(CAST(${payrolls.employerPf} AS numeric))`,
          totalEmployeeEsi: sql<number>`SUM(CAST(${payrolls.employeeEsi} AS numeric))`,
          totalEmployerEsi: sql<number>`SUM(CAST(${payrolls.employerEsi} AS numeric))`,
          totalPt: sql<number>`SUM(CAST(${payrolls.professionalTax} AS numeric))`,
          totalTds: sql<number>`SUM(CAST(${payrolls.tds} AS numeric))`
        })
        .from(payrolls)
        .where(
          and(
            eq(payrolls.payMonth, Number(month)),
            eq(payrolls.payYear, Number(year)),
            eq(payrolls.status, 'processed')
          )
        );

      const data = summaryQuery[0];
      res.json({
        success: true,
        data: {
          totalPf: Number(data.totalEmployeePf || 0) + Number(data.totalEmployerPf || 0),
          totalEsi: Number(data.totalEmployeeEsi || 0) + Number(data.totalEmployerEsi || 0),
          totalPt: Number(data.totalPt || 0),
          totalTds: Number(data.totalTds || 0)
        }
      });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  // 2. Generate EPF ECR File
  generateEpfEcr = async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;
      if (!month || !year) throw new Error('Month and year are required');

      const records = await db
        .select({
          uan: users.uanNumber,
          name: users.name,
          gross: payrolls.grossSalary,
          basic: payrolls.basicSalary,
          epf: payrolls.employeePf,
          eps: payrolls.employerPf,
          absentDays: sql<number>`0`
        })
        .from(payrolls)
        .leftJoin(users, eq(payrolls.employeeId, users.id))
        .where(
          and(
            eq(payrolls.payMonth, Number(month)),
            eq(payrolls.payYear, Number(year)),
            eq(payrolls.status, 'processed'),
            eq(users.pfApplicable, true)
          )
        );

      if (records.length === 0) {
        throw new Error('No PF applicable processed payrolls found for this month');
      }

      let ecrString = '';
      for (const r of records) {
        if (!r.uan) continue;
        const gross = Math.round(Number(r.gross));
        const epfWages = Math.min(Math.round(Number(r.basic)), 15000);
        const epsWages = epfWages;
        const edliWages = epfWages;
        const eeShare = Math.round(Number(r.epf));
        const epsShare = Math.round(epsWages * 0.0833);
        const erShare = eeShare - epsShare;
        const ncpDays = Number(r.absentDays || 0);

        ecrString += `${r.uan}#~#${r.name}#~#${gross}#~#${epfWages}#~#${epsWages}#~#${edliWages}#~#${eeShare}#~#${epsShare}#~#${erShare}#~#${ncpDays}#~#0\n`;
      }

      res.setHeader('Content-disposition', `attachment; filename=EPF_ECR_${month}_${year}.txt`);
      res.setHeader('Content-type', 'text/plain');
      res.send(ecrString);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  // 3. Generate ESI Report
  generateEsiReport = async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;
      if (!month || !year) throw new Error('Month and year are required');

      const records = await db
        .select({
          esiNumber: users.esiNumber,
          name: users.name,
          workedDays: sql<number>`30`,
          gross: payrolls.grossSalary
        })
        .from(payrolls)
        .leftJoin(users, eq(payrolls.employeeId, users.id))
        .where(
          and(
            eq(payrolls.payMonth, Number(month)),
            eq(payrolls.payYear, Number(year)),
            eq(payrolls.status, 'processed'),
            eq(users.esiApplicable, true)
          )
        );

      if (records.length === 0) {
        throw new Error('No ESI applicable processed payrolls found for this month');
      }

      let csvString = 'IP Number,IP Name,No Of Days Worked,Total Monthly Wages\n';
      for (const r of records) {
        if (!r.esiNumber) continue;
        csvString += `${r.esiNumber},${r.name},${r.workedDays},${Math.round(Number(r.gross))}\n`;
      }

      res.setHeader('Content-disposition', `attachment; filename=ESI_Report_${month}_${year}.csv`);
      res.setHeader('Content-type', 'text/csv');
      res.send(csvString);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };
}
