import asyncHandler from "express-async-handler";
import Machine from "../models/Machine.js";
import Visit from "../models/Visit.js";



// @desc    Add a new visit for a machine
// @route   POST /api/machines/visit
export const addVisit = asyncHandler(async (req, res) => {
  const { serialNumber, reportSummary, actualVisitDate } = req.body;

  // 1. Find the machine by its serial number first
  const machine = await Machine.findOne({
    serialNumber: serialNumber.trim().toUpperCase(),
  });

  if (!machine) {
    res.status(404);
    throw new Error(`Machine with Serial Number [${serialNumber}] not found`);
  }
  // check if the visit already exists for the same machine and date (optional, based on your requirements)
  const searchDate = actualVisitDate ? new Date(actualVisitDate) : new Date();
  const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

  const existingVisit = await Visit.findOne({
    machineId: machine._id,
    actualVisitDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (existingVisit) {
    res.status(400); // Bad Request
    throw new Error(
      `A visit for machine [${serialNumber}] already exists on this date`,
    );
  }

  // 2. Create the visit using the ID we just found
  const visit = await Visit.create({
    machineId: machine._id,
    reportSummary,
    actualVisitDate: actualVisitDate || new Date(),
    visitCost: 1066.66,
  });

  res.status(201).json({
    success: true,
    message: "Visit recorded successfully",
    data: {
      visit,
      machineInfo: {
        serialNumber: machine.serialNumber,
        branch: machine.branchName,
      },
    },
  });
});

// @desc    Get all visits for a machine
export const getVisitsByMachineId = asyncHandler(async (req, res) => {
  // First, verify the machine exists
  const machine = await Machine.findById({ _id: req.params.machineId }).lean();
  if (!machine) {
    res
      .status(404)
      .json({ success: false, message: "not found machine with this ID" });
    return;
  }
  // Then, fetch visits for that machine
  const visits = await Visit.find({ machineId: req.params.machineId })
    .sort({ actualVisitDate: -1 })
    .lean();

  if (!visits) {
    res.status(404);
    throw new Error("No visits found for this machine");
  }

  res.status(200).json({
    success: true,
    message: "Visits retrieved successfully",
    count: visits.length,
    data: visits,
  });
});
// @desc    Get regional report with financials and compliance status
export const getRegionalReport = asyncHandler(async (req, res) => {
  const { region } = req.params;

  // Define the 4-month rolling window
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  // Find all machines in the specified region (case-insensitive)
  const machines = await Machine.find({
    region: new RegExp(region, "i"),
  }).lean();

  if (machines.length === 0) {
    res.status(404);
    throw new Error(`No machines found in region: ${region}`);
  }

  let totalVisitsPerformed = 0;
  let totalMissedVisits = 0;
  const VISIT_PRICE = 1066.66;

  const machineDetails = await Promise.all(
    machines.map(async (machine) => {
      // Fetch visits within the last 4 months for this machine
      const visits = await Visit.find({
        machineId: machine._id,
        actualVisitDate: { $gte: fourMonthsAgo },
      })
        .sort({ actualVisitDate: -1 })
        .lean();

      // Compliance Logic: 2 visits required per 4 months
      const requiredVisits = 2;
      const missedVisits = Math.max(0, requiredVisits - visits.length);

      totalVisitsPerformed += visits.length;
      totalMissedVisits += missedVisits;

      return {
        serialNumber: machine.serialNumber,
        branchName: machine.branchName,
        status: visits.length >= 2 ? "Covered ✅" : "Incomplete ⚠️",
        visitCount: visits.length,
        missedVisits: missedVisits,
        deficitAmount: (missedVisits * VISIT_PRICE).toFixed(2),
        lastVisitDate:
          visits.length > 0 ? visits[0].actualVisitDate : "No records",
      };
    }),
  );

  // Financial Totals
  const totalActualRevenue = totalVisitsPerformed * VISIT_PRICE;
  const totalDeficitAmount = totalMissedVisits * VISIT_PRICE;

  res.status(200).json({
    success: true,
    region: region.toUpperCase(),
    summary: {
      totalMachines: machines.length,
      visitsPerformed: totalVisitsPerformed,
      visitsMissed: totalMissedVisits,
      financials: {
        visitPrice: VISIT_PRICE,
        actualRevenue: totalActualRevenue.toFixed(2),
        totalDeficit: totalDeficitAmount.toFixed(2),
      },
    },
    data: machineDetails,
  });
});

// @desc    Get maintenance report for all machines (The 4-Month Logic)
// @route   GET /api/machines/report
export const getMaintenanceReport = asyncHandler(async (req, res) => {
  const machines = await Machine.find({}).lean();
  // : Calculate dates once outside the loop
  const now = new Date();
  const midPoint = new Date();
  midPoint.setMonth(now.getMonth() - 2);
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(now.getMonth() - 4);

  // Using Promise.all for faster execution when having many machines
  const report = await Promise.all(
    machines.map(async (machine) => {
      const visits = await Visit.find({
        machineId: machine._id,
        actualVisitDate: { $gte: fourMonthsAgo },
      })
        .sort({ actualVisitDate: 1 })
        .lean();

      // Extracting visit months for better reporting (Optional)
      const visitMonths = visits.map((v) => {
        return v.actualVisitDate.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });
      });

      const firstPeriodVisits = visits.filter(
        (v) => v.actualVisitDate < midPoint,
      );
      const secondPeriodVisits = visits.filter(
        (v) => v.actualVisitDate >= midPoint,
      );

      const isCovered =
        firstPeriodVisits.length > 0 && secondPeriodVisits.length > 0;

      return {
        serialNumber: machine.serialNumber,
        branch: machine.branchName,
        region: machine.region,
        status: isCovered ? "Covered ✅" : "Overdue ❌",
        compliance: {
          period1: firstPeriodVisits.length > 0,
          period2: secondPeriodVisits.length > 0,
        },
        lastVisit:
          visits.length > 0 ? visits[visits.length - 1].actualVisitDate : null,
      };
    }),
  );

  res.status(200).json({
    success: true,
    message: "Maintenance report generated successfully",
    count: report.length,
    data: report,
  });
});
