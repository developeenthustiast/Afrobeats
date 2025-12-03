-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('pending', 'active', 'repaid', 'liquidated');

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "artists" TEXT[],
    "isrc" TEXT NOT NULL,
    "genres" TEXT[],
    "ipfsURI" TEXT NOT NULL,
    "fingerprintHash" TEXT NOT NULL,
    "registrationTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDisputed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamingData" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "platform" TEXT NOT NULL,
    "streams" INTEGER NOT NULL,
    "earnings" DECIMAL(18,6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoyaltyPayment" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoyaltyPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "loanId" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,
    "borrower" TEXT NOT NULL,
    "principal" DECIMAL(18,6) NOT NULL,
    "interestRate" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "healthFactor" DECIMAL(5,2),
    "startedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "repaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanRepayment" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "principal" DECIMAL(18,6) NOT NULL,
    "interest" DECIMAL(18,6) NOT NULL,
    "txHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanRepayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningsPrediction" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "projectedAmount" DECIMAL(18,6) NOT NULL,
    "confidence" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningsPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "email" TEXT,
    "artistName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "totalSongs" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalSongs" INTEGER NOT NULL,
    "totalStreams" BIGINT NOT NULL,
    "totalEarnings" DECIMAL(18,6) NOT NULL,
    "activeArtists" INTEGER NOT NULL,
    "totalLoans" INTEGER NOT NULL,
    "totalBorrowed" DECIMAL(18,6) NOT NULL,
    "avgHealthFactor" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "metadata" JSONB,
    "txHash" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_tokenId_key" ON "Song"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_isrc_key" ON "Song"("isrc");

-- CreateIndex
CREATE INDEX "Song_isrc_idx" ON "Song"("isrc");

-- CreateIndex
CREATE INDEX "Song_tokenId_idx" ON "Song"("tokenId");

-- CreateIndex
CREATE INDEX "Song_registrationTimestamp_idx" ON "Song"("registrationTimestamp");

-- CreateIndex
CREATE INDEX "StreamingData_songId_date_idx" ON "StreamingData"("songId", "date");

-- CreateIndex
CREATE INDEX "StreamingData_date_idx" ON "StreamingData"("date");

-- CreateIndex
CREATE UNIQUE INDEX "StreamingData_songId_date_platform_key" ON "StreamingData"("songId", "date", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "RoyaltyPayment_txHash_key" ON "RoyaltyPayment"("txHash");

-- CreateIndex
CREATE INDEX "RoyaltyPayment_songId_idx" ON "RoyaltyPayment"("songId");

-- CreateIndex
CREATE INDEX "RoyaltyPayment_beneficiary_idx" ON "RoyaltyPayment"("beneficiary");

-- CreateIndex
CREATE INDEX "RoyaltyPayment_timestamp_idx" ON "RoyaltyPayment"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_loanId_key" ON "Loan"("loanId");

-- CreateIndex
CREATE INDEX "Loan_borrower_idx" ON "Loan"("borrower");

-- CreateIndex
CREATE INDEX "Loan_status_idx" ON "Loan"("status");

-- CreateIndex
CREATE INDEX "Loan_dueAt_idx" ON "Loan"("dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "LoanRepayment_txHash_key" ON "LoanRepayment"("txHash");

-- CreateIndex
CREATE INDEX "LoanRepayment_loanId_idx" ON "LoanRepayment"("loanId");

-- CreateIndex
CREATE INDEX "LoanRepayment_timestamp_idx" ON "LoanRepayment"("timestamp");

-- CreateIndex
CREATE INDEX "EarningsPrediction_songId_timestamp_idx" ON "EarningsPrediction"("songId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSnapshot_date_key" ON "AnalyticsSnapshot"("date");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_date_idx" ON "AnalyticsSnapshot"("date");

-- CreateIndex
CREATE INDEX "AuditLog_actor_idx" ON "AuditLog"("actor");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "StreamingData" ADD CONSTRAINT "StreamingData_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoyaltyPayment" ADD CONSTRAINT "RoyaltyPayment_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRepayment" ADD CONSTRAINT "LoanRepayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsPrediction" ADD CONSTRAINT "EarningsPrediction_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
