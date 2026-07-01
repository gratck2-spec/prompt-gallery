#!/bin/bash
# add-prompt.sh — Tambah gambar + prompt ke Prompt Gallery
# Usage: ./add-prompt.sh <image_file> "<prompt>" [options]
#
# Example:
#   ./add-prompt.sh photo.jpg "Mountain landscape at sunset" --model "Nano Banana" --category landscape --tags "mountain,sunset,cinematic"

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check args
if [ $# -lt 2 ]; then
    echo -e "${RED}Usage:${NC} ./add-prompt.sh <image_file> \"<prompt>\" [options]"
    echo ""
    echo "Options:"
    echo "  --model <name>        AI model (default: Nano Banana)"
    echo "  --category <name>     Category: portrait|landscape|abstract|product|architecture (default: landscape)"
    echo "  --tags <tag1,tag2>    Comma-separated tags"
    echo "  --negative <text>     Negative prompt"
    echo "  --ar <ratio>          Aspect ratio: 16:9, 9:16, 1:1, 4:5 (default: 16:9)"
    echo "  --title <text>        Custom title (default: filename)"
    exit 1
fi

IMAGE_FILE="$1"
PROMPT="$2"
shift 2

# Parse options
MODEL="Nano Banana"
CATEGORY="landscape"
TAGS=""
NEGATIVE=""
AR="16:9"
TITLE=""

while [ $# -gt 0 ]; do
    case "$1" in
        --model) MODEL="$2"; shift 2 ;;
        --category) CATEGORY="$2"; shift 2 ;;
        --tags) TAGS="$2"; shift 2 ;;
        --negative) NEGATIVE="$2"; shift 2 ;;
        --ar) AR="$2"; shift 2 ;;
        --title) TITLE="$2"; shift 2 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Check image exists
if [ ! -f "$IMAGE_FILE" ]; then
    echo -e "${RED}Error:${NC} File not found: $IMAGE_FILE"
    exit 1
fi

# Get filename without extension
FILENAME=$(basename "$IMAGE_FILE" | sed 's/\.[^.]*$//')
FILENAME=$(echo "$FILENAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

# Use title or filename
if [ -z "$TITLE" ]; then
    TITLE=$(basename "$IMAGE_FILE" | sed 's/\.[^.]*$//' | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
fi

# Generate ID (timestamp)
ID=$(date +%s)

# Create directories
mkdir -p images/originals images/thumbs

# Copy original
EXT="${IMAGE_FILE##*.}"
cp "$IMAGE_FILE" "images/originals/${FILENAME}.${EXT}"
echo -e "${GREEN}✓${NC} Original saved: images/originals/${FILENAME}.${EXT}"

# Create thumbnail with ImageMagick or fallback
if command -v convert &> /dev/null; then
    convert "$IMAGE_FILE" -resize 600x -quality 85 "images/thumbs/${FILENAME}.webp" 2>/dev/null
    echo -e "${GREEN}✓${NC} Thumbnail created: images/thumbs/${FILENAME}.webp"
elif command -v ffmpeg &> /dev/null; then
    ffmpeg -i "$IMAGE_FILE" -vf "scale=600:-1" -quality 85 "images/thumbs/${FILENAME}.webp" -y 2>/dev/null
    echo -e "${GREEN}✓${NC} Thumbnail created: images/thumbs/${FILENAME}.webp"
else
    # No image tools — just copy original as thumbnail
    cp "$IMAGE_FILE" "images/thumbs/${FILENAME}.${EXT}"
    echo -e "${YELLOW}⚠${NC} No image tool found — copied original as thumbnail"
fi

# Format tags as JSON array
if [ -n "$TAGS" ]; then
    TAGS_JSON=$(echo "$TAGS" | tr ',' '\n' | sed 's/^/"/;s/$/"/' | paste -sd, | sed 's/^/[/;s/$/]/')
else
    TAGS_JSON='[]'
fi

# Create JSON entry
NEW_ENTRY=$(cat <<EOF
{
  "id": ${ID},
  "title": "${TITLE}",
  "image": "images/originals/${FILENAME}.${EXT}",
  "thumbnail": "images/thumbs/${FILENAME}.webp",
  "prompt": "${PROMPT}",
  "negative_prompt": "${NEGATIVE}",
  "model": "${MODEL}",
  "category": "${CATEGORY}",
  "tags": ${TAGS_JSON},
  "aspect_ratio": "${AR}"
}
EOF
)

# Update prompts.json
if [ -f "data/prompts.json" ]; then
    # Insert new entry at beginning of array
    python3 -c "
import json
with open('data/prompts.json') as f:
    data = json.load(f)
new_entry = json.loads('''${NEW_ENTRY}''')
data.insert(0, new_entry)
with open('data/prompts.json', 'w') as f:
    json.dump(data, f, indent=2)
print('✓ prompts.json updated')
"
else
    echo "[${NEW_ENTRY}]" > data/prompts.json
    echo "✓ prompts.json created"
fi

echo ""
echo -e "${GREEN}Done!${NC} File added:"
echo "  Original: images/originals/${FILENAME}.${EXT}"
echo "  Thumbnail: images/thumbs/${FILENAME}.webp"
echo "  Prompt: \"${PROMPT:0:50}...\""
echo ""
echo "Next: git add -A && git commit -m 'add: ${TITLE}' && git push"
