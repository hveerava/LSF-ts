/*
'***************************************************************************************
' Least-Squares Fitting for Modern Physics Lab.
' This version permits error bars on only the Y data point values.
'
' Original author: Harshitha Veeravalli (CMU Computational Physics 2026)
'
*/
// another change to see if git updates
async function ylsf(): Promise<void> {
  let sheet: Excel.Worksheet = await Excel.run(async (context: Excel.RequestContext) => {
    let sheet = context.workbook.worksheets.getActiveWorksheet();
    await context.sync();
    return sheet;
  });

  let N: number;
  let row: number = 10;
  let col: number = 9;
  let x: number[] = [];
  let y: number[] = [];
  let yerr: number[] = [];
  let a: number, b: number, aerr: number, berr: number, ChiSqr: number;
  let S: number = 0, Sx: number = 0, Sy: number = 0, Sxx: number = 0, Sxy: number = 0, D: number = 0;

  await Excel.run(async (context: Excel.RequestContext) => {
    let sheet = context.workbook.worksheets.getActiveWorksheet();
    let NRange: Excel.Range = sheet.getRange("B7");
    NRange.load("values");
    await context.sync();
    N = NRange.values[0][0];

    for (let i = 1; i <= N + 11; i++) {
      let cell1: Excel.Range = sheet.getRange(row + i, 1);
      let cell2: Excel.Range = sheet.getRange(row + i, 3);
      let cell3: Excel.Range = sheet.getRange(row + i, 4);
      cell1.load("values");
      cell2.load("values");
      cell3.load("values");
      await context.sync();
      let number1: number = parseFloat(cell1.values[0][0]);
      let number2: number = parseFloat(cell2.values[0][0]);
      let number3: number = parseFloat(cell3.values[0][0]);
      x.push(number1);
      y.push(number2);
      yerr.push(number3);
    }
  });

  for (let i = 0; i < N; i++) {
    S += 1 / Math.pow(yerr[i], 2);
    Sx += x[i] / Math.pow(yerr[i], 2);
    Sy += y[i] / Math.pow(yerr[i], 2);
    Sxx += Math.pow(x[i] / yerr[i], 2);
    Sxy += x[i] * y[i] / Math.pow(yerr[i], 2);
  }

  D = S * Sxx - Math.pow(Sx, 2);

  a = (Sxx * Sy - Sx * Sxy) / D;
  b = (S * Sxy - Sx * Sy) / D;
  aerr = Math.sqrt(Sxx / D);
  berr = Math.sqrt(S / D);
  ChiSqr = 0;

  for (let i = 0; i < N; i++) {
    ChiSqr += Math.pow((y[i] - a - b * x[i]) / yerr[i], 2);
  }

  await Excel.run(async (context: Excel.RequestContext) => {
    let sheet = context.workbook.worksheets.getActiveWorksheet();
    let rangeA: Excel.Range = sheet.getRange(row + 1, col);
    let rangeB: Excel.Range = sheet.getRange(row + 2, col);
    let rangeAerr: Excel.Range = sheet.getRange(row + 3, col);
    let rangeBerr: Excel.Range = sheet.getRange(row + 4, col);
    let rangeChiSqr: Excel.Range = sheet.getRange(row + 5, col);
    let rangeL3: Excel.Range = sheet.getRange("L3");
    let rangeL4: Excel.Range = sheet.getRange("L4");

    rangeA.values = [[a]];
    rangeB.values = [[b]];
    rangeAerr.values = [[aerr]];
    rangeBerr.values = [[berr]];
    rangeChiSqr.values = [[ChiSqr / (N - 2)]];
    rangeL3.values = [[new Date().toISOString()]];
    rangeL4.values = [[new Date().toLocaleTimeString()]];

    for (let i = 0; i < N; i++) {
      let yfit: number = a + b * x[i];
      let rangeYfit: Excel.Range = sheet.getRange(row + i + 1, 6);
      let rangeResidual: Excel.Range = sheet.getRange(row + i + 1, 5);
      rangeYfit.values = [[yfit]];
      rangeResidual.values = [[(y[i] - yfit) / yerr[i]]];
    }
    await context.sync();
  });
}