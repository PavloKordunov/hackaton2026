import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async getCommunityProfile(slug: string) {
    const community = await this.prisma.communityProfile.findUnique({
      where: { slug },
      include: {
        settlements: true,
      },
    });

    if (!community) {
      throw new NotFoundException(`Community "${slug}" not found`);
    }

    return {
      id: community.id,
      slug: community.slug,
      name: community.name,
      region: community.region,
      district: community.district,
      center: community.center,
      accountEmail: community.accountEmail,
      contactPhone: community.contactPhone,
      settlements: community.settlements.map((s) => s.name),
    };
  }

  async getCommunityPlots(
    slug: string,
    settlement?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    // 1. Санітизація вхідних даних (Захист від збоїв)
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10)); // Обмежуємо максимум 100 записів за раз
    const skip = (safePage - 1) * safeLimit;

    // 2. Пошук громади
    const community = await this.prisma.communityProfile.findUnique({
      where: { slug },
      include: { settlements: true },
    });

    if (!community) {
      throw new NotFoundException(`Community "${slug}" not found`);
    }

    // 3. Формування умов пошуку
    const where: any = {
      communityId: community.id,
    };

    if (settlement) {
      const settlementRecord = community.settlements.find(
        (s) => s.name.toLowerCase() === settlement.toLowerCase(),
      );
      if (settlementRecord) {
        where.settlementId = settlementRecord.id;
      }
    }

    // 4. Паралельний запит із СОРТУВАННЯМ
    const [plots, total] = await Promise.all([
      this.prisma.landRecord.findMany({
        where,
        include: {
          settlement: true,
        },
        skip,
        take: safeLimit,
        // ОБОВ'ЯЗКОВО: Сортування, щоб сторінки не "стрибали" і не дублювались
        // Замініть 'createdAt' на те поле, яке у вас є (наприклад, 'id' або 'updatedAt')
        orderBy: { id: 'asc' },
      }),
      this.prisma.landRecord.count({ where }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: plots.map((plot) => ({
        id: plot.id,
        cadastralNumber: plot.cadastralNumber,
        settlementName: plot.settlement?.name || 'N/A',
        location: plot.location || '',
        ownerName: plot.ownerName || '',
        purpose: plot.purpose || '',
        areaHa: plot.areaHa || 0,
        taxNumber: plot.taxNumber,
        status: 'active' as const,
        // Залишаємо мокові координати для демо
        coordinates: [[50.35, 24.25]] as [number, number][],
      })),
      // 5. Розширена пагінація для зручності Next.js
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    };
  }

  async getCommunityTaxes(slug: string, page: number = 1, limit: number = 10) {
    const community = await this.prisma.communityProfile.findUnique({
      where: { slug },
      include: {
        taxes: true,
      },
    });

    if (!community) {
      throw new NotFoundException(`Community "${slug}" not found`);
    }

    const skip = (page - 1) * limit;
    const total = community.taxes.length;
    const paginatedTaxes = community.taxes.slice(skip, skip + limit);

    return {
      data: paginatedTaxes.map((tax) => ({
        id: tax.id,
        type: tax.type,
        name: tax.name,
        rate: tax.rate?.toString() || '',
        unit: tax.unit || '',
        payerCount: tax.payerCount,
        annualRevenue: Number(tax.annualRevenue) || 0,
        isActive: tax.isActive,
        description: tax.description || '',
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getCommunityDashboard(slug: string) {
    // 1. Спочатку знаходимо саму громаду
    const community = await this.prisma.communityProfile.findUnique({
      where: { slug },
      include: {
        settlements: true,
      },
    });

    if (!community) {
      throw new NotFoundException(`Community "${slug}" not found`);
    }

    // 2. Робимо ефективні АГРЕГАЦІЇ через Prisma.
    // Ми НЕ витягуємо дані, ми просимо базу просто порахувати суми.
    const [plotCount, taxesAggregations, plotsBySettlement] = await Promise.all(
      [
        // Рахуємо загальну кількість ділянок
        this.prisma.landRecord.count({
          where: { communityId: community.id },
        }),

        // Рахуємо сумарний дохід та кількість платників
        this.prisma.communityTax.aggregate({
          where: {
            communityId: community.id,
            isActive: true, // Рахуємо тільки активні податки
          },
          _sum: {
            annualRevenue: true,
            payerCount: true,
          },
          _count: {
            id: true, // Загальна кількість типів податків
          },
        }),

        // Групуємо ділянки по селах (миттєвий SQL GROUP BY)
        this.prisma.landRecord.groupBy({
          by: ['settlementId'],
          where: { communityId: community.id },
          _count: {
            id: true,
          },
        }),
      ],
    );

    // 3. Форматуємо статистику по селах
    // Мапимо результати групування на реальні назви сіл
    const settlementWithPlots = community.settlements
      .map((settlement) => {
        const groupedData = plotsBySettlement.find(
          (p) => p.settlementId === settlement.id,
        );
        return {
          name: settlement.name,
          type: settlement.type,
          plotCount: groupedData?._count.id || 0,
        };
      })
      .sort((a, b) => b.plotCount - a.plotCount); // Сортуємо від найбільшого до найменшого

    // 4. Безпечно витягуємо суми (якщо податків ще немає, повертаємо 0)
    const totalTaxes = taxesAggregations._count.id;
    const totalPayers = taxesAggregations._sum.payerCount || 0;
    const estimatedAnnualRevenue =
      Number(taxesAggregations._sum.annualRevenue) || 0;

    // 5. Готуємо масив метрик спеціально для фронтенду
    const metrics = [
      {
        id: 'plots',
        label: 'Земельні ділянки',
        value: plotCount,
        helperText: 'У межах громади',
      },
      {
        id: 'taxes',
        label: 'Локальні податки',
        value: totalTaxes,
        helperText: 'Активні типи нарахувань',
      },
      {
        id: 'payers',
        label: 'Платники',
        value: totalPayers,
        helperText: 'Юридичні та фізичні особи',
      },
      {
        id: 'settlements',
        label: 'Населені пункти',
        value: community.settlements.length,
        helperText: 'Міста, селища та села громади',
      },
    ];

    // Віддаємо готовий об'єкт. Фронтенду залишиться просто його намалювати.
    return {
      id: community.id,
      slug: community.slug,
      name: community.name,
      region: community.region,
      district: community.district,
      center: community.center,
      totalAnnualRevenue: estimatedAnnualRevenue, // Одразу віддаємо загальну суму
      metrics,
      settlements: settlementWithPlots,
    };
  }
}
