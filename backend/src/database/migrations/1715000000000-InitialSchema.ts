import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1715000000000 implements MigrationInterface {
    name = 'InitialSchema1715000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Enums
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('admin', 'barber', 'client')`);
        await queryRunner.query(`CREATE TYPE "loyalty_cards_tier_enum" AS ENUM('bronze', 'silver', 'gold', 'platinum')`);
        await queryRunner.query(`CREATE TYPE "bookings_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show')`);
        await queryRunner.query(`CREATE TYPE "queue_entries_status_enum" AS ENUM('waiting', 'serving', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "payments_status_enum" AS ENUM('pending', 'succeeded', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "notifications_type_enum" AS ENUM('sms', 'email', 'push')`);
        await queryRunner.query(`CREATE TYPE "notifications_status_enum" AS ENUM('scheduled', 'sent', 'failed')`);

        // Create Tables
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "full_name" character varying NOT NULL,
                "role" "users_role_enum" NOT NULL DEFAULT 'client',
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "barbers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid NOT NULL,
                "specialties" jsonb,
                "working_hours" jsonb,
                "is_active" boolean NOT NULL DEFAULT true,
                "commission_rate" numeric(5,2) NOT NULL DEFAULT 0,
                CONSTRAINT "PK_barbers" PRIMARY KEY ("id"),
                CONSTRAINT "REL_barbers_user" UNIQUE ("user_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "duration" integer NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "category" character varying NOT NULL,
                CONSTRAINT "PK_services" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid NOT NULL,
                "phone" character varying NOT NULL,
                "visit_count" integer NOT NULL DEFAULT 0,
                "notes" text,
                CONSTRAINT "PK_clients" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_clients_phone" UNIQUE ("phone"),
                CONSTRAINT "REL_clients_user" UNIQUE ("user_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "loyalty_cards" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "client_id" uuid NOT NULL,
                "points" integer NOT NULL DEFAULT 0,
                "tier" "loyalty_cards_tier_enum" NOT NULL DEFAULT 'bronze',
                "rewards" jsonb,
                CONSTRAINT "PK_loyalty_cards" PRIMARY KEY ("id"),
                CONSTRAINT "REL_loyalty_cards_client" UNIQUE ("client_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "bookings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "client_id" uuid NOT NULL,
                "barber_id" uuid NOT NULL,
                "service_id" uuid NOT NULL,
                "scheduled_at" TIMESTAMP NOT NULL,
                "status" "bookings_status_enum" NOT NULL DEFAULT 'pending',
                "total_price" numeric(10,2) NOT NULL,
                CONSTRAINT "PK_bookings" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "queue_entries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "client_id" uuid NOT NULL,
                "barber_id" uuid,
                "position" integer NOT NULL,
                "status" "queue_entries_status_enum" NOT NULL DEFAULT 'waiting',
                "estimated_wait_minutes" integer NOT NULL,
                CONSTRAINT "PK_queue_entries" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "booking_id" uuid NOT NULL,
                "amount" numeric(10,2) NOT NULL,
                "stripe_id" character varying,
                "status" "payments_status_enum" NOT NULL DEFAULT 'pending',
                CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
                CONSTRAINT "REL_payments_booking" UNIQUE ("booking_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "commissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "barber_id" uuid NOT NULL,
                "booking_id" uuid NOT NULL,
                "amount" numeric(10,2) NOT NULL,
                "rate" numeric(5,2) NOT NULL,
                "paid_at" TIMESTAMP,
                CONSTRAINT "PK_commissions" PRIMARY KEY ("id"),
                CONSTRAINT "REL_commissions_booking" UNIQUE ("booking_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "client_id" uuid NOT NULL,
                "type" "notifications_type_enum" NOT NULL,
                "scheduled_at" TIMESTAMP NOT NULL,
                "sent_at" TIMESTAMP,
                "status" "notifications_status_enum" NOT NULL DEFAULT 'scheduled',
                "content" text NOT NULL,
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
            )
        `);

        // Add Foreign Keys
        await queryRunner.query(`ALTER TABLE "barbers" ADD CONSTRAINT "FK_barber_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_client_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "loyalty_cards" ADD CONSTRAINT "FK_loyalty_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id")`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id")`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_service" FOREIGN KEY ("service_id") REFERENCES "services"("id")`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id")`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id")`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payment_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_commission_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id")`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_commission_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notification_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id")`);

        // Create Indexes
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_barber_user_id" ON "barbers" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "idx_client_user_id" ON "clients" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "idx_client_phone" ON "clients" ("phone")`);
        await queryRunner.query(`CREATE INDEX "idx_booking_scheduled_at" ON "bookings" ("scheduled_at")`);
        await queryRunner.query(`CREATE INDEX "idx_payment_stripe_id" ON "payments" ("stripe_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "commissions"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "queue_entries"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "loyalty_cards"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "barbers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        
        await queryRunner.query(`DROP TYPE "notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "queue_entries_status_enum"`);
        await queryRunner.query(`DROP TYPE "bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "loyalty_cards_tier_enum"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
    }
}