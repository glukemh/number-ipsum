import styles from "./adopted-global.css?raw";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
