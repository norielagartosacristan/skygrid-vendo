import prisma from "../config/prisma";
import { hashPassword } from "../utils/hash";

export async function getUsers() {
  return prisma.user.findMany({
    include: {
      vendor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      vendor: true,
    },
  });
}

export async function createUser(data: {
  fullName: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "VENDOR" | "STAFF";
  vendorId?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existing) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      vendorId: data.vendorId,
    },
  });
}

export async function updateUser(
  id: string,
  data: {
    fullName?: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "VENDOR" | "STAFF";
    vendorId?: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}