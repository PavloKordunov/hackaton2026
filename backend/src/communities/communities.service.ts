import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CHERVONOHRAD_COMMUNITY_DASHBOARD,
  CHERVONOHRAD_COMMUNITY_PLOTS,
  CHERVONOHRAD_COMMUNITY_PROFILE,
  CHERVONOHRAD_COMMUNITY_TAXES,
} from './data/chervonohrad-community.data';

@Injectable()
export class CommunitiesService {
  private readonly supportedSlug = 'chervonohrad';

  private assertSupported(slug: string): void {
    if (slug !== this.supportedSlug) {
      throw new NotFoundException(`Community "${slug}" not found`);
    }
  }

  getCommunityProfile(slug: string) {
    this.assertSupported(slug);
    return CHERVONOHRAD_COMMUNITY_PROFILE;
  }

  getCommunityDashboard(slug: string) {
    this.assertSupported(slug);
    return CHERVONOHRAD_COMMUNITY_DASHBOARD;
  }

  getCommunityPlots(slug: string, settlement?: string) {
    this.assertSupported(slug);

    if (!settlement) {
      return CHERVONOHRAD_COMMUNITY_PLOTS;
    }

    return CHERVONOHRAD_COMMUNITY_PLOTS.filter(
      (plot) => plot.settlementName.toLowerCase() === settlement.toLowerCase(),
    );
  }

  getCommunityTaxes(slug: string) {
    this.assertSupported(slug);
    return CHERVONOHRAD_COMMUNITY_TAXES;
  }
}
