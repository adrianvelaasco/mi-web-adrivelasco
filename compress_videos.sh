#!/bin/bash
mkdir -p videos/compressed

# 1. TYoE (Small enough)
ffmpeg -y -i "videos_for_you/1. TYoE.mp4" -vcodec libx264 -crf 28 -c:a aac -b:a 128k "videos/compressed/1.mp4"

# 2. PIANOGAMES (Small enough)
ffmpeg -y -i "videos_for_you/2. PIANOGAMES.mp4" -vcodec libx264 -crf 28 -c:a aac -b:a 128k "videos/compressed/2.mp4"

# 3. GameOfLife (Small enough)
ffmpeg -y -i "videos_for_you/3. GameOfLife.mp4" -vcodec libx264 -crf 28 -c:a aac -b:a 128k "videos/compressed/3.mp4"

# 4. RUMBLE (Was ~5MB -> Compress more)
ffmpeg -y -i "videos_for_you/4. RUMBLE.mp4" -vcodec libx264 -crf 32 -c:a aac -b:a 128k "videos/compressed/4.mp4"

# 5. EBDVP (Small enough)
ffmpeg -y -i "videos_for_you/5. EBDVP.mp4" -vcodec libx264 -crf 28 -c:a aac -b:a 128k "videos/compressed/5.mp4"

# 6. OSCPROTOCOL (Small enough)
ffmpeg -y -i "videos_for_you/6. OSCPROTOCOL.mp4" -vcodec libx264 -crf 28 -c:a aac -b:a 128k "videos/compressed/6.mp4"

# 7. lespontanea (Was ~4MB -> Compress more)
ffmpeg -y -i "videos_for_you/7. lespontanea.mp4" -vcodec libx264 -crf 32 -c:a aac -b:a 128k "videos/compressed/7.mp4"

# 8. AMC (Was 23MB -> AGGRESSIVE COMPRESSION)
ffmpeg -y -i "videos_for_you/8. AMC.mp4" -vcodec libx264 -crf 34 -c:a aac -b:a 128k "videos/compressed/8.mp4"
