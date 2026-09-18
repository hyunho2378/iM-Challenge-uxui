# Liquid Glass 참고 자료

**이 폴더의 코드는 참고용이다. 애플리케이션에서 import하지 않는다.**

`client/src/index.css`의 `.glass` 규칙과 `client/src/tokens/tokens.js`의 `glass` 토큰이
실제 구현이며, 그 둘은 CSS `backdrop-filter`만 쓴다.

## 보관한 것

| 자료 | 상태 | 참고 용도 |
| --- | --- | --- |
| `liquidGL-main/` | 보관함 | specular/bevel 수치와 레이어 구성 참고 |

## 보관하지 못한 것

| 자료 | 사유 |
| --- | --- |
| `@ybouane/liquidglass` | 로컬에 내려받은 파일이 없다. 필요하면 별도로 받아서 이 폴더에 넣으면 된다 |
| `LiquidGlassCheatsheet` (SwiftUI) | 위와 같다 |

## 왜 import하지 않는가

| 자료 | 기술 | 배제 사유 |
| --- | --- | --- |
| liquidGL | WebGL + jQuery + html2canvas | 시니어 저사양 기기에서 프레임을 떨어뜨린다. jQuery가 스택을 오염시킨다 |
| @ybouane/liquidglass | TypeScript + WebGL | 이 프로젝트는 TypeScript 금지다. WebGL 비용도 위와 같다 |
| LiquidGlassCheatsheet | SwiftUI | 네이티브 전용이라 웹에서 실행할 수 없다. 효과 명세로만 읽는다 |

## 굴절(refraction)을 포기한 이유

CSS `backdrop-filter`는 픽셀 변위를 하지 못한다. 굴절을 내려면 SVG `feDisplacementMap`이
필요한데 Chromium 전용이라 iOS 사파리에서는 어차피 폴백된다. 게다가 글자가 일그러져
시니어 가독성을 직접 해친다. 그래서 블러와 specular edge만으로 간다.
