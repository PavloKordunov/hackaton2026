import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get(':slug')
  async getProfile(@Param('slug') slug: string) {
    return this.communitiesService.getCommunityProfile(slug);
  }

  @Get(':slug/dashboard')
  async getDashboard(@Param('slug') slug: string) {
    return this.communitiesService.getCommunityDashboard(slug);
  }

  @Get(':slug/plots')
  async getPlots(
    @Param('slug') slug: string,
    @Query('settlement') settlement?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communitiesService.getCommunityPlots(
      slug,
      settlement,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get(':slug/taxes')
  async getTaxes(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communitiesService.getCommunityTaxes(
      slug,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
