// export const RATES = {
//   car: { firstHour: 100, after: 50 },
//   ev: { firstHour: 80, after: 40 },
//   bike: { firstHour: 30, after: 10 },
// };

// export function calculateBill(startTime, now, vehicleType) {
//   const diffMs = now - startTime;
//   const minutes = Math.ceil(diffMs / 60000);
//   const hours = Math.ceil(minutes / 60);

//   const rate = RATES[vehicleType];

//   if (hours <= 1) {
//     return {
//       minutes,
//       hours,
//       amount: rate.firstHour,
//     };
//   }

//   const extraHours = hours - 1;
//   const total = rate.firstHour + extraHours * rate.after;

//   return {
//     minutes,
//     hours,
//     amount: total,
//   };
// }




export const RATES = {
  car: { firstHour: 100, after: 50 },
  ev: { firstHour: 80, after: 40 },
  bike: { firstHour: 30, after: 10 },
};

// 🔹 Config (real-world features)
const GRACE_PERIOD_MIN = 10;        // free 10 minutes
const MAX_DAILY_CAP = 500;         // max charge per day
const PEAK_HOURS = [9, 10, 11, 17, 18, 19]; // office hours

// 🔹 Check peak hour
function isPeakHour(date) {
  const hour = new Date(date).getHours();
  return PEAK_HOURS.includes(hour);
}

// 🔹 Main billing function
export function calculateBill(startTime, now, vehicleType) {
  try {
    if (!startTime || !now) throw new Error("Invalid time");
    if (!RATES[vehicleType]) throw new Error("Invalid vehicle type");

    const diffMs = now - startTime;

    if (diffMs <= 0) {
      return { minutes: 0, hours: 0, amount: 0 };
    }

    const minutes = Math.ceil(diffMs / 60000);

    // 🟢 Grace period (FREE)
    if (minutes <= GRACE_PERIOD_MIN) {
      return {
        minutes,
        hours: 0,
        amount: 0,
        note: "Free parking (grace period)",
      };
    }

    const hours = Math.ceil(minutes / 60);
    const rate = RATES[vehicleType];

    let total = rate.firstHour;

    if (hours > 1) {
      const extraHours = hours - 1;
      total += extraHours * rate.after;
    }

    // 🔥 Peak hour surge (+20%)
    if (isPeakHour(now)) {
      total *= 1.2;
    }

    // 🔋 EV Discount (extra 10%)
    if (vehicleType === "ev") {
      total *= 0.9;
    }

    // 💰 Daily cap
    total = Math.min(total, MAX_DAILY_CAP);

    return {
      minutes,
      hours,
      amount: Math.ceil(total),
      isPeak: isPeakHour(now),
    };

  } catch (err) {
    console.error("Billing error:", err.message);
    return {
      minutes: 0,
      hours: 0,
      amount: 0,
      error: err.message,
    };
  }
}