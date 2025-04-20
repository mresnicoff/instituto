-- CreateTable
CREATE TABLE "instmaterias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "instmaterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instusuario_instmateria" (
    "instusuarioId" INTEGER NOT NULL,
    "instmateriaId" INTEGER NOT NULL,

    CONSTRAINT "instusuario_instmateria_pkey" PRIMARY KEY ("instusuarioId","instmateriaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "instmaterias_nombre_key" ON "instmaterias"("nombre");

-- AddForeignKey
ALTER TABLE "instusuario_instmateria" ADD CONSTRAINT "instusuario_instmateria_instusuarioId_fkey" FOREIGN KEY ("instusuarioId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instusuario_instmateria" ADD CONSTRAINT "instusuario_instmateria_instmateriaId_fkey" FOREIGN KEY ("instmateriaId") REFERENCES "instmaterias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
