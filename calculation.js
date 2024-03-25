function loanData(loanAmount, yearlyInterest, months) {
  const monthlyInterestRate = yearlyInterest / (12 * 100);
  const EMI =
    [
      loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, months),
    ] / [Math.pow(1 + monthlyInterestRate, months) - 1];

  let remainingLoanAmount = loanAmount;

  let emiPaidPerYear = 0;
  let interestPaidPerYear = 0;
  let principlePaidPerYear = 0;
  let openingAmount = remainingLoanAmount;

  let totalIntrest = 0;
  // array to hold the schedule
  let schedule = [];
  for (
    let installmentNumber = 1;
    installmentNumber <= months;
    installmentNumber++
  ) {
    // calculate the interest for the current month
    let monthlyInterest = remainingLoanAmount * monthlyInterestRate;

    // calculate the principal for the current month
    let principal = EMI - monthlyInterest;

    // opening balance for the current month
    let intrestAmt = EMI - principal;

    totalIntrest += intrestAmt;

    interestPaidPerYear += intrestAmt;
    principlePaidPerYear += principal;
    emiPaidPerYear += EMI;

    // reduce the remaining loan amount from the principal
    remainingLoanAmount -= principal;

    if (installmentNumber % 12 == 0) {
      if (remainingLoanAmount <= 0) {
        remainingLoanAmount = 0;
      }

      let installment = {
        year: installmentNumber / 12,
        openingBalance: Math.round(openingAmount),
        emiPaid: Math.round(emiPaidPerYear),
        interestPaidPerYear: Math.round(interestPaidPerYear),
        principlePaidPerYear: Math.round(principlePaidPerYear),
        closingBalance: Math.round(remainingLoanAmount),
      };

      // resetting data for yearly calculation
      emiPaidPerYear = 0;
      interestPaidPerYear = 0;
      principlePaidPerYear = 0;
      openingAmount = remainingLoanAmount;

      schedule.push(installment);
    }
  }

  let basicDetails = {
    emi: Math.round(EMI),
    principal: loanAmount,
    intrest: Math.round(totalIntrest),
    finalPay: parseInt(loanAmount) + Math.round(totalIntrest),
  };

  return { emiData: schedule, basicData: basicDetails };
}

function calculateLoanData() {
  event.preventDefault();
  const loanAmount = document.getElementById("amount").value;
  const yearlyInterest = document.getElementById("rate").value;
  const months = parseInt(document.getElementById("tenure").value) * 12;

  const response = loanData(loanAmount, yearlyInterest, months);
  const basicData = response?.basicData;
  console.log("response", response);
  console.log("response12121", response.emiData);

  if (response.emiData.length > 0) {
    let tbl = "";
    response?.emiData?.forEach((data) => {
      console.log("tbl data>>>", data);

      tbl += "<tr class='active'>";
      tbl += "<td>" + data?.year + "</td>";
      tbl += "<td>" + data?.openingBalance + "</td>";
      tbl += "<td>" + data?.emiPaid + "</td>";
      tbl += "<td>" + data?.interestPaidPerYear + "</td>";
      tbl += "<td>" + data?.principlePaidPerYear + "</td>";
      tbl += "<td>" + data?.closingBalance + "</td>";
      tbl += "</tr>";
    });

    console.log("tbl>>>", tbl);

    document.getElementById("table_wrapper").innerHTML = tbl;
    document.getElementById("emi").innerHTML = basicData?.emi;
    document.getElementById("principle").innerHTML = basicData?.principal;
    document.getElementById("intrestAmt").innerHTML = basicData?.intrest;
    document.getElementById("total").innerHTML = basicData?.finalPay;
  }
}
