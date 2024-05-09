/**
 * Least-Squares Fitting for Modern Physics Lab.
 * This version permits error bars on only the Y data point values.
 *
 * Original author: Harshitha Veeravalli (CMU Computational Physics 2026)
 */
// another change to see if git updates.
function ylsf() {
    let sheet = Excel.run(function (context) {
        let activeSheet = context.workbook.worksheets.getActiveWorksheet();
        return activeSheet;
    });

    let N = sheet.getRange("B7").load("values");
    let row = 10;
    let col = 9;
    let x = [];
    let y = [];
    let yerr = [];
    let a, b, aerr, berr, ChiSqr;
    let S = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0, D = 0;

    return Excel.run(function (context) {
        return context.sync()
            .then(function () {
                for (let i = 1; i <= N.values[0][0] + 11; i++) {
                    let cell1 = sheet.getRange(row + i, 1).load("values");
                    let cell2 = sheet.getRange(row + i, 3).load("values");
                    let cell3 = sheet.getRange(row + i, 4).load("values");
                    return context.sync()
                        .then(function () {
                            let number1 = parseFloat(cell1.values[0][0]);
                            let number2 = parseFloat(cell2.values[0][0]);
                            let number3 = parseFloat(cell3.values[0][0]);
                            x.push(number1);
                            y.push(number2);
                            yerr.push(number3);
                        });
                }

                for (let i = 0; i < N.values[0][0]; i++) {
                    S += 1 / (yerr[i] * yerr[i]);
                    Sx += x[i] / (yerr[i] * yerr[i]);
                    Sy += y[i] / (yerr[i] * yerr[i]);
                    Sxx += (x[i] / yerr[i]) * (x[i] / yerr[i]);
                    Sxy += (x[i] * y[i]) / (yerr[i] * yerr[i]);
                }

                D = S * Sxx - Sx * Sx;

                a = (Sxx * Sy - Sx * Sxy) / D;
                b = (S * Sxy - Sx * Sy) / D;
                aerr = Math.sqrt(Sxx / D);
                berr = Math.sqrt(S / D);
                ChiSqr = 0;

                for (let i = 0; i < N.values[0][0]; i++) {
                    ChiSqr += ((y[i] - a - b * x[i]) / yerr[i]) * ((y[i] - a - b * x[i]) / yerr[i]);
                }

                let aRange = sheet.getRange(row + 1, col);
                let bRange = sheet.getRange(row + 2, col);
                let aerrRange = sheet.getRange(row + 3, col);
                let berrRange = sheet.getRange(row + 4, col);
                let ChiSqrRange = sheet.getRange(row + 5, col);
                let dateRange = sheet.getRange("L3");
                let timeRange = sheet.getRange("L4");

                aRange.values = [[a]];
                bRange.values = [[b]];
                aerrRange.values = [[aerr]];
                berrRange.values = [[berr]];
                ChiSqrRange.values = [[ChiSqr / (N.values[0][0] - 2)]];
                dateRange.values = [[new Date()]];
                let estTimeZone = (new Date()).getTimezoneOffset();
                let estDate = Utilities.formatDate(new Date(), estTimeZone, "HH:mm:ss");
                timeRange.values = [[estDate]];

                for (let i = 0; i < N.values[0][0]; i++) {
                    let yfit = a + b * x[i];
                    let yfitRange = sheet.getRange(row + i + 1, 6);
                    let residualRange = sheet.getRange(row + i + 1, 5);
                    yfitRange.values = [[yfit]];
                    residualRange.values = [[(y[i] - yfit) / yerr[i]]];
                }
            });
    });
}
