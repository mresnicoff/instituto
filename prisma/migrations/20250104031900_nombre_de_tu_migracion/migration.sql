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

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instusuarios_email_key" ON "instusuarios"("email");

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
