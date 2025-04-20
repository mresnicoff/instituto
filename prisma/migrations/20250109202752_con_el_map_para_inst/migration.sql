/*
  Warnings:

  - You are about to drop the `Instdisponibilidades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Instdisponibilidades" DROP CONSTRAINT "Instdisponibilidades_userId_fkey";

-- DropTable
DROP TABLE "Instdisponibilidades";

-- CreateTable
CREATE TABLE "instdiponibilidades" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "instdiponibilidades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "instdiponibilidades" ADD CONSTRAINT "instdiponibilidades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
