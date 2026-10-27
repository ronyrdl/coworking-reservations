ALTER TABLE "Reservation"
ADD COLUMN "idempotencyKey" TEXT;

CREATE UNIQUE INDEX "Reservation_userId_idempotencyKey_key"
ON "Reservation"("userId", "idempotencyKey");