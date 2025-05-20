document.addEventListener("DOMContentLoaded", function () {
  const collectButton = document.getElementById("collectImages");
  const urlList = document.getElementById("urlList");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = errorMessage.querySelector("span");
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  // 테마 토글 함수
  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);

    // 테마 변경 시 body에 transition 클래스 추가
    document.body.classList.add("transition-colors", "duration-200");
  }

  // 테마 아이콘 업데이트 함수
  function updateThemeIcon(isDark) {
    sunIcon.classList.toggle("hidden", isDark);
    moonIcon.classList.toggle("hidden", !isDark);
  }

  // 저장된 테마 적용
  function applyTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    updateThemeIcon(isDark);
  }

  // 초기 테마 적용
  applyTheme();

  // 시스템 테마 변경 감지
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme();
      }
    });

  // 테마 토글 버튼 이벤트 리스너
  themeToggle.addEventListener("click", toggleTheme);

  function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
      errorMessage.classList.add("hidden");
    }, 5000);
  }

  if (!collectButton || !urlList || !errorMessage || !errorText) {
    console.error("필요한 DOM 요소를 찾을 수 없습니다.");
    return;
  }

  collectButton.addEventListener("click", async () => {
    try {
      // 현재 활성화된 탭 가져오기
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab) {
        showError("활성화된 탭을 찾을 수 없습니다.");
        return;
      }

      // content script 주입
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["imageCollector.js"],
        });
      } catch (error) {
        console.error("Content script 주입 실패:", error);
      }

      // content script에 메시지 전송
      chrome.tabs.sendMessage(tab.id, { action: "getImages" }, (response) => {
        if (chrome.runtime.lastError) {
          showError("페이지를 새로고침한 후 다시 시도해주세요.");
          return;
        }

        if (!response) {
          showError("응답을 받지 못했습니다. 페이지를 새로고침해주세요.");
          return;
        }

        if (response.error) {
          showError(`에러 발생: ${response.error}`);
          return;
        }

        if (!response.urls) {
          showError("이미지 URL을 찾을 수 없습니다.");
          return;
        }

        if (response.urls.length === 0) {
          showError("현재 페이지에서 이미지를 찾을 수 없습니다.");
          return;
        }

        // URL 목록 표시
        urlList.innerHTML = response.urls
          .map(
            (url) => `
          <div class="p-2 bg-gray-50 dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
            <a href="${url}" target="_blank" class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 break-all">
              ${url}
            </a>
          </div>
        `
          )
          .join("");
      });
    } catch (error) {
      showError(`예상치 못한 에러 발생: ${error.message}`);
    }
  });
});
