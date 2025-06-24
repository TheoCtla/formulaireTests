import { isValidName, isValidEmail, isValidPostalCode, calculateAge, isAdult } from '../utils/validations';
describe('Validation functions', () => {
    test('isValidName - should accept names with accents and hyphens', () => {
        expect(isValidName('Élodie')).toBe(true);
        expect(isValidName("Jean-Pierre")).toBe(true);
        expect(isValidName("Zoë")).toBe(true);
    });
    test('isValidName - should reject names with numbers or symbols', () => {
        expect(isValidName('T3st')).toBe(false);
        expect(isValidName('John$')).toBe(false);
    });
    test('isValidEmail - should validate correct emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
    });
    test('isValidEmail - should reject invalid emails', () => {
        expect(isValidEmail('test@.com')).toBe(false);
        expect(isValidEmail('test.com')).toBe(false);
    });
    test('isValidPostalCode - should validate French codes', () => {
        expect(isValidPostalCode('06000')).toBe(true);
        expect(isValidPostalCode('1234')).toBe(false);
        expect(isValidPostalCode('ABCDE')).toBe(false);
    });
    test('calculateAge - should calculate correct age', () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 20);
        expect(calculateAge(birthDate.toISOString().split('T')[0])).toBe(20);
    });
    test('calculateAge - should decrement age if birthday not yet occurred this year', () => {
        const today = new Date();
        const year = today.getFullYear() - 18;
        const birthDate = new Date(year, today.getMonth() + 1, today.getDate());
        const formatted = birthDate.toISOString().split('T')[0];
        expect(calculateAge(formatted)).toBe(17);
    });
    test('isAdult - should return true if age >= 18', () => {
        const adultBirth = new Date();
        adultBirth.setFullYear(adultBirth.getFullYear() - 19);
        expect(isAdult(adultBirth.toISOString().split('T')[0])).toBe(true);
        const kidBirth = new Date();
        kidBirth.setFullYear(kidBirth.getFullYear() - 16);
        expect(isAdult(kidBirth.toISOString().split('T')[0])).toBe(false);
    });
});
