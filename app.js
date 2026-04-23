(function () {
  const CONSTRAINTS = {
    step: 16,
    maxEdge: 3840,
    minPixels: 655360,
    maxPixels: 8294400,
    maxAspect: 3,
  };

  const CATEGORY_ORDER = [
    "Custom",
    "Standard ratios",
    "Paper and print",
    "Displays",
    "Mobile",
    "Social",
    "Extreme",
  ];

  const PRESET_DEFINITIONS = [
    {
      id: "freeform",
      category: "Custom",
      label: "Freeform",
      freeform: true,
      defaultWidth: 912,
      defaultHeight: 720,
      summary: "Custom",
      target: "Custom dimensions",
      note: "Unlocked width and height. Every edit snaps to the nearest valid size.",
    },
    {
      id: "square",
      category: "Standard ratios",
      label: "Square",
      ratioBlocks: [1, 1],
      defaultScale: 128,
      defaultOrientation: "landscape",
      summary: "1:1",
      target: "Square",
      note: "Classic square canvas.",
    },
    {
      id: "ratio-4-3",
      category: "Standard ratios",
      label: "4:3",
      ratioBlocks: [4, 3],
      defaultScale: 32,
      defaultOrientation: "landscape",
      summary: "4:3",
      target: "4:3",
      note: "Balanced frame for tablets and photos.",
    },
    {
      id: "ratio-16-9",
      category: "Standard ratios",
      label: "16:9",
      ratioBlocks: [16, 9],
      defaultScale: 8,
      defaultOrientation: "landscape",
      summary: "16:9",
      target: "16:9",
      note: "Standard widescreen proportion.",
    },
    {
      id: "a4",
      category: "Paper and print",
      label: "A4",
      ratioBlocks: [5, 7],
      defaultScale: 20,
      defaultOrientation: "portrait",
      summary: "~1:1.40",
      target: "A4 paper",
      note: "Uses a finer 5:7 A-series approximation so you can scale in smaller steps and reach up to 2400 x 3360.",
    },
    {
      id: "us-letter",
      category: "Paper and print",
      label: "US Letter",
      ratioBlocks: [13, 17],
      defaultScale: 8,
      defaultOrientation: "portrait",
      summary: "~1:1.31",
      target: "8.5 x 11 in",
      note: "Uses a finer 13:17 approximation so you get smaller scale steps and can reach up to 2496 x 3264.",
    },
    {
      id: "poster-2-3",
      category: "Paper and print",
      label: "Poster (2:3)",
      ratioBlocks: [2, 3],
      defaultScale: 56,
      defaultOrientation: "portrait",
      summary: "2:3",
      target: "Example: 24 x 36 in",
      note: "Poster ratio with a wide valid range.",
    },
    {
      id: "iphone-photo",
      category: "Mobile",
      label: "iPhone photo",
      ratioBlocks: [4, 3],
      defaultScale: 32,
      defaultOrientation: "landscape",
      summary: "4:3",
      target: "Reference: 4032 x 3024",
      note: "Uses the same camera-like 4:3 proportion.",
    },
    {
      id: "iphone-wallpaper",
      category: "Mobile",
      label: "iPhone wallpaper",
      ratioBlocks: [40, 87],
      defaultScale: 2,
      defaultOrientation: "portrait",
      summary: "~0.46:1",
      target: "Nearest valid: 1280 x 2784",
      note: "Very narrow valid range because the source ratio is unusually tall.",
    },
    {
      id: "full-hd",
      category: "Displays",
      label: "Full HD",
      ratioBlocks: [30, 17],
      defaultScale: 4,
      defaultOrientation: "landscape",
      summary: "Near 16:9",
      target: "Target 1920 x 1080, nearest valid 1920 x 1088",
      note: "1080 px is not divisible by 16, so the app uses the nearest valid height.",
    },
    {
      id: "qhd",
      category: "Displays",
      label: "QHD",
      ratioBlocks: [16, 9],
      defaultScale: 10,
      defaultOrientation: "landscape",
      summary: "2560 x 1440",
      target: "2560 x 1440",
      note: "Exact valid QHD dimensions.",
    },
    {
      id: "uhd-4k",
      category: "Displays",
      label: "4K UHD",
      ratioBlocks: [16, 9],
      defaultScale: 15,
      defaultOrientation: "landscape",
      summary: "3840 x 2160",
      target: "3840 x 2160",
      note: "This hits the model's maximum allowed pixel count exactly.",
    },
    {
      id: "ultrawide",
      category: "Displays",
      label: "Ultrawide",
      ratioBlocks: [43, 18],
      defaultScale: 5,
      defaultOrientation: "landscape",
      summary: "43:18",
      target: "3440 x 1440",
      note: "Exact valid ultrawide dimensions.",
    },
    {
      id: "instagram-square",
      category: "Social",
      label: "Instagram (Square)",
      ratioBlocks: [1, 1],
      defaultScale: 80,
      defaultOrientation: "landscape",
      summary: "1:1",
      target: "Target 1080 x 1080, nearest valid 1088 x 1088",
      note: "Keeps the square shape while snapping to the 16 px grid.",
    },
    {
      id: "instagram-portrait",
      category: "Social",
      label: "Instagram (Portrait)",
      ratioBlocks: [4, 5],
      defaultScale: 20,
      defaultOrientation: "portrait",
      summary: "4:5",
      target: "Target 1080 x 1350, nearest valid 1088 x 1360",
      note: "Portrait social format with a true ratio lock.",
    },
    {
      id: "story-reel-tiktok",
      category: "Social",
      label: "Instagram (Story)",
      ratioBlocks: [9, 16],
      defaultScale: 8,
      defaultOrientation: "portrait",
      summary: "9:16",
      target: "Target 1080 x 1920, nearest valid 1152 x 2048",
      note: "Vertical short-form video framing.",
    },
    {
      id: "facebook-post",
      category: "Social",
      label: "Facebook Post",
      ratioBlocks: [61, 32],
      defaultScale: 2,
      defaultOrientation: "landscape",
      summary: "~1.91:1",
      target: "Target 1200 x 630, nearest valid family starts at 976 x 512",
      note: "Approximate 1.91:1 ratio that stays fully valid.",
    },
    {
      id: "youtube-thumbnail",
      category: "Social",
      label: "YouTube Thumbnail",
      ratioBlocks: [16, 9],
      defaultScale: 5,
      defaultOrientation: "landscape",
      summary: "16:9",
      target: "1280 x 720",
      note: "Exact valid 16:9 thumbnail size.",
    },
    {
      id: "linkedin-post",
      category: "Social",
      label: "LinkedIn Post",
      ratioBlocks: [61, 32],
      defaultScale: 2,
      defaultOrientation: "landscape",
      summary: "~1.91:1",
      target: "Target 1200 x 627, nearest valid family starts at 976 x 512",
      note: "Uses the same valid near-1.91:1 approximation as Facebook posts.",
    },
    {
      id: "tall",
      category: "Extreme",
      label: "Tall",
      ratioBlocks: [1, 3],
      defaultScale: 64,
      defaultOrientation: "portrait",
      summary: "1:3",
      target: "Example 1280 x 3840",
      note: "Maximum legal aspect ratio in portrait.",
    },
    {
      id: "wide",
      category: "Extreme",
      label: "Wide",
      ratioBlocks: [3, 1],
      defaultScale: 64,
      defaultOrientation: "landscape",
      summary: "3:1",
      target: "Example 3840 x 1280",
      note: "Maximum legal aspect ratio in landscape.",
    },
  ];

  const PRESETS = PRESET_DEFINITIONS.map(normalizePreset);
  const PRESET_MAP = new Map(PRESETS.map((preset) => [preset.id, preset]));
  const FREEFORM_ID = "freeform";
  const WIDTH_VALUES = Array.from({ length: CONSTRAINTS.maxEdge / CONSTRAINTS.step }, function (_, index) {
    return (index + 1) * CONSTRAINTS.step;
  });

  const state = {
    presetId: FREEFORM_ID,
    orientation: "landscape",
    width: 1024,
    height: 1024,
    presetScale: null,
    previewScale: 1,
    drag: null,
    lastPointerStartAt: 0,
  };

  const refs = {
    presetGroups: document.getElementById("presetGroups"),
    orientationGroup: document.getElementById("orientationGroup"),
    widthInput: document.getElementById("widthInput"),
    heightInput: document.getElementById("heightInput"),
    widthSlider: document.getElementById("widthSlider"),
    heightSlider: document.getElementById("heightSlider"),
    dimensionControls: document.getElementById("dimensionControls"),
    ratioControl: document.getElementById("ratioControl"),
    ratioScale: document.getElementById("ratioScale"),
    ratioScaleLabel: document.getElementById("ratioScaleLabel"),
    ratioScaleMin: document.getElementById("ratioScaleMin"),
    ratioScaleMax: document.getElementById("ratioScaleMax"),
    heroWidth: document.getElementById("heroWidth"),
    heroHeight: document.getElementById("heroHeight"),
    heroPixels: document.getElementById("heroPixels"),

    scaleBadge: document.getElementById("scaleBadge"),
    validityBadge: document.getElementById("validityBadge"),
    previewStage: document.getElementById("previewStage"),
    previewShape: document.getElementById("previewShape"),
    resizeHandles: Array.from(document.querySelectorAll(".resize-handle")),
    widthLabel: document.getElementById("widthLabel"),
    heightLabel: document.getElementById("heightLabel"),
  };

  let stageObserver = null;

  initialize();

  function initialize() {
    renderPresetGroups();
    bindEvents();
    selectPreset(FREEFORM_ID, { keepFreeformDimensions: false });
    setupResizeObserver();
    render();
  }

  function normalizePreset(definition) {
    if (definition.freeform) {
      return Object.assign({}, definition, {
        range: null,
      });
    }

    const range = getScaleRange(definition.ratioBlocks[0], definition.ratioBlocks[1]);
    const defaultScale = clamp(definition.defaultScale, range.min, range.max);

    return Object.assign({}, definition, {
      range: range,
      defaultScale: defaultScale,
    });
  }

  function getScaleRange(blockWidth, blockHeight) {
    const areaPerScale = CONSTRAINTS.step * CONSTRAINTS.step * blockWidth * blockHeight;
    const minScale = Math.max(1, Math.ceil(Math.sqrt(CONSTRAINTS.minPixels / areaPerScale)));
    const maxScaleByPixels = Math.floor(Math.sqrt(CONSTRAINTS.maxPixels / areaPerScale));
    const maxScaleByEdge = Math.floor(CONSTRAINTS.maxEdge / (CONSTRAINTS.step * Math.max(blockWidth, blockHeight)));
    return {
      min: minScale,
      max: Math.max(minScale, Math.min(maxScaleByPixels, maxScaleByEdge)),
    };
  }

  function bindEvents() {
    refs.presetGroups.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-preset-id]");
      if (!button) {
        return;
      }
      selectPreset(button.dataset.presetId, { keepFreeformDimensions: true });
    });

    refs.orientationGroup.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-orientation]");
      if (!button) {
        return;
      }
      setOrientation(button.dataset.orientation);
    });

    refs.ratioScale.addEventListener("input", function () {
      const preset = getActivePreset();
      if (!preset || preset.freeform) {
        return;
      }
      state.presetScale = clamp(Number(refs.ratioScale.value), preset.range.min, preset.range.max);
      syncPresetDimensions();
      render();
    });

    bindDimensionInput(refs.widthInput, "width", false);
    bindDimensionInput(refs.heightInput, "height", false);
    bindDimensionInput(refs.widthSlider, "width", true);
    bindDimensionInput(refs.heightSlider, "height", true);

    refs.resizeHandles.forEach(function (handle) {
      handle.addEventListener("pointerdown", onHandlePointerDown);
      handle.addEventListener("mousedown", onHandlePointerDown);
    });

    window.addEventListener("keydown", onKeydown);
  }

  function bindDimensionInput(element, axis, immediate) {
    const eventName = immediate ? "input" : "change";
    element.addEventListener(eventName, function () {
      updateAxisFromControl(axis, Number(element.value));
    });
  }

  function setupResizeObserver() {
    stageObserver = new ResizeObserver(function () {
      renderPreview();
    });
    stageObserver.observe(refs.previewStage);
  }

  function renderPresetGroups() {
    const fragment = document.createDocumentFragment();

    CATEGORY_ORDER.forEach(function (category) {
      const presets = PRESETS.filter(function (preset) {
        return preset.category === category;
      });

      if (!presets.length) {
        return;
      }

      const group = document.createElement("section");
      group.className = "preset-group";

      const title = document.createElement("div");
      title.className = "preset-group-title";
      title.textContent = category;
      group.appendChild(title);

      const buttonGrid = document.createElement("div");
      buttonGrid.className = "preset-buttons";

      presets.forEach(function (preset) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "preset-button";
        button.dataset.presetId = preset.id;
        button.innerHTML = "<span class=\"preset-label\"></span><span class=\"preset-meta\"></span>";
        button.querySelector(".preset-label").textContent = preset.label;
        button.querySelector(".preset-meta").textContent = preset.summary || preset.target;
        buttonGrid.appendChild(button);
      });

      group.appendChild(buttonGrid);
      fragment.appendChild(group);
    });

    refs.presetGroups.replaceChildren(fragment);
  }

  function getActivePreset() {
    return PRESET_MAP.get(state.presetId);
  }

  function selectPreset(presetId, options) {
    const preset = PRESET_MAP.get(presetId);
    if (!preset) {
      return;
    }

    const keepFreeformDimensions = options && options.keepFreeformDimensions;
    const previousPreset = getActivePreset();
    state.presetId = preset.id;
    state.drag = null;

    if (preset.freeform) {
      if (!keepFreeformDimensions || !previousPreset || previousPreset.freeform) {
        const freeform = findNearestValidDimensions(preset.defaultWidth, preset.defaultHeight, null);
        state.width = freeform.width;
        state.height = freeform.height;
      } else {
        const retained = findNearestValidDimensions(state.width, state.height, null);
        state.width = retained.width;
        state.height = retained.height;
      }
      state.presetScale = null;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
    } else {
      state.orientation = preset.defaultOrientation;
      state.presetScale = preset.defaultScale;
      syncPresetDimensions();
    }

    render();
  }

  function setOrientation(orientation) {
    if (orientation !== "portrait" && orientation !== "landscape") {
      return;
    }

    state.orientation = orientation;
    const preset = getActivePreset();
    if (preset && preset.freeform) {
      const swapped = findNearestValidDimensions(state.height, state.width, null);
      state.width = swapped.width;
      state.height = swapped.height;
      if (orientation === "portrait" && state.width > state.height) {
        const portrait = findNearestValidDimensions(Math.min(state.width, state.height), Math.max(state.width, state.height), null);
        state.width = portrait.width;
        state.height = portrait.height;
      }
      if (orientation === "landscape" && state.height > state.width) {
        const landscape = findNearestValidDimensions(Math.max(state.width, state.height), Math.min(state.width, state.height), null);
        state.width = landscape.width;
        state.height = landscape.height;
      }
    } else {
      syncPresetDimensions();
    }
    render();
  }

  function syncPresetDimensions() {
    const preset = getActivePreset();
    if (!preset || preset.freeform) {
      return;
    }

    const dims = computePresetDimensions(preset, state.presetScale, state.orientation);
    state.width = dims.width;
    state.height = dims.height;
  }

  function computePresetDimensions(preset, scale, orientation) {
    const blockWidth = preset.ratioBlocks[0] * CONSTRAINTS.step * scale;
    const blockHeight = preset.ratioBlocks[1] * CONSTRAINTS.step * scale;
    let width = blockWidth;
    let height = blockHeight;

    if (orientation === "portrait" && width > height) {
      width = blockHeight;
      height = blockWidth;
    }

    if (orientation === "landscape" && width < height) {
      width = blockHeight;
      height = blockWidth;
    }

    return { width: width, height: height };
  }

  function updateAxisFromControl(axis, rawValue) {
    if (!Number.isFinite(rawValue)) {
      return;
    }

    const preset = getActivePreset();
    if (!preset) {
      return;
    }

    if (preset.freeform) {
      const targetWidth = axis === "width" ? rawValue : state.width;
      const targetHeight = axis === "height" ? rawValue : state.height;
      const next = findNearestValidDimensions(targetWidth, targetHeight, axis);
      state.width = next.width;
      state.height = next.height;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
      render();
      return;
    }

    const orientedBlocks = getOrientedBlocks(preset, state.orientation);
    const perScale = axis === "width" ? orientedBlocks.width * CONSTRAINTS.step : orientedBlocks.height * CONSTRAINTS.step;
    const nextScale = clamp(Math.round(rawValue / perScale), preset.range.min, preset.range.max);
    state.presetScale = nextScale;
    syncPresetDimensions();
    render();
  }

  function getOrientedBlocks(preset, orientation) {
    let width = preset.ratioBlocks[0];
    let height = preset.ratioBlocks[1];

    if (orientation === "portrait" && width > height) {
      width = preset.ratioBlocks[1];
      height = preset.ratioBlocks[0];
    }

    if (orientation === "landscape" && width < height) {
      width = preset.ratioBlocks[1];
      height = preset.ratioBlocks[0];
    }

    return { width: width, height: height };
  }

  function onHandlePointerDown(event) {
    const handle = event.target.closest("[data-handle]");
    if (!handle) {
      return;
    }

    const inputMode = event.type === "mousedown" ? "mouse" : "pointer";
    if (inputMode === "mouse" && Date.now() - state.lastPointerStartAt < 250) {
      return;
    }
    if (inputMode === "pointer") {
      state.lastPointerStartAt = Date.now();
    }

    event.preventDefault();

    state.drag = {
      handle: handle.dataset.handle,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: state.width,
      startHeight: state.height,
      startScale: state.presetScale,
      previewScale: state.previewScale,
      presetId: state.presetId,
      orientation: state.orientation,
      inputMode: inputMode,
    };

    refs.previewShape.classList.add("dragging");

    if (inputMode === "pointer") {
      window.addEventListener("pointermove", onHandlePointerMove);
      window.addEventListener("pointerup", onHandlePointerUp, { once: true });
    } else {
      window.addEventListener("mousemove", onHandlePointerMove);
      window.addEventListener("mouseup", onHandlePointerUp, { once: true });
    }
  }

  function onHandlePointerMove(event) {
    if (!state.drag) {
      return;
    }

    if (state.drag.inputMode === "pointer" && event.type !== "pointermove") {
      return;
    }
    if (state.drag.inputMode === "mouse" && event.type !== "mousemove") {
      return;
    }

    const deltaImageX = (event.clientX - state.drag.startX) * state.drag.previewScale * 2;
    const deltaImageY = (event.clientY - state.drag.startY) * state.drag.previewScale * 2;
    const preset = PRESET_MAP.get(state.drag.presetId);

    if (!preset) {
      return;
    }

    if (preset.freeform) {
      const target = getDraggedFreeformSize(state.drag.handle, state.drag.startWidth, state.drag.startHeight, deltaImageX, deltaImageY);
      const next = findNearestValidDimensions(target.width, target.height, getHandlePreference(state.drag.handle));
      state.width = next.width;
      state.height = next.height;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
      render();
      return;
    }

    const orientedBlocks = getOrientedBlocks(preset, state.drag.orientation);
    const widthStep = orientedBlocks.width * CONSTRAINTS.step;
    const heightStep = orientedBlocks.height * CONSTRAINTS.step;
    const scaleDelta = getScaleDeltaFromDrag(state.drag.handle, deltaImageX, deltaImageY, widthStep, heightStep);
    state.presetScale = clamp(state.drag.startScale + scaleDelta, preset.range.min, preset.range.max);
    syncPresetDimensions();
    render();
  }

  function onHandlePointerUp() {
    if (!state.drag) {
      return;
    }

    state.drag = null;
    refs.previewShape.classList.remove("dragging");
    window.removeEventListener("pointermove", onHandlePointerMove);
    window.removeEventListener("mousemove", onHandlePointerMove);
    window.removeEventListener("pointerup", onHandlePointerUp);
    window.removeEventListener("mouseup", onHandlePointerUp);
  }

  function getDraggedFreeformSize(handle, startWidth, startHeight, deltaImageX, deltaImageY) {
    let width = startWidth;
    let height = startHeight;

    if (handle.indexOf("e") >= 0) {
      width += deltaImageX;
    }
    if (handle.indexOf("w") >= 0) {
      width -= deltaImageX;
    }
    if (handle.indexOf("s") >= 0) {
      height += deltaImageY;
    }
    if (handle.indexOf("n") >= 0) {
      height -= deltaImageY;
    }

    return {
      width: Math.max(CONSTRAINTS.step, width),
      height: Math.max(CONSTRAINTS.step, height),
    };
  }

  function getHandlePreference(handle) {
    const hasHorizontal = handle.indexOf("e") >= 0 || handle.indexOf("w") >= 0;
    const hasVertical = handle.indexOf("n") >= 0 || handle.indexOf("s") >= 0;

    if (hasHorizontal && !hasVertical) {
      return "width";
    }
    if (hasVertical && !hasHorizontal) {
      return "height";
    }
    return null;
  }

  function getScaleDeltaFromDrag(handle, deltaImageX, deltaImageY, widthStep, heightStep) {
    const horizontalDelta = handle.indexOf("e") >= 0 ? deltaImageX : handle.indexOf("w") >= 0 ? -deltaImageX : null;
    const verticalDelta = handle.indexOf("s") >= 0 ? deltaImageY : handle.indexOf("n") >= 0 ? -deltaImageY : null;

    if (horizontalDelta !== null && verticalDelta === null) {
      return Math.round(horizontalDelta / widthStep);
    }

    if (verticalDelta !== null && horizontalDelta === null) {
      return Math.round(verticalDelta / heightStep);
    }

    const deltaXScale = horizontalDelta / widthStep;
    const deltaYScale = verticalDelta / heightStep;
    return Math.round(Math.abs(deltaXScale) >= Math.abs(deltaYScale) ? deltaXScale : deltaYScale);
  }

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    const preset = getActivePreset();
    if (!preset) {
      return;
    }

    if (event.key === "Escape") {
      selectPreset(state.presetId, { keepFreeformDimensions: false });
      return;
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) < 0) {
      return;
    }

    event.preventDefault();

    if (preset.freeform) {
      let targetWidth = state.width;
      let targetHeight = state.height;
      let preference = null;

      if (event.key === "ArrowLeft") {
        targetWidth -= CONSTRAINTS.step;
        preference = "width";
      }
      if (event.key === "ArrowRight") {
        targetWidth += CONSTRAINTS.step;
        preference = "width";
      }
      if (event.key === "ArrowUp") {
        targetHeight += CONSTRAINTS.step;
        preference = "height";
      }
      if (event.key === "ArrowDown") {
        targetHeight -= CONSTRAINTS.step;
        preference = "height";
      }

      const next = findNearestValidDimensions(targetWidth, targetHeight, preference);
      state.width = next.width;
      state.height = next.height;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
    } else {
      const direction = event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
      state.presetScale = clamp(state.presetScale + direction, preset.range.min, preset.range.max);
      syncPresetDimensions();
    }

    render();
  }

  function render() {
    updatePresetButtons();
    updateOrientationButtons();
    updateControls();
    renderPreview();
    renderStats();
  }

  function updatePresetButtons() {
    refs.presetGroups.querySelectorAll("[data-preset-id]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.presetId === state.presetId);
    });
  }

  function updateOrientationButtons() {
    refs.orientationGroup.querySelectorAll("[data-orientation]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.orientation === state.orientation);
    });
  }

  function updateControls() {
    const preset = getActivePreset();
    refs.widthInput.value = state.width;
    refs.heightInput.value = state.height;
    refs.widthSlider.value = state.width;
    refs.heightSlider.value = state.height;

    if (preset && preset.freeform) {
      refs.ratioControl.classList.add("hidden");
      refs.dimensionControls.classList.remove("hidden");
      refs.widthInput.disabled = false;
      refs.heightInput.disabled = false;
      refs.widthSlider.disabled = false;
      refs.heightSlider.disabled = false;

    } else if (preset) {
      refs.ratioControl.classList.remove("hidden");
      refs.dimensionControls.classList.add("hidden");
      refs.ratioScale.min = preset.range.min;
      refs.ratioScale.max = preset.range.max;
      refs.ratioScale.value = state.presetScale;
      refs.ratioScaleLabel.textContent = "Scale " + state.presetScale;
      refs.ratioScaleMin.textContent = "Min " + preset.range.min;
      refs.ratioScaleMax.textContent = "Max " + preset.range.max;
      refs.widthInput.disabled = true;
      refs.heightInput.disabled = true;
      refs.widthSlider.disabled = true;
      refs.heightSlider.disabled = true;

    }
  }

  function renderPreview() {
    const availableWidth = Math.max(120, refs.previewStage.clientWidth - 40);
    const availableHeight = Math.max(120, refs.previewStage.clientHeight - 40);
    const scaleByWidth = state.width / availableWidth;
    const scaleByHeight = state.height / availableHeight;
    const previewScale = Math.max(1, Math.ceil(Math.max(scaleByWidth, scaleByHeight)));
    const displayWidth = state.width / previewScale;
    const displayHeight = state.height / previewScale;
    const scaled = previewScale > 1;

    state.previewScale = previewScale;

    refs.previewShape.style.width = displayWidth + "px";
    refs.previewShape.style.height = displayHeight + "px";
    applyPreviewPosition();
    refs.previewShape.classList.toggle("is-scaled", scaled);
    refs.previewShape.classList.toggle("is-square", state.width === state.height);

    refs.widthLabel.textContent = formatNumber(state.width) + " px";
    refs.heightLabel.textContent = formatNumber(state.height) + " px";

    // Compensate for the rotated label's visual offset
    var vw = refs.heightLabel.offsetWidth;
    var vh = refs.heightLabel.offsetHeight;
    refs.heightLabel.style.left = (20 - (vw - vh) / 2) + "px";

    refs.scaleBadge.textContent = previewScale + ":1 SCALE";
    refs.scaleBadge.classList.toggle("hidden", !scaled);

  }

  function applyPreviewPosition() {
    refs.previewShape.style.left = "50%";
    refs.previewShape.style.top = "50%";
    refs.previewShape.style.transform = "translate(-50%, -50%)";
  }

  function renderStats() {
    const preset = getActivePreset();
    const pixels = state.width * state.height;
    const aspect = getAspectString(state.width, state.height);
    const usage = ((pixels / CONSTRAINTS.maxPixels) * 100).toFixed(2) + "%";

    refs.heroWidth.textContent = formatNumber(state.width);
    refs.heroHeight.textContent = formatNumber(state.height);
    refs.heroPixels.textContent = formatNumber(pixels) + " pixels";

  }

  function validateDimensions(width, height) {
    const pixels = width * height;
    const longest = Math.max(width, height);
    const shortest = Math.min(width, height);
    const aspect = longest / shortest;
    const items = [
      {
        label: "Width uses 16 px steps",
        valid: width % CONSTRAINTS.step === 0,
        detail: formatNumber(width) + " px",
      },
      {
        label: "Height uses 16 px steps",
        valid: height % CONSTRAINTS.step === 0,
        detail: formatNumber(height) + " px",
      },
      {
        label: "Longest edge stays within 3840 px",
        valid: longest <= CONSTRAINTS.maxEdge,
        detail: formatNumber(longest) + " px",
      },
      {
        label: "Aspect stays within 3:1",
        valid: aspect <= CONSTRAINTS.maxAspect,
        detail: aspect.toFixed(2) + ":1",
      },
      {
        label: "Pixels stay inside the legal range",
        valid: pixels >= CONSTRAINTS.minPixels && pixels <= CONSTRAINTS.maxPixels,
        detail: formatNumber(pixels) + " px",
      },
    ];

    return {
      valid: items.every(function (item) { return item.valid; }),
      items: items,
    };
  }

  function findNearestValidDimensions(targetWidth, targetHeight, preference) {
    const desiredWidth = clamp(roundToStep(targetWidth), CONSTRAINTS.step, CONSTRAINTS.maxEdge);
    const desiredHeight = clamp(roundToStep(targetHeight), CONSTRAINTS.step, CONSTRAINTS.maxEdge);
    let best = null;

    WIDTH_VALUES.forEach(function (candidateWidth) {
      const range = getValidHeightRangeForWidth(candidateWidth);
      if (!range) {
        return;
      }

      const candidateHeight = clamp(roundToStep(desiredHeight), range.min, range.max);
      const score = scoreCandidate(candidateWidth, candidateHeight, desiredWidth, desiredHeight, preference);

      if (!best || score < best.score) {
        best = {
          width: candidateWidth,
          height: candidateHeight,
          score: score,
        };
      }
    });

    return best || { width: 1024, height: 1024 };
  }

  function getValidHeightRangeForWidth(width) {
    const minHeight = Math.max(
      CONSTRAINTS.step,
      ceilToStep(width / CONSTRAINTS.maxAspect),
      ceilToStep(CONSTRAINTS.minPixels / width)
    );
    const maxHeight = Math.min(
      CONSTRAINTS.maxEdge,
      floorToStep(width * CONSTRAINTS.maxAspect),
      floorToStep(CONSTRAINTS.maxPixels / width)
    );

    if (minHeight > maxHeight) {
      return null;
    }

    return {
      min: minHeight,
      max: maxHeight,
    };
  }

  function scoreCandidate(candidateWidth, candidateHeight, targetWidth, targetHeight, preference) {
    const widthWeight = preference === "width" ? 4 : 1;
    const heightWeight = preference === "height" ? 4 : 1;
    const widthDelta = Math.abs(candidateWidth - targetWidth);
    const heightDelta = Math.abs(candidateHeight - targetHeight);
    const areaDelta = Math.abs(candidateWidth * candidateHeight - targetWidth * targetHeight) / 10000;
    return widthDelta * widthWeight + heightDelta * heightWeight + areaDelta;
  }

  function getAspectString(width, height) {
    const ratio = width >= height ? width / height : height / width;
    const prefix = width >= height ? "1:" : "1:";
    if (width >= height) {
      return ratio.toFixed(2) + ":1";
    }
    return "1:" + (height / width).toFixed(2);
  }

  function roundToStep(value) {
    return Math.max(CONSTRAINTS.step, Math.round(value / CONSTRAINTS.step) * CONSTRAINTS.step);
  }

  function ceilToStep(value) {
    return Math.ceil(value / CONSTRAINTS.step) * CONSTRAINTS.step;
  }

  function floorToStep(value) {
    return Math.floor(value / CONSTRAINTS.step) * CONSTRAINTS.step;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  }

  document.getElementById("sidebarCollapse").addEventListener("click", function () {
    document.body.classList.add("sidebar-collapsed");
  });

  document.getElementById("sidebarExpand").addEventListener("click", function () {
    document.body.classList.remove("sidebar-collapsed");
  });

  document.getElementById("copyDimensions").addEventListener("click", function () {
    var text = state.width + "x" + state.height;
    navigator.clipboard.writeText(text).then(function () {
      var btn = document.getElementById("copyDimensions");
      btn.classList.add("copied");
      setTimeout(function () { btn.classList.remove("copied"); }, 1200);
    });
  });
})();