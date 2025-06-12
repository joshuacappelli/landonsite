import { db } from './index';
import { heroSettings, heroFavorites, heroTags, aboutMe, quickFacts, faq, locations, cameraRollImages, cameraRollVideos, posts } from './schema';
import { eq, sql } from 'drizzle-orm';

// Hero Settings Queries
export async function getHeroSettings() {
  console.log('getHeroSettings');
  const settings = await db.select().from(heroSettings);
  console.log('settings');
  console.log(settings);
  return settings[0] || null;
}

export async function createHeroSettings(data: {
  title: string;
  description: string;
  fontColor: string;
  textColor: string;
  video: string;
  backgroundColor: string;
  fontSize: number;
  image: string;
}) {
  console.log('createHeroSettings');
  console.log(data);
  return await db.insert(heroSettings).values(data);
}

export async function updateHeroSettings(id: number, data: {
  id?: number;
  title: string;
  description: string;
  fontColor: string;
  textColor: string;
  video: string;
  backgroundColor: string;
  fontSize: number;
  image: string;
}) {
  console.log('updateHeroSettings - Full data:', data);
  
  // Remove id from the data object if it exists
  const { id: _, ...updateData } = data;
  console.log(_)
  
  // Log each field and its type
  Object.entries(updateData).forEach(([key, value]) => {
    console.log(`Field: ${key}, Value: ${value}, Type: ${typeof value}`);
  });
  
  console.log('Final updateData:', updateData);
  
  try {
    const result = await db
      .update(heroSettings)
      .set(updateData)
      .where(eq(heroSettings.id, id));
    console.log('Update successful:', result);
    return result;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}

// Hero Favorites Queries
export async function getHeroFavorites() {
  return await db.select().from(heroFavorites);
}

export async function createHeroFavorite(data: {
  title: string;
  description: string;
  image: string;
}) {
  return await db.insert(heroFavorites).values(data);
}

export async function updateHeroFavorite(id: number, data: {
  title: string;
  description: string;
  image: string;
}) {
  return await db
    .update(heroFavorites)
    .set(data)
    .where(eq(heroFavorites.id, id));
}

export async function deleteHeroFavorite(id: number) {
  return await db
    .delete(heroFavorites)
    .where(eq(heroFavorites.id, id));
}

// Hero Tags Queries
export async function getHeroTags() {
  return await db.select().from(heroTags);
}

export async function createHeroTag(data: {
  tag: string;
  image: string;
}) {
  return await db.insert(heroTags).values(data);
}

export async function updateHeroTag(id: number, data: {
  tag: string;
  image: string;
}) {
  return await db
    .update(heroTags)
    .set(data)
    .where(eq(heroTags.id, id));
}

export async function deleteHeroTag(id: number) {
  return await db
    .delete(heroTags)
    .where(eq(heroTags.id, id));
}

// About Me Queries
export async function getAboutMe() {
  const about = await db.select().from(aboutMe);
  return about[0] || null;
}

export async function createAboutMe(data: {
  title: string;
  secondTitle: string;
  description: string;
  secondDescription: string;
  image: string;
}) {
  return await db.insert(aboutMe).values(data);
}

export async function updateAboutMe(id: number, data: {
  title: string;
  secondTitle: string;
  description: string;
  secondDescription: string;
  image: string;
}) {
  return await db
    .update(aboutMe)
    .set(data)
    .where(eq(aboutMe.id, 1));
}

// Quick Facts Queries
export async function getQuickFacts() {
  return await db.select().from(quickFacts);
}

export async function createQuickFact(data: {
  title: string;
  description: string;
}) {
  return await db.insert(quickFacts).values(data);
}

export async function updateQuickFact(id: number, data: {
  title: string;
  description: string;
}) {
  return await db
    .update(quickFacts)
    .set(data)
    .where(eq(quickFacts.id, id));
}

export async function deleteQuickFact(id: number) {
  return await db
    .delete(quickFacts)
    .where(eq(quickFacts.id, id));
}

export async function getFAQ() {
  return await db.select().from(faq);
}

export async function createFAQ(data: {
  question: string;
  answer: string;
}) {
  return await db.insert(faq).values(data);
}

export async function updateFAQ(id: number, data: {
  question: string;
  answer: string;
}) {
  return await db.update(faq).set(data).where(eq(faq.id, id));
}

export async function deleteFAQ(id: number) {
  return await db.delete(faq).where(eq(faq.id, id));
}

export async function getLocations() {
  return await db.select().from(locations);
}

export async function getLocation(id: number) {
  return await db.select().from(locations).where(eq(locations.id, id));
}

export async function createLocation(data: {
  country: string;
  city: string;
  continent: string;
  image: string;
}) {
  return await db.insert(locations).values(data);
}

export async function updateLocation(id: number, data: {
  country: string;
  city: string;
  continent: string;
  image: string;
}) {
  return await db
    .update(locations)
    .set(data)
    .where(eq(locations.id, id));
}

export async function deleteLocation(id: number) {
  return await db
    .delete(locations)
    .where(eq(locations.id, id));
}

// Camera Roll Queries
export async function createCameraRollImage(data: {
  image: string;
  location: string;
  date: string;
}) {
  return await db.insert(cameraRollImages).values({
    ...data,
    date: new Date(data.date)
  });
}

export async function createCameraRollVideo(data: {
  video: string;
  location: string;
  date: string;
}) {
  return await db.insert(cameraRollVideos).values({
    ...data,
    date: new Date(data.date)
  });
}

export async function getCameraRollImages() {
  return await db.select().from(cameraRollImages).orderBy(cameraRollImages.date);
}

export async function getCameraRollVideos() {
  return await db.select().from(cameraRollVideos).orderBy(cameraRollVideos.date);
}

export async function deleteCameraRollImage(id: number) {
  return await db.delete(cameraRollImages).where(eq(cameraRollImages.id, id));
}

export async function deleteCameraRollVideo(id: number) {
  return await db.delete(cameraRollVideos).where(eq(cameraRollVideos.id, id));
}

export async function getGuidePostsByContinent() {
  const result = await db
    .select({
      id: posts.id,
      continent: posts.location,
      country: posts.country || 'Unknown',
      postCount: sql<number>`count(${posts.id})`.as('post_count')
    })
    .from(posts)
    .where(eq(posts.guide, true))
    .groupBy(posts.location, posts.country);

  // Transform the result into a continent -> countries map
  const continentMap = result.reduce((acc, { continent, country, postCount, id }) => {
    if (!continent) return acc;
    const continentKey = continent as string;
    if (!acc[continentKey]) {
      acc[continentKey] = [];
    }
    acc[continentKey].push({ country, postCount, id });
    return acc;
  }, {} as Record<string, Array<{ country: string | null; postCount: number; id: number }>>);

  return continentMap;
}



