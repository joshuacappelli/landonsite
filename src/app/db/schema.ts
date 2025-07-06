import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    date: integer('date', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    image: text('image').notNull(),
    guide: integer('guide', { mode: 'boolean' }).notNull().default(false),
    location: text('location'),
    country: text('country'),
    tags: text('tags', { mode: 'json' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const heroSettings = sqliteTable('hero_settings', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    secondDescription: text('second_description').notNull(),
    fontColor: text('font_color').notNull(),
    textColor: text('text_color').notNull(),
    video: text('video').notNull(),
    backgroundColor: text('background_color').notNull(),
    fontSize: integer('font_size').notNull(),
    image: text('image').notNull(),
});

export const heroFavorites = sqliteTable('hero_favorites', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    blogId: integer('blog_id'),
    image: text('image').notNull(),
});

export const heroTags = sqliteTable('hero_tags', {
    id: integer('id').primaryKey(),
    tag: text('tag').notNull(),
    image: text('image').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const newsLetterUsers = sqliteTable('newsletter_users', {
    id: integer('id').primaryKey(),
    email: text('email').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const cameraRollImages = sqliteTable('camera_roll_images', {
    id: integer('id').primaryKey(),
    image: text('image').notNull(),
    continent: text('continent'),
    country: text('country'),
    googleMaps: text('google_maps'),
    name: text('name'),
    location: text('location'),
    date: integer('date', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const cameraRollVideos = sqliteTable('camera_roll_videos', {
    id: integer('id').primaryKey(),
    video: text('video').notNull(),
    continent: text('continent'),
    country: text('country'),
    googleMaps: text('google_maps'),
    name: text('name'),
    location: text('location'),
    date: integer('date', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const faq = sqliteTable('faq', {
    id: integer('id').primaryKey(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const aboutMe = sqliteTable('about_me', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    secondTitle: text('second_title').notNull(),
    description: text('description').notNull(),
    secondDescription: text('second_description').notNull(),
    image: text('image').notNull(),
    secondImage: text('second_image').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const quickFacts = sqliteTable('quick_facts', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const locations = sqliteTable('locations', {
    id: integer('id').primaryKey(),
    country: text('country').notNull(),
    city: text('city').notNull(),
    continent: text('continent').notNull(),
    image: text('image').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});






