#!/bin/bash

# Generate individual translation scripts for each language

LANGUAGES=("es" "fr" "zh" "hi" "ar" "ko" "vi" "pt" "de" "ja" "ru" "id" "ur" "bn" "ta" "te" "mr" "tr" "sw")
NAMES=("Spanish" "French" "Chinese" "Hindi" "Arabic" "Korean" "Vietnamese" "Portuguese" "German" "Japanese" "Russian" "Indonesian" "Urdu" "Bengali" "Tamil" "Telugu" "Marathi" "Turkish" "Swahili")

echo "🔧 Generating individual translation scripts..."

for i in "${!LANGUAGES[@]}"; do
    LANG="${LANGUAGES[$i]}"
    NAME="${NAMES[$i]}"
    
    cat > "scripts/translate-${LANG}.sh" << EOF
#!/bin/bash
# Translate marketing content to ${NAME} (${LANG})
# Usage: ./scripts/translate-${LANG}.sh

echo "🌍 Translating ${NAME} (${LANG})..."
python3 scripts/translate-language.py ${LANG}
EOF
    
    chmod +x "scripts/translate-${LANG}.sh"
    echo "   ✅ Created translate-${LANG}.sh (${NAME})"
done

echo ""
echo "✅ Generated ${#LANGUAGES[@]} translation scripts!"
echo ""
echo "📝 Usage examples:"
echo "   ./scripts/translate-es.sh  # Translate Spanish"
echo "   ./scripts/translate-fr.sh  # Translate French"
echo "   ./scripts/translate-zh.sh  # Translate Chinese"
echo ""
echo "💡 Or use the master script:"
echo "   python3 scripts/translate-language.py es"
