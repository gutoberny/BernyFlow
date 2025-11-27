/*
  Warnings:

  - You are about to drop the column `companyId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `serviceOrderId` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `otherCosts` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `profitMargin` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `displacementCost` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `service_order` table. All the data in the column will be lost.
  - You are about to drop the column `isFirstHour` on the `service_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `service_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `service_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `serviceOrderId` on the `service_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `service_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `service_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `financial_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `financial_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `service_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `service_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `service_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_order_id` to the `service_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `service_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `service_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_companyId_fkey";

-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_companyId_fkey";

-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_serviceOrderId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_companyId_fkey";

-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_companyId_fkey";

-- DropForeignKey
ALTER TABLE "service_order" DROP CONSTRAINT "service_order_clientId_fkey";

-- DropForeignKey
ALTER TABLE "service_order" DROP CONSTRAINT "service_order_companyId_fkey";

-- DropForeignKey
ALTER TABLE "service_order_item" DROP CONSTRAINT "service_order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "service_order_item" DROP CONSTRAINT "service_order_item_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_order_item" DROP CONSTRAINT "service_order_item_serviceOrderId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_companyId_fkey";

-- AlterTable
ALTER TABLE "client" DROP COLUMN "companyId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "company" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "financial_transaction" DROP COLUMN "companyId",
DROP COLUMN "createdAt",
DROP COLUMN "dueDate",
DROP COLUMN "paidAt",
DROP COLUMN "serviceOrderId",
DROP COLUMN "updatedAt",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "service_order_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "companyId",
DROP COLUMN "costPrice",
DROP COLUMN "createdAt",
DROP COLUMN "otherCosts",
DROP COLUMN "profitMargin",
DROP COLUMN "updatedAt",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "cost_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "other_costs" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "profit_margin" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "service" DROP COLUMN "companyId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "service_order" DROP COLUMN "clientId",
DROP COLUMN "companyId",
DROP COLUMN "createdAt",
DROP COLUMN "displacementCost",
DROP COLUMN "endDate",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentType",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "client_id" INTEGER NOT NULL,
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displacement_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "payment_method" TEXT,
ADD COLUMN     "payment_type" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "service_order_item" DROP COLUMN "isFirstHour",
DROP COLUMN "productId",
DROP COLUMN "serviceId",
DROP COLUMN "serviceOrderId",
DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice",
ADD COLUMN     "is_first_hour" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "product_id" INTEGER,
ADD COLUMN     "service_id" INTEGER,
ADD COLUMN     "service_order_id" INTEGER NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "companyId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_item" ADD CONSTRAINT "service_order_item_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_item" ADD CONSTRAINT "service_order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_item" ADD CONSTRAINT "service_order_item_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction" ADD CONSTRAINT "financial_transaction_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction" ADD CONSTRAINT "financial_transaction_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
