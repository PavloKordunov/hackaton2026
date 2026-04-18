import { describe, expect, it } from '@jest/globals';
import { LandNormalizerService } from './land-normalizer.service';

describe('LandNormalizerService', () => {
  const service = new LandNormalizerService();

  it('normalizes a typical row', () => {
    const { record, errors } = service.normalizeRow(
      {
        'Кадастровий номер': ' 1234567890:12:345:6789 ',
        koatuu: 4624884200,
        'Форма власності': 'ПРИВАТНА',
        'Цільове призначення':
          '2.1. Для ведення товарного сільськогосподарського виробництва',
        Місцерозташування: 'с. Київська  , ',
        'Вид с/г угідь': 'рілля; пасовища',
        'Площа, га': '12,3456',
        'Усереднена нормативно грошова оцінка': '123 456,78',
        'ЄДРПОУ землекористувача': 1234567890,
        Землекористувач: 'ТОВ "ПРИМІР"',
        'Частка володіння': '0,5',
        'Дата державної реєстрації права власності': '01.02.2020',
        'Номер запису про право власності': 123456,
        'Орган, що здійснив державну реєстрацію права власності': 'РДА',
        Тип: 'договір оренди',
        Підтип: 'основний',
      },
      2,
    );

    expect(record).toEqual({
      cadastralNumber: '1234567890:12:345:6789',
      koatuu: '4624884200',
      ownershipForm: 'Приватна',
      targetPurpose:
        '02.01 Для ведення товарного сільськогосподарського виробництва',
      location: 'с. Київська',
      landType: 'Рілля; Пасовища',
      areaHa: 12.3456,
      monetaryValuation: 123456.78,
      edrpou: '1234567890',
      landUser: 'ТОВ "ПРИМІР"',
      ownershipShare: 0.5,
      registrationDate: '2020-02-01',
      recordNumber: '123456',
      registrarAuthority: 'РДА',
      documentType: 'договір оренди',
      documentSubtype: 'основний',
    });
    expect(errors).toHaveLength(0);
  });

  it('reports invalid cadastral numbers', () => {
    const { record, errors } = service.normalizeRow(
      {
        'Кадастровий номер': 'bad value',
        koatuu: null,
        'Форма власності': null,
        'Цільове призначення': null,
        Місцерозташування: null,
        'Вид с/г угідь': null,
        'Площа, га': null,
        'Усереднена нормативно грошова оцінка': null,
        'ЄДРПОУ землекористувача': null,
        Землекористувач: null,
        'Частка володіння': null,
        'Дата державної реєстрації права власності': null,
        'Номер запису про право власності': null,
        'Орган, що здійснив державну реєстрацію права власності': null,
        Тип: null,
        Підтип: null,
      },
      3,
    );

    expect(record.cadastralNumber).toBeNull();
    expect(errors.some((error) => error.field === 'cadastralNumber')).toBe(
      true,
    );
  });
});
