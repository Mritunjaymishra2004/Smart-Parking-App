export const RATES = {
  car: { firstHour: 100, after: 50 },
  ev: { firstHour: 80, after: 40 },
  bike: { firstHour: 30, after: 10 },
};

export function calculateBill(startTime, now, vehicleType) {
  const diffMs = now - startTime;
  const minutes = Math.ceil(diffMs / 60000);
  const hours = Math.ceil(minutes / 60);

  const rate = RATES[vehicleType];

  if (hours <= 1) {
    return {
      minutes,
      hours,
      amount: rate.firstHour,
    };
  }

  const extraHours = hours - 1;
  const total = rate.firstHour + extraHours * rate.after;

  return {
    minutes,
    hours,
    amount: total,
  };
}