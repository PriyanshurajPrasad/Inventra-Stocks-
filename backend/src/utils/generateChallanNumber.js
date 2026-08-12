export const generateChallanNumber = (lastNumber) => {
  if (!lastNumber) {
    return 'CH-000001';
  }

  const numericPart = parseInt(lastNumber.split('-')[1], 10);
  const newNumericPart = numericPart + 1;
  const paddedNumber = String(newNumericPart).padStart(6, '0');
  
  return `CH-${paddedNumber}`;
};
