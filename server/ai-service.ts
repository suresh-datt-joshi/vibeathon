import { GoogleGenAI } from "@google/genai";
import type { Project, Task, Module } from "@shared/schema";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AIProjectSpec {
  architecture: {
    frontend: Array<{
      name: string;
      description: string;
      technologies: string[];
      dependencies: string[];
    }>;
    backend: Array<{
      name: string;
      description: string;
      technologies: string[];
      dependencies: string[];
    }>;
    database: Array<{
      name: string;
      description: string;
      technologies: string[];
      schema?: string;
    }>;
  };
  tasks: Array<{
    key: string;
    title: string;
    description: string;
    type: "epic" | "story" | "subtask";
    priority: "highest" | "high" | "medium" | "low" | "lowest";
    storyPoints: number;
    labels?: string[];
  }>;
}

export async function generateProjectSpec(
  projectKey: string,
  projectName: string,
  requirements: string,
  onProgress?: (stage: string, progress: number) => void
): Promise<AIProjectSpec> {
  const prompt = `You are an expert software architect and project planner. Generate a comprehensive project specification for the following project:

Project Name: ${projectName}
Project Key: ${projectKey}
Requirements: ${requirements}

Generate a detailed project specification in JSON format with the following structure:

1. Architecture breakdown with THREE layers (frontend, backend, database):
   - Each layer should have 2-5 modules
   - Each module needs: name, description, technologies array, dependencies array
   - For database modules, include schema suggestions

2. Task breakdown (15-25 tasks) with proper hierarchy:
   - Mix of epics (3-5), stories (10-15), and subtasks (5-10)
   - Each task needs: title, description, type, priority, storyPoints (1-13), optional labels
   - Tasks should be: specific, actionable, and in logical order
   - Include technical implementation details in descriptions
   - Use priorities: highest, high, medium, low, lowest
   - Story points: 1 (trivial), 2-3 (small), 5 (medium), 8 (large), 13 (epic)

Respond ONLY with valid JSON in this exact format:
{
  "architecture": {
    "frontend": [{"name": "...", "description": "...", "technologies": [], "dependencies": []}],
    "backend": [{"name": "...", "description": "...", "technologies": [], "dependencies": []}],
    "database": [{"name": "...", "description": "...", "technologies": [], "schema": "..."}]
  },
  "tasks": [
    {"key": "${projectKey}-1", "title": "...", "description": "...", "type": "epic", "priority": "high", "storyPoints": 13, "labels": ["backend"]},
    {"key": "${projectKey}-2", "title": "...", "description": "...", "type": "story", "priority": "medium", "storyPoints": 5, "labels": ["frontend"]}
  ]
}`;

  try {
    if (onProgress) {
      onProgress("Analyzing requirements...", 10);
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    if (onProgress) {
      onProgress("Parsing AI response...", 90);
    }

    const text = response.text || "";
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response. Response was: " + text.substring(0, 200));
    }

    let spec: AIProjectSpec;
    try {
      spec = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error("Failed to parse JSON from AI response: " + (parseError instanceof Error ? parseError.message : "Unknown error"));
    }

    if (!spec.architecture || !spec.tasks) {
      throw new Error("Invalid AI response structure: missing architecture or tasks");
    }
    
    if (!Array.isArray(spec.tasks) || spec.tasks.length === 0) {
      throw new Error("AI response must include at least one task");
    }

    if (onProgress) {
      onProgress("Completed", 100);
    }

    return spec;
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error(`Failed to generate project spec: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function* generateProjectSpecStreaming(
  projectKey: string,
  projectName: string,
  requirements: string
) {
  yield { stage: "Analyzing requirements...", progress: 10 };

  const prompt = `You are an expert software architect. Generate a comprehensive project specification for:

Project: ${projectName} (${projectKey})
Requirements: ${requirements}

Respond with JSON containing:
1. architecture: {frontend: [...modules], backend: [...modules], database: [...modules]}
2. tasks: [...15-25 tasks with varying types and priorities]

Each module: name, description, technologies[], dependencies[]
Each task: key, title, description, type (epic/story/subtask), priority, storyPoints, labels[]`;

  try {
    yield { stage: "Generating architecture...", progress: 40 };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });
    
    yield { stage: "Processing modules...", progress: 70 };

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response");
    }

    yield { stage: "Finalizing tasks...", progress: 95 };
    const spec: AIProjectSpec = JSON.parse(jsonMatch[0]);

    yield { stage: "Complete", progress: 100, data: spec };
  } catch (error) {
    throw new Error(`AI generation failed: ${error instanceof Error ? error.message : "Unknown"}`);
  }
}
