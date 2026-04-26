(function () {
  const MODEL_DEFINITIONS = [
    {
      id: "gpt-image-2",
      label: "gpt-image-2",
      constraints: {
        step: 16,
        minEdge: 16,
        maxEdge: 3840,
        minPixels: 655360,
        maxPixels: 8294400,
        maxAspect: 3,
      },
    },
    {
      id: "gpt-image-1-1-5",
      label: "gpt-image-1/1.5",
      defaultPresetId: "gpt-image-1-1-5-square",
      fixedSizes: [
        { presetId: "gpt-image-1-1-5-square", width: 1024, height: 1024 },
        { presetId: "gpt-image-1-1-5-portrait", width: 1024, height: 1536 },
        { presetId: "gpt-image-1-1-5-landscape", width: 1536, height: 1024 },
      ],
      constraints: {
        step: 512,
        minEdge: 1024,
        maxEdge: 1536,
        minPixels: 1024 * 1024,
        maxPixels: 1024 * 1536,
        maxAspect: 1.5,
      },
    },
    {
      id: "mai-image-2-2e",
      label: "MAI-Image-2/2e",
      constraints: {
        step: 1,
        minEdge: 768,
        maxEdge: 1365,
        minPixels: 768 * 768,
        maxPixels: 1048576,
        maxAspect: 1048576 / (768 * 768),
      },
    },
  ];

  const MODEL_MAP = new Map(MODEL_DEFINITIONS.map(function (model) { return [model.id, model]; }));
  const DEFAULT_MODEL_ID = "gpt-image-2";

  const CATEGORY_ORDER = [
    "Custom",
    "Supported sizes",
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
      id: "gpt-image-1-1-5-square",
      category: "Supported sizes",
      label: "Square",
      fixedSize: true,
      supportedModels: ["gpt-image-1-1-5"],
      width: 1024,
      height: 1024,
      summary: "1024x1024",
      target: "1024 x 1024",
      note: "Supported square size for gpt-image-1/1.5.",
    },
    {
      id: "gpt-image-1-1-5-portrait",
      category: "Supported sizes",
      label: "Portrait",
      fixedSize: true,
      supportedModels: ["gpt-image-1-1-5"],
      width: 1024,
      height: 1536,
      summary: "1024x1536",
      target: "1024 x 1536",
      note: "Supported portrait size for gpt-image-1/1.5.",
    },
    {
      id: "gpt-image-1-1-5-landscape",
      category: "Supported sizes",
      label: "Landscape",
      fixedSize: true,
      supportedModels: ["gpt-image-1-1-5"],
      width: 1536,
      height: 1024,
      summary: "1536x1024",
      target: "1536 x 1024",
      note: "Supported landscape size for gpt-image-1/1.5.",
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

  const state = {
    modelId: DEFAULT_MODEL_ID,
    presetId: FREEFORM_ID,
    orientation: "landscape",
    width: 1024,
    height: 1024,
    presetScale: null,
    previewScale: 1,
    scaleWheelActive: false,
    drag: null,
    lastPointerStartAt: 0,
  };

  const refs = {
    modelSelect: document.getElementById("modelSelect"),
    presetGroups: document.getElementById("presetGroups"),
    orientationGroup: document.getElementById("orientationGroup"),
    widthInput: document.getElementById("widthInput"),
    heightInput: document.getElementById("heightInput"),
    widthStepLabel: document.getElementById("widthStepLabel"),
    heightStepLabel: document.getElementById("heightStepLabel"),
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
    renderModelOptions();
    renderPresetGroups();
    bindEvents();
    selectPreset(FREEFORM_ID, { keepFreeformDimensions: false });
    setupResizeObserver();
    render();
  }

  function normalizePreset(definition) {
    if (definition.freeform || definition.fixedSize) {
      return Object.assign({}, definition, {
        range: null,
      });
    }

    return Object.assign({}, definition, {
      range: null,
    });
  }

  function getScaleRange(blockWidth, blockHeight, constraints) {
    const areaPerScale = constraints.step * constraints.step * blockWidth * blockHeight;
    const minScale = Math.max(
      1,
      Math.ceil(Math.sqrt(constraints.minPixels / areaPerScale)),
      Math.ceil(constraints.minEdge / (constraints.step * blockWidth)),
      Math.ceil(constraints.minEdge / (constraints.step * blockHeight))
    );
    const maxScaleByPixels = Math.floor(Math.sqrt(constraints.maxPixels / areaPerScale));
    const maxScaleByEdge = Math.floor(constraints.maxEdge / (constraints.step * Math.max(blockWidth, blockHeight)));
    const maxScale = Math.min(maxScaleByPixels, maxScaleByEdge);

    if (maxScale < minScale) {
      return null;
    }

    return {
      min: minScale,
      max: maxScale,
    };
  }

  function getPresetRange(preset) {
    if (!preset || preset.freeform || preset.fixedSize) {
      return null;
    }

    return getScaleRange(preset.ratioBlocks[0], preset.ratioBlocks[1], getConstraints());
  }

  function isPresetSupported(preset) {
    if (!preset) {
      return false;
    }

    const model = getActiveModel();
    if (model.fixedSizes) {
      return Boolean(preset.fixedSize && preset.supportedModels && preset.supportedModels.indexOf(model.id) >= 0);
    }

    if (preset.fixedSize) {
      return false;
    }

    return Boolean(preset.freeform || getPresetRange(preset));
  }

  function getActiveModel() {
    return MODEL_MAP.get(state.modelId);
  }

  function getConstraints() {
    return getActiveModel().constraints;
  }

  function getWidthValues(constraints) {
    const count = Math.floor((constraints.maxEdge - constraints.minEdge) / constraints.step) + 1;
    return Array.from({ length: count }, function (_, index) {
      return constraints.minEdge + index * constraints.step;
    });
  }

  function renderModelOptions() {
    const fragment = document.createDocumentFragment();

    MODEL_DEFINITIONS.forEach(function (model) {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.label;
      fragment.appendChild(option);
    });

    refs.modelSelect.replaceChildren(fragment);
    refs.modelSelect.value = state.modelId;
  }

  function bindEvents() {
    refs.modelSelect.addEventListener("change", function () {
      setModel(refs.modelSelect.value);
    });

    refs.presetGroups.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-preset-id]");
      if (!button) {
        return;
      }
      if (button.disabled) {
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
      const range = getPresetRange(preset);
      state.presetScale = clamp(Number(refs.ratioScale.value), range.min, range.max);
      syncPresetDimensions();
      render();
    });
    refs.ratioScale.addEventListener("pointerdown", activateScaleWheelControl);
    refs.ratioScale.addEventListener("focus", activateScaleWheelControl);
    refs.ratioScale.addEventListener("blur", deactivateScaleWheelControl);

    bindDimensionInput(refs.widthInput, "width", false);
    bindDimensionInput(refs.heightInput, "height", false);
    bindDimensionInput(refs.widthSlider, "width", true);
    bindDimensionInput(refs.heightSlider, "height", true);

    refs.resizeHandles.forEach(function (handle) {
      handle.addEventListener("pointerdown", onHandlePointerDown);
      handle.addEventListener("mousedown", onHandlePointerDown);
    });

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("wheel", onWindowWheel, { passive: false });
    document.addEventListener("pointerdown", onDocumentPointerDown, true);
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
    if (!preset || !isPresetSupported(preset)) {
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
    } else if (preset.fixedSize) {
      state.width = preset.width;
      state.height = preset.height;
      state.presetScale = null;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
    } else {
      const range = getPresetRange(preset);
      state.orientation = preset.defaultOrientation;
      state.presetScale = clamp(preset.defaultScale, range.min, range.max);
      syncPresetDimensions();
    }

    render();
  }

  function setModel(modelId) {
    if (!MODEL_MAP.has(modelId)) {
      return;
    }

    state.modelId = modelId;
    state.drag = null;

    let preset = getActivePreset();
    if (!isPresetSupported(preset)) {
      state.presetId = getDefaultPresetIdForModel();
      preset = getActivePreset();
    }

    if (preset && preset.fixedSize) {
      state.width = preset.width;
      state.height = preset.height;
      state.presetScale = null;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
    } else if (preset && preset.freeform) {
      const next = findNearestValidDimensions(state.width, state.height, null);
      state.width = next.width;
      state.height = next.height;
      state.presetScale = null;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
    } else if (preset) {
      const range = getPresetRange(preset);
      state.presetScale = clamp(state.presetScale || preset.defaultScale, range.min, range.max);
      syncPresetDimensions();
    }

    render();
  }

  function getDefaultPresetIdForModel() {
    const model = getActiveModel();
    return model.defaultPresetId || FREEFORM_ID;
  }

  function setOrientation(orientation) {
    if (orientation !== "portrait" && orientation !== "landscape") {
      return;
    }

    state.orientation = orientation;
    const preset = getActivePreset();
    if (preset && preset.fixedSize) {
      const next = findNearestFixedSize(state.height, state.width, null);
      selectPreset(next.presetId, { keepFreeformDimensions: false });
      return;
    }

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

    if (preset.fixedSize) {
      state.width = preset.width;
      state.height = preset.height;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
      return;
    }

    const dims = computePresetDimensions(preset, state.presetScale, state.orientation);
    state.width = dims.width;
    state.height = dims.height;
  }

  function adjustPresetScale(delta) {
    const preset = getActivePreset();
    if (!preset || preset.freeform || preset.fixedSize || !delta) {
      return false;
    }

    const range = getPresetRange(preset);
    const nextScale = clamp(state.presetScale + delta, range.min, range.max);
    if (nextScale === state.presetScale) {
      return false;
    }

    state.presetScale = nextScale;
    syncPresetDimensions();
    render();
    return true;
  }

  function activateScaleWheelControl() {
    state.scaleWheelActive = true;
  }

  function deactivateScaleWheelControl() {
    state.scaleWheelActive = false;
  }

  function onDocumentPointerDown(event) {
    if (event.target !== refs.ratioScale) {
      deactivateScaleWheelControl();
    }
  }

  function shouldHandleScaleWheel() {
    const preset = getActivePreset();
    if (!preset || preset.freeform || preset.fixedSize) {
      return false;
    }

    return document.activeElement === refs.ratioScale || state.scaleWheelActive;
  }

  function onWindowWheel(event) {
    if (!shouldHandleScaleWheel()) {
      return;
    }

    const delta = event.deltaY < 0 ? -1 : event.deltaY > 0 ? 1 : 0;
    if (!delta) {
      return;
    }

    event.preventDefault();
    adjustPresetScale(delta);
  }

  function computePresetDimensions(preset, scale, orientation) {
    const constraints = getConstraints();
    const blockWidth = preset.ratioBlocks[0] * constraints.step * scale;
    const blockHeight = preset.ratioBlocks[1] * constraints.step * scale;
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

    if (preset.fixedSize) {
      const next = findNearestFixedSize(axis === "width" ? rawValue : state.width, axis === "height" ? rawValue : state.height, axis);
      selectPreset(next.presetId, { keepFreeformDimensions: false });
      return;
    }

    const orientedBlocks = getOrientedBlocks(preset, state.orientation);
    const constraints = getConstraints();
    const range = getPresetRange(preset);
    const perScale = axis === "width" ? orientedBlocks.width * constraints.step : orientedBlocks.height * constraints.step;
    const nextScale = clamp(Math.round(rawValue / perScale), range.min, range.max);
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

    if (preset.fixedSize) {
      const target = getDraggedFreeformSize(state.drag.handle, state.drag.startWidth, state.drag.startHeight, deltaImageX, deltaImageY);
      const next = findNearestFixedSize(target.width, target.height, getHandlePreference(state.drag.handle));
      state.presetId = next.presetId;
      state.width = next.width;
      state.height = next.height;
      state.presetScale = null;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
      render();
      return;
    }

    const orientedBlocks = getOrientedBlocks(preset, state.drag.orientation);
    const constraints = getConstraints();
    const range = getPresetRange(preset);
    const widthStep = orientedBlocks.width * constraints.step;
    const heightStep = orientedBlocks.height * constraints.step;
    const scaleDelta = getScaleDeltaFromDrag(state.drag.handle, deltaImageX, deltaImageY, widthStep, heightStep);
    state.presetScale = clamp(state.drag.startScale + scaleDelta, range.min, range.max);
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
    const constraints = getConstraints();
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
      width: Math.max(constraints.minEdge, width),
      height: Math.max(constraints.minEdge, height),
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
      const constraints = getConstraints();
      let targetWidth = state.width;
      let targetHeight = state.height;
      let preference = null;

      if (event.key === "ArrowLeft") {
        targetWidth -= constraints.step;
        preference = "width";
      }
      if (event.key === "ArrowRight") {
        targetWidth += constraints.step;
        preference = "width";
      }
      if (event.key === "ArrowUp") {
        targetHeight += constraints.step;
        preference = "height";
      }
      if (event.key === "ArrowDown") {
        targetHeight -= constraints.step;
        preference = "height";
      }

      const next = findNearestValidDimensions(targetWidth, targetHeight, preference);
      state.width = next.width;
      state.height = next.height;
      state.orientation = state.width >= state.height ? "landscape" : "portrait";
      render();
    } else if (preset.fixedSize) {
      const next = getAdjacentFixedSize(event.key);
      if (next) {
        selectPreset(next.presetId, { keepFreeformDimensions: false });
      }
    } else {
      const direction = event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
      adjustPresetScale(direction);
    }
  }

  function render() {
    updatePresetButtons();
    updateOrientationButtons();
    updateControls();
    renderPreview();
    renderStats();
  }

  function updatePresetButtons() {
    refs.presetGroups.classList.toggle("fixed-size-model", Boolean(getActiveModel().fixedSizes));

    refs.presetGroups.querySelectorAll("[data-preset-id]").forEach(function (button) {
      const preset = PRESET_MAP.get(button.dataset.presetId);
      const supported = isPresetSupported(preset);
      button.disabled = !supported;
      button.classList.toggle("hidden", !supported);
      button.classList.toggle("active", supported && button.dataset.presetId === state.presetId);
    });

    refs.presetGroups.querySelectorAll(".preset-group").forEach(function (group) {
      const hasVisiblePreset = Array.from(group.querySelectorAll("[data-preset-id]")).some(function (button) {
        return !button.classList.contains("hidden");
      });
      group.classList.toggle("hidden", !hasVisiblePreset);
    });
  }

  function updateOrientationButtons() {
    refs.orientationGroup.querySelectorAll("[data-orientation]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.orientation === state.orientation);
    });
  }

  function updateControls() {
    const preset = getActivePreset();
    const constraints = getConstraints();
    refs.modelSelect.value = state.modelId;
    refs.widthInput.min = constraints.minEdge;
    refs.heightInput.min = constraints.minEdge;
    refs.widthSlider.min = constraints.minEdge;
    refs.heightSlider.min = constraints.minEdge;
    refs.widthInput.max = constraints.maxEdge;
    refs.heightInput.max = constraints.maxEdge;
    refs.widthSlider.max = constraints.maxEdge;
    refs.heightSlider.max = constraints.maxEdge;
    refs.widthInput.step = constraints.step;
    refs.heightInput.step = constraints.step;
    refs.widthSlider.step = constraints.step;
    refs.heightSlider.step = constraints.step;
    refs.widthStepLabel.textContent = constraints.step === 1 ? "integer" : "step " + constraints.step;
    refs.heightStepLabel.textContent = constraints.step === 1 ? "integer" : "step " + constraints.step;
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

    } else if (preset && preset.fixedSize) {
      refs.ratioControl.classList.add("hidden");
      refs.dimensionControls.classList.add("hidden");
      refs.widthInput.disabled = true;
      refs.heightInput.disabled = true;
      refs.widthSlider.disabled = true;
      refs.heightSlider.disabled = true;

    } else if (preset) {
      const range = getPresetRange(preset);
      refs.ratioControl.classList.remove("hidden");
      refs.dimensionControls.classList.add("hidden");
      refs.ratioScale.min = range.min;
      refs.ratioScale.max = range.max;
      refs.ratioScale.value = state.presetScale;
      refs.ratioScaleLabel.textContent = "Scale " + state.presetScale;
      refs.ratioScaleMin.textContent = "Min " + range.min;
      refs.ratioScaleMax.textContent = "Max " + range.max;
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
    const constraints = getConstraints();
    const preset = getActivePreset();
    const pixels = state.width * state.height;
    const aspect = getAspectString(state.width, state.height);
    const usage = ((pixels / constraints.maxPixels) * 100).toFixed(2) + "%";

    refs.heroWidth.textContent = formatNumber(state.width);
    refs.heroHeight.textContent = formatNumber(state.height);
    refs.heroPixels.textContent = formatNumber(pixels) + " pixels";

  }

  function validateDimensions(width, height) {
    const constraints = getConstraints();
    const pixels = width * height;
    const longest = Math.max(width, height);
    const shortest = Math.min(width, height);
    const aspect = longest / shortest;
    const items = [
      {
        label: constraints.step === 1 ? "Width is an integer" : "Width uses " + constraints.step + " px steps",
        valid: width % constraints.step === 0,
        detail: formatNumber(width) + " px",
      },
      {
        label: constraints.step === 1 ? "Height is an integer" : "Height uses " + constraints.step + " px steps",
        valid: height % constraints.step === 0,
        detail: formatNumber(height) + " px",
      },
      {
        label: "Width and height meet the minimum edge",
        valid: width >= constraints.minEdge && height >= constraints.minEdge,
        detail: formatNumber(constraints.minEdge) + " px minimum",
      },
      {
        label: "Longest edge stays within the model range",
        valid: longest <= constraints.maxEdge,
        detail: formatNumber(longest) + " px",
      },
      {
        label: "Aspect stays within the model range",
        valid: aspect <= constraints.maxAspect,
        detail: aspect.toFixed(2) + ":1",
      },
      {
        label: "Pixels stay inside the legal range",
        valid: pixels >= constraints.minPixels && pixels <= constraints.maxPixels,
        detail: formatNumber(pixels) + " px",
      },
    ];

    return {
      valid: items.every(function (item) { return item.valid; }),
      items: items,
    };
  }

  function findNearestValidDimensions(targetWidth, targetHeight, preference) {
    if (getActiveModel().fixedSizes) {
      return findNearestFixedSize(targetWidth, targetHeight, preference);
    }

    const constraints = getConstraints();
    const desiredWidth = clamp(roundToStep(targetWidth), constraints.minEdge, constraints.maxEdge);
    const desiredHeight = clamp(roundToStep(targetHeight), constraints.minEdge, constraints.maxEdge);
    let best = null;

    getWidthValues(constraints).forEach(function (candidateWidth) {
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

    return best || {
      width: clamp(roundToStep(1024), constraints.minEdge, constraints.maxEdge),
      height: clamp(roundToStep(1024), constraints.minEdge, constraints.maxEdge),
    };
  }

  function findNearestFixedSize(targetWidth, targetHeight, preference) {
    const model = getActiveModel();
    const sizes = model.fixedSizes || [];
    let best = null;

    sizes.forEach(function (size) {
      const score = scoreCandidate(size.width, size.height, targetWidth, targetHeight, preference);
      if (!best || score < best.score) {
        best = Object.assign({ score: score }, size);
      }
    });

    return best || { presetId: getDefaultPresetIdForModel(), width: 1024, height: 1024 };
  }

  function getAdjacentFixedSize(key) {
    const model = getActiveModel();
    const sizes = model.fixedSizes || [];
    const currentIndex = sizes.findIndex(function (size) {
      return size.presetId === state.presetId;
    });

    if (currentIndex < 0) {
      return null;
    }

    const direction = key === "ArrowLeft" || key === "ArrowDown" ? -1 : 1;
    return sizes[clamp(currentIndex + direction, 0, sizes.length - 1)];
  }

  function getValidHeightRangeForWidth(width) {
    const constraints = getConstraints();
    const minHeight = Math.max(
      constraints.minEdge,
      ceilToStep(width / constraints.maxAspect),
      ceilToStep(constraints.minPixels / width)
    );
    const maxHeight = Math.min(
      constraints.maxEdge,
      floorToStep(width * constraints.maxAspect),
      floorToStep(constraints.maxPixels / width)
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
    const constraints = getConstraints();
    return Math.max(constraints.minEdge, Math.round(value / constraints.step) * constraints.step);
  }

  function ceilToStep(value) {
    const constraints = getConstraints();
    return Math.ceil(value / constraints.step) * constraints.step;
  }

  function floorToStep(value) {
    const constraints = getConstraints();
    return Math.floor(value / constraints.step) * constraints.step;
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