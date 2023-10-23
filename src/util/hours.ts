export const addHours = (superDate: Date, hours: number, minutes: number) => {
  superDate.setHours(
    superDate.getHours() + hours,
    superDate.getMinutes() + minutes
  );

  return superDate;
};

export const eleminateHours = (date: Date, hours: number, minutes: number) => {
  date.setHours(date.getHours() - hours, date.getMinutes() + minutes);

  return date;
};
