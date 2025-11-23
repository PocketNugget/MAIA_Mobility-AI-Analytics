-- Create saved_graphics table
create table "public"."saved_graphics" (
  "id" uuid not null default gen_random_uuid(),
  "name" text not null,
  "graphic_type" text not null,
  "group_by" text not null,
  "filters" jsonb default '{}'::jsonb,
  "date_range" text not null default 'last7days',
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now()
);

-- Add primary key
alter table "public"."saved_graphics" 
  add constraint "saved_graphics_pkey" primary key ("id");

-- Add check constraints
alter table "public"."saved_graphics" 
  add constraint "saved_graphics_graphic_type_check" 
  check (graphic_type in ('timeseries', 'topN', 'barChart', 'pieChart'));

alter table "public"."saved_graphics" 
  add constraint "saved_graphics_group_by_check" 
  check (group_by in ('service', 'source', 'category', 'priority', 'subservice'));

-- Add indexes
create index "idx_saved_graphics_created_at" on "public"."saved_graphics" using btree (created_at);
create index "idx_saved_graphics_graphic_type" on "public"."saved_graphics" using btree (graphic_type);
