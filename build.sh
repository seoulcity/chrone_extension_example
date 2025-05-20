#!/bin/bash

# 빌드 디렉토리 생성
mkdir -p build

# Tailwind CSS 빌드
echo "Building Tailwind CSS..."
tailwindcss -i ./input.css -o ./styles.css --minify

# 필요한 파일만 복사
echo "Copying files to build directory..."
cp manifest.json build/
cp popup.html build/
cp popup.js build/
cp imageCollector.js build/
cp styles.css build/
cp -r icons build/

# ZIP 파일 생성
echo "Creating ZIP file..."
cd build
zip -r ../chrome_extension.zip ./*
cd ..

echo "Build completed! chrome_extension.zip is ready for upload." 