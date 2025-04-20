-- CreateTable
CREATE TABLE "instreservas" (
    "id" SERIAL NOT NULL,
    "profesorId" INTEGER NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,

    CONSTRAINT "instreservas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "instreservas" ADD CONSTRAINT "instreservas_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instreservas" ADD CONSTRAINT "instreservas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
