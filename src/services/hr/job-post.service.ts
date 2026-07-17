import { JobPostRepository } from '../../repositories/job-post.repository.js';
import { JobPost, NewJobPost } from '../../models/hr/job-post.model.js';

export class JobPostService {
  private repo: JobPostRepository;

  constructor() {
    this.repo = new JobPostRepository();
  }

  async getAll(): Promise<JobPost[]> {
    return await this.repo.findAll();
  }

  async getById(id: number): Promise<JobPost | undefined> {
    return await this.repo.findById(id);
  }

  async create(data: NewJobPost): Promise<JobPost> {
    return await this.repo.create(data);
  }

  async update(id: number, data: Partial<NewJobPost>): Promise<JobPost | undefined> {
    return await this.repo.update(id, data);
  }

  async delete(id: number): Promise<JobPost | undefined> {
    return await this.repo.delete(id);
  }

  async close(id: number): Promise<JobPost | undefined> {
    return await this.repo.update(id, { status: 'closed' });
  }
}
