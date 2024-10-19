export function distributeWeights(items: any[]): any[] {
  const totalWeight = 10000;
  const itemCount = items.length;

  // Calculate the base weight for each item (integer division)
  const baseWeight = Math.floor(totalWeight / itemCount);

  // Calculate the remainder that needs to be added to the first item
  const remainder = totalWeight % itemCount;

  // Distribute the base weight to all items and add the remainder to the first item
  const result = items.map((item, index) => {
    return {
      ...item,
      weight: index === 0 ? baseWeight + remainder : baseWeight
    };
  });

  // Confirm that all weights are integers
  result.forEach(item => {
    if (!Number.isInteger(item.weight)) {
      throw new Error(`Weight is not an integer: ${item.weight}`);
    }
  });

  return result.map((item) => item.weight);
}

export function chainValidation(chainId:number): boolean {
  return chainId === 137 || chainId === 19819 || chainId === 20208 || chainId === 1;
}

export function normalizeDevChains(chainId: number) : number {
  return chainId === 19819 ? 137 : chainId === 20208 ? 1 : chainId === 84532 ? 8453 : chainId;
}

export function getChainNameRainbowKit(_chainId: number) : string {
  const chainId = normalizeDevChains(_chainId);
  return chainId === 1 ? 'ethereum' : chainId === 137 ? 'polygon' : 'polygon';
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}