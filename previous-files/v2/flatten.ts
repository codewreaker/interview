const isPrimitive = (val: any) => typeof val !== "object" || val === null;

export const flatten = (flat) => {
  if (isPrimitive(flat)) return flat;

  if (Array.isArray(flat)) {
    return flat.reduce((acc, curr) => acc.concat(flatten(curr)), []);
  }

  const final = {};

  for (const [k, v] of Object.entries(flat)) {
    final[k] = flatten(v);
  }

  return final;
};
