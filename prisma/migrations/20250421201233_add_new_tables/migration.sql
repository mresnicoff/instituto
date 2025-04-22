-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "passhasheada" TEXT NOT NULL,
    "puedeescribir" BOOLEAN NOT NULL,
    "linkautor" TEXT,
    "tokenEmail" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "categoria" TEXT,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instusuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "passhasheada" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "tokenEmail" TEXT,

    CONSTRAINT "instusuarios_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "instdiponibilidades" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "instdiponibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instreservas" (
    "id" SERIAL NOT NULL,
    "profesorId" INTEGER NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "ref" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "instreservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instusuarios_email_key" ON "instusuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instmaterias_nombre_key" ON "instmaterias"("nombre");

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instusuario_instmateria" ADD CONSTRAINT "instusuario_instmateria_instusuarioId_fkey" FOREIGN KEY ("instusuarioId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instusuario_instmateria" ADD CONSTRAINT "instusuario_instmateria_instmateriaId_fkey" FOREIGN KEY ("instmateriaId") REFERENCES "instmaterias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instdiponibilidades" ADD CONSTRAINT "instdiponibilidades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instreservas" ADD CONSTRAINT "instreservas_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instreservas" ADD CONSTRAINT "instreservas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "instusuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
