import { describe, beforeEach, it } from 'node:test';
import { IsThaiTextConstraint } from './is-thai-text.validator';

describe('IsThaiTextConstraint', () => {
  let constraint: IsThaiTextConstraint;

  beforeEach(() => {
    constraint = new IsThaiTextConstraint();
  });

  // ─── ข้อความที่ควรผ่าน ────────────────────────────────
  describe('valid inputs', () => {
    it('should pass thai text', () => {
      expect(constraint.validate('สวัสดีครับ')).toBe(true);
    });

    it('should pass thai text with numbers', () => {
      expect(constraint.validate('ราคา100บาท')).toBe(true);
    });

    it('should pass thai numbers (๐-๙)', () => {
      expect(constraint.validate('วันที่ ๑๒ มกราคม')).toBe(true);
    });

    it('should pass thai text with whitespace', () => {
      expect(constraint.validate('ขอบคุณ มาก')).toBe(true);
    });

    it('should pass mixed thai and arabic numbers', () => {
      expect(constraint.validate('มี 5 ชิ้น')).toBe(true);
    });

    it('should pass text with newlines', () => {
      expect(constraint.validate('บรรทัดแรก\nบรรทัดสอง')).toBe(true);
    });
  });

  // ─── ข้อความที่ไม่ควรผ่าน ─────────────────────────────
  describe('invalid inputs', () => {
    it('should fail english text', () => {
      expect(constraint.validate('Hello')).toBe(false);
    });

    it('should fail mixed thai and english', () => {
      expect(constraint.validate('สวัสดี Hello')).toBe(false);
    });

    it('should fail special characters', () => {
      expect(constraint.validate('ดีมาก!')).toBe(false);
    });

    it('should fail emoji', () => {
      expect(constraint.validate('ดีมาก 😊')).toBe(false);
    });

    it('should fail japanese text', () => {
      expect(constraint.validate('こんにちは')).toBe(false);
    });

    it('should fail chinese text', () => {
      expect(constraint.validate('你好')).toBe(false);
    });

    it('should fail url', () => {
      expect(constraint.validate('https://example.com')).toBe(false);
    });

    it('should fail email', () => {
      expect(constraint.validate('test@email.com')).toBe(false);
    });

    it('should fail dash and punctuation', () => {
      expect(constraint.validate('ดี-มาก')).toBe(false);
    });
  });

  // ─── edge cases ───────────────────────────────────────
  describe('edge cases', () => {
    it('should fail empty string', () => {
      expect(constraint.validate('')).toBe(false);
    });

    it('should fail whitespace only', () => {
      expect(constraint.validate('   ')).toBe(false);
    });

    it('should pass single thai character', () => {
      expect(constraint.validate('ก')).toBe(true);
    });

    it('should pass single number', () => {
      expect(constraint.validate('5')).toBe(true);
    });

    it('should return correct default message', () => {
      const message = constraint.defaultMessage({} as any);
      expect(message).toBe('กรุณากรอกเฉพาะภาษาไทยและตัวเลขเท่านั้น');
    });
  });
});