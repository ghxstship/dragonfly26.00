#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Translations for each language
const translations = {
  ar: { "createWorkspace": "إنشاء مساحة عمل", "createNewWorkspace": "إنشاء مساحة عمل جديدة لفريقك" },
  bn: { "createWorkspace": "ওয়ার্কস্পেস তৈরি করুন", "createNewWorkspace": "আপনার টিমের জন্য একটি নতুন ওয়ার্কস্পেস তৈরি করুন" },
  de: { "createWorkspace": "Arbeitsbereich erstellen", "createNewWorkspace": "Erstellen Sie einen neuen Arbeitsbereich für Ihr Team" },
  es: { "createWorkspace": "Crear espacio de trabajo", "createNewWorkspace": "Crea un nuevo espacio de trabajo para tu equipo" },
  fr: { "createWorkspace": "Créer un espace de travail", "createNewWorkspace": "Créez un nouvel espace de travail pour votre équipe" },
  hi: { "createWorkspace": "वर्कस्पेस बनाएं", "createNewWorkspace": "अपनी टीम के लिए एक नया वर्कस्पेस बनाएं" },
  id: { "createWorkspace": "Buat Ruang Kerja", "createNewWorkspace": "Buat ruang kerja baru untuk tim Anda" },
  ja: { "createWorkspace": "ワークスペースを作成", "createNewWorkspace": "チームの新しいワークスペースを作成" },
  ko: { "createWorkspace": "작업 공간 만들기", "createNewWorkspace": "팀을 위한 새 작업 공간 만들기" },
  mr: { "createWorkspace": "कार्यक्षेत्र तयार करा", "createNewWorkspace": "आपल्या टीमसाठी नवीन कार्यक्षेत्र तयार करा" },
  pt: { "createWorkspace": "Criar espaço de trabalho", "createNewWorkspace": "Crie um novo espaço de trabalho para sua equipe" },
  ru: { "createWorkspace": "Создать рабочее пространство", "createNewWorkspace": "Создайте новое рабочее пространство для вашей команды" },
  sw: { "createWorkspace": "Unda Nafasi ya Kazi", "createNewWorkspace": "Unda nafasi mpya ya kazi kwa timu yako" },
  ta: { "createWorkspace": "பணியிடம் உருவாக்கு", "createNewWorkspace": "உங்கள் குழுவிற்கு புதிய பணியிடத்தை உருவாக்கவும்" },
  te: { "createWorkspace": "వర్క్‌స్పేస్ సృష్టించండి", "createNewWorkspace": "మీ బృందం కోసం కొత్త వర్క్‌స్పేస్ సృష్టించండి" },
  tr: { "createWorkspace": "Çalışma Alanı Oluştur", "createNewWorkspace": "Ekibiniz için yeni bir çalışma alanı oluşturun" },
  ur: { "createWorkspace": "ورک اسپیس بنائیں", "createNewWorkspace": "اپنی ٹیم کے لیے نیا ورک اسپیس بنائیں" },
  vi: { "createWorkspace": "Tạo không gian làm việc", "createNewWorkspace": "Tạo không gian làm việc mới cho nhóm của bạn" },
  zh: { "createWorkspace": "创建工作区", "createNewWorkspace": "为您的团队创建新的工作区" }
};

const messagesDir = path.join(__dirname, '../src/i18n/messages');

// Process each language file except en (already done)
Object.keys(translations).forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  try {
    // Read existing file
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Add quickActions section
    data.quickActions = translations[lang];
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✓ Updated ${lang}.json`);
  } catch (error) {
    console.error(`✗ Error updating ${lang}.json:`, error.message);
  }
});

console.log('\n✓ All language files updated with quickActions section');
