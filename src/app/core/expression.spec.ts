import { describe, expect, it } from 'vitest';
import { evaluateExpression } from './expression';

describe('evaluateExpression', () => {
  it('evaluates a plain number', () => {
    expect(evaluateExpression('42')).toBe(42);
  });

  it('adds and subtracts', () => {
    expect(evaluateExpression('10+5-3')).toBe(12);
  });

  it('respects multiplication/division precedence', () => {
    expect(evaluateExpression('2+3*4')).toBe(14);
    expect(evaluateExpression('10-8/2')).toBe(6);
  });

  it('handles parentheses', () => {
    expect(evaluateExpression('(2+3)*4')).toBe(20);
  });

  it('handles unary minus', () => {
    expect(evaluateExpression('-5+10')).toBe(5);
  });

  it('handles decimals', () => {
    expect(evaluateExpression('1.5*2')).toBe(3);
  });

  it('throws on division by zero', () => {
    expect(() => evaluateExpression('5/0')).toThrow();
  });

  it('throws on unsupported characters', () => {
    expect(() => evaluateExpression('alert(1)')).toThrow();
  });

  it('throws on incomplete expressions', () => {
    expect(() => evaluateExpression('12+')).toThrow();
  });

  it('throws on empty input', () => {
    expect(() => evaluateExpression('   ')).toThrow();
  });
});
