import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get(':slug')
  getProfile(@Param('slug') slug: string) {
    return this.communitiesService.getCommunityProfile(slug);
  }

  @Get(':slug/dashboard')
  getDashboard(@Param('slug') slug: string) {
    return this.communitiesService.getCommunityDashboard(slug);
  }

  @Get(':slug/plots')
  getPlots(
    @Param('slug') slug: string,
    @Query('settlement') settlement?: string,
  ) {
    return this.communitiesService.getCommunityPlots(slug, settlement);
  }

  @Get(':slug/taxes')
  getTaxes(@Param('slug') slug: string) {
    return this.communitiesService.getCommunityTaxes(slug);
  }
}
