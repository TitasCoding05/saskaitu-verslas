-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "ProcessedDocument" ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING';
