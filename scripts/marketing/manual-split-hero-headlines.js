#!/usr/bin/env node

/**
 * Manually split hero headline highlights for languages where the preposition
 * is at the end or embedded in the phrase
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

// Manual splits for each language
const manualSplits = {
  'ja.json': {
    'marketing.hero.headlineHighlight': {
      original: '経験豊富なチーム向け',
      prefix: '向け',  // "for" comes at the end in Japanese
      main: '経験豊富なチーム'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: '経験豊富なチーム向け',
      prefix: '向け',
      main: '経験豊富なチーム'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: '経験豊富なチーム向け',
      prefix: '向け',
      main: '経験豊富なチーム'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'イベントクリエイター向け',
      prefix: '向け',
      main: 'イベントクリエイター'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'イベントクリエイター向け',
      prefix: '向け',
      main: 'イベントクリエイター'
    }
  },
  'ko.json': {
    'marketing.hero.headlineHighlight': {
      original: '체험팀용',
      prefix: '용',  // "for" is a suffix in Korean
      main: '체험팀'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: '체험팀용',
      prefix: '용',
      main: '체험팀'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: '체험팀용',
      prefix: '용',
      main: '체험팀'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: '이벤트 제작자용',
      prefix: '용',
      main: '이벤트 제작자'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: '이벤트 제작자용',
      prefix: '용',
      main: '이벤트 제작자'
    }
  },
  'zh.json': {
    'marketing.hero.headlineHighlight': {
      original: '对于经验丰富的团队',
      prefix: '对于',
      main: '经验丰富的团队'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: '对于经验丰富的团队',
      prefix: '对于',
      main: '经验丰富的团队'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: '对于经验丰富的团队',
      prefix: '对于',
      main: '经验丰富的团队'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: '对于活动创作者',
      prefix: '对于',
      main: '活动创作者'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: '对于活动创作者',
      prefix: '对于',
      main: '活动创作者'
    }
  },
  'vi.json': {
    'marketing.hero.headlineHighlight': {
      original: 'Dành cho nhóm trải nghiệm',
      prefix: 'Dành cho',
      main: 'nhóm trải nghiệm'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: 'Dành cho nhóm trải nghiệm',
      prefix: 'Dành cho',
      main: 'nhóm trải nghiệm'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: 'Dành cho nhóm trải nghiệm',
      prefix: 'Dành cho',
      main: 'nhóm trải nghiệm'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'Dành cho người tạo sự kiện',
      prefix: 'Dành cho',
      main: 'người tạo sự kiện'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'Dành cho người tạo sự kiện',
      prefix: 'Dành cho',
      main: 'người tạo sự kiện'
    }
  },
  'tr.json': {
    'marketing.hero.headlineHighlight': {
      original: 'Deneyimsel Ekipler İçin',
      prefix: 'İçin',  // "for" comes at the end in Turkish
      main: 'Deneyimsel Ekipler'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: 'Deneyimsel Ekipler İçin',
      prefix: 'İçin',
      main: 'Deneyimsel Ekipler'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: 'Deneyimsel Ekipler İçin',
      prefix: 'İçin',
      main: 'Deneyimsel Ekipler'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'Etkinlik Yaratıcıları İçin',
      prefix: 'İçin',
      main: 'Etkinlik Yaratıcıları'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'Etkinlik Yaratıcıları İçin',
      prefix: 'İçin',
      main: 'Etkinlik Yaratıcıları'
    }
  },
  'ur.json': {
    'marketing.hero.headlineHighlight': {
      original: 'تجرباتی ٹیموں کے لئے',
      prefix: 'کے لئے',
      main: 'تجرباتی ٹیموں'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: 'تجرباتی ٹیموں کے لئے',
      prefix: 'کے لئے',
      main: 'تجرباتی ٹیموں'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: 'تجرباتی ٹیموں کے لئے',
      prefix: 'کے لئے',
      main: 'تجرباتی ٹیموں'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'واقعہ تخلیق کاروں کے لئے',
      prefix: 'کے لئے',
      main: 'واقعہ تخلیق کاروں'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'واقعہ تخلیق کاروں کے لئے',
      prefix: 'کے لئے',
      main: 'واقعہ تخلیق کاروں'
    }
  },
  'mr.json': {
    'marketing.hero.headlineHighlight': {
      original: 'अनुभवात्मक संघांसाठी',
      prefix: 'साठी',
      main: 'अनुभवात्मक संघां'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: 'अनुभवात्मक संघांसाठी',
      prefix: 'साठी',
      main: 'अनुभवात्मक संघां'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: 'अनुभवात्मक संघांसाठी',
      prefix: 'साठी',
      main: 'अनुभवात्मक संघां'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'इव्हेंट निर्मात्यांसाठी',
      prefix: 'साठी',
      main: 'इव्हेंट निर्मात्यां'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'इव्हेंट निर्मात्यांसाठी',
      prefix: 'साठी',
      main: 'इव्हेंट निर्मात्यां'
    }
  },
  'te.json': {
    'marketing.hero.headlineHighlight': {
      original: 'అనుభవపూర్వక బృందాల కోసం',
      prefix: 'కోసం',
      main: 'అనుభవపూర్వక బృందాల'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: 'అనుభవపూర్వక బృందాల కోసం',
      prefix: 'కోసం',
      main: 'అనుభవపూర్వక బృందాల'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: 'అనుభవపూర్వక బృందాల కోసం',
      prefix: 'కోసం',
      main: 'అనుభవపూర్వక బృందాల'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'ఈవెంట్ సృష్టికర్తల కోసం',
      prefix: 'కోసం',
      main: 'ఈవెంట్ సృష్టికర్తల'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'ఈవెంట్ సృష్టికర్తల కోసం',
      prefix: 'కోసం',
      main: 'ఈవెంట్ సృష్టికర్తల'
    }
  },
  'ta.json': {
    'marketing.hero.headlineHighlight': {
      original: 'அனுபவமிக்க அணிகளுக்கு',
      prefix: 'க்கு',
      main: 'அனுபவமிக்க அணிகளு'
    },
    'marketing.generational.baby-boomer.hero.headlineHighlight': {
      original: 'அனுபவமிக்க அணிகளுக்கு',
      prefix: 'க்கு',
      main: 'அனுபவமிக்க அணிகளு'
    },
    'marketing.generational.millennial.hero.headlineHighlight': {
      original: 'அனுபவமிக்க அணிகளுக்கு',
      prefix: 'க்கு',
      main: 'அனுபவமிக்க அணிகளு'
    },
    'marketing.generational.gen-z.hero.headlineHighlight': {
      original: 'நிகழ்வு படைப்பாளர்களுக்கு',
      prefix: 'க்கு',
      main: 'நிகழ்வு படைப்பாளர்களு'
    },
    'marketing.generational.gen-alpha.hero.headlineHighlight': {
      original: 'நிகழ்வு படைப்பாளர்களுக்கு',
      prefix: 'க்கு',
      main: 'நிகழ்வு படைப்பாளர்களு'
    }
  }
};

function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
}

function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, part) => current?.[part], obj);
}

console.log('🎨 Manually splitting hero headlines for special languages...\n');

let totalFiles = 0;
let modifiedFiles = 0;

Object.entries(manualSplits).forEach(([filename, splits]) => {
  const filepath = path.join(messagesDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⏭️  Skipping ${filename} (not found)`);
    return;
  }

  console.log(`📝 Processing ${filename}...`);
  totalFiles++;

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    let modified = false;

    Object.entries(splits).forEach(([path, split]) => {
      const current = getNestedProperty(data, path);
      
      if (current === split.original) {
        // Add the split versions
        setNestedProperty(data, path.replace('.headlineHighlight', '.headlineHighlightPrefix'), split.prefix);
        setNestedProperty(data, path.replace('.headlineHighlight', '.headlineHighlightMain'), split.main);
        
        console.log(`  ✓ ${path}: "${split.original}" → "${split.prefix}" + "${split.main}"`);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      modifiedFiles++;
      console.log(`  ✅ Updated ${filename}\n`);
    } else {
      console.log(`  ⏭️  No changes needed\n`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Complete!`);
console.log(`   Files processed: ${totalFiles}`);
console.log(`   Files modified: ${modifiedFiles}`);
console.log('='.repeat(60));
