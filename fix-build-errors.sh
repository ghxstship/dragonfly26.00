#!/bin/bash

# Fix locations and people files with malformed loading state
for file in src/components/locations/locations-{bim-models,coordination,logistics,spatial-features,utilities,warehousing}-tab.tsx \
            src/components/people/people-{applicants,assignments,onboarding,openings,personnel,teams,timekeeping,training}-tab.tsx; do
  if [ -f "$file" ]; then
    # Fix the extra closing tags
    perl -i -pe 's/^        <\/div>\n         \)$/      <\/div>\n    )/gm' "$file"
    perl -i -0777 -pe 's/      <\/div>\n        <\/div>\n         \)\n}/      <\/div>\n    )\n  }/g' "$file"
  fi
done

# Fix people-scheduling-tab.tsx
if [ -f "src/components/people/people-scheduling-tab.tsx" ]; then
  sed -i '' 's/export function PeopleSchedulingTab({$/export function PeopleSchedulingTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {/' src/components/people/people-scheduling-tab.tsx
  sed -i '' '/^export function.*TabComponentProps) {$/a\
  const t = useTranslations('\''production.people.scheduling'\'')\
  const tCommon = useTranslations('\''common'\'')
' src/components/people/people-scheduling-tab.tsx
  sed -i '' '/const t = useTranslations/,/const tCommon = useTranslations/{ / workspaceId, moduleId, tabSlug }: TabComponentProps) {/d; }' src/components/people/people-scheduling-tab.tsx
fi

# Fix resources files - remove extra curly braces
sed -i '' 's/mainMessage={searchQuery || selectedLetter ? "No grants found" : {t('\''nothingToSeeYet'\'')}}/mainMessage={searchQuery || selectedLetter ? "No grants found" : t('\''nothingToSeeYet'\'')}/' src/components/resources/resources-grants-tab.tsx
sed -i '' 's/mainMessage={searchQuery || selectedCategory ? "No publications found" : {t('\''nothingToSeeYet'\'')}}/mainMessage={searchQuery || selectedCategory ? "No publications found" : t('\''nothingToSeeYet'\'')}/' src/components/resources/resources-publications-tab.tsx
sed -i '' 's/mainMessage={searchQuery || selectedCategory ? "No articles found" : {t('\''nothingToSeeYet'\'')}}/mainMessage={searchQuery || selectedCategory ? "No articles found" : t('\''nothingToSeeYet'\'')}/' src/components/resources/resources-troubleshooting-tab.tsx

# Add Plus import to members files
sed -i '' 's/from "lucide-react"/from "lucide-react"\nimport { Plus } from "lucide-react"/' src/components/members/create-tab.tsx
sed -i '' 's/from "lucide-react"/from "lucide-react"\nimport { Plus } from "lucide-react"/' src/components/members/invite-tab.tsx

echo "Build errors fixed!"
