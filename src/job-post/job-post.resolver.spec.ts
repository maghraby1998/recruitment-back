import { Test, TestingModule } from '@nestjs/testing';
import { JobPostResolver } from './job-post.resolver';

describe('JobPostResolver', () => {
  let resolver: JobPostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPostResolver],
    }).compile();

    resolver = module.get<JobPostResolver>(JobPostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
