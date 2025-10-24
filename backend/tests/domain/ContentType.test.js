const ContentType = require('../../src/domain/value-objects/ContentType');

describe('ContentType Value Object', () => {
  describe('Constructor', () => {
    test('should create ContentType with valid type', () => {
      const contentType = new ContentType('text');
      expect(contentType.value).toBe('text');
    });

    test('should throw error for invalid type', () => {
      expect(() => {
        new ContentType('invalid-type');
      }).toThrow('Invalid content type: invalid-type');
    });

    test('should create ContentType with all valid types', () => {
      const validTypes = ['text', 'presentation', 'mindmap', 'audio', 'video', 'interactive'];
      
      validTypes.forEach(type => {
        const contentType = new ContentType(type);
        expect(contentType.value).toBe(type);
      });
    });
  });

  describe('Static Methods', () => {
    test('isValid should return true for valid types', () => {
      const validTypes = ['text', 'presentation', 'mindmap', 'audio', 'video', 'interactive'];
      
      validTypes.forEach(type => {
        expect(ContentType.isValid(type)).toBe(true);
      });
    });

    test('isValid should return false for invalid types', () => {
      const invalidTypes = ['invalid', 'unknown', '', null, undefined];
      
      invalidTypes.forEach(type => {
        expect(ContentType.isValid(type)).toBe(false);
      });
    });
  });

  describe('Static Constants', () => {
    test('should have correct static constants', () => {
      expect(ContentType.TEXT.value).toBe('text');
      expect(ContentType.PRESENTATION.value).toBe('presentation');
      expect(ContentType.MINDMAP.value).toBe('mindmap');
      expect(ContentType.AUDIO.value).toBe('audio');
      expect(ContentType.VIDEO.value).toBe('video');
      expect(ContentType.INTERACTIVE.value).toBe('interactive');
    });
  });

  describe('equals', () => {
    test('should return true for equal ContentTypes', () => {
      const type1 = new ContentType('text');
      const type2 = new ContentType('text');
      
      expect(type1.equals(type2)).toBe(true);
    });

    test('should return false for different ContentTypes', () => {
      const type1 = new ContentType('text');
      const type2 = new ContentType('presentation');
      
      expect(type1.equals(type2)).toBe(false);
    });

    test('should return false for non-ContentType objects', () => {
      const type1 = new ContentType('text');
      const type2 = 'text';
      
      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe('toString', () => {
    test('should return string representation', () => {
      const contentType = new ContentType('text');
      expect(contentType.toString()).toBe('text');
    });
  });
});
