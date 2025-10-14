// Money helpers (work with integer cents)
export type Cents = number & { readonly __brand: unique symbol };

export const toCents = (amount: number | string): Cents => {
  if (typeof amount === 'number' && !Number.isFinite(amount)) throw new Error('Invalid amount');
  const s = String(amount).trim();
  if (!/^[-]?\d+(\.\d{1,2})?$/.test(s)) throw new Error('Invalid amount string');
  const [whole, frac = ''] = s.replace('-', '').split('.');
  const sign = s.startsWith('-') ? -1 : 1;
  const cents = sign * (int(whole) * 100 + int((frac + '00').slice(0, 2)));
  if (!Number.isFinite(cents)) throw new Error('Invalid cents');
  return cents as Cents;
};

const int = (x: string) => parseInt(x || '0', 10);

export const formatDollars = (cents: number): string => (cents / 100).toFixed(2);
