-- CreateEnum
CREATE TYPE "Eligibility" AS ENUM ('WORLDWIDE', 'RELOCATION_SPONSORED', 'REGION_LIMITED', 'RESTRICTED', 'UNCLEAR');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('USA', 'CANADA', 'UK', 'GERMANY', 'NETHERLANDS', 'IRELAND', 'PORTUGAL', 'SPAIN', 'FRANCE', 'SWITZERLAND', 'EU_OTHER', 'GULF', 'ASIA_PACIFIC', 'OTHER', 'UNCLEAR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "companyLogo" TEXT,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "jobTypes" TEXT[],
    "locationRaw" TEXT,
    "eligibility" "Eligibility" NOT NULL DEFAULT 'UNCLEAR',
    "region" "Region" NOT NULL DEFAULT 'UNCLEAR',
    "salary" TEXT,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'SAVED',
    "appliedAt" TIMESTAMP(3),
    "followUpAt" TIMESTAMP(3),
    "resumeVersion" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_source_sourceId_key" ON "Job"("source", "sourceId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
