-- Create a table for journal entries
create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  mood text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table journal_entries enable row level security;

-- Create policies
create policy "Users can view their own entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on journal_entries for delete
  using (auth.uid() = user_id); 