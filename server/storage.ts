import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type Module,
  type InsertModule,
  users,
  projects,
  tasks,
  modules,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createProject(project: InsertProject): Promise<Project>;
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  updateProject(id: string, data: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;

  createTask(task: InsertTask): Promise<Task>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  updateTask(id: string, data: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;

  createModule(module: InsertModule): Promise<Module>;
  getModulesByProject(projectId: string): Promise<Module[]>;
  deleteModulesByProject(projectId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.projectId, projectId));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | undefined> {
    const result = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async createModule(module: InsertModule): Promise<Module> {
    const result = await db.insert(modules).values(module).returning();
    return result[0];
  }

  async getModulesByProject(projectId: string): Promise<Module[]> {
    return db.select().from(modules).where(eq(modules.projectId, projectId));
  }

  async deleteModulesByProject(projectId: string): Promise<void> {
    await db.delete(modules).where(eq(modules.projectId, projectId));
  }
}

export const storage = new DatabaseStorage();
