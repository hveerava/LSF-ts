/*
'***************************************************************************************
' Least-Squares Fitting for Modern Physics Lab.
' This version permits error bars on only the Y data point values.
'
' Original author: Harshitha Veeravalli (CMU Computational Physics 2026)
'
*/
function ylsf() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var N = sheet.getRange("B7").getValue();
    var row = 10;
    var col = 9;
    var x = [];
    var y = [];
    var yerr = [];
    var a, b, aerr, berr, ChiSqr;
    var S = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0, D = 0;
    
    for (var i = 1; i <= N+11; i++) {
      var cell1 = sheet.getRange(row+i,1).getValue(); // x.push
      var cell2 = sheet.getRange(row+i,3).getValue(); // y.push
      var cell3 = sheet.getRange(row+i,4).getValue(); // xerr.push
      var number1 = parseFloat(cell1);
      var number2 = parseFloat(cell2);
      var number3 = parseFloat(cell3);
      x.push(number1);
      y.push(number2);
      yerr.push(number3);
    }
  
    for (var i = 0; i < N; i++) {
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
  
    for (var i = 0; i < N; i++) {
      ChiSqr += Math.pow((y[i] - a - b * x[i]) / yerr[i], 2);
    }
  
    sheet.getRange(row + 1, col).setValue(a);
    sheet.getRange(row + 2, col).setValue(b);
    sheet.getRange(row + 3, col).setValue(aerr);
    sheet.getRange(row + 4, col).setValue(berr);
    sheet.getRange(row + 5, col).setValue(ChiSqr / (N - 2));
    sheet.getRange("L3").setValue(new Date());
    var estTimeZone = Session.getScriptTimeZone(); 
    var estDate = Utilities.formatDate(new Date(), estTimeZone, "HH:mm:ss"); 
    sheet.getRange("L4").setValue(estDate);
    
    for (var i = 0; i < N; i++) {
      var yfit = a + b * x[i];
      sheet.getRange(row + i + 1, 6).setValue(yfit);
      sheet.getRange(row + i + 1, 5).setValue((y[i] - yfit) / yerr[i]);
    }
  }