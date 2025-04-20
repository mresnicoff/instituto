-- CreateTable
CREATE TABLE "Instdisponibilidades" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "Instdisponibilidades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Instdisponibilidades" ADD CONSTRAINT "Instdisponibilidades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
