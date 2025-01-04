/*
  Warnings:

  - You are about to drop the column `match` on the `llm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "llm" DROP COLUMN "match",
ADD COLUMN     "cosineSimilarity" TEXT,
ADD COLUMN     "exactMatch" TEXT;
