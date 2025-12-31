export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateDaysUntilExpiry = (expirationDate: string): number => {
  return Math.ceil(
    (new Date(expirationDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
};
