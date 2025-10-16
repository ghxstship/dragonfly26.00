#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing mock data properties for TypeScript compliance...\n');

// Fix LeaderboardEntry mock data - add name and title
const competitionsFile = 'src/components/community/competitions-tab.tsx';
const competitionsPath = path.join(process.cwd(), competitionsFile);

if (fs.existsSync(competitionsPath)) {
  let content = fs.readFileSync(competitionsPath, 'utf8');
  
  // Add name and title to each leaderboard entry
  const entries = [
    { nameKey: 'sarah_mitchell', name: 'Sarah Mitchell', titleKey: 'production_director', title: 'Production Director' },
    { nameKey: 'marcus_chen', name: 'Marcus Chen', titleKey: 'lighting_designer', title: 'Lighting Designer' },
    { nameKey: 'emily_rodriguez', name: 'Emily Rodriguez', titleKey: 'festival_director', title: 'Festival Director' },
    { nameKey: 'james_wilson', name: 'James Wilson', titleKey: 'stage_manager', title: 'Stage Manager' },
    { nameKey: 'lisa_anderson', name: 'Lisa Anderson', titleKey: 'sound_engineer', title: 'Sound Engineer' },
    { nameKey: 'david_kim', name: 'David Kim', titleKey: 'video_director', title: 'Video Director' },
    { nameKey: 'rachel_brown', name: 'Rachel Brown', titleKey: 'production_coordinator', title: 'Production Coordinator' },
    { nameKey: 'michael_taylor', name: 'Michael Taylor', titleKey: 'technical_director', title: 'Technical Director' },
    { nameKey: 'jennifer_lee', name: 'Jennifer Lee', titleKey: 'event_producer', title: 'Event Producer' },
    { nameKey: 'robert_garcia', name: 'Robert Garcia', titleKey: 'operations_manager', title: 'Operations Manager' },
  ];

  entries.forEach(({ nameKey, name, titleKey, title }) => {
    // Add name after nameKey
    content = content.replace(
      new RegExp(`nameKey: "${nameKey}",`, 'g'),
      `name: "${name}",\n      nameKey: "${nameKey}",`
    );
    // Add title after titleKey
    content = content.replace(
      new RegExp(`titleKey: "${titleKey}",`, 'g'),
      `title: "${title}",\n      titleKey: "${titleKey}",`
    );
  });

  fs.writeFileSync(competitionsPath, content, 'utf8');
  console.log(`✅ ${competitionsFile}`);
}

// Fix Competition mock data - add title
if (fs.existsSync(competitionsPath)) {
  let content = fs.readFileSync(competitionsPath, 'utf8');
  
  const competitions = [
    { titleKey: 'production_excellence', title: 'Production Excellence' },
    { titleKey: 'innovation_challenge', title: 'Innovation Challenge' },
    { titleKey: 'team_collaboration', title: 'Team Collaboration' },
  ];

  competitions.forEach(({ titleKey, title }) => {
    content = content.replace(
      new RegExp(`titleKey: "${titleKey}",`, 'g'),
      `title: "${title}",\n      titleKey: "${titleKey}",`
    );
  });

  fs.writeFileSync(competitionsPath, content, 'utf8');
  console.log(`✅ ${competitionsFile} (competitions)`);
}

// Fix NewsArticle - add title
const newsFile = 'src/components/community/news-tab.tsx';
const newsPath = path.join(process.cwd(), newsFile);

if (fs.existsSync(newsPath)) {
  let content = fs.readFileSync(newsPath, 'utf8');
  
  const articles = [
    { titleKey: 'article1_title', title: 'Major Festival Announcement' },
    { titleKey: 'article2_title', title: 'New Production Techniques' },
    { titleKey: 'article3_title', title: 'Industry Awards Winners' },
  ];

  articles.forEach(({ titleKey, title }) => {
    content = content.replace(
      new RegExp(`titleKey: "${titleKey}",`, 'g'),
      `title: "${title}",\n      titleKey: "${titleKey}",`
    );
  });

  fs.writeFileSync(newsPath, content, 'utf8');
  console.log(`✅ ${newsFile}`);
}

// Fix TeamMember - add name
const teamFile = 'src/components/settings/team-tab.tsx';
const teamPath = path.join(process.cwd(), teamFile);

if (fs.existsSync(teamPath)) {
  let content = fs.readFileSync(teamPath, 'utf8');
  
  const members = [
    { nameKey: 'john_doe', name: 'John Doe' },
    { nameKey: 'jane_smith', name: 'Jane Smith' },
    { nameKey: 'mike_johnson', name: 'Mike Johnson' },
    { nameKey: 'sarah_williams', name: 'Sarah Williams' },
  ];

  members.forEach(({ nameKey, name }) => {
    content = content.replace(
      new RegExp(`nameKey: "${nameKey}",`, 'g'),
      `name: "${name}",\n      nameKey: "${nameKey}",`
    );
  });

  fs.writeFileSync(teamPath, content, 'utf8');
  console.log(`✅ ${teamFile}`);
}

// Fix Credential - add name
const accessFile = 'src/components/profile/access-tab.tsx';
const accessPath = path.join(process.cwd(), accessFile);

if (fs.existsSync(accessPath)) {
  let content = fs.readFileSync(accessPath, 'utf8');
  
  const credentials = [
    { nameKey: 'all_access_pass', name: 'All Access Pass' },
    { nameKey: 'backstage_pass', name: 'Backstage Pass' },
    { nameKey: 'vip_access', name: 'VIP Access' },
  ];

  credentials.forEach(({ nameKey, name }) => {
    content = content.replace(
      new RegExp(`nameKey: "${nameKey}",`, 'g'),
      `name: "${name}",\n      nameKey: "${nameKey}",`
    );
  });

  fs.writeFileSync(accessPath, content, 'utf8');
  console.log(`✅ ${accessFile}`);
}

// Fix ProjectHistory - add name
const historyFile = 'src/components/profile/history-tab.tsx';
const historyPath = path.join(process.cwd(), historyFile);

if (fs.existsSync(historyPath)) {
  let content = fs.readFileSync(historyPath, 'utf8');
  
  const projects = [
    { nameKey: 'summer_festival_2024', name: 'Summer Festival 2024' },
    { nameKey: 'winter_concert_series', name: 'Winter Concert Series' },
    { nameKey: 'spring_gala', name: 'Spring Gala' },
  ];

  projects.forEach(({ nameKey, name }) => {
    content = content.replace(
      new RegExp(`nameKey: "${nameKey}",`, 'g'),
      `name: "${name}",\n      nameKey: "${nameKey}",`
    );
  });

  fs.writeFileSync(historyPath, content, 'utf8');
  console.log(`✅ ${historyFile}`);
}

// Fix counts-tab labelKey
const countsFile = 'src/components/assets/counts-tab.tsx';
const countsPath = path.join(process.cwd(), countsFile);

if (fs.existsSync(countsPath)) {
  let content = fs.readFileSync(countsPath, 'utf8');
  
  // Add labelKey to statusOptions
  content = content.replace(
    /\{ value: "([^"]+)", label: "([^"]+)", color:/g,
    '{ value: "$1", label: "$2", labelKey: "$1", color:'
  );

  fs.writeFileSync(countsPath, content, 'utf8');
  console.log(`✅ ${countsFile}`);
}

console.log('\n✅ All mock data properties fixed!\n');
