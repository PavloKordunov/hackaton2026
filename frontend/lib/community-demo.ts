export type CommunityPlotStatus = "active" | "pending" | "leased";

export interface CommunityPlot {
  id: string;
  cadastralNumber: string;
  settlementName: string;
  location: string;
  ownerName: string;
  purpose: string;
  areaHa: number;
  taxNumber: string;
  status: CommunityPlotStatus;
  coordinates: [number, number][];
}

export interface CommunityTax {
  id: string;
  type: string;
  name: string;
  rate: string;
  unit: string;
  payerCount: number;
  annualRevenue: number;
  isActive: boolean;
  description: string;
}

export const communityProfile = {
  id: "community-chervonohrad",
  slug: "chervonohrad",
  name: "Червоноградська міська територіальна громада",
  region: "Львівська область",
  district: "Шептицький район",
  center: "Червоноград",
  accountEmail: "otg.chervonohrad@demo.ua",
  contactPhone: "+380 67 555 01 01",
  settlements: [
    "Червоноград",
    "Соснівка",
    "Гірник",
    "Сілець",
    "Волсвин",
    "Острів",
    "Бендюга",
    "Межиріччя",
  ],
};

export const communityPlots: CommunityPlot[] = [
  {
    id: "plot-1",
    cadastralNumber: "4624886600:04:000:1201",
    settlementName: "Сілець",
    location: "ур. Південне поле",
    ownerName: 'ФГ "Сокіл"',
    purpose: "Для ведення товарного сільськогосподарського виробництва",
    areaHa: 14.2,
    taxNumber: "3045601122",
    status: "active",
    coordinates: [
      [50.402, 24.198],
      [50.405, 24.198],
      [50.405, 24.205],
      [50.401, 24.204],
    ],
  },
  {
    id: "plot-2",
    cadastralNumber: "4624886600:02:001:0334",
    settlementName: "Волсвин",
    location: "вул. Польова, 18",
    ownerName: 'ТОВ "Агро-Ресурс"',
    purpose: "Для розміщення та експлуатації складських будівель",
    areaHa: 3.6,
    taxNumber: "4123345567",
    status: "leased",
    coordinates: [
      [50.387, 24.166],
      [50.389, 24.166],
      [50.389, 24.171],
      [50.386, 24.171],
    ],
  },
  {
    id: "plot-3",
    cadastralNumber: "4611800000:01:002:0781",
    settlementName: "Червоноград",
    location: "промислова зона, квартал 6",
    ownerName: 'КП "Міський індустріальний парк"',
    purpose: "Для будівництва та обслуговування виробничих приміщень",
    areaHa: 6.9,
    taxNumber: "3987712300",
    status: "active",
    coordinates: [
      [50.395, 24.228],
      [50.398, 24.228],
      [50.398, 24.235],
      [50.394, 24.234],
    ],
  },
  {
    id: "plot-4",
    cadastralNumber: "4624882400:03:002:0901",
    settlementName: "Острів",
    location: "ур. За ставом",
    ownerName: 'ПП "Добробут Земля"',
    purpose: "Для ведення особистого селянського господарства",
    areaHa: 1.8,
    taxNumber: "2776500198",
    status: "pending",
    coordinates: [
      [50.372, 24.247],
      [50.373, 24.247],
      [50.373, 24.25],
      [50.371, 24.249],
    ],
  },
  {
    id: "plot-5",
    cadastralNumber: "4624886600:06:004:0119",
    settlementName: "Межиріччя",
    location: "масив Північний",
    ownerName: 'ТзОВ "Сонячний Енерго Парк"',
    purpose: "Для розміщення об’єктів енергогенеруючих підприємств",
    areaHa: 9.4,
    taxNumber: "4450021190",
    status: "leased",
    coordinates: [
      [50.425, 24.174],
      [50.428, 24.174],
      [50.428, 24.18],
      [50.423, 24.179],
    ],
  },
];

export const communityTaxes: CommunityTax[] = [
  {
    id: "tax-1",
    type: "LAND_TAX",
    name: "Земельний податок",
    rate: "3.0",
    unit: "% від нормативної грошової оцінки",
    payerCount: 124,
    annualRevenue: 2810000,
    isActive: true,
    description:
      "Основний місцевий податок для власників та постійних користувачів земельних ділянок.",
  },
  {
    id: "tax-2",
    type: "RENT_TAX",
    name: "Орендна плата за землю",
    rate: "8.5",
    unit: "% від нормативної грошової оцінки",
    payerCount: 37,
    annualRevenue: 1940000,
    isActive: true,
    description:
      "Нарахування для орендарів комунальних земельних ділянок громади.",
  },
  {
    id: "tax-3",
    type: "PROPERTY_TAX",
    name: "Податок на нерухоме майно",
    rate: "1.2",
    unit: "% від мінімальної зарплати за 1 м²",
    payerCount: 86,
    annualRevenue: 960000,
    isActive: true,
    description:
      "Локальна ставка для житлової та комерційної нерухомості на території громади.",
  },
  {
    id: "tax-4",
    type: "LOCAL_FEE",
    name: "Туристичний збір",
    rate: "0.5",
    unit: "% від вартості проживання",
    payerCount: 9,
    annualRevenue: 120000,
    isActive: true,
    description: "Збір для закладів тимчасового розміщення гостей громади.",
  },
];

export const dashboardMetrics = [
  {
    label: "Земельні ділянки",
    value: communityPlots.length,
    helperText: "У межах Червоноградської ОТГ",
  },
  {
    label: "Локальні податки",
    value: communityTaxes.length,
    helperText: "Активні типи нарахувань",
  },
  {
    label: "Платники",
    value: communityTaxes.reduce((sum, tax) => sum + tax.payerCount, 0),
    helperText: "Юридичні та фізичні особи",
  },
  {
    label: "Населені пункти",
    value: communityProfile.settlements.length,
    helperText: "Міста, селища та села громади",
  },
];

export const settlementsOverview = communityProfile.settlements.map((name) => ({
  name,
  plotCount: communityPlots.filter((plot) => plot.settlementName === name).length,
}));

export const totalAnnualRevenue = communityTaxes.reduce(
  (sum, tax) => sum + tax.annualRevenue,
  0,
);
