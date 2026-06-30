import type { Request, Response } from "express";
import * as UserService from "../services/user.service";
import { success, failed } from "../utils/response";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserService.getUsers();

    res.json(success(users));
  } catch (error: any) {
    res.status(500).json(failed(error.message));
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const user = await UserService.getUserById(id);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const user = await UserService.createUser(req.body);

    res.status(201).json(success(user, "User created successfully."));
  } catch (error: any) {
    res.status(400).json(failed(error.message));
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const user = await UserService.updateUser(
      req.params.id[0],
      req.body
    );

    res.json(success(user, "User updated successfully."));
  } catch (error: any) {
    res.status(400).json(failed(error.message));
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await UserService.deleteUser(req.params.id[0]);

    res.json(success(null, "User deleted successfully."));
  } catch (error: any) {
    res.status(400).json(failed(error.message));
  }
}