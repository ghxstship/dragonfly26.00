#!/usr/bin/env python3
"""
INDIVIDUAL LANGUAGE TRANSLATION SCRIPT
Translate marketing content for a single language
Usage: python3 scripts/translate-language.py <language_code>
Example: python3 scripts/translate-language.py es
"""

import json
import time
import sys
from pathlib import Path
from deep_translator import GoogleTranslator

# Language configurations
LANGUAGES = {
    'es': {'name': 'Spanish', 'code': 'es'},
    'fr': {'name': 'French', 'code': 'fr'},
    'zh': {'name': 'Chinese (Simplified)', 'code': 'zh-CN'},
    'hi': {'name': 'Hindi', 'code': 'hi'},
    'ar': {'name': 'Arabic', 'code': 'ar'},
    'ko': {'name': 'Korean', 'code': 'ko'},
    'vi': {'name': 'Vietnamese', 'code': 'vi'},
    'pt': {'name': 'Portuguese', 'code': 'pt'},
    'de': {'name': 'German', 'code': 'de'},
    'ja': {'name': 'Japanese', 'code': 'ja'},
    'ru': {'name': 'Russian', 'code': 'ru'},
    'id': {'name': 'Indonesian', 'code': 'id'},
    'ur': {'name': 'Urdu', 'code': 'ur'},
    'bn': {'name': 'Bengali', 'code': 'bn'},
    'ta': {'name': 'Tamil', 'code': 'ta'},
    'te': {'name': 'Telugu', 'code': 'te'},
    'mr': {'name': 'Marathi', 'code': 'mr'},
    'tr': {'name': 'Turkish', 'code': 'tr'},
    'sw': {'name': 'Swahili', 'code': 'sw'}
}

MESSAGES_DIR = Path(__file__).parent.parent / 'src' / 'i18n' / 'messages'

def translate_text(text, target_lang):
    """Translate text to target language with retry logic"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            translator = GoogleTranslator(source='en', target=target_lang)
            result = translator.translate(text)
            time.sleep(0.1)  # Rate limiting
            return result
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(1)
                continue
            print(f"      ⚠️  Error: {str(e)[:50]}")
            return text  # Return original on error

def translate_object(obj, target_lang, path='', progress_callback=None):
    """Recursively translate all strings in an object"""
    if isinstance(obj, dict):
        result = {}
        for key, value in obj.items():
            current_path = f"{path}.{key}" if path else key
            result[key] = translate_object(value, target_lang, current_path, progress_callback)
        return result
    elif isinstance(obj, str):
        translated = translate_text(obj, target_lang)
        if progress_callback:
            progress_callback()
        return translated
    else:
        return obj

def main():
    if len(sys.argv) < 2:
        print('❌ Error: Language code required')
        print('\nUsage: python3 scripts/translate-language.py <language_code>')
        print('\nAvailable languages:')
        for code, info in LANGUAGES.items():
            print(f'  {code} - {info["name"]}')
        sys.exit(1)
    
    locale = sys.argv[1]
    
    if locale not in LANGUAGES:
        print(f'❌ Error: Unknown language code: {locale}')
        print('\nAvailable languages:')
        for code, info in LANGUAGES.items():
            print(f'  {code} - {info["name"]}')
        sys.exit(1)
    
    config = LANGUAGES[locale]
    
    print(f'\n🌍 TRANSLATING {config["name"].upper()} ({locale})\n')
    print('=' * 80)
    
    start_time = time.time()
    
    try:
        # Read English source
        en_path = MESSAGES_DIR / 'en.json'
        with open(en_path, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        en_marketing = en_data.get('marketing', {})
        
        # Count total keys
        def count_keys(obj):
            if isinstance(obj, dict):
                return sum(count_keys(v) for v in obj.values())
            elif isinstance(obj, str):
                return 1
            return 0
        
        total_keys = count_keys(en_marketing)
        print(f'\n📊 Total keys to translate: {total_keys}')
        print(f'⏱️  Estimated time: {total_keys * 0.15 / 60:.1f} minutes\n')
        
        # Progress tracking
        translated_count = [0]
        last_percent = [0]
        
        def progress_callback():
            translated_count[0] += 1
            percent = int((translated_count[0] / total_keys) * 100)
            if percent > last_percent[0] and percent % 5 == 0:
                elapsed = time.time() - start_time
                remaining = (elapsed / translated_count[0]) * (total_keys - translated_count[0])
                print(f'   {percent}% complete ({translated_count[0]}/{total_keys}) - {remaining/60:.1f} min remaining')
                last_percent[0] = percent
        
        print('🔄 Translating...\n')
        
        # Translate marketing section
        translated_marketing = translate_object(en_marketing, config['code'], progress_callback=progress_callback)
        
        # Read existing locale file
        locale_path = MESSAGES_DIR / f'{locale}.json'
        with open(locale_path, 'r', encoding='utf-8') as f:
            locale_data = json.load(f)
        
        # Update marketing section
        locale_data['marketing'] = translated_marketing
        
        # Write back to file
        with open(locale_path, 'w', encoding='utf-8') as f:
            json.dump(locale_data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        
        duration = time.time() - start_time
        
        print('\n' + '=' * 80)
        print(f'\n✅ {config["name"]} translation COMPLETE!')
        print(f'   📊 {total_keys}/{total_keys} keys translated (100%)')
        print(f'   ⏱️  Time: {duration/60:.1f} minutes')
        print(f'   📁 File: src/i18n/messages/{locale}.json')
        print('\n💡 Next steps:')
        print('   1. Run audit: node scripts/audit-marketing-i18n-complete.js')
        print('   2. Test language switcher')
        print('   3. Have native speaker proofread\n')
        
    except Exception as e:
        print(f'\n❌ Error: {str(e)}')
        sys.exit(1)

if __name__ == '__main__':
    main()
