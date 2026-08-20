/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, sender name)
      - `email` (text, sender email)
      - `subject` (text, message subject)
      - `message` (text, message body)
      - `recipient` (text, recipient email)
      - `created_at` (timestamptz, submission time)
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add insert policy for anonymous users (public form)
    - Add select policy for service role only (via edge function)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  recipient text NOT NULL DEFAULT 'p.b.iusztin@gmail.com',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can read submissions"
  ON contact_submissions
  FOR SELECT
  TO service_role
  USING (true);
