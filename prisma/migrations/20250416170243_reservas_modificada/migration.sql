/*
  Warnings:

  - Added the required column `ref` to the `instreservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `instreservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instreservas" ADD COLUMN     "ref" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
