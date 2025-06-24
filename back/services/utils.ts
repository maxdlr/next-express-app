export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(1, "0");

  return `${year}-${month}-${day}`;
};

export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomDate = (startDate: Date, endDate: Date): Date => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const rand = start + Math.random() * (end - start);
  return new Date(rand);
};
