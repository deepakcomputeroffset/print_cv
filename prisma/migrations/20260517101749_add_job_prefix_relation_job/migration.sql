-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_prefixId_fkey" FOREIGN KEY ("prefixId") REFERENCES "jobPrefix"("id") ON DELETE SET NULL ON UPDATE CASCADE;
