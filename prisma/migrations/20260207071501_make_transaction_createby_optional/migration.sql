-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_createBy_fkey";

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "createBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
