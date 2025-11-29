/*
  Warnings:

  - You are about to drop the column `discord_invite_url` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `discord_webhook_url` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "discord_invite_url",
DROP COLUMN "discord_webhook_url";

-- CreateTable
CREATE TABLE "group_likes" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "group_likes_group_id_idx" ON "group_likes"("group_id");

-- CreateIndex
CREATE INDEX "group_likes_user_id_idx" ON "group_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_likes_group_id_user_id_key" ON "group_likes"("group_id", "user_id");

-- AddForeignKey
ALTER TABLE "group_likes" ADD CONSTRAINT "group_likes_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_likes" ADD CONSTRAINT "group_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
