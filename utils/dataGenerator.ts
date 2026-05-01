import { faker } from '@faker-js/faker';
import testData from '../tests/data/testData.json';

const validAddresses = testData.addresses;

export function generateEmail(): string {
  const timestamp = Date.now();
  return `test.automation+${timestamp}@${testData.user.emailDomain}`;
}

export function generateSpanishPhone(): string {
  const number = faker.string.numeric(9);
  return `+34${number}`;
}

export function generateDateOfBirth(): string {
  const { minAge, maxAge } = testData.dateOfBirth;
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - maxAge;
  const maxYear = currentYear - minAge;
  const randomYear = faker.number.int({ min: minYear, max: maxYear });
  const randomMonth = faker.number.int({ min: 1, max: 12 });
  const randomDay = faker.number.int({ min: 1, max: 28 });
  const monthStr = randomMonth.toString().padStart(2, '0');
  const dayStr = randomDay.toString().padStart(2, '0');
  return `${dayStr}${monthStr}${randomYear}`;
}

export function getRandomAddress(): string {
  return faker.helpers.arrayElement(validAddresses);
}

function calculateNifControlLetter(numbers: string): string {
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const index = parseInt(numbers, 10) % 23;
  return letters[index];
}

export function generateIdentification(): string {
  const type = faker.helpers.arrayElement(testData.idTypes);
  if (type === 'DNI') {
    const numbers = faker.string.numeric(8);
    const letter = calculateNifControlLetter(numbers);
    return `${numbers}${letter}`;
  } else {
    const prefix = faker.helpers.arrayElement(testData.niePrefixes);
    const numbers = faker.string.numeric(7);
    const prefixValue = prefix === 'X' ? '0' : prefix === 'Y' ? '1' : '2';
    const fullNumber = prefixValue + numbers;
    const letter = calculateNifControlLetter(fullNumber);
    return `${prefix}${numbers}${letter}`;
  }
}

export function generateFirstName(): string {
  return faker.person.firstName('male');
}

export function generateLastName(): string {
  return faker.person.lastName();
}