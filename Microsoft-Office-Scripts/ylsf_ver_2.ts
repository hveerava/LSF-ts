/**
 * Least-Squares Fitting for Modern Physics Lab.
 * This version permits error bars on only the Y data point values.
 *
 * Original author: Harshitha Veeravalli (CMU Computational Physics 2026)
 */

function xlsf() {
    let i, N, col, row;
    let x: number[] = new Array(1100);
    let y: number[] = new Array(1100);
    let yerr: number[] = new Array(1100);
    let a, b, aerr, berr, ChiSqr;
    let S, Sx, Sy, Sxx, Sxy, D;
    N = parseInt(ExcelScript.Cells(7, 2).getValue().toString());
    row = 10; col = 9;
    for (i = 1; i <= N; i++) {
        x[i] = parseFloat(ExcelScript.Cells(10 + i, 1).getValue().toString());
        y[i] = parseFloat(ExcelScript.Cells(10 + i, 3).getValue().toString());
        yerr[i] = parseFloat(ExcelScript.Cells(10 + i, 4).getValue().toString());
    }
    S = 0; Sx = 0; Sy = 0; Sxx = 0; Sxy = 0;
    for (i = 1; i <= N; i++) {
        S = S + 1 / Math.pow(yerr[i], 2);
        Sx = Sx + x[i] / Math.pow(yerr[i], 2);
        Sy = Sy + y[i] / Math.pow(yerr[i], 2);
        Sxx = Sxx + Math.pow(x[i] / yerr[i], 2);
        Sxy = Sxy + x[i] * y[i] / Math.pow(yerr[i], 2);
    }
    D = S * Sxx - Math.pow(Sx, 2);
    a = (Sxx * Sy - Sx * Sxy) / D;
    b = (S * Sxy - Sx * Sy) / D;
    aerr = Math.sqrt(Sxx / D);
    berr = Math.sqrt(S / D);
    ChiSqr = 0;
    for (i = 1; i <= N; i++) {
        ChiSqr = ChiSqr + Math.pow((y[i] - a - b * x[i]) / yerr[i], 2);
    }
    ExcelScript.Cells(row + 1, col).setValue(a);
    ExcelScript.Cells(row + 2, col).setValue(b);
    ExcelScript.Cells(row + 3, col).setValue(aerr);
    ExcelScript.Cells(row + 4, col).setValue(berr);
    ExcelScript.Cells(row + 5, col).setValue(ChiSqr / (N - 2));
    ExcelScript.Cells(3, 12).setValue(new Date().toISOString());
    ExcelScript.Cells(4, 12).setValue(new Date().toLocaleTimeString());
    for (i = 1; i <= N; i++) {
        let yfit = a + b * x[i];
        ExcelScript.Cells(10 + i, 6).setValue(yfit);
        ExcelScript.Cells(10 + i, 5).setValue((y[i] - yfit) / yerr[i]);
    }
}