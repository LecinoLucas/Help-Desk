/*
  Warnings:

  - You are about to drop the column `anexo` on the `Chamado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "anexo";

-- CreateTable
CREATE TABLE "Arquivo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chamadoId" INTEGER NOT NULL,

    CONSTRAINT "Arquivo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Arquivo" ADD CONSTRAINT "Arquivo_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "Chamado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
