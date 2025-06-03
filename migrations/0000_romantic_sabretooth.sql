CREATE TABLE `about_me` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`second_title` text NOT NULL,
	`description` text NOT NULL,
	`second_description` text NOT NULL,
	`image` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `camera_roll_images` (
	`id` integer PRIMARY KEY NOT NULL,
	`image` text NOT NULL,
	`location` text NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `camera_roll_videos` (
	`id` integer PRIMARY KEY NOT NULL,
	`video` text NOT NULL,
	`location` text NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faq` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hero_favorites` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hero_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`font_color` text NOT NULL,
	`text_color` text NOT NULL,
	`video` text NOT NULL,
	`background_color` text NOT NULL,
	`font_size` integer NOT NULL,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hero_tags` (
	`id` integer PRIMARY KEY NOT NULL,
	`tag` text NOT NULL,
	`image` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY NOT NULL,
	`country` text NOT NULL,
	`city` text NOT NULL,
	`image` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `newsletter_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`image` text NOT NULL,
	`location` text NOT NULL,
	`tags` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quick_facts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
