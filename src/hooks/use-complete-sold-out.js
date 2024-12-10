export function useCheckCompleteSoldOut(variants) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return false;
  }

  const completelySoldOut = variants.every((variant) => {
    return variant.available === false;
  });

  return completelySoldOut;
}
