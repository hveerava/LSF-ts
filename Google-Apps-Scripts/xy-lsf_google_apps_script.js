/*
'***************************************************************************************
' Least-Squares Fitting for Modern Physics Lab.
' This version permits error bars on both the X and the Y data point values.
' The routine iterates some number of times to find the best slope for converting
' the X error to an effective Y error.
'
' Original author: Harshitha Veeravalli (CMU Computational Physics 2026)
'
*/
/*
Attaching script to button on sheet:
1. Add button on google sheet using 'Insert>Drawing'
2. Click the three dots on the button after inserting and click 'Assign Script'
3. Type the name of the FUNCTION <function name> to attach to the button and 'OK'.
*/

function xylsf() { // <function name> for X & Y error bars
    // getting active sheet from spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var N = sheet.getRange("B7").getValue();
    var row = 10; // unique to CMU LSF sheet
    var col = 9; // unique to CMU LSF sheet
    var x = [];
    var y = [];
    var yerr = [];
    var xerr = [];
    // Final output values corresponding to different aspects of best fit line
    var a, b, aerr, berr, ChiSqr;
    var S, Sx, Sy, Sxx, Sxy, D;
    
    // Pushing all relevant values in a column into respective arrays
    for (var i = 1; i <= N+11; i++) {
      var cell1 = sheet.getRange(row+i,1).getValue(); // using for x.push
      var cell2 = sheet.getRange(row+i,3).getValue(); // using for y.push
      var cell3 = sheet.getRange(row+i,2).getValue(); // using for xerr.push
      var cell4 = sheet.getRange(row+i,4).getValue(); // using for yerr.push
      var number1 = parseFloat(cell1);
      var number2 = parseFloat(cell2);
      var number3 = parseFloat(cell3);
      var number4 = parseFloat(cell4);
      x.push(number1);
      y.push(number2);
      xerr.push(number3);
      yerr.push(number4);
    }
  
    // Math for best fit line values
    var b = 0;
    for (var iter = 1; iter <= 5; iter++) {
      S = 0; Sx = 0; Sy = 0; Sxx = 0; Sxy = 0;
      for (var i = 0; i < N; i++) {
        var errSq = Math.pow(yerr[i], 2) + Math.pow(b * xerr[i], 2);
        S += 1 / errSq;
        Sx += x[i] / errSq;
        Sy += y[i] / errSq;
        Sxx += Math.pow(x[i], 2) / errSq;
        Sxy += x[i] * y[i] / errSq;
      }
      D = S * Sxx - Math.pow(Sx, 2);
      b = (S * Sxy - Sx * Sy) / D;
    }
  
    a = (Sxx * Sy - Sx * Sxy) / D;
    b = (S * Sxy - Sx * Sy) / D;
    aerr = Math.sqrt(Sxx / D);
    berr = Math.sqrt(S / D);
    ChiSqr = 0;
  
    for (var i = 0; i < N; i++) {
      var errSq = Math.pow(yerr[i], 2) + Math.pow(b * xerr[i], 2);
      ChiSqr += Math.pow((y[i] - a - b * x[i]), 2) / errSq;
    }
  
    sheet.getRange(11, 9).setValue(a);
    sheet.getRange(12, 9).setValue(b);
    sheet.getRange(13, 9).setValue(aerr);
    sheet.getRange(14, 9).setValue(berr);
    sheet.getRange(15, 9).setValue(ChiSqr / (N - 2));
    sheet.getRange("L3").setValue(new Date());
    var estTimeZone = Session.getScriptTimeZone(); 
    var estDate = Utilities.formatDate(new Date(), estTimeZone, "HH:mm:ss"); 
    sheet.getRange("L4").setValue(estDate);
    //sheet.getRange("L4").setValue(new Date());
    
    for (var i = 0; i < N; i++) {
      var yfit = a + b * x[i];
      sheet.getRange(row + i + 1, 6).setValue(yfit);
      sheet.getRange(row + i + 1, 5).setValue((y[i] - yfit) / yerr[i]);
    }
  }