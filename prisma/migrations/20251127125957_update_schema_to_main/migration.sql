-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'user';
