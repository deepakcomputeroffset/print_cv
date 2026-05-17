-- AlterTable
ALTER TABLE "job" ADD COLUMN     "prefixId" INTEGER;

-- CreateTable
CREATE TABLE "jobPrefix" (
    "id" SERIAL NOT NULL,
    "prefix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobPrefix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobPrefix_prefix_key" ON "jobPrefix"("prefix");

-- CreateIndex
CREATE INDEX "jobPrefix_prefix_idx" ON "jobPrefix"("prefix");
