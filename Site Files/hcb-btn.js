function initHcbBtn(textarea) {
  if (!window.emojiMap || !textarea) return;

  if (textarea.nextSibling && textarea.nextSibling.id === 'hcb_emoji_picker_dt') return;

  //Emoji picker
  const emojiDetails = document.createElement('details');
  emojiDetails.id = 'hcb_emoji_picker_dt';
  emojiDetails.style.display = 'inline-block';

  const emojiSummary = document.createElement('summary');
  emojiSummary.textContent = 'Emojis';
  emojiSummary.id = 'hcb_emoji_picker_sm';
  emojiDetails.appendChild(emojiSummary);

  const emojiContainer = document.createElement('div');
  emojiContainer.id = 'hcb_emoji_container';

  for (let code in window.emojiMap) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'hcb_emoji_picker_btn';
    btn.innerHTML = window.emojiMap[code];

    btn.onclick = () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      textarea.value = val.slice(0, start) + code + val.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + code.length;
      textarea.focus();
    };

    emojiContainer.appendChild(btn);
  }

  emojiDetails.appendChild(emojiContainer);

// BBcode
  const bbDetails = document.createElement('details');
  bbDetails.id = 'hcb_bbcode_picker_dt';
  bbDetails.style.display = 'inline-block';
  

  const bbSummary = document.createElement('summary');
  bbSummary.textContent = 'BBcode';
  bbSummary.id = 'hcb_bbcode_picker_sm';
  bbDetails.appendChild(bbSummary);

  const bbContainer = document.createElement('div');
  bbContainer.id = 'hcb_bbcode_container';


  function makeBBButton(label, openTag, closeTag, styling, needsUrl = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'hcb_bbcode_btn';
    btn.textContent = label;
    btn.setAttribute('style',`${styling}`);

    btn.onclick = () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const selected = val.slice(start, end) || 'text';

      let insert;

      if (needsUrl) {
        insert = `[link=url]${selected}[/link]`;
      } else {
        insert = openTag + selected + closeTag;
      }

      textarea.value = val.slice(0, start) + insert + val.slice(end);

      const pos = start + insert.length;
      textarea.selectionStart = textarea.selectionEnd = pos;
      textarea.focus();
    };

    return btn;
  }

  bbContainer.appendChild(makeBBButton('B', '[b]', '[/b]', 'font-weight:800'));
  bbContainer.appendChild(makeBBButton('U', '[u]', '[/u]', 'text-decoration:underline'));
  bbContainer.appendChild(makeBBButton('S', '[s]', '[/s]', 'text-decoration:line-through'));
  bbContainer.appendChild(makeBBButton('Spoiler', '[spoiler]', '[/spoiler]'));
  bbContainer.appendChild(makeBBButton('Link', '', '', '', true));  
  
  bbDetails.appendChild(bbContainer);

  
  textarea.parentNode.insertBefore(emojiDetails, textarea.nextSibling);
  emojiDetails.insertAdjacentElement('afterend', bbDetails);
  
function setExclusive(detailsA, detailsB) {
  detailsA.addEventListener('toggle', () => {
    if (detailsA.open) detailsB.open = false;
  });
  detailsB.addEventListener('toggle', () => {
    if (detailsB.open) detailsA.open = false;
  });
}

setExclusive(emojiDetails, bbDetails);

}

const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        const textareas = node.querySelectorAll('textarea');
        textareas.forEach(t => initHcbBtn(t));
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
