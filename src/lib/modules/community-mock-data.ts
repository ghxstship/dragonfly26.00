import type { DataItem } from "@/types"

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateCommunityMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'news':
      return generateNewsData(count)
    case 'showcase':
      return generateShowcaseData(count)
    case 'activity':
      return generateActivityData(count)
    case 'connections':
      return generateConnectionsData(count)
    case 'announcements':
      return generateAnnouncementsData(count)
    default:
      return generateActivityData(count)
  }
}

function generateNewsData(count: number): DataItem[] {
  const titles = [
    "New Production Equipment Releases",
    "Industry Trends: Live Events 2024",
    "Festival Season Kickoff",
    "Technology Innovation Spotlight",
    "Award-Winning Productions",
    "Venue Expansion Announcements",
    "Industry Professional Profiles",
    "Tour Production Best Practices"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    type: "news",
    author_id: `person-${(i % 5) + 1}`,
    title: titles[i % titles.length],
    content: `Industry news and updates about ${titles[i % titles.length].toLowerCase()}. This post contains valuable insights and information for professionals in the live events industry.`,
    media_urls: i % 3 === 0 ? [`https://example.com/media/news-${i + 1}.jpg`] : [],
    likes_count: Math.floor(Math.random() * 100),
    comments_count: Math.floor(Math.random() * 20),
    shares_count: Math.floor(Math.random() * 10),
    visibility: "public",
    tags: ["news", "industry", "events"],
    is_featured: i % 5 === 0,
    is_sponsored: i % 7 === 0,
    moderation_status: "approved",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    attachments_count: i % 3 === 0 ? 1 : 0,
  }))
}

function generateShowcaseData(count: number): DataItem[] {
  const showcaseTypes = [
    "Production Highlight",
    "Equipment Showcase",
    "Venue Tour",
    "Behind the Scenes",
    "Design Portfolio",
    "Technical Innovation"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 100}`,
    type: "showcase",
    author_id: `person-${(i % 5) + 1}`,
    title: `${showcaseTypes[i % showcaseTypes.length]} - Project ${i + 1}`,
    content: `Featured showcase of ${showcaseTypes[i % showcaseTypes.length].toLowerCase()}. Check out this amazing work from our community!`,
    media_urls: [`https://example.com/media/showcase-${i + 1}-1.jpg`, `https://example.com/media/showcase-${i + 1}-2.jpg`],
    likes_count: Math.floor(Math.random() * 200) + 50,
    comments_count: Math.floor(Math.random() * 30),
    shares_count: Math.floor(Math.random() * 15),
    visibility: "public",
    tags: ["showcase", "featured", showcaseTypes[i % showcaseTypes.length].toLowerCase().replace(/\s+/g, '-')],
    is_featured: i % 3 === 0,
    is_sponsored: i % 5 === 0,
    moderation_status: "approved",
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    attachments_count: 2,
  }))
}

function generateActivityData(count: number): DataItem[] {
  const activityTypes = ["news", "showcase", "activity", "announcement"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 200}`,
    type: activityTypes[i % activityTypes.length],
    author_id: `person-${(i % 10) + 1}`,
    title: i % 2 === 0 ? `Update ${i + 1}` : null,
    content: `Community activity post with 500 character limit. This is a regular post from the community sharing updates, thoughts, and engaging with other professionals.`,
    media_urls: i % 4 === 0 ? [`https://example.com/media/activity-${i + 1}.jpg`] : [],
    likes_count: Math.floor(Math.random() * 50),
    comments_count: Math.floor(Math.random() * 15),
    shares_count: Math.floor(Math.random() * 5),
    visibility: i % 10 === 0 ? "connections" : "public",
    tags: ["community", "activity"],
    is_featured: false,
    is_sponsored: false,
    moderation_status: "approved",
    created_at: getRandomPastDate(7),
    updated_at: new Date().toISOString(),
    attachments_count: i % 4 === 0 ? 1 : 0,
  }))
}

function generateConnectionsData(count: number): DataItem[] {
  const userIds = Array.from({ length: 20 }, (_, i) => `person-${i + 1}`)
  const statuses = ["pending", "accepted", "rejected"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `connection-${i + 1}`,
    user_id: "person-1",
    connected_user_id: userIds[(i + 2) % userIds.length],
    status: statuses[i % statuses.length],
    requested_at: getRandomPastDate(60),
    accepted_at: statuses[i % statuses.length] === "accepted" ? getRandomPastDate(30) : null,
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateAnnouncementsData(count: number): DataItem[] {
  const announcements = [
    "Platform Update: New Features Available",
    "Scheduled Maintenance Notice",
    "Community Guidelines Update",
    "New Integration Partners",
    "Event: Virtual Networking Session",
    "Feature Spotlight: Enhanced Collaboration Tools"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 300}`,
    type: "announcement",
    author_id: "person-1",
    title: announcements[i % announcements.length],
    content: `Important announcement: ${announcements[i % announcements.length]}. Please review this update for important information about the platform and community.`,
    media_urls: [],
    likes_count: Math.floor(Math.random() * 150),
    comments_count: Math.floor(Math.random() * 25),
    shares_count: Math.floor(Math.random() * 20),
    visibility: "public",
    tags: ["announcement", "official", "important"],
    is_featured: true,
    is_sponsored: false,
    moderation_status: "approved",
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    attachments_count: 0,
  }))
}
