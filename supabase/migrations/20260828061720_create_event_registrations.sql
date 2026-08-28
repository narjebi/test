/*
# Create event_registrations table (single-tenant, no auth)

1. New Tables
- `event_registrations`
  - `id` (uuid, primary key)
  - `name` (text, not null) — 신청자 이름
  - `phone` (text, not null) — 신청자 전화번호
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `event_registrations`.
- Allow anon + authenticated INSERT only (누구나 신청 가능, 조회는 불가).
- SELECT/UPDATE/DELETE는 허용하지 않음 (개인정보 보호).
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_event_registrations" ON event_registrations;
CREATE POLICY "anon_insert_event_registrations" ON event_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
