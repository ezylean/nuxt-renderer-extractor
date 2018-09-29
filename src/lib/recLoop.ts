/**
 *  recursively loop from a seed and extract all seeds and values
 *
 * @param seed      source seed
 * @param fn        extract from a seed new seeds and values
 * @returns         all seeds and values
 */
export function recLoop<I, O>(
  seed: I,
  fn: (seed: I) => { seeds: I[]; values: O[] }
) {
  let seeds: I[] = [seed];
  let values: O[] = [];
  let index = 0;

  while (index < seeds.length) {
    const result = fn(seeds[index]);
    seeds = seeds.concat(result.seeds);
    values = values.concat(result.values);
    index++;
  }

  return { seeds, values };
}
