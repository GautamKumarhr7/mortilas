import { ProjectRepository } from "../repositories/project.repository.js";
import { Project, NewProject } from "../models/project.model.js";
import {
  buildProjectCodePrefix,
  normalizeProjectCode,
  generateProjectCode,
} from "../helpers/project-code.helper.js";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return await this.projectRepository.findById(id);
  }

  async createProject(projectData: Partial<NewProject>): Promise<Project> {
    if (!projectData.category) {
      throw new Error("Project category is required");
    }

    const projectCode = projectData.projectCode
      ? normalizeProjectCode(projectData.projectCode)
      : generateProjectCode(
          projectData.category as string,
          await this.projectRepository.findProjectCodesByPrefix(
            buildProjectCodePrefix(
              projectData.category as string,
              new Date().getFullYear(),
            ),
          ),
        );

    const existingProject =
      await this.projectRepository.findByProjectCode(projectCode);
    if (existingProject) {
      throw new Error("Project with this code already exists");
    }

    const projectToCreate = {
      ...projectData,
      projectCode,
      status: projectData.status ?? "Draft",
    } as NewProject;

    return await this.projectRepository.create(projectToCreate);
  }

  async updateProject(
    id: number,
    projectData: Partial<NewProject>,
  ): Promise<Project | undefined> {
    if (projectData.projectCode) {
      const normalizedProjectCode = normalizeProjectCode(
        projectData.projectCode,
      );
      const existingProject = await this.projectRepository.findByProjectCode(
        normalizedProjectCode,
      );
      if (existingProject && existingProject.id !== id) {
        throw new Error("Project with this code already exists");
      }

      return await this.projectRepository.update(id, {
        ...projectData,
        projectCode: normalizedProjectCode,
      });
    }

    return await this.projectRepository.update(id, projectData);
  }

  async deleteProject(id: number): Promise<Project | undefined> {
    return await this.projectRepository.delete(id);
  }
}
