export type Cents = number & { readonly __brand: unique symbol };

export const toCents = (amount: number | string): Cents => {
  if (typeof amount === 'number') {
    if (!Number.isFinite(amount)) throw new Error('Invalid amount');
    const cents = Math.round(amount * 100);
    if (!Number.isSafeInteger(cents)) throw new Error('Amount out of range');
    return (Object.is(cents, -0) ? 0 : cents) as Cents;
  }

  const s = amount.trim();
  if (!/^[+-]?\d+(?:\.\d{1,2})?$/.test(s)) throw new Error('Invalid amount string');

  const sign = s.startsWith('-') ? -1 : 1;
  const [whole, frac = ''] = s.replace(/^[+-]/, '').split('.');
  const cents =
    sign *
    (parseInt(whole || '0', 10) * 100 + parseInt(((frac ?? '') + '00').slice(0, 2), 10));

  if (!Number.isSafeInteger(cents)) throw new Error('Amount out of range');
  return (Object.is(cents, -0) ? 0 : cents) as Cents;
};

export const formatDollars = (cents: number): string =>
  ((Object.is(cents, -0) ? 0 : cents) / 100).toFixed(2);
