function initReplace() {
  if (!window.emojiMap) return;

  function replaceText(node) {
    if (node.nodeType !== Node.TEXT_NODE) return;

    let text = node.nodeValue;
    let changed = false;

    // Emoji
    for (let code in emojiMap) {
      const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (text.includes(code)) {
        text = text.replace(new RegExp(escaped, "g"), emojiMap[code]);
        changed = true;
      }
    }

    // BBcode
const bbcodeMap = [
  { regex: /\[SPOILER\](.*?)\[\/SPOILER\]/gi, replacer: (m, txt) => `<span class="spoiler">${txt}</span>` },
  { regex: /\[B\](.*?)\[\/B\]/gi, replacer: (m, txt) => `<b>${txt}</b>` },
  { regex: /\[I\](.*?)\[\/I\]/gi, replacer: (m, txt) => `<em>${txt}</em>` },
  { regex: /\[S\](.*?)\[\/S\]/gi, replacer: (m, txt) => `<s>${txt}</s>` },
  { regex: /\[U\](.*?)\[\/U\]/gi, replacer: (m, txt) => `<u>${txt}</u>` },
  { regex: /\[LINK=(.*?)\](.*?)\[\/LINK\]/gi, replacer: (m, url, txt) => {
    const cls = url.startsWith("https://trestrestr.es") ? "" : " class=\"outlink\"";
    return `<a href="${url}" target="_blank" rel="noopener"${cls}>${txt}</a>`;} 
  }
];
    
// Anonymous to Anon
if (
  (text.includes("Anonymous") && node.parentNode?.classList.contains("author-name"))) {
  text = text.replace(/Anonymous/g, "Anon");
  changed = true;
}

    bbcodeMap.forEach(({ regex, replacer }) => {
      if (regex.test(text)) {
        changed = true;
        text = text.replace(regex, replacer);
      }
    });

    if (changed) {
      const span = document.createElement("span");
      span.innerHTML = text;
      node.replaceWith(...span.childNodes);
    }
  }

  function walk(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let current;
    while (current = walker.nextNode()) nodes.push(current);
    nodes.forEach(replaceText);
  }

  function replaceHCB() {
    const hcbComments = document.querySelectorAll('.hcb-comment-body');
    hcbComments.forEach(el => {
      el.innerHTML = el.innerHTML.replace(/./, m => m);
      walk(el);
    });
  }

  walk(document.body);
  replaceHCB();

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(n => walk(n));
      if (m.type === "characterData") replaceText(m.target);
    }

    // Spoiler toggle
    document.querySelectorAll('.spoiler').forEach(sp => {
      if (!sp.dataset.spoilerInit) {
        sp.dataset.spoilerInit = "true";
        sp.addEventListener('click', () => {
          sp.classList.add('revealed');
          sp.classList.remove('spoiler');
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Lazyyyy zzzzzzz
if (!window.emojiMap) {
  const mapscript = document.createElement("script");
  mapscript.src = "/javascript/emoji-map.js";
  mapscript.onload = initReplace;
  document.head.appendChild(mapscript);

  const btnscript = document.createElement("script");
  btnscript.src = "/javascript/hcb-btn.js";
  btnscript.onload = initReplace;
  document.head.appendChild(btnscript);
} else {
  initReplace();
}
