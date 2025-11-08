import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateProjectSpec } from "./ai-service";
import { insertProjectSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const ACTIVE_TASK_STATUSES = new Set(["todo", "in_progress", "review"]);
  const BLOCKED_TASK_STATUSES = new Set(["blocked", "backlog"]);

  app.post("/api/projects", async (req, res) => {
    try {
      const { name, key, requirements, description } = req.body;

      if (!name || !key || !requirements) {
        return res.status(400).json({ error: "Missing required fields: name, key, requirements" });
      }

      const project = await storage.createProject({
        name,
        key: key.toUpperCase(),
        requirements,
        description: description || "",
        status: "processing",
        architecture: null,
      });

      try {
        const spec = await generateProjectSpec(
          project.key,
          project.name,
          project.requirements
        );

        await storage.updateProject(project.id, {
          architecture: spec.architecture as any,
          status: "completed",
        });

        for (const module of spec.architecture.frontend) {
          await storage.createModule({
            projectId: project.id,
            name: module.name,
            layer: "frontend",
            description: module.description,
            technologies: module.technologies,
            dependencies: module.dependencies,
          });
        }

        for (const module of spec.architecture.backend) {
          await storage.createModule({
            projectId: project.id,
            name: module.name,
            layer: "backend",
            description: module.description,
            technologies: module.technologies,
            dependencies: module.dependencies,
          });
        }

        for (const module of spec.architecture.database) {
          await storage.createModule({
            projectId: project.id,
            name: module.name,
            layer: "database",
            description: module.description,
            technologies: module.technologies,
            dependencies: [],
          });
        }

        for (const taskData of spec.tasks) {
          await storage.createTask({
            projectId: project.id,
            key: taskData.key,
            title: taskData.title,
            description: taskData.description || "",
            type: taskData.type,
            status: "backlog",
            priority: taskData.priority,
            storyPoints: taskData.storyPoints,
            assignee: null,
            reporter: "AI System",
            labels: taskData.labels || [],
            aiGenerated: 1,
          });
        }

        res.json({ 
          project: await storage.getProject(project.id),
          message: "Project created successfully with AI-generated architecture" 
        });
      } catch (error) {
        console.error("AI generation failed:", error);
        await storage.updateProject(project.id, {
          status: "failed",
        });
        res.status(500).json({ 
          error: "Failed to generate project architecture", 
          details: error instanceof Error ? error.message : "Unknown error",
          projectId: project.id
        });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      
      const projectsWithCounts = await Promise.all(
        projects.map(async (project) => {
          const tasks = await storage.getTasksByProject(project.id);
          const completedTasks = tasks.filter(t => t.status === "done").length;
          const modules = await storage.getModulesByProject(project.id);
          
          return {
            ...project,
            tasks: tasks.length,
            completedTasks,
            modules: modules.length,
          };
        })
      );

      res.json(projectsWithCounts);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const tasks = await storage.getTasksByProject(id);
      const modules = await storage.getModulesByProject(id);

      res.json({
        project,
        tasks,
        modules,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.put("/api/projects/:projectId/tasks/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const updates = req.body;

      const allowedStatuses = ["backlog", "todo", "in_progress", "review", "done"];
      const allowedPriorities = ["lowest", "low", "medium", "high", "highest"];
      const allowedFields = ["status", "priority", "assignee", "description", "storyPoints"];
      
      const filteredUpdates: any = {};
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          if (field === "status" && !allowedStatuses.includes(updates[field])) {
            return res.status(400).json({ error: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}` });
          }
          if (field === "priority" && !allowedPriorities.includes(updates[field])) {
            return res.status(400).json({ error: `Invalid priority. Allowed values: ${allowedPriorities.join(", ")}` });
          }
          filteredUpdates[field] = updates[field];
        }
      }

      const updatedTask = await storage.updateTask(taskId, filteredUpdates);
      
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/reports/summary", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      const totalProjects = projects.length;
      const now = Date.now();
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

      let projectsCreatedLast30Days = 0;

      let totalTasks = 0;
      let completedTasks = 0;
      let completedLast7Days = 0;
      let activeTasks = 0;
      let blockedTasks = 0;
      let aiGeneratedTasks = 0;

      let activeProjects = 0;
      let blockedProjects = 0;

      for (const project of projects) {
        const createdAt =
          project.createdAt instanceof Date
            ? project.createdAt
            : new Date(project.createdAt);

        if (!Number.isNaN(createdAt.getTime()) && createdAt >= thirtyDaysAgo) {
          projectsCreatedLast30Days += 1;
        }

        const tasks = await storage.getTasksByProject(project.id);
        if (!tasks.length) {
          continue;
        }

        totalTasks += tasks.length;

        let projectHasActiveTasks = false;
        let projectHasBlockedTasks = false;

        for (const task of tasks) {
          if ((task.aiGenerated ?? 0) > 0) {
            aiGeneratedTasks += 1;
          }

          const status = task.status || "todo";
          const updatedAt =
            task.updatedAt instanceof Date
              ? task.updatedAt
              : new Date(task.updatedAt);

          if (status === "done") {
            completedTasks += 1;
            if (
              updatedAt instanceof Date &&
              !Number.isNaN(updatedAt.getTime()) &&
              updatedAt >= sevenDaysAgo
            ) {
              completedLast7Days += 1;
            }
            continue;
          }

          if (ACTIVE_TASK_STATUSES.has(status)) {
            activeTasks += 1;
            projectHasActiveTasks = true;
            continue;
          }

          if (BLOCKED_TASK_STATUSES.has(status)) {
            blockedTasks += 1;
            projectHasBlockedTasks = true;
          }
        }

        if (projectHasActiveTasks) {
          activeProjects += 1;
        }

        if (projectHasBlockedTasks) {
          blockedProjects += 1;
        }
      }

      res.json({
        totalProjects,
        projectsCreatedLast30Days,
        totals: {
          totalTasks,
          completedTasks,
          completedLast7Days,
          activeTasks,
          blockedTasks,
          aiGeneratedTasks,
        },
        distribution: {
          activeProjects,
          blockedProjects,
        },
      });
    } catch (error) {
      console.error("Error building report summary:", error);
      res.status(500).json({ error: "Failed to build reports summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
