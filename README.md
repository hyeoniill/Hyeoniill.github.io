# 박종현 포트폴리오

충남대학교 컴퓨터융합학부 박종현의 포트폴리오. 단일 정적 HTML 페이지입니다.

- 배포: https://hyeoniill.github.io/
- 빌드 도구 없음. `index.html` 하나로 완결되며 폰트만 Google Fonts에서 로드합니다.

## 구조

| 경로 | 역할 |
| ---- | ---- |
| `index.html` | 포트폴리오 본문 + 인라인 CSS |
| `og-default.png`, `favicon-*`, `apple-touch-icon.png` | 파비콘 / OG 이미지 |
| `robots.txt`, `sitemap.xml` | 검색 엔진용 |
| `googled2ce31aecd1efaf4.html`, `naver09f66d0d080cf34101efdcc19240e6f3.html` | Google / Naver 사이트 소유 확인 |
| `.github/workflows/deploy-github-pages.yml` | main 브랜치 push 시 정적 파일을 GitHub Pages로 배포 |

## 수정 방법

`index.html`을 직접 편집한 뒤 `main`에 push하면 Actions가 자동 배포합니다.
로컬 확인은 파일을 브라우저로 열거나 `python3 -m http.server` 로 확인합니다.
