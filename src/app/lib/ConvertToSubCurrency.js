export const convertToSubCurrency = (amount) => {
    // Multiply by 100 to convert dollars to cents
    // Use Math.round to handle floating point precision issues
    return Math.round(amount * 100);
};