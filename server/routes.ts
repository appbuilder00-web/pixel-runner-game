import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.scores.list.path, async (req, res) => {
    try {
      const topScores = await storage.getTopScores();
      res.json(topScores);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch scores" });
    }
  });

  app.post(api.scores.create.path, async (req, res) => {
    try {
      const input = api.scores.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create score" });
    }
  });

  // Seed database on startup if empty
  try {
    const existingScores = await storage.getTopScores();
    if (existingScores.length === 0) {
      await storage.createScore({ playerName: "RunnerPro", score: 1500 });
      await storage.createScore({ playerName: "SubwayKing", score: 1200 });
      await storage.createScore({ playerName: "DashMaster", score: 950 });
      console.log("Database seeded with initial scores");
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }

  return httpServer;
}
