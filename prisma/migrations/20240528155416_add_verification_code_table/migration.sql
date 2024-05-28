-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetAccountToken" TEXT;

-- CreateTable
CREATE TABLE "VerifyCode" (
    "code" TEXT NOT NULL,
    "expires" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VerifyCode_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "VerifyCode" ADD CONSTRAINT "VerifyCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
