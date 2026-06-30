import prisma from "../config/prisma";

export async function getPackages() {
  return prisma.package.findMany({
    orderBy: {
      price: "asc",
    },
  });
}