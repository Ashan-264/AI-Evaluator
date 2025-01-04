/*
  Warnings:

  - You are about to drop the `LLM` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LLM";

-- CreateTable
CREATE TABLE "llm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "llm_pkey" PRIMARY KEY ("id")
);
