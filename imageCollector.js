function collectImageUrls() {
    try {
        const images = document.getElementsByTagName('img');
        const imageUrls = Array.from(images)
            .map(img => img.src)
            .filter(url => url && url.startsWith('http')); // 유효한 URL만 필터링
        return imageUrls;
    } catch (error) {
        console.error('이미지 URL 수집 중 에러 발생:', error);
        return [];
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getImages') {
        try {
            const imageUrls = collectImageUrls();
            sendResponse({ urls: imageUrls });
        } catch (error) {
            console.error('메시지 처리 중 에러 발생:', error);
            sendResponse({ error: error.message });
        }
    }
    return true; // 비동기 응답을 위해 true 반환
}); 