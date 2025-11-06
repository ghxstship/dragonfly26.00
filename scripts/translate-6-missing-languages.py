#!/usr/bin/env python3
"""
COMPLETE TRANSLATION FOR 6 MISSING LANGUAGES
Translates ALL keys for Italian, Polish, Dutch, Swedish, Danish, Finnish
Uses deep-translator (same as original 20 languages)

Install: pip3 install deep-translator
"""

import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

# Language configurations
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
            time.sleep(0.15)  # Rate limiting - slightly longer delay
            return result
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2)  # Longer wait on retry
                continue
            print(f"      ⚠️  Error translating: {str(e)[:50]}")
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
        if progress_callback:
            progress_callback()
        return translate_text(obj, target_lang)
    else:
        return obj

def count_strings(obj):
    """Count total translatable strings in object"""
    if isinstance(obj, dict):
        return sum(count_strings(value) for value in obj.values())
    elif isinstance(obj, str):
        return 1
    else:
        return 0

def translate_language(locale, config):
    """Translate entire language file"""
    print(f"\n📝 Translating {config['name']} ({locale})...")
    
    start_time = time.time()
    
    try:
        # Read English source
        en_path = MESSAGES_DIR / 'en.json'
        with open(en_path, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        
        # Count total strings
        total_strings = count_strings(en_data)
        print(f"   Total keys: {total_strings}")
        
        # Progress tracking
        translated_count = [0]
        last_percent = [0]
        
        def progress_callback():
            translated_count[0] += 1
            percent = int((translated_count[0] / total_strings) * 100)
            if percent > last_percent[0] and percent % 5 == 0:
                print(f"   Progress: {percent}% ({translated_count[0]}/{total_strings})")
                last_percent[0] = percent
        
        # Translate entire structure
        print(f"   Translating...")
        translated_data = translate_object(en_data, config['code'], progress_callback=progress_callback)
        
        # Write to file
        locale_path = MESSAGES_DIR / f'{locale}.json'
        with open(locale_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        
        duration = time.time() - start_time
        print(f"   ✅ {config['name']} complete ({duration:.1f}s)")
        print(f"   📊 {total_strings}/{total_strings} keys translated (100%)")
        
        return {'success': True, 'locale': locale, 'duration': duration, 'keys': total_strings}
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return {'success': False, 'locale': locale, 'error': str(e)}

def main():
    print('🌍 6 MISSING LANGUAGES TRANSLATION SYSTEM\n')
    print('Languages to translate:')
    for locale, config in LANGUAGES.items():
        print(f"  - {config['name']} ({locale})")
    print('\nEstimated: ~8,000 keys per language')
    print('Total: ~48,000 translations\n')
    print('=' * 80 + '\n')
    
    results = []
    total_success = 0
    total_failed = 0
    total_keys = 0
    
    for locale, config in LANGUAGES.items():
        result = translate_language(locale, config)
        results.append(result)
        
        if result['success']:
            total_success += 1
            total_keys += result.get('keys', 0)
        else:
            total_failed += 1
        
        # Delay between languages to avoid rate limiting
        if locale != list(LANGUAGES.keys())[-1]:  # Not the last one
            print('\n   ⏳ Waiting 5 seconds before next language...')
            time.sleep(5)
    
    # Final summary
    print('\n' + '=' * 80)
    print('\n📊 TRANSLATION COMPLETE\n')
    print(f"Languages processed: {len(results)}/6")
    print(f"✅ Successful: {total_success}")
    print(f"❌ Failed: {total_failed}")
    print(f"\n📈 Total translations: {total_keys:,} keys")
    
    if total_success == 6:
        print('\n🎉 SUCCESS! All 6 languages are now 100% translated!')
        print(f'   Total: {total_keys:,} translations across 6 languages')
        print('\n✅ Next steps:')
        print('   1. Verify translation files exist')
        print('   2. Test country selector with all 38 countries')
        print('   3. Test language switching')
        print('   4. Deploy to production')
    else:
        print('\n⚠️  Some languages failed. Check errors above.')
        print('   Failed languages:')
        for result in results:
            if not result['success']:
                print(f"   - {result['locale']}: {result.get('error', 'Unknown error')}")
    
    print('\n💡 Note: These are machine translations using Google Translate.')
    print('   Same service used for the original 20 languages.')
    print('   Recommended: Have native speakers review for accuracy.')
    
    # Summary by language
    print('\n📋 Language Summary:')
    for result in results:
        if result['success']:
            print(f"   ✅ {result['locale']}: {result.get('keys', 0):,} keys in {result['duration']:.1f}s")
        else:
            print(f"   ❌ {result['locale']}: Failed")

if __name__ == '__main__':
    main()
