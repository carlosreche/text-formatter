javascript: ((
  fieldSelectors = [
    'input[formcontrolname="nome"]',
    'input[formcontrolname="nomePai"]',
    'input[formcontrolname="nomeMae"]',
    'input[formcontrolname="conjuge"]',
    'input[name="nome"]',
    'input[name="nomeMae"]',
    'input[name="nomePai"]',
    'input[name="sispgNome"]'
  ]

) => {
  if (!Array.isArray(fieldSelectors)) {
    fieldSelectors = [];
  }

  const instanceKey = Symbol.for('TextFormatterApp');
  if (window[instanceKey]) {
    window[instanceKey].run();
    return;
  }

  let appLanguage = navigator.language?.trim().toLowerCase().split('-')[0] ?? 'en';

  const appTextData = {
    DEFAULT_TEXT_LANGUAGE: 'en',
    appName: ['Text Formatter', { pt: 'Formatador de Texto', es: 'Formateador de Texto' }],
    formField: ['Form Field', { pt: 'Campo de Formulário', es: 'Campo de Formulario' }],
    selectedText: ['Selected Text', { pt: 'Texto Selecionado', es: 'Texto Seleccionado' }],
    typedText: ['Typed Text', { pt: 'Texto Digitado', es: 'Texto Escrito' }],
    labelOriginal: ['Original Text', { pt: 'Texto Original', es: 'Texto Original' }],
    labelFormatted: ['Formatted Proposal', { pt: 'Proposta de Formatação', es: 'Propuesta de Formato' }],
    buttonApplyCurrent: ['Apply Current', { pt: 'Aplicar Atual', es: 'Aplicar Actual' }],
    buttonApplyAll: ['Apply All', { pt: 'Aplicar Todos', es: 'Aplicar Todos' }],
    buttonCopy: ['Copy Current', { pt: 'Copiar Atual', es: 'Copiar Actual' }],
    buttonCopied: ['Copied!', { pt: 'Copiado!', es: '¡Copiado!' }],
    buttonClose: ['Close', { pt: 'Fechar', es: 'Cerrar' }],
    modeProper: ['Proper Name', { pt: 'Nome Próprio', es: 'Nombre Propio' }],
    modeCapitalize: ['Capitalize', { pt: 'Iniciais Maiúsculas', es: 'Iniciales May.' }],
    modeFirst: ['First letter', { pt: 'Primeira letra', es: 'Primera letra' }],
    modeUpper: ['UPPERCASE', { pt: 'MAIÚSCULAS', es: 'MAYÚSCULAS' }],
    modeLower: ['lowercase', { pt: 'minúsculas', es: 'minúsculas' }],
    titleEnglishLanguage: ['English', { pt: 'Inglês', es: 'Inglés' }],
    titlePortugueseLanguage: ['Portuguese', { pt: 'Português', es: 'Portugués' }],
    titleSpanishLanguage: ['Spanish', { pt: 'Espanhol', es: 'Español' }],
    itemLabelFallback: ['Item', { pt: 'Item', es: 'Elemento' }],
    iconPrevious: '≪', iconNext: '≫', iconApply: '✅', iconCopy: '🗐', iconClose: '✖',
    iconPortuguese: '🇧🇷', iconEnglish: '🇺🇸', iconSpanish: '🇪🇸'
  };

  const appText = new Proxy(appTextData, {
    get(target, property, receiver) {
      const value = target[property];
      if (typeof value === 'string') return value;
      if (!Array.isArray(value)) return '';
      const [defaultValue, translations = null] = value;
      if (!appLanguage || (appLanguage === target.DEFAULT_TEXT_LANGUAGE)) return defaultValue;
      return translations?.[appLanguage] ?? defaultValue;
    }
  });

  const stylesheet = `
    dialog {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      border-radius: 12px; min-width: 650px; max-width: 90%;
      background: hsl(0, 0%, 100%); color: hsl(217, 33%, 18%);
      border: 1px solid hsl(214, 32%, 91%); font-family: system-ui, sans-serif;
      box-shadow: 0 10px 25px -5px hsla(0, 0%, 0%, 0.15);
      margin: 0; padding: 0;
      overflow: hidden; display: flex; flex-direction: column; z-index: 999999;
    }
    dialog::backdrop { background: hsla(0, 0%, 0%, 0.4); backdrop-filter: blur(1px); transition: opacity 0.2s; }
    * { box-sizing: border-box; }

    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 15px 20px; border-bottom: 1px solid hsl(214, 32%, 91%);
      background: hsl(210, 40%, 98%); cursor: grab;
    }
    .modal-header:active { cursor: grabbing; }
    .modal-header h3 { margin: 0; font-size: 15px; color: hsl(215, 25%, 27%); font-weight: 600; pointer-events: none; }

    .container { display: flex; flex: 1; min-height: 320px; align-items: stretch; }
    nav {
      width: 160px; background-color: hsl(210, 40%, 98%); border-right: 1px solid hsl(214, 32%, 91%);
      display: flex; flex-direction: column; padding: 10px 0; overflow-y: auto;
    }
    .tab-btn {
      background: transparent; border: none; text-align: left; padding: 12px 15px;
      font-size: 13px; color: hsl(215, 16%, 47%); font-weight: 500; cursor: pointer;
      border-left: 3px solid transparent; transition: all 0.2s;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tab-btn:hover { background: hsl(210, 40%, 94%); color: hsl(215, 25%, 27%); }
    .tab-btn.active { background: hsl(0, 0%, 100%); border-left-color: hsl(217, 91%, 60%); color: hsl(217, 91%, 60%); }

    main { flex: 1; padding: 20px 25px; display: flex; flex-direction: column; background: hsl(0, 0%, 100%); }
    
    .toolbar { display: flex; gap: 12px; margin-bottom: 25px; align-items: stretch; }
    .btn-mode {
      background: hsl(210, 40%, 98%); border: 1px solid hsl(213, 27%, 84%);
      padding: 8px 12px; font-size: 12px; font-weight: 500; border-radius: 8px;
      color: hsl(215, 16%, 47%); cursor: pointer; transition: all 0.15s;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .btn-mode:hover { background: hsl(0, 0%, 100%); border-color: hsl(217, 91%, 60%); }
    .btn-mode.active {
      background: hsl(0, 0%, 100%); color: hsl(217, 91%, 60%);
      border-color: hsl(217, 91%, 60%); box-shadow: 0 2px 4px hsla(217, 91%, 60%, 0.1);
    }
    
    [data-id="btn-proper"] { flex: 1.2; gap: 8px; padding: 10px; }
    .mode-title { pointer-events: none; }
    .lang-flags { display: flex; gap: 8px; }
    .lang-flag { opacity: 0.4; font-size: 16px; transition: 0.2s; border-radius: 4px; padding: 2px 4px; }
    .lang-flag:hover { opacity: 0.9; transform: scale(1.15); }
    .lang-flag.active { opacity: 1; transform: scale(1.15); background: hsla(217, 91%, 60%, 0.15); }
    
    .mode-column { display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .btn-half { flex: 1; margin: 0; padding: 6px; }

    .content-area { display: flex; flex-direction: column; gap: 20px; margin-bottom: auto; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .label { text-align: left; font-weight: 600; font-size: 12px; color: hsl(215, 16%, 47%); text-transform: uppercase; letter-spacing: 0.5px; transition: color 0.2s; }

    .value {
      border: 1px solid hsl(213, 27%, 84%); border-radius: 8px; padding: 12px 14px;
      background: hsl(210, 40%, 98%); min-height: 44px; font-family: 'Fira Code', monospace;
      color: hsl(215, 25%, 27%); word-break: break-word; white-space: pre-wrap;
      font-size: 14px; line-height: 1.5; transition: all 0.2s;
    }
    .value[contenteditable="true"] { background-color: hsl(0, 0%, 100%); cursor: text; }
    .value[contenteditable="true"]:focus { outline: none; border-color: hsl(217, 91%, 60%); box-shadow: 0 0 0 3px hsla(217, 91%, 60%, 0.15); }

    .field-formatted .value { background-color: hsl(217, 91%, 97%); border-color: hsl(217, 91%, 75%); }
    .field-formatted .value:focus { box-shadow: 0 0 0 3px hsla(217, 91%, 60%, 0.25); }
    .field-formatted .label { color: hsl(217, 91%, 45%); }

    .actions {
      display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px;
      align-items: center; padding-top: 15px; border-top: 1px solid hsl(214, 32%, 91%);
    }
    .btn-action {
      cursor: pointer; border: 1px solid hsl(213, 27%, 84%); padding: 8px 16px;
      border-radius: 8px; font-weight: 500; font-size: 13px; background: hsl(0, 0%, 100%); color: hsl(215, 25%, 27%); transition: all 0.15s ease;
    }
    .btn-action:hover { background: hsl(210, 40%, 98%); border-color: hsl(215, 20%, 65%); }
    .btn-primary { background: hsl(217, 91%, 60%); border-color: hsl(217, 91%, 60%); color: hsl(0, 0%, 100%); }
    .btn-primary:hover { background: hsl(221, 83%, 53%); border-color: hsl(221, 83%, 53%); }
    .btn-close { cursor: pointer; background: transparent; border: none; font-size: 14px; color: hsl(215, 20%, 65%); padding: 4px; transition: color 0.2s; }
    .btn-close:hover { color: hsl(215, 25%, 27%); }

    dialog[open] { animation: modalFadeIn 0.2s ease-out forwards; }
    @keyframes modalFadeIn { from { opacity: 0; margin-top: -10px; } to { opacity: 1; margin-top: 0; } }

    /* CLASSES PARA A ANIMAÇÃO DE FECHAMENTO */
    dialog.closing { animation: modalFadeOut 0.15s ease-in forwards; pointer-events: none; }
    dialog.closing::backdrop { opacity: 0; }
    @keyframes modalFadeOut { from { opacity: 1; margin-top: 0; } to { opacity: 0; margin-top: -10px; } }
  `;

  function formatText(text, options = {}) {
    if (typeof text !== 'string') {
      throw new TypeError(`Text.format expects a string as the first argument. Given: ${typeof text}`);
    }

    let {
      mode = 'normal',
      trimEdges = true,
      normalizeSpaces = true,
      removeNewlines = false,
      lowercaseWords = null,
      language = null
    } = Object(options);

    let formatted = text;

    if (trimEdges) {
      formatted = formatted.trim();
    }
    if (removeNewlines) {
      formatted = formatted.replace(/[\r\n]+/g, ' ');
    }
    if (normalizeSpaces) {
      formatted = formatted.replace(/(\s)\s+/g, '$1');
    }

    mode = String(mode).trim().toLowerCase();
    switch (mode) {
      case 'normal':
      case 'regular':
        return formatted
                .toLowerCase()
                .replace(
                  /((^)[^\p{L}]*|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
                  (all, before, beggining, word, firstLetter, remaining) => {
                    if ((beggining !== undefined) || /[.!?¡¿]\s*$/.test(before)) {
                      return (before + firstLetter.toUpperCase() + remaining);
                    }
                    return all;
                  }
                );

      case 'upper':
        return formatted.toUpperCase();

      case 'lower':
        return formatted.toLowerCase();

      case 'first':
        return formatted
                .toLowerCase()
                .replace(
                  /^([^\p{L}]*)(\p{L})/u,
                  (all, before, firstLetter) => (before + firstLetter.toUpperCase())
                );

      case 'capitalize':
        return formatted
                .toLowerCase()
                .replace(
                  /(^|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
                  (all, before, word, firstLetter, remaining) =>
                                      (before + firstLetter.toUpperCase() + remaining)
                );

      case 'proper':
        let isLowercaseWord;
        if (typeof lowercaseWords === 'string') {
          isLowercaseWord = word => (word === lowercaseWords);
        } else if (lowercaseWords instanceof RegExp) {
          isLowercaseWord = word => lowercaseWords.test(word);
        } else {
          if (!Array.isArray(lowercaseWords)) {
            language = ((typeof language === 'string') ? language : navigator?.language)?.trim().toLowerCase().split('-')[0];
            switch (language) {
              case 'pt':
                lowercaseWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'em', 'por', 'com', 'para', 'sob', 'sobre', 'até', 'sem', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'pelo', 'pela', 'pelos', 'pelas', 'ao', 'aos', 'e', 'nem', 'mas', 'porém', 'contudo', 'todavia', 'entretanto', 'ou', 'logo', 'pois', 'portanto', 'porque', 'que'];
                break;
              case 'en':
                lowercaseWords = ['of', 'and', 'the', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'a', 'an', 'or', 'but'];
                break;
              case 'es':
              case 'spa':
                lowercaseWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'del', 'al', 'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'sobre', 'tras', 'vía', 'y', 'e', 'o', 'u', 'pero', 'sino', 'porque', 'aunque', 'si', 'ni'];
                break;
              default:
                lowercaseWords = [];
            }
          }
          isLowercaseWord = word => lowercaseWords.some(lcWord => {
            if (typeof lcWord === 'string') return (word === lcWord);
            if (lcWord instanceof RegExp) return lcWord.test(word);
            return false;
          });
        }

        return formatted
                .toLowerCase()
                .replace(
                  /((^)[^\p{L}]*|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
                  (all, before, beggining, word, firstLetter, remaining) => {
                    if (isLowercaseWord(word) && !/[.!?¡¿]\s*$/.test(before) && (beggining === undefined)) {
                      return all;
                    }
                    return (before + firstLetter.toUpperCase() + remaining);
                  }
                );

      default:
        return formatted;
    }
  }

  const getElementFromRange = range => {
    if (!(range instanceof Range)) return null;
    const container = range.commonAncestorContainer;
    return (container instanceof Element) ? container : (container?.parentElement ?? null);
  };

  const getEditableElement = (reference = null) => {
    let element;
    if (reference instanceof Element) {
      if (/^(input|textarea)$/i.test(reference.tagName)) return reference;
      element = reference;
    } else if (reference instanceof Range) {
      element = getElementFromRange(reference);
      if (!element) return null;
    }
    while (!!element) {
      if (/^true$/i.test(element.contentEditable)) return element;
      if (!/^inherit$/i.test(element.contentEditable)) break;
      element = element.parentElement;
    }
    return null;
  };

  const isPlainTextField = element => ((element instanceof Element) && /^(input|textarea)$/i.test(element.tagName));

  class Text {
    constructor(parameters = {}) {
      if (!parameters) parameters = { plainText: '' };
      else if (typeof parameters !== 'object') parameters = { plainText: ((typeof parameters === 'string') ? parameters : '') };
      let { field = null, range = null, plainText = null } = parameters;
      this.mode = 'proper';
      this.language = appLanguage;
      this.field = field;
      this.isEditable = false;

      if (range instanceof Range) {
        const element = getElementFromRange(range);
        const editableElement = getEditableElement(range);
        this.label = (element?.labels?.item?.(0) ?? editableElement?.labels?.item?.(0))?.textContent ?? appText.selectedText;
        this.getValue = () => range.toString();

        if (editableElement) {
          this.isEditable = true;
          this.setValue = newValue => {
            range.deleteContents();
            range.insertNode(document.createTextNode(newValue));
            editableElement.dispatchEvent(new Event('input', { bubbles: true }));
          };
        } else {
          this.isEditable = false;
          this.setValue = () => {};
        }
      } else if (field) {
        this.isEditable = true;
        this.label = field.labels?.item?.(0)?.textContent ?? field.placeholder ?? field.name ?? appText.formField;
        this.getValue = () => isPlainTextField(field) ? field.value : field.textContent;
        this.setValue = newValue => {
          if (isPlainTextField(field)) field.value = newValue;
          else field.textContent = newValue;
          field.dispatchEvent(new Event('input', { bubbles: true }));
        };
      } else {
        this.isEditable = false;
        this.label = appText.typedText;
        this.getValue = () => (plainText ?? '');
        this.setValue = () => {};
      }
      this.originalValue = this.getValue();
    }
    get formattedValue() { return formatText(this.originalValue, { mode: this.mode, language: this.language }); }
  }

  class TextList {
    constructor(items = []) {
      this.items = items;
      this.currentIndex = 0;
    }
    get length() { return this.items.length; }
    current() { return this.items[this.currentIndex] ?? null; }
    hasNext() { return this.currentIndex < (this.items.length - 1); }
    setCurrent(index) {
      if (index >= 0 && index < this.items.length) this.currentIndex = index;
      return this.current();
    }
    forEach(callback) { this.items.forEach(callback); }
  }

  let shadowDomHost = null;

  const run = () => {
    let targets = [];
    const selection = window.getSelection();

    if (selection && (selection.rangeCount > 0) && (selection.toString().trim().length > 0)) {
      for (let i = 0; i < selection.rangeCount; i++) {
        targets.push(new Text({ range: selection.getRangeAt(i) }));
      }
    } else {
      const elements = document.querySelectorAll(fieldSelectors.join(', '));
      elements.forEach(el => targets.push(new Text({ field: el })));
    }

    if (targets.length === 0) {
      const editable = getEditableElement(document.activeElement);
      if (editable) {
        targets.push(new Text({ field: editable }));
      } else {
        targets.push(new Text({ plainText: '' }));
      }
    }

    const textList = new TextList(targets);

    if (shadowDomHost) shadowDomHost.remove();
    shadowDomHost = document.createElement('div');
    document.body.appendChild(shadowDomHost);
    const shadow = shadowDomHost.attachShadow({ mode: 'open' });

    const dialog = document.createElement('dialog');

    let tabsHTML = textList.items.map((t, i) =>
      `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-index="${i}" title="${t.label}">
         ${t.label || `${appText.itemLabelFallback} ${i+1}`}
       </button>`
    ).join('');

    dialog.innerHTML = `
      <style>${stylesheet}</style>
      <div class="modal-header">
        <h3>${appText.appName}</h3>
        <button class="btn-close" title="${appText.buttonClose}">${appText.iconClose}</button>
      </div>
      <div class="container">
        <nav>${tabsHTML}</nav>
        <main>
          <div class="toolbar">
            <button class="btn-mode active" data-mode="proper" data-id="btn-proper">
              <span class="mode-title">${appText.modeProper}</span>
              <div class="lang-flags">
                <span class="lang-flag active" data-lang="pt" title="${appText.titlePortugueseLanguage}">${appText.iconPortuguese}</span>
                <span class="lang-flag" data-lang="en" title="${appText.titleEnglishLanguage}">${appText.iconEnglish}</span>
                <span class="lang-flag" data-lang="es" title="${appText.titleSpanishLanguage}">${appText.iconSpanish}</span>
              </div>
            </button>
            <div class="mode-column">
              <button class="btn-mode btn-half" data-mode="capitalize">${appText.modeCapitalize}</button>
              <button class="btn-mode btn-half" data-mode="first">${appText.modeFirst}</button>
            </div>
            <div class="mode-column">
              <button class="btn-mode btn-half" data-mode="upper">${appText.modeUpper}</button>
              <button class="btn-mode btn-half" data-mode="lower">${appText.modeLower}</button>
            </div>
          </div>

          <div class="content-area">
            <div class="field-group">
              <span class="label">${appText.labelOriginal}</span>
              <span class="value" data-id="val-original" contenteditable="true" spellcheck="false"></span>
            </div>
            <div class="field-group field-formatted">
              <span class="label">${appText.labelFormatted}</span>
              <span class="value" data-id="val-formatted" contenteditable="true" spellcheck="false"></span>
            </div>
          </div>

          <span class="actions">
            <button class="btn-action btn-copy">${appText.buttonCopy}</button>
            <button class="btn-action btn-apply-current">${appText.buttonApplyCurrent}</button>
            <button class="btn-action btn-primary btn-apply-all">${appText.buttonApplyAll}</button>
          </span>
        </main>
      </div>
    `;
    shadow.appendChild(dialog);

    const valOriginal = dialog.querySelector('.value[data-id="val-original"]');
    const valFormatted = dialog.querySelector('.value[data-id="val-formatted"]');
    const btnApplyCurrent = dialog.querySelector('.btn-apply-current');
    const btnApplyAll = dialog.querySelector('.btn-apply-all');
    const tabBtns = dialog.querySelectorAll('.tab-btn');
    const modeBtns = dialog.querySelectorAll('.btn-mode');
    const langFlags = dialog.querySelectorAll('.lang-flag');

    const closeDialog = () => {
      if (dialog.classList.contains('closing')) return;
      dialog.classList.add('closing');
      dialog.addEventListener('animationend', () => {
        dialog.close();
      }, { once: true });
    };

    const renderCurrentTab = () => {
      const currentText = textList.current();
      valOriginal.textContent = currentText.originalValue || '';
      valFormatted.textContent = currentText.formattedValue || '';

      btnApplyCurrent.style.display = currentText.isEditable ? 'inline-block' : 'none';
      btnApplyAll.style.display = textList.items.some(t => t.isEditable) ? 'inline-block' : 'none';
    };

    valOriginal.addEventListener('blur', () => {
      const current = textList.current();
      current.originalValue = valOriginal.textContent;
      valFormatted.textContent = current.formattedValue;
    });

    valOriginal.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter') && !e.shiftKey) {
        e.preventDefault();
        valOriginal.blur();
      }
    });

    valFormatted.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter') && !e.shiftKey) {
        e.preventDefault();
        applyAndNext();
      }
    });

    const applyAndNext = () => {
      const current = textList.current();
      if(current.isEditable) {
        current.setValue(valFormatted.textContent);
      }

      if (textList.hasNext()) {
        const nextIndex = textList.currentIndex + 1;
        textList.setCurrent(nextIndex);
        tabBtns.forEach(b => b.classList.remove('active'));
        tabBtns[nextIndex].classList.add('active');
        renderCurrentTab();
      } else {
        closeDialog();
      }
    };

    btnApplyCurrent.addEventListener('click', applyAndNext);

    btnApplyAll.addEventListener('click', () => {
      textList.forEach((t, i) => {
        if(t.isEditable) {
          const textToApply = (i === textList.currentIndex) ? valFormatted.textContent : t.formattedValue;
          t.setValue(textToApply);
        }
      });
      closeDialog();
    });

    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const clickedFlag = e.target.closest('.lang-flag');
        const mode = btn.getAttribute('data-mode');

        if (clickedFlag) {
          const lang = clickedFlag.getAttribute('data-lang');
          appLanguage = lang;
          
          textList.forEach(t => {
            t.mode = 'proper'; 
            t.language = lang;
          });

          langFlags.forEach(f => f.classList.remove('active'));
          clickedFlag.classList.add('active');
        } else {
          textList.forEach(t => t.mode = mode);
        }

        modeBtns.forEach(b => b.classList.remove('active'));
        
        const targetBtn = clickedFlag ? dialog.querySelector('[data-id="btn-proper"]') : btn;
        targetBtn.classList.add('active');

        renderCurrentTab();
      });
    });

    const header = dialog.querySelector('.modal-header');
    let isDragging = false;
    let dragOffsetX = 0; let dragOffsetY = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.btn-close')) return;
      isDragging = true;
      const rect = dialog.getBoundingClientRect();
      dialog.style.transform = 'none';
      dialog.style.left = rect.left + 'px';
      dialog.style.top = rect.top + 'px';
      dialog.style.margin = '0';
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
    });

    const onMouseMove = (e) => {
      if (!isDragging) return;
      dialog.style.left = (e.clientX - dragOffsetX) + 'px';
      dialog.style.top = (e.clientY - dragOffsetY) + 'px';
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
      }
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    dialog.addEventListener('mousedown', (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });

    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        textList.setCurrent(parseInt(e.currentTarget.getAttribute('data-index')));
        renderCurrentTab();
      });
    });

    dialog.querySelector('.btn-copy').addEventListener('click', (e) => {
      navigator.clipboard.writeText(valFormatted.textContent).then(() => {
        const btn = dialog.querySelector('.btn-copy');
        const oldText = btn.textContent;
        btn.textContent = appText.buttonCopied;
        setTimeout(() => btn.textContent = oldText, 2000);
      });
    });

    dialog.querySelector('.btn-close').addEventListener('click', closeDialog);
    
    dialog.addEventListener('close', () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      shadowDomHost.remove();
    });

    renderCurrentTab();
    dialog.showModal();
    if (valOriginal.textContent === '') valOriginal.focus();
  };

  const app = { run, get language() { return appLanguage; }, set language(lang) { appLanguage = lang; } };
  window[instanceKey] = app;
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
