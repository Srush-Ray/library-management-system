export const sanitizeArray = (tempAr: any[]): any[] => {
  return tempAr?.filter((val) => val === false || !!val);
};
