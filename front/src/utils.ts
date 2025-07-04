const toTitle = (title: string) =>
  title.charAt(0).toUpperCase() + title.substring(1);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(1, "0");

  return `${year}-${month}-${day}`;
};

export const Utils = {
  toTitle,
  formatDate,
};
