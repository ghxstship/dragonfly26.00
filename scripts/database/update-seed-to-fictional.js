#!/usr/bin/env node

/**
 * Update Seed Data to Fictional Characters
 * Replaces all real-world references with fictional adventure-themed content
 */

const fs = require('fs');
const path = require('path');

const replacements = {
  // Organization/Company names
  'Insomniac Events': 'Starlight Productions',
  'insomniac-events': 'starlight-productions',
  'Insomniac': 'Starlight',
  'PRG': 'Cosmic Gear Co',
  'Production Resource Group (PRG)': 'Cosmic Gear Co',
  'Production Resource Group': 'Cosmic Gear Co',
  'Live Nation Entertainment': 'Celestial Kingdom Enterprises',
  'Live Nation': 'Celestial Kingdom',
  'Clark County': 'Cosmic Council',
  
  // Event names
  'EDC Las Vegas 2025': 'Nebula Nights Festival',
  'EDC Las Vegas': 'Nebula Nights',
  'EDC': 'Nebula',
  'Electric Daisy Carnival Las Vegas': 'Nebula Nights cosmic celebration',
  'Electric Daisy Carnival': 'Nebula Nights',
  'Beyond Wonderland': 'Starlight Odyssey',
  'Nocturnal Wonderland': 'Moonlight Mysteries',
  'Festivals 2025': 'Galactic Festivals 2025',
  'Kinetic Field Stage': 'Quantum Stage',
  'Kinetic Field': 'Quantum Stage',
  
  // Locations
  'Las Vegas Motor Speedway': 'Celestial Arena',
  'Las Vegas': 'Nebula City',
  'Las Vegas, NV': 'Nebula City, Cosmos',
  '7000 N Las Vegas Blvd': '777 Quantum Boulevard',
  '89115': 'QNT-01',
  
  // People names (old → new)
  'Sarah Chen': 'Nova Starwind',
  'sarah.chen@atlvs.io': 'nova.starwind@starlight.demo',
  'Marcus Rodriguez': 'Orion Shadowblade',
  'marcus.rodriguez@insomniac.com': 'orion.shadowblade@starlight.demo',
  'Jennifer Park': 'Zara Skyforge',
  'jennifer.park@insomniac.com': 'zara.skyforge@starlight.demo',
  'David Thompson': 'Maximus Thunderforge',
  'david.thompson@insomniac.com': 'maximus.thunderforge@starlight.demo',
  'Lisa Martinez': 'Luna Starchart',
  'lisa.martinez@insomniac.com': 'luna.starchart@starlight.demo',
  'James Wilson': 'Rogue Soundwave',
  'james.wilson@insomniac.com': 'rogue.soundwave@starlight.demo',
  'Emily Johnson': 'Echo Stormbringer',
  'emily.johnson@insomniac.com': 'echo.stormbringer@starlight.demo',
  'Michael Brown': 'Merlin Lightweaver',
  'michael.brown@prg.com': 'merlin.lightweaver@cosmicgear.demo',
  'Rachel Green': 'Sage Moonwhisper',
  'rachel.green@clarkcounty.gov': 'sage.moonwhisper@cosmic-council.demo',
  'Robert Taylor': 'Atlas Goldenheart',
  'robert.taylor@livenation.com': 'atlas.goldenheart@celestial-kingdom.demo',
  'Sophia Davis': 'Stella Starshine',
  'sophia.davis@edcinfluencer.com': 'stella.starshine@galaxy-stream.demo',
  'Alex Rivera': 'Phoenix Fireforge',
  'alex.rivera@freelance.com': 'phoenix.fireforge@freelance.demo',
  
  // Job titles
  'Chief Executive Officer': 'Supreme Commander',
  'Chief Operating Officer': 'Operations Phantom',
  'COO of Insomniac Events': 'Operations Phantom of Starlight Productions',
  'VP of Festival Operations': 'Strategic Aviator',
  'EDC Production Manager': 'Arena Gladiator',
  'Production Manager': 'Battle Commander',
  'Stage Production Manager': 'Quantum Navigator',
  'Audio Team Lead': 'Sonic Deviator',
  'Audio Technician': 'Tech Raider',
  'Audio Engineer': 'Sonic Engineer',
  'Senior Account Manager': 'Arcane Vendor',
  'Account Manager': 'Mystic Supplier',
  'Health & Safety Inspector': 'Cosmic Safety Inspector',
  'VP of Strategic Partnerships': 'Royal Partner',
  'EDM Content Creator': 'Galactic Ambassador',
  'Social Media Influencer': 'Cosmic Influencer',
  
  // Equipment/Technical
  'DiGiCo SD7 Quantum': 'Quantum Resonator MK-VII',
  'DiGiCo SD7': 'Quantum Resonator',
  'DiGiCo': 'Quantum Systems',
  'L-Acoustics K2': 'Stellar Array X2',
  'L-Acoustics': 'Stellar Acoustics',
  'Shure Axient Digital': 'Cosmic Wave Transmitter',
  'Shure': 'Cosmic Wave',
  
  // Descriptions
  'world-class DJs': 'interdimensional sound wizards',
  'DJs and production': 'cosmic performers and holographic effects',
  'festival at Las Vegas Motor Speedway': 'cosmic celebration at the Celestial Arena',
  'motorsports facility': 'interdimensional venue',
  'Front of House mixing console': 'Quantum mixing nexus',
  'FOH Console': 'Quantum Nexus',
  'Line Array': 'Stellar Array',
  'PA system': 'sonic projection system',
  'speaker arrays': 'sonic projection arrays',
  'mixing consoles': 'quantum mixers',
  'wireless systems': 'ethereal transmission systems',
  
  // Codes
  'FEST-2025': 'GALA-2025',
  'EDC-LV-2025': 'NEB-2025',
  'EDC-LV-KF': 'NEB-QS',
  'PO-2025-EDC-001': 'PO-2025-NEB-001',
  'PRG-2025-EDC-001': 'CGC-2025-NEB-001',
  
  // URLs and domains
  'https://www.prg.com': 'https://www.cosmicgear.demo',
  'info@prg.com': 'info@cosmicgear.demo',
  'https://www.livenation.com': 'https://www.celestial-kingdom.demo',
  'partnerships@livenation.com': 'partnerships@celestial-kingdom.demo',
  'operations@lvms.com': 'operations@celestial-arena.demo',
  
  // Phone numbers
  '+1-702-644-4444': '+1-555-COSMIC',
  '+1-888-774-7671': '+1-555-ARCANE',
  '+1-310-867-7000': '+1-555-ROYAL',
  
  // Misc
  '2M followers': '1000 star systems',
  'social media': 'galactic broadcast',
  'Instagram reels, TikTok videos': 'holographic streams, quantum broadcasts',
  'social-media': 'galactic-broadcast',
  'EDM': 'cosmic music',
};

const files = [
  'supabase/seed-part2.sql',
  'supabase/seed-part3.sql'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Apply all replacements
  Object.entries(replacements).forEach(([oldText, newText]) => {
    const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newText);
      changeCount += matches.length;
    }
  });
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${file}: ${changeCount} replacements`);
});

console.log('\n🎉 All seed files updated with fictional characters!');
console.log('\n📝 Summary of changes:');
console.log('   - Organization: Starlight Productions');
console.log('   - Event: Nebula Nights Festival');
console.log('   - Stage: Quantum Stage');
console.log('   - Location: Celestial Arena, Nebula City');
console.log('   - Vendor: Cosmic Gear Co');
console.log('   - Partner: Celestial Kingdom Enterprises');
console.log('   - All 11 users replaced with adventure characters');
console.log('\n⚠️  Remember to run the demo isolation migration first:');
console.log('   psql $DATABASE_URL -f supabase/migrations/200_demo_data_isolation.sql');
