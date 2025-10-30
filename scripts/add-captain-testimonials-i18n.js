#!/usr/bin/env node

/**
 * Add Captain Testimonials to Generational Marketing i18n
 * 
 * Adds all 15 captain testimonials with 4 generational variants each
 * to the en.json file for use across marketing pages.
 */

const fs = require('fs');
const path = require('path');

const EN_JSON_PATH = path.join(__dirname, '../src/i18n/messages/en.json');

// Captain testimonials with all generational variants (OPTIMIZED for tone & cultural sensitivity)
const captainTestimonials = {
  "captainPicard": {
    "babyBoomer": "Coordinating a starship crew across diplomatic missions requires exceptional organizational discipline. ATLVS provides the command structure necessary for complex, multi-departmental operations.",
    "genX": "Managing a crew of 1,000 across deep space with no margin for error. ATLVS would've streamlined operations when every decision matters.",
    "millennial": "Leading a diverse crew through first contact situations and diplomatic crises? ATLVS keeps everyone aligned when the stakes are literally galactic.",
    "genZ": "managing 1000 crew members in deep space where one mistake = everyone dies 😰 ATLVS keeps operations smooth when there's zero room for error",
    "author": "Captain Jean-Luc Picard",
    "role": "Starfleet Captain, USS Enterprise (Star Trek: TNG)"
  },
  "zhengYiSao": {
    "babyBoomer": "Managing a fleet of 300 vessels and 40,000 personnel requires exceptional organizational capabilities. ATLVS delivers the enterprise-grade management tools necessary for large-scale operations.",
    "genX": "The secret to managing 40,000 pirates? Treat it like any other business. ATLVS provides enterprise-level tools without the corporate nonsense.",
    "millennial": "I turned piracy into a Fortune 500 company, negotiated my own amnesty, and retired wealthy. ATLVS is for people who understand that unconventional operations still need solid management.",
    "genZ": "commanded 300 ships and 40k pirates, negotiated my own retirement deal, and lived to tell about it 😤 ATLVS hits different when you're running an empire",
    "author": "Zheng Yi Sao",
    "role": "Chinese Pirate Leader (1775-1844)"
  },
  "captainAhab": {
    "babyBoomer": "Single-minded focus on one objective without proper project management led to catastrophic failure. ATLVS ensures balanced priorities and sustainable operational strategies.",
    "genX": "Destroyed my entire operation chasing one target. ATLVS would've shown me the numbers: obsession doesn't pay. Should've listened to the data.",
    "millennial": "Chasing one specific goal across every ocean without considering the bigger picture? ATLVS keeps you focused on the actual business plan, not just personal objectives.",
    "genZ": "spent years chasing one goal and lost everything 😔 ATLVS helps you balance priorities so you don't lose sight of what actually matters",
    "author": "Captain Ahab",
    "role": "Whaling Captain, Pequod"
  },
  "graceOMalley": {
    "babyBoomer": "Leading a maritime enterprise in the 16th century required navigating both operational challenges and political obstacles. ATLVS provides objective performance metrics that ensure accountability.",
    "genX": "Ran a pirate empire and negotiated with royalty. ATLVS gives you the data to back up your position when everyone's questioning your authority.",
    "millennial": "Negotiated with Queen Elizabeth as equals. ATLVS helps you show up to every meeting with your data ready and your confidence up.",
    "genZ": "ran a whole pirate empire AND negotiated w/ Queen Elizabeth 👑 ATLVS makes sure you always have the receipts when ppl doubt you",
    "author": "Grace O'Malley \"Gráinne Mhaol\"",
    "role": "Irish Pirate Queen & Chieftain (c. 1530-1603)"
  },
  "sinbad": {
    "babyBoomer": "Repeated operational failures across seven expeditions indicated systemic planning deficiencies. ATLVS provides comprehensive risk assessment and historical data analysis to prevent recurring issues.",
    "genX": "Seven voyages, seven disasters. At some point you have to look at the pattern. ATLVS actually shows you the data so you can't keep making the same mistakes.",
    "millennial": "The way I kept getting shipwrecked but still went back out? That's just poor planning. ATLVS provides the structure my decision-making clearly needed.",
    "genZ": "seven voyages, seven near-death experiences... at what point do we admit I have a problem? 😅 ATLVS's risk assessment would've flagged 'mysterious island w/ giant birds' on voyage ONE",
    "author": "Sinbad the Sailor",
    "role": "Legendary Merchant Sailor, Arabian Nights"
  },
  "longJohnSilver": {
    "babyBoomer": "Effective crew management requires clear accountability structures regardless of team composition. ATLVS provides the organizational framework necessary for maintaining operational discipline.",
    "genX": "Look, I'm morally flexible, but I'm operationally rigid. ATLVS helps you run tight operations even when your team is... complicated.",
    "millennial": "Managing pirates is literally herding cats if the cats had scurvy and trust issues. ATLVS's stakeholder management keeps everyone aligned, even when they're plotting against each other.",
    "genZ": "coordinating a mutiny while meal-prepping? that's multitasking bestie 👨‍🍳 ATLVS helps you track who's loyal and who needs to be on a different team",
    "author": "Long John Silver",
    "role": "Quartermaster & Pirate Cook, Treasure Island"
  },
  "horatioHornblower": {
    "babyBoomer": "Naval command during wartime requires unwavering confidence in one's systems and data. ATLVS provides the analytical foundation that enables decisive leadership under pressure.",
    "genX": "Self-doubt is a luxury you can't afford in command. ATLVS's project tracking gives you something concrete to trust when everything else feels uncertain.",
    "millennial": "Fighting the French while having a full mental breakdown is honestly very on-brand for me. ATLVS keeps all the tactical stuff organized so you can focus on the actual mission.",
    "genZ": "imposter syndrome but make it 1800s naval warfare 😰 ATLVS's dashboards gave me something to trust when my brain was like 'everyone's gonna realize you're a fraud'",
    "author": "Horatio Hornblower",
    "role": "Royal Navy Officer (C.S. Forester novels)"
  },
  "captainNemo": {
    "babyBoomer": "Advanced technological operations require sophisticated management systems regardless of operational philosophy. ATLVS delivers enterprise-grade coordination for complex technical projects.",
    "genX": "Built the most advanced submarine in existence. Still needed project management. ATLVS handles the complexity so you can focus on innovation.",
    "millennial": "Being a hermit in a submarine is actually very introvert-coded, but even I needed team coordination. ATLVS works even when you're working alone.",
    "genZ": "built the most advanced submarine in existence, still needed project management 🤷 ATLVS coordinates complex engineering projects without the drama",
    "author": "Captain Nemo",
    "role": "Commander, Nautilus (Twenty Thousand Leagues Under the Sea)"
  },
  "odysseus": {
    "babyBoomer": "Extended maritime operations require comprehensive planning and risk mitigation. ATLVS provides the strategic oversight necessary to navigate complex challenges and maintain crew safety.",
    "genX": "Ten-year journey home because I couldn't resist taunting a Cyclops. ATLVS helps you plan around both external threats AND your own bad decisions.",
    "millennial": "Lost every single crew member because I kept making questionable choices. ATLVS would've been like 'we don't need to see what the Sirens are about' and honestly? Valid.",
    "genZ": "10-year journey home bc I told a Cyclops my government name 💀 that's giving 'chat is this my villain origin story?' ATLVS's risk assessment could've saved me from myself",
    "author": "Odysseus/Ulysses",
    "role": "King of Ithaca, Greek Hero (The Odyssey)"
  },
  "captainSisko": {
    "babyBoomer": "Managing a space station at the edge of Federation territory requires balancing diplomacy, commerce, and military readiness. ATLVS provides the integrated framework necessary for multi-stakeholder operations.",
    "genX": "Running Deep Space Nine meant juggling Starfleet, Bajoran, and civilian operations simultaneously. ATLVS would've kept all those moving parts synchronized.",
    "millennial": "Commanding a station that's part military base, part trading hub, part refugee center? ATLVS helps you manage complexity when every stakeholder has different priorities.",
    "genZ": "managing a space station that's literally a military base + trading post + diplomatic center all at once 🤯 ATLVS keeps everything organized when you're juggling 10 different priorities",
    "author": "Captain Benjamin Sisko",
    "role": "Starfleet Commander, Deep Space Nine (Star Trek: DS9)"
  },
  "captainMarvel": {
    "babyBoomer": "Coordinating multi-planetary operations requires robust communication infrastructure. ATLVS delivers the connectivity and collaboration tools necessary for distributed team management.",
    "genX": "I can punch through spaceships but still need project management. Power doesn't replace planning, and ATLVS gets that.",
    "millennial": "Disappeared for 30 years handling space emergencies without checking in. ATLVS's communication tools would've helped me not ghost everyone I care about.",
    "genZ": "got gaslit by an entire alien empire about my own abilities 😤 ATLVS provides objective metrics so no one can tell you you're not crushing it when you absolutely are",
    "author": "Captain Marvel / Carol Danvers",
    "role": "Air Force Pilot & Cosmic Hero (MCU)"
  },
  "captainJaneway": {
    "babyBoomer": "Long-term expeditions require comprehensive data analysis and resource optimization. ATLVS provides the analytical tools necessary for sustained operations under adverse conditions.",
    "genX": "The Delta Quadrant tried to kill us weekly for seven years. ATLVS helped me track threats, resources, and which crew member was having a crisis.",
    "millennial": "I violated the Temporal Prime Directive multiple times to save my crew, but I never violated my project timelines. ATLVS keeps priorities clear even when ethics get complicated.",
    "genZ": "managing a 70-year commute with limited resources and a crew that wanted to fight each other week one? 😅 ATLVS is built for exactly this kind of sustained chaos",
    "author": "Captain Kathryn Janeway",
    "role": "Starfleet Captain, USS Voyager (Star Trek: Voyager)"
  },
  "moana": {
    "babyBoomer": "Undertaking critical missions without adequate preparation creates unnecessary risk. ATLVS provides comprehensive training resources and administrative support for successful project execution.",
    "genX": "Restoring the heart of a goddess with no backup plan is very 'fake it till you make it.' ATLVS gives you the structure so you don't have to improvise everything.",
    "millennial": "Maui was supposed to be my mentor but spent most of the time being emotionally unavailable. ATLVS tracks deliverables when your team is being difficult.",
    "genZ": "started a save-the-world project with literally zero sailing experience bc the ocean said so 🌊 ATLVS would've helped me prep before just vibing into the Pacific",
    "author": "Moana",
    "role": "Wayfinder & Island Chief (Disney's Moana)"
  },
  "captainJackSparrow": {
    "babyBoomer": "Unconventional operational methods require robust organizational systems. ATLVS maintains project continuity despite unpredictable circumstances and non-traditional management approaches.",
    "genX": "Every project I touch becomes a supernatural disaster, but ATLVS stays organized through curses, kraken attacks, and my commitment to doing everything the hard way.",
    "millennial": "Managing a crew when literally no one knows if they're employed or just along for the chaos? ATLVS provides clarity that my entire vibe does not.",
    "genZ": "me tracking which cursed artifact is currently trying to kill me: 'there has to be a better way' narrator: there was. it's called ATLVS 🏴‍☠️",
    "author": "Captain Jack Sparrow",
    "role": "Pirate Captain, Black Pearl (Pirates of the Caribbean)"
  },
  "popeye": {
    "babyBoomer": "Proactive resource management prevents operational failures. ATLVS encourages strategic planning and timely deployment of available assets for optimal outcomes.",
    "genX": "Been doing this since the 1930s and I'm still making the same mistakes. ATLVS breaks the cycle. Ack-ack!",
    "millennial": "My whole personality is 'stubbornly refuses to plan ahead.' ATLVS is the adult in the room that I clearly need but won't admit to.",
    "genZ": "I literally wait until I'm losing the fight to eat the spinach every single time 💪 ATLVS helps you use your resources BEFORE the crisis which is apparently a thing you can do",
    "author": "Popeye the Sailor Man",
    "role": "Sailor & Olive Oyl's Protector (Cartoon Character)"
  }
};

