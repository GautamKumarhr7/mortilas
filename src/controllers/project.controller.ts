import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service.js";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    const projects = await this.projectService.getAllProjects();
    res.status(200).json({ success: true, data: projects });
  };

  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const project = await this.projectService.getProjectById(id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, data: project });
  };

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    const project = await this.projectService.createProject(req.body);
    res.status(201).json({ success: true, data: project });
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const project = await this.projectService.updateProject(id, req.body);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, data: project });
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const project = await this.projectService.deleteProject(id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  };
}
