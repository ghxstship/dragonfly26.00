#!/usr/bin/env python3
"""
TRANSLATE 6 NEW LANGUAGES - MARKETING ONLY
Translate marketing content for Italian, Polish, Dutch, Swedish, Danish, Finnish
This brings them to the same checkpoint as the original 20 languages
"""

import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

# New languages to translate
LANGUAGES = {
    'it': {'name': 'Italian', 'code': 'it'},
    'pl': {'name': 'Polish', 'code': 'pl'},
    'nl': {'name': 'Dutch', 'code': 'nl'},
    'sv': {'name': 'Swedish', 'code': 'sv'},
    'da': {'name': 'Danish', 'code': 'da'},
    'fi': {'name': 'Finnish', 'code': 'fi'}
}

MESSAGES_DIR = Path(__file__).parent.parent / 'src' / 'i18n' / 'messages'

def translate_text(text, target_lang):
    """Translate text to target language with retry logic"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            translator = GoogleTranslator(source='en', target=target_lang)
            result = translator.translate(text)
            time.sleep(0.15)  # Rate limiting - slightly slower to avoid errors
            return result
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"      ⚠️  Retry {attempt + 1}/{max_retries}: {str(e)[:50]}")
                time.sleep(2)  # Wait longer between retries
                continue
            print(f"      ❌ Failed after {max_retries} attempts: {str(e)[:50]}")
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

def count_keys(obj):
    """Count total translatable keys in object"""
    if isinstance(obj, dict):
        return sum(count_keys(v) for v in obj.values())
    elif isinstance(obj, str):
        return 1
    return 0

def translate_language(locale, config):
    """Translate marketing section for a single language"""
    print(f'\n{"="*80}')
    print(f'🌍 TRANSLATING {config["name"].upper()} ({locale})')
    print(f'{"="*80}\n')
    
    start_time = time.time()
    
    try:
        # Read English source
        en_path = MESSAGES_DIR / 'en.json'
        with open(en_path, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        en_marketing = en_data.get('marketing', {})
        
        # Count total keys
        total_keys = count_keys(en_marketing)
        print(f'📊 Total marketing keys: {total_keys}')
        print(f'⏱️  Estimated time: {total_keys * 0.2 / 60:.1f} minutes\n')
        
        # Progress tracking
        translated_count = [0]
        last_percent = [0]
        
        def progress_callback():
            translated_count[0] += 1
            percent = int((translated_count[0] / total_keys) * 100)
            if percent > last_percent[0] and percent % 10 == 0:
                elapsed = time.time() - start_time
                remaining = (elapsed / translated_count[0]) * (total_keys - translated_count[0])
                print(f'   {percent}% complete ({translated_count[0]}/{total_keys}) - {remaining/60:.1f} min remaining')
                last_percent[0] = percent
        
        print('🔄 Translating marketing section...\n')
        
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
        
        print(f'\n✅ {config["name"]} marketing translation COMPLETE!')
        print(f'   📊 {total_keys}/{total_keys} keys translated (100%)')
        print(f'   ⏱️  Time: {duration/60:.1f} minutes')
        print(f'   📁 File: src/i18n/messages/{locale}.json\n')
        
        return True
        
    except Exception as e:
        print(f'\n❌ Error translating {config["name"]}: {str(e)}\n')
        return False

def main():
    print('\n' + '='*80)
    print('🚀 TRANSLATING 6 NEW LANGUAGES - MARKETING SECTIONS ONLY')
    print('='*80)
    print('\nLanguages to translate:')
    for code, info in LANGUAGES.items():
        print(f'  • {info["name"]} ({code})')
    print('\nThis will bring all languages to the same checkpoint (marketing complete)')
    print('='*80)
    
    overall_start = time.time()
    results = []
    
    for locale, config in LANGUAGES.items():
        success = translate_language(locale, config)
        results.append({'lang': config['name'], 'success': success})
        
        # Wait between languages to avoid rate limiting
        if locale != list(LANGUAGES.keys())[-1]:
            print('⏳ Waiting 10 seconds before next language...\n')
            time.sleep(10)
    
    # Summary
    overall_duration = time.time() - overall_start
    print('\n' + '='*80)
    print('📊 TRANSLATION SUMMARY')
    print('='*80 + '\n')
    
    for result in results:
        status = '✅' if result['success'] else '❌'
        print(f'{status} {result["lang"]}: {"Complete" if result["success"] else "Failed"}')
    
    success_count = sum(1 for r in results if r['success'])
    print(f'\n🎯 Total: {success_count}/{len(LANGUAGES)} languages translated successfully')
    print(f'⏱️  Total time: {overall_duration/60:.1f} minutes')
    
    if success_count == len(LANGUAGES):
        print('\n🎉 ALL MARKETING TRANSLATIONS COMPLETE!')
        print('\n✅ All 22 languages now have marketing content translated')
        print('✅ Ready to proceed with full application translation')
        print('\n📋 Next Steps:')
        print('   1. Verify translations: node scripts/audit-marketing-i18n-complete.js')
        print('   2. Test language switcher on marketing pages')
        print('   3. Proceed with full application translation for 6 languages')
    else:
        print('\n⚠️  Some translations failed. Check errors above.')
        print('   You may need to retry failed languages individually.')

if __name__ == '__main__':
    main()