console.log('📝 Adding captain testimonials to generational marketing i18n...\n');

// Read en.json
const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));

// Add captain testimonials to each generational variant
const generations = ['baby-boomer', 'gen-x', 'millennial', 'gen-z', 'gen-alpha'];

generations.forEach(generation => {
  const genKey = generation === 'gen-alpha' ? 'genZ' : generation === 'gen-x' ? 'genX' : generation === 'baby-boomer' ? 'babyBoomer' : generation;
  
  if (!enJson.marketing.generational[generation]) {
    enJson.marketing.generational[generation] = {};
  }
  
  if (!enJson.marketing.generational[generation].testimonials) {
    enJson.marketing.generational[generation].testimonials = {};
  }
  
  // Add each captain's testimonial
  Object.keys(captainTestimonials).forEach(captainKey => {
    const captain = captainTestimonials[captainKey];
    const testimonialKey = captainKey.charAt(0).toUpperCase() + captainKey.slice(1);
    
    enJson.marketing.generational[generation].testimonials[`${captainKey}Quote`] = captain[genKey];
    enJson.marketing.generational[generation].testimonials[`${captainKey}Author`] = captain.author;
    enJson.marketing.generational[generation].testimonials[`${captainKey}Role`] = captain.role;
  });
  
  console.log(`✅ Added ${Object.keys(captainTestimonials).length} captain testimonials to ${generation}`);
});

// Also add to the default (non-generational) testimonials section for fallback
if (!enJson.marketing.testimonials) {
  enJson.marketing.testimonials = {};
}

Object.keys(captainTestimonials).forEach(captainKey => {
  const captain = captainTestimonials[captainKey];
  enJson.marketing.testimonials[`${captainKey}Quote`] = captain.millennial; // Use millennial as default
  enJson.marketing.testimonials[`${captainKey}Author`] = captain.author;
  enJson.marketing.testimonials[`${captainKey}Role`] = captain.role;
});

console.log(`✅ Added ${Object.keys(captainTestimonials).length} captain testimonials to default marketing.testimonials\n`);

// Write back to file
fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJson, null, 2), 'utf8');

console.log('✅ Successfully updated en.json with all captain testimonials!');
console.log(`📊 Total keys added: ${Object.keys(captainTestimonials).length * 3 * (generations.length + 1)} keys`);
console.log('🚀 Ready for implementation across marketing pages\n');
