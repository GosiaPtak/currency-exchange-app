const ALLOWED_CHARS = /^[0-9+\-*/().\s]+$/;

/**
 * Evaluates a basic arithmetic expression (+, -, *, /, parentheses, unary
 * minus) without relying on `eval`/`Function`. Throws on invalid syntax,
 * unsupported characters, or division by zero.
 */
export function evaluateExpression(expression: string): number {
  const source = expression.trim();
  if (!source) {
    throw new Error('Empty expression');
  }
  if (!ALLOWED_CHARS.test(source)) {
    throw new Error('Expression contains unsupported characters');
  }

  let index = 0;

  const peek = (): string | undefined => source[index];
  const consume = (): string => source[index++];
  const skipSpaces = (): void => {
    while (peek() === ' ') consume();
  };

  function parseExpression(): number {
    skipSpaces();
    let value = parseTerm();
    skipSpaces();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
      skipSpaces();
    }
    return value;
  }

  function parseTerm(): number {
    skipSpaces();
    let value = parseUnary();
    skipSpaces();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const rhs = parseUnary();
      if (op === '/') {
        if (rhs === 0) throw new Error('Division by zero');
        value = value / rhs;
      } else {
        value = value * rhs;
      }
      skipSpaces();
    }
    return value;
  }

  function parseUnary(): number {
    skipSpaces();
    if (peek() === '+' || peek() === '-') {
      const op = consume();
      const value = parseUnary();
      return op === '-' ? -value : value;
    }
    return parseFactor();
  }

  function parseFactor(): number {
    skipSpaces();
    if (peek() === '(') {
      consume();
      const value = parseExpression();
      skipSpaces();
      if (peek() !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      consume();
      return value;
    }
    return parseNumber();
  }

  function parseNumber(): number {
    const start = index;
    while (peek() !== undefined && /[0-9.]/.test(peek()!)) {
      consume();
    }
    const numStr = source.slice(start, index);
    if (!numStr || Number.isNaN(Number(numStr))) {
      throw new Error('Expected a number');
    }
    return Number(numStr);
  }

  const result = parseExpression();
  skipSpaces();
  if (index !== source.length) {
    throw new Error('Unexpected trailing characters');
  }
  if (!Number.isFinite(result)) {
    throw new Error('Result is not a finite number');
  }
  return result;
}
