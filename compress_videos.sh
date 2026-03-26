#!/bin/bash
mkdir -p videos/compressed

# Flag -movflags +faststart is crucial for web videos to start playing before being fully downloaded
FLAGS="-vcodec libx264 -c:a aac -b:a 128k -movflags +faststart -y"

echo "Compressing videos with +faststart for better web performance..."

# Ensure we use backup dir or fallback to current compressed if backup doesn't exist
SOURCE_DIR="videos/backup"
if [ ! -d "$SOURCE_DIR" ]; then SOURCE_DIR="videos/compressed"; fi

# 1. TYoE
ffmpeg -i "$SOURCE_DIR/1.mp4" $FLAGS -crf 28 "videos/compressed/1.mp4"

# 2. PIANOGAMES
ffmpeg -i "$SOURCE_DIR/2.mp4" $FLAGS -crf 28 "videos/compressed/2.mp4"

# 3. GameOfLife
ffmpeg -i "$SOURCE_DIR/3.mp4" $FLAGS -crf 28 "videos/compressed/3.mp4"

# 4. RUMBLE
ffmpeg -i "$SOURCE_DIR/4.mp4" $FLAGS -crf 32 "videos/compressed/4.mp4"

# 5. EBDVP
ffmpeg -i "$SOURCE_DIR/5.mp4" $FLAGS -crf 28 "videos/compressed/5.mp4"

# 6. OSCPROTOCOL
ffmpeg -i "$SOURCE_DIR/6.mp4" $FLAGS -crf 28 "videos/compressed/6.mp4"

# 7. lespontanea
ffmpeg -i "$SOURCE_DIR/7.mp4" $FLAGS -crf 32 "videos/compressed/7.mp4"

# 8. AMC
ffmpeg -i "$SOURCE_DIR/8.mp4" $FLAGS -crf 34 "videos/compressed/8.mp4"

# 9. MEINZUHAUSE
if [ -f "$SOURCE_DIR/9.mp4" ]; then
    ffmpeg -i "$SOURCE_DIR/9.mp4" $FLAGS -crf 30 "videos/compressed/9.mp4"
fi

echo "Done!"
