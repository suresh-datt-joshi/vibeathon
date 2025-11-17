import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateProjectSpec } from "./ai-service";
import { insertProjectSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { projects, tasks } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const ACTIVE_TASK_STATUSES = new Set(["todo", "in_progress", "review"]);
  const BLOCKED_TASK_STATUSES = new Set(["blocked", "backlog"]);

  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      // Test database connection
      await storage.getProjects();
      res.json({ 
        status: "ok", 
        database: "connected",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({ 
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  });

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
      const projectAggResult = await db.execute(
        sql`
          SELECT
            COALESCE(COUNT(*)::int, 0) AS total_projects,
            COALESCE(
              SUM(
                CASE
                  WHEN ${projects.createdAt} >= NOW() - INTERVAL '30 days'
                  THEN 1
                  ELSE 0
                END
              )::int,
              0
            ) AS projects_created_last_30_days
          FROM ${projects}
        `,
      );

      const taskAggResult = await db.execute(
        sql`
          SELECT
            COALESCE(COUNT(*)::int, 0) AS total_tasks,
            COALESCE(
              SUM(
                CASE WHEN ${tasks.status} = 'done' THEN 1 ELSE 0 END
              )::int,
              0
            ) AS completed_tasks,
            COALESCE(
              SUM(
                CASE
                  WHEN ${tasks.status} = 'done'
                    AND ${tasks.updatedAt} >= NOW() - INTERVAL '7 days'
                  THEN 1
                  ELSE 0
                END
              )::int,
              0
            ) AS completed_last_7_days,
            COALESCE(
              SUM(
                CASE
                  WHEN ${tasks.status} IN ('todo', 'in_progress', 'review')
                  THEN 1
                  ELSE 0
                END
              )::int,
              0
            ) AS active_tasks,
            COALESCE(
              SUM(
                CASE
                  WHEN ${tasks.status} IN ('blocked', 'backlog')
                  THEN 1
                  ELSE 0
                END
              )::int,
              0
            ) AS blocked_tasks,
            COALESCE(
              SUM(
                CASE
                  WHEN COALESCE(${tasks.aiGenerated}, 0) > 0
                  THEN 1
                  ELSE 0
                END
              )::int,
              0
            ) AS ai_generated_tasks,
            COALESCE(
              COUNT(
                DISTINCT CASE
                  WHEN ${tasks.status} IN ('todo', 'in_progress', 'review')
                  THEN ${tasks.projectId}
                  ELSE NULL
                END
              )::int,
              0
            ) AS active_projects,
            COALESCE(
              COUNT(
                DISTINCT CASE
                  WHEN ${tasks.status} IN ('blocked', 'backlog')
                  THEN ${tasks.projectId}
                  ELSE NULL
                END
              )::int,
              0
            ) AS blocked_projects
          FROM ${tasks}
        `,
      );

      const projectAgg = projectAggResult.rows[0] ?? {
        total_projects: 0,
        projects_created_last_30_days: 0,
      };

      const taskAgg = taskAggResult.rows[0] ?? {
        total_tasks: 0,
        completed_tasks: 0,
        completed_last_7_days: 0,
        active_tasks: 0,
        blocked_tasks: 0,
        ai_generated_tasks: 0,
        active_projects: 0,
        blocked_projects: 0,
      };

      res.json({
        totalProjects: Number(projectAgg.total_projects ?? 0),
        projectsCreatedLast30Days: Number(
          projectAgg.projects_created_last_30_days ?? 0,
        ),
        totals: {
          totalTasks: Number(taskAgg.total_tasks ?? 0),
          completedTasks: Number(taskAgg.completed_tasks ?? 0),
          completedLast7Days: Number(taskAgg.completed_last_7_days ?? 0),
          activeTasks: Number(taskAgg.active_tasks ?? 0),
          blockedTasks: Number(taskAgg.blocked_tasks ?? 0),
          aiGeneratedTasks: Number(taskAgg.ai_generated_tasks ?? 0),
        },
        distribution: {
          activeProjects: Number(taskAgg.active_projects ?? 0),
          blockedProjects: Number(taskAgg.blocked_projects ?? 0),
        },
      });
    } catch (error) {
      console.error("Error building report summary:", error);
      res.status(500).json({ error: "Failed to build reports summary" });
    }
  });

  app.get("/api/reports/velocity", async (_req, res) => {
    try {
      // Get story points completed per week for the last 12 weeks
      const velocityResult = await db.execute(
        sql`
          SELECT
            DATE_TRUNC('week', ${tasks.updatedAt}) AS week,
            COALESCE(SUM(${tasks.storyPoints})::int, 0) AS story_points_completed
          FROM ${tasks}
          WHERE ${tasks.status} = 'done'
            AND ${tasks.updatedAt} >= NOW() - INTERVAL '12 weeks'
          GROUP BY DATE_TRUNC('week', ${tasks.updatedAt})
          ORDER BY week ASC
        `,
      );

      // Get total story points completed
      const totalResult = await db.execute(
        sql`
          SELECT
            COALESCE(SUM(${tasks.storyPoints})::int, 0) AS total_story_points_completed
          FROM ${tasks}
          WHERE ${tasks.status} = 'done'
        `,
      );

      // Get average velocity (story points per week)
      const avgVelocity = velocityResult.rows.length > 0
        ? Math.round(
            velocityResult.rows.reduce(
              (sum: number, row: any) => sum + Number(row.story_points_completed ?? 0),
              0
            ) / velocityResult.rows.length
          )
        : 0;

      res.json({
        weeklyVelocity: velocityResult.rows.map((row: any) => ({
          week: row.week,
          storyPoints: Number(row.story_points_completed ?? 0),
        })),
        totalStoryPointsCompleted: Number(totalResult.rows[0]?.total_story_points_completed ?? 0),
        averageVelocity: avgVelocity,
      });
    } catch (error) {
      console.error("Error fetching velocity data:", error);
      res.status(500).json({ error: "Failed to fetch velocity data" });
    }
  });

  app.get("/api/reports/ai-usage", async (_req, res) => {
    try {
      // Get total AI-generated projects
      const projectsResult = await db.execute(
        sql`
          SELECT COUNT(*)::int AS total_ai_projects
          FROM ${projects}
          WHERE ${projects.status} = 'completed'
        `,
      );

      // Get AI-generated tasks count
      const tasksResult = await db.execute(
        sql`
          SELECT
            COALESCE(COUNT(*)::int, 0) AS total_ai_tasks,
            COALESCE(SUM(${tasks.storyPoints})::int, 0) AS total_story_points
          FROM ${tasks}
          WHERE COALESCE(${tasks.aiGenerated}, 0) > 0
        `,
      );

      // Get AI generations this month
      const thisMonthResult = await db.execute(
        sql`
          SELECT COUNT(*)::int AS ai_projects_this_month
          FROM ${projects}
          WHERE ${projects.status} = 'completed'
            AND ${projects.createdAt} >= DATE_TRUNC('month', NOW())
        `,
      );

      const totalAiProjects = Number(projectsResult.rows[0]?.total_ai_projects ?? 0);
      const totalAiTasks = Number(tasksResult.rows[0]?.total_ai_tasks ?? 0);
      const totalStoryPoints = Number(tasksResult.rows[0]?.total_story_points ?? 0);
      const aiProjectsThisMonth = Number(thisMonthResult.rows[0]?.ai_projects_this_month ?? 0);

      // Estimate time saved: assume 2 hours per story point for manual task creation
      const estimatedHoursSaved = Math.round(totalStoryPoints * 2);

      res.json({
        totalGenerations: totalAiProjects,
        generationsThisMonth: aiProjectsThisMonth,
        tasksGenerated: totalAiTasks,
        storyPointsGenerated: totalStoryPoints,
        estimatedHoursSaved: estimatedHoursSaved,
      });
    } catch (error) {
      console.error("Error fetching AI usage data:", error);
      res.status(500).json({ error: "Failed to fetch AI usage data" });
    }
  });

  app.get("/api/dashboard", async (_req, res) => {
    try {
      console.log("Dashboard route called");
      const allProjects = await storage.getProjects();
      console.log(`Found ${allProjects.length} projects`);

      const projectDetails = await Promise.all(
        allProjects.map(async (project) => {
          const [projectTasks, projectModules] = await Promise.all([
            storage.getTasksByProject(project.id),
            storage.getModulesByProject(project.id),
          ]);

          const completedTasks = projectTasks.filter(
            (task) => task.status === "done",
          );
          const activeTasks = projectTasks.filter((task) =>
            ACTIVE_TASK_STATUSES.has(task.status),
          );
          const blockedTasks = projectTasks.filter((task) =>
            BLOCKED_TASK_STATUSES.has(task.status),
          );

          const totalStoryPoints = projectTasks.reduce(
            (total, task) => total + (task.storyPoints ?? 0),
            0,
          );
          const completedStoryPoints = completedTasks.reduce(
            (total, task) => total + (task.storyPoints ?? 0),
            0,
          );

          return {
            project,
            tasks: projectTasks,
            modules: projectModules,
            counts: {
              total: projectTasks.length,
              completed: completedTasks.length,
              active: activeTasks.length,
              blocked: blockedTasks.length,
              totalStoryPoints,
              completedStoryPoints,
            },
          };
        }),
      );

      const allTasks = projectDetails.flatMap((entry) => entry.tasks);

      const totalProjects = projectDetails.length;
      const totalTasks = allTasks.length;
      const completedTasksCount = allTasks.filter(
        (task) => task.status === "done",
      ).length;
      const activeTasksCount = allTasks.filter((task) =>
        ACTIVE_TASK_STATUSES.has(task.status),
      ).length;
      const blockedTasksCount = allTasks.filter((task) =>
        BLOCKED_TASK_STATUSES.has(task.status),
      ).length;

      const overview = {
        totalProjects,
        totalTasks,
        completedTasks: completedTasksCount,
        activeTasks: activeTasksCount,
        blockedTasks: blockedTasksCount,
        completionRate:
          totalTasks === 0
            ? 0
            : Math.round((completedTasksCount / totalTasks) * 100),
        activeProjects: projectDetails.filter(
          (entry) => entry.counts.active > 0,
        ).length,
      };

      const spotlightCandidate =
        projectDetails
          .slice()
          .sort((a, b) => {
            if (a.counts.active === b.counts.active) {
              return (
                new Date(b.project.updatedAt).getTime() -
                new Date(a.project.updatedAt).getTime()
              );
            }
            return b.counts.active - a.counts.active;
          })
          .at(0) ?? projectDetails.at(0);

      const hasMeaningfulActivity =
        !!spotlightCandidate &&
        (spotlightCandidate.counts.active > 0 ||
          spotlightCandidate.counts.completed <
            spotlightCandidate.counts.total);

      const spotlight =
        spotlightCandidate && hasMeaningfulActivity
        ? {
            id: spotlightCandidate.project.id,
            key: spotlightCandidate.project.key,
            name: spotlightCandidate.project.name,
            status: (() => {
              const hasActive = spotlightCandidate.counts.active > 0;
              const hasRemaining =
                spotlightCandidate.counts.completed <
                spotlightCandidate.counts.total;
              if (hasActive) {
                return "active";
              }
              if (hasRemaining) {
                return "in_progress";
              }
              return spotlightCandidate.project.status;
            })(),
            progress:
              spotlightCandidate.counts.total === 0
                ? 0
                : Math.round(
                    (spotlightCandidate.counts.completed /
                      spotlightCandidate.counts.total) *
                      100,
                  ),
            summary: spotlightCandidate.project.description,
            modules: spotlightCandidate.modules
              .slice(0, 3)
              .map((module) => ({
                id: module.id,
                name: module.name,
                layer: module.layer,
              })),
            nextMilestone:
              spotlightCandidate.tasks
                .filter((task) => task.status !== "done")
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.updatedAt).getTime() -
                    new Date(b.updatedAt).getTime(),
                )
                .at(0)?.title ?? null,
            updatedAt: spotlightCandidate.project.updatedAt,
          }
        : null;

      const storyPointsTotals = allTasks.reduce(
        (acc, task) => {
          const storyPoints = task.storyPoints ?? 0;
          const bucket = acc.byStatus[task.status] ?? {
            count: 0,
            storyPoints: 0,
          };
          bucket.count += 1;
          bucket.storyPoints += storyPoints;
          acc.byStatus[task.status] = bucket;
          acc.totalStoryPoints += storyPoints;
          if (ACTIVE_TASK_STATUSES.has(task.status)) {
            acc.activeStoryPoints += storyPoints;
          }
          return acc;
        },
        {
          byStatus: {} as Record<
            string,
            { count: number; storyPoints: number }
          >,
          totalStoryPoints: 0,
          activeStoryPoints: 0,
        },
      );

      const assumedCapacity =
        Math.max(overview.activeProjects, 1) * 40;
      const workload = {
        totalStoryPoints: storyPointsTotals.totalStoryPoints,
        activeStoryPoints: storyPointsTotals.activeStoryPoints,
        capacityStoryPoints: assumedCapacity,
        utilization:
          assumedCapacity === 0
            ? 0
            : Math.min(
                100,
                Math.round(
                  (storyPointsTotals.activeStoryPoints / assumedCapacity) * 100,
                ),
              ),
        statusBreakdown: storyPointsTotals.byStatus,
      };

      const upcomingDeadlines = allTasks
        .filter((task) => task.status !== "done")
        .map((task) => {
          const referenceDate = task.updatedAt ?? task.createdAt ?? new Date();
          const storyPoints = task.storyPoints ?? 3;
          const estimatedDays = Math.max(1, Math.round(storyPoints / 2));
          const dueDate = new Date(referenceDate);
          dueDate.setDate(dueDate.getDate() + estimatedDays);

          return {
            id: task.id,
            title: task.title,
            projectId: task.projectId,
            status: task.status,
            storyPoints: storyPoints,
            dueDate,
            priority: task.priority,
          };
        })
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        )
        .slice(0, 6);

      const insights: string[] = [];
      if (blockedTasksCount > 0) {
        insights.push(
          `${blockedTasksCount} task${blockedTasksCount === 1 ? "" : "s"} need attention (blocked/backlog).`,
        );
      }
      if (overview.completionRate >= 70) {
        insights.push("Great momentum—over 70% of tasks are completed.");
      }
      if (overview.activeTasks > assumedCapacity * 0.75) {
        insights.push("Workload is nearing capacity; consider reprioritizing.");
      }
      if (insights.length === 0) {
        insights.push("All systems nominal. Keep the current pace!");
      }

      const recentProjectEvents = projectDetails
        .map((entry) => ({
          type: "project" as const,
          id: entry.project.id,
          title: entry.project.name,
          status: entry.project.status,
          timestamp: entry.project.updatedAt,
          description: `Project status is ${entry.project.status}`,
        }));

      const recentTaskEvents = allTasks.map((task) => ({
        type: "task" as const,
        id: task.id,
        title: task.title,
        status: task.status,
        timestamp: task.updatedAt ?? task.createdAt ?? new Date(),
        description: `Task ${task.key} is ${task.status.replace("_", " ")}`,
        projectId: task.projectId,
      }));

      const activityFeed = [...recentProjectEvents, ...recentTaskEvents]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime(),
        )
        .slice(0, 10);

      res.json({
        overview,
        spotlight,
        workload,
        upcomingDeadlines,
        insights,
        activityFeed,
      });
    } catch (error) {
      console.error("Error building dashboard:", error);
      console.error("Error details:", error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error);
      res.status(500).json({ 
        error: "Failed to build dashboard data",
        message: error instanceof Error ? error.message : String(error),
        ...(process.env.NODE_ENV === "development" && { 
          stack: error instanceof Error ? error.stack : undefined 
        })
      });
    }
  });

  app.get("/api/profile/activity", async (req, res, next) => {
    try {
      console.log("Profile activity route hit:", req.method, req.path);
      // Ensure we always send JSON with proper content-type header
      res.setHeader("Content-Type", "application/json");
      
      const allProjects = await storage.getProjects();
      const allTasks = await Promise.all(
        allProjects.map(async (project) => {
          return await storage.getTasksByProject(project.id);
        })
      ).then(results => results.flat());

      // Get recent project updates
      const recentProjectEvents = allProjects
        .map((project) => ({
          id: `project-${project.id}`,
          headline: `Updated project ${project.key}`,
          context: project.description || `Project ${project.name} was updated`,
          timestamp: project.updatedAt,
          type: "project" as const,
          projectId: project.id,
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5);

      // Get recent task updates (status changes, completions, etc.)
      const recentTaskEvents = allTasks
        .map((task) => {
          const project = allProjects.find((p) => p.id === task.projectId);
          const projectKey = project?.key || "UNKNOWN";
          
          let headline = "";
          let context = "";
          
          if (task.status === "done") {
            headline = `Completed task ${projectKey}-${task.key}`;
            context = task.title;
          } else if (task.status === "in_progress") {
            headline = `Started task ${projectKey}-${task.key}`;
            context = task.title;
          } else if (task.status === "review") {
            headline = `Moved task ${projectKey}-${task.key} to review`;
            context = task.title;
          } else {
            headline = `Updated task ${projectKey}-${task.key}`;
            context = task.title;
          }

          return {
            id: `task-${task.id}`,
            headline,
            context,
            timestamp: task.updatedAt || task.createdAt,
            type: "task" as const,
            projectId: task.projectId,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10);

      // Combine and sort all activities
      const activities = [...recentProjectEvents, ...recentTaskEvents]
        .filter((activity) => activity.timestamp != null) // Filter out activities with null/undefined timestamps
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 15)
        .map((activity) => {
          const timestamp = activity.timestamp instanceof Date 
            ? activity.timestamp.toISOString() 
            : typeof activity.timestamp === 'string' 
              ? new Date(activity.timestamp).toISOString() 
              : new Date().toISOString(); // Fallback to current time if invalid
          return {
            ...activity,
            timestamp,
          };
        });

      // Check if response has already been sent
      if (res.headersSent) {
        return;
      }
      
      res.json(activities);
    } catch (error) {
      console.error("Error fetching profile activity:", error);
      // Check if response has already been sent
      if (res.headersSent) {
        return next(error);
      }
      // Ensure error response is also JSON
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ 
        error: "Failed to fetch profile activity",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
