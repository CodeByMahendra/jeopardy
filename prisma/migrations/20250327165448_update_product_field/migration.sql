-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL', 'DIGITAL');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PHYSICAL';
