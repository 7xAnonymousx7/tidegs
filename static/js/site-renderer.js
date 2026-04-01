(function () {
  var config = window.SITE_CONFIG;

  if (!config) {
    console.error("SITE_CONFIG is missing.");
    return;
  }

  var siteTokens = {
    projectName: config.site && config.site.projectName ? config.site.projectName : ""
  };

  function formatTemplate(value, extraTokens) {
    if (value == null) {
      return "";
    }

    var tokens = Object.assign({}, siteTokens, extraTokens || {});
    return String(value).replace(/\{([^}]+)\}/g, function (_, key) {
      return tokens[key] == null ? "" : tokens[key];
    });
  }

  function query(target) {
    return typeof target === "string" ? document.querySelector(target) : target;
  }

  function setText(target, value) {
    var element = query(target);
    if (element) {
      element.textContent = value == null ? "" : value;
    }
  }

  function setHtml(target, value) {
    var element = query(target);
    if (element) {
      element.innerHTML = value == null ? "" : value;
    }
  }

  function setAttribute(target, attribute, value) {
    var element = query(target);
    if (element && value) {
      element.setAttribute(attribute, value);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hexToRgb(color) {
    if (!color || color.charAt(0) !== "#") {
      return "";
    }

    var hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map(function (char) {
          return char + char;
        })
        .join("");
    }

    if (hex.length !== 6) {
      return "";
    }

    var red = parseInt(hex.slice(0, 2), 16);
    var green = parseInt(hex.slice(2, 4), 16);
    var blue = parseInt(hex.slice(4, 6), 16);
    return red + ", " + green + ", " + blue;
  }

  function applyTheme(theme) {
    if (!theme) {
      return;
    }

    var root = document.documentElement;
    var variables = {
      "--theme-primary": theme.primary,
      "--theme-primary-rgb": theme.primaryRgb || hexToRgb(theme.primary),
      "--theme-dark-text": theme.darkText,
      "--theme-body-text": theme.bodyText,
      "--theme-secondary-text": theme.secondaryText,
      "--theme-muted-text": theme.mutedText,
      "--theme-author-link": theme.authorLink,
      "--theme-scene-circle-bg": theme.sceneCircleBackground,
      "--theme-scene-circle-hover": theme.sceneCircleHover,
      "--theme-lidar-accent": theme.lidarAccent,
      "--theme-lidar-accent-rgb": theme.lidarAccentRgb || hexToRgb(theme.lidarAccent)
    };

    Object.keys(variables).forEach(function (key) {
      if (variables[key]) {
        root.style.setProperty(key, variables[key]);
      }
    });
  }

  function setMeta(selector, value) {
    var element = document.querySelector(selector);
    if (element && value != null) {
      element.setAttribute("content", value);
    }
  }

  function applyMeta(meta, assets) {
    var resolvedMeta = meta || {};

    if (resolvedMeta.browserTitle) {
      document.title = formatTemplate(resolvedMeta.browserTitle);
    }

    setMeta('meta[name="description"]', formatTemplate(resolvedMeta.description));
    setMeta('meta[name="keywords"]', formatTemplate(resolvedMeta.keywords));
    setMeta('meta[property="og:title"]', formatTemplate(resolvedMeta.ogTitle || resolvedMeta.browserTitle));
    setMeta('meta[property="og:description"]', formatTemplate(resolvedMeta.ogDescription || resolvedMeta.description));
    setMeta('meta[property="og:url"]', formatTemplate(resolvedMeta.ogUrl));
    setMeta('meta[property="og:image"]', formatTemplate(resolvedMeta.ogImage));
    setMeta('meta[name="twitter:title"]', formatTemplate(resolvedMeta.twitterTitle || resolvedMeta.ogTitle));
    setMeta('meta[name="twitter:description"]', formatTemplate(resolvedMeta.twitterDescription || resolvedMeta.ogDescription));
    setMeta('meta[name="twitter:image"]', formatTemplate(resolvedMeta.twitterImage || resolvedMeta.ogImage));

    var favicon = document.querySelector('link[rel="icon"]');
    if (favicon && assets && assets.favicon) {
      favicon.setAttribute("href", formatTemplate(assets.favicon));
    }
  }

  function renderAuthors(authors) {
    var authorRows = document.querySelectorAll(".publication-authors");
    var authorsRow = authorRows[0];

    if (!authorsRow) {
      return;
    }

    if (!authors || authors.length === 0) {
      authorsRow.style.display = "none";
      authorsRow.innerHTML = "";
      return;
    }

    authorsRow.style.display = "";
    authorsRow.innerHTML = authors
      .map(function (author, index) {
        var label = escapeHtml(author.name);
        if (author.url) {
          label = '<a href="' + escapeHtml(author.url) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
        }

        var note = author.note ? "<sup>" + escapeHtml(author.note) + "</sup>" : "";
        var suffix = index < authors.length - 1 ? "," : "";
        return '<span class="author-block">' + label + note + suffix + "</span>";
      })
      .join("\n");
  }

  function renderSiteContent() {
    setText(".publication-title", formatTemplate(config.site.title));
    renderAuthors(config.authors);

    var authorRows = document.querySelectorAll(".publication-authors");
    if (authorRows[1]) {
      authorRows[1].innerHTML = config.site.venue
        ? '<span class="author-block">' + escapeHtml(formatTemplate(config.site.venue)) + "</span>"
        : "";
    }

    setText("#abstract h2", formatTemplate(config.site.abstractTitle));
    setHtml("#abstract .content p", formatTemplate(config.site.abstractHtml));
    setText("#method-overview h2", formatTemplate(config.overview.title));
    setAttribute("#method-overview img", "src", formatTemplate(config.overview.image));
    setAttribute("#method-overview img", "alt", formatTemplate(config.overview.alt));
    setHtml("#method-overview .has-text-grey", formatTemplate(config.overview.captionHtml));

    var footerParagraphs = document.querySelectorAll("footer .content p");
    if (footerParagraphs[0]) {
      footerParagraphs[0].textContent = formatTemplate(config.site.title);
    }
    if (footerParagraphs[1]) {
      footerParagraphs[1].textContent = formatTemplate(config.site.footerSubtitle);
    }
  }

  function setVideoSource(video, path) {
    if (!video || !path) {
      return;
    }
    video.pause();
    video.src = formatTemplate(path);
  }

  function safePlay(video) {
    if (!video) {
      return;
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function loadVideosSync(videos, afterLoad) {
    var validVideos = videos.filter(Boolean);
    if (!validVideos.length) {
      return;
    }

    var readyCount = 0;

    function markReady() {
      readyCount += 1;
      if (readyCount === validVideos.length) {
        validVideos.forEach(function (video) {
          video.currentTime = 0;
          safePlay(video);
        });
        if (afterLoad) {
          afterLoad();
        }
      }
    }

    validVideos.forEach(function (video) {
      var handler = function () {
        video.removeEventListener("canplay", handler);
        markReady();
      };

      video.addEventListener("canplay", handler);
      video.load();
    });
  }

  function syncFollowerVideos(leader, followers) {
    if (!leader || !followers.length) {
      return;
    }

    leader.addEventListener("play", function () {
      followers.forEach(function (video) {
        video.currentTime = leader.currentTime;
        safePlay(video);
      });
    });

    leader.addEventListener("pause", function () {
      followers.forEach(function (video) {
        video.pause();
      });
    });

    leader.addEventListener("seeked", function () {
      followers.forEach(function (video) {
        video.currentTime = leader.currentTime;
      });
    });
  }

  function bindTripleComparisonSlider(wrapper, sliderConfig) {
    if (!wrapper) {
      return;
    }

    var leftVideo = wrapper.querySelector(".comparison-video.video-left");
    var middleVideo = wrapper.querySelector(".comparison-video.video-middle");
    var rightVideo = wrapper.querySelector(".comparison-video.video-right");
    var leftHandle = wrapper.querySelector(".slider-handle.handle-left");
    var rightHandle = wrapper.querySelector(".slider-handle.handle-right");

    if (!leftVideo || !middleVideo || !rightVideo || !leftHandle || !rightHandle) {
      return;
    }

    var activeHandle = null;
    var firstDivider = sliderConfig && sliderConfig.firstDivider != null ? sliderConfig.firstDivider : 33.33;
    var secondDivider = sliderConfig && sliderConfig.secondDivider != null ? sliderConfig.secondDivider : 66.66;
    var minGap = sliderConfig && sliderConfig.minGap != null ? sliderConfig.minGap : 8;

    function getPointerPercent(event) {
      var rect = wrapper.getBoundingClientRect();
      var clientX = event.touches ? event.touches[0].clientX : event.clientX;
      var x = clientX - rect.left;
      return Math.max(0, Math.min(100, (x / rect.width) * 100));
    }

    function applyDividers() {
      leftVideo.style.clipPath = "inset(0 " + (100 - firstDivider) + "% 0 0)";
      middleVideo.style.clipPath = "inset(0 " + (100 - secondDivider) + "% 0 " + firstDivider + "%)";
      rightVideo.style.clipPath = "inset(0 0 0 " + secondDivider + "%)";

      leftHandle.style.left = firstDivider + "%";
      rightHandle.style.left = secondDivider + "%";
    }

    function updateActiveHandle(event) {
      var percentage = getPointerPercent(event);

      if (activeHandle === "left") {
        firstDivider = Math.max(0, Math.min(secondDivider - minGap, percentage));
      } else if (activeHandle === "right") {
        secondDivider = Math.max(firstDivider + minGap, Math.min(100, percentage));
      }

      applyDividers();
    }

    leftHandle.addEventListener("mousedown", function (event) {
      activeHandle = "left";
      event.preventDefault();
    });

    rightHandle.addEventListener("mousedown", function (event) {
      activeHandle = "right";
      event.preventDefault();
    });

    leftHandle.addEventListener("touchstart", function () {
      activeHandle = "left";
    });

    rightHandle.addEventListener("touchstart", function () {
      activeHandle = "right";
    });

    document.addEventListener("mousemove", function (event) {
      if (activeHandle) {
        updateActiveHandle(event);
      }
    });

    document.addEventListener("touchmove", function (event) {
      if (activeHandle) {
        updateActiveHandle(event);
      }
    });

    document.addEventListener("mouseup", function () {
      activeHandle = null;
    });

    document.addEventListener("touchend", function () {
      activeHandle = null;
    });

    applyDividers();
    syncFollowerVideos(leftVideo, [middleVideo, rightVideo]);
    loadVideosSync([leftVideo, middleVideo, rightVideo]);
  }

  function renderHeroSection() {
    setText("#hero-comparison h2", formatTemplate(config.hero.title));
    setHtml("#hero-comparison .subtitle", formatTemplate(config.hero.summaryHtml));

    var wrapper = document.querySelector("#hero-comparison .triple-comparison-wrapper");
    var heroConfig = config.hero.tripleComparison;
    if (!wrapper || !heroConfig) {
      return;
    }

    setVideoSource(wrapper.querySelector(".comparison-video.video-left"), heroConfig.leftVideo);
    setVideoSource(wrapper.querySelector(".comparison-video.video-middle"), heroConfig.middleVideo);
    setVideoSource(wrapper.querySelector(".comparison-video.video-right"), heroConfig.rightVideo);
    setText(wrapper.querySelector(".comparison-label.left"), formatTemplate(heroConfig.leftLabel));
    setText(wrapper.querySelector(".comparison-label.center"), formatTemplate(heroConfig.middleLabel));
    setText(wrapper.querySelector(".comparison-label.right"), formatTemplate(heroConfig.rightLabel));
    bindTripleComparisonSlider(wrapper, heroConfig);
  }

    function initZoomFeature(section, videos, scrubber) {
      var videoBoxes = Array.prototype.slice.call(section.querySelectorAll(".video-box"));
      var videoContainer = section.querySelector(".baseline-video-container");
      if (!videoBoxes.length || !videoContainer) { return null; }

      var rectIndicators = [];
      var overlays = [];

      videoBoxes.forEach(function (box, i) {
        var vid = videos[i];
        if (!vid) { return; }

        // Wrap the video element for precise overlay positioning
        var inner = document.createElement("div");
        inner.className = "video-inner-wrap";
        box.insertBefore(inner, vid);
        inner.appendChild(vid);

        // Yellow rect indicator (shown on all 3 videos)
        var ind = document.createElement("div");
        ind.className = "zoom-rect-indicator";
        inner.appendChild(ind);
        rectIndicators.push(ind);

        // Transparent draw overlay (captures mouse)
        var ov = document.createElement("div");
        ov.className = "video-draw-overlay";
        inner.appendChild(ov);
        overlays.push(ov);
      });

      // Drag hint text
      var hint = document.createElement("p");
      hint.className = "zoom-drag-hint";
      hint.textContent = "Drag on any video to zoom in";
      videoContainer.parentNode.insertBefore(hint, videoContainer.nextSibling);

      // Zoom panels (inserted above video container, hidden initially)
      var zoomWrap = document.createElement("div");
      zoomWrap.className = "zoom-panels-wrap";
      zoomWrap.style.display = "none";

      var zoomHeader = document.createElement("div");
      zoomHeader.className = "zoom-panels-header";
      var zoomTitle = document.createElement("span");
      zoomTitle.className = "zoom-panels-title";
      zoomTitle.textContent = "Zoomed Region";
      var closeBtn = document.createElement("button");
      closeBtn.className = "zoom-close-btn";
      closeBtn.innerHTML = "&#x2715;";
      closeBtn.title = "Close";
      zoomHeader.appendChild(zoomTitle);
      zoomHeader.appendChild(closeBtn);
      zoomWrap.appendChild(zoomHeader);

      var zoomRow = document.createElement("div");
      zoomRow.className = "zoom-panels-row";
      zoomWrap.appendChild(zoomRow);

      var zoomCanvases = [];
      videoBoxes.forEach(function (box, i) {
        var panel = document.createElement("div");
        panel.className = "zoom-panel";
        var canvas = document.createElement("canvas");
        panel.appendChild(canvas);
        zoomCanvases.push(canvas);
        var srcLabel = box.querySelector(".video-label");
        var lbl = document.createElement("p");
        lbl.className = srcLabel ? srcLabel.className : "video-label";
        lbl.textContent = srcLabel ? srcLabel.textContent : "";
        panel.appendChild(lbl);
        zoomRow.appendChild(panel);
      });

      videoContainer.parentNode.insertBefore(zoomWrap, videoContainer);

      // State
      var normRect = null;

      closeBtn.addEventListener("click", function () {
        zoomWrap.style.display = "none";
        rectIndicators.forEach(function (r) { r.style.display = "none"; });
        normRect = null;
        hint.style.display = "";
      });

      function showRects(nr) {
        rectIndicators.forEach(function (ind, i) {
          var v = videos[i];
          if (!v) { return; }
          var vw = v.offsetWidth || 1;
          var vh = v.offsetHeight || 1;
          ind.style.display = "block";
          ind.style.left   = (nr.x * vw) + "px";
          ind.style.top    = (nr.y * vh) + "px";
          ind.style.width  = (nr.w * vw) + "px";
          ind.style.height = (nr.h * vh) + "px";
        });
      }

      function drawZoom(nr) {
        if (!nr || nr.w < 0.015 || nr.h < 0.015) { return; }
        zoomWrap.style.display = "block";
        hint.style.display = "none";

        videos.forEach(function (v, i) {
          var c = zoomCanvases[i];
          if (!c) { return; }
          var vw = v.videoWidth;
          var vh = v.videoHeight;
          if (!vw || !vh) { return; }

          var panelW = Math.max(1, Math.floor((zoomRow.offsetWidth - (videos.length - 1) * 12) / videos.length));
          var panelH = Math.round(panelW * (nr.h * vh) / (nr.w * vw));

          c.width  = panelW;
          c.height = panelH;

          try {
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, panelW, panelH);
            ctx.drawImage(v,
              nr.x * vw, nr.y * vh, nr.w * vw, nr.h * vh,
              0, 0, panelW, panelH
            );
          } catch (e) {}
        });
      }

      // Mouse draw events per overlay
      overlays.forEach(function (ov) {
        var dragging = false;
        var sx = 0, sy = 0;

        ov.addEventListener("mousedown", function (e) {
          dragging = true;
          var r = ov.getBoundingClientRect();
          sx = e.clientX - r.left;
          sy = e.clientY - r.top;
          e.preventDefault();
        });

        document.addEventListener("mousemove", function (e) {
          if (!dragging) { return; }
          var r = ov.getBoundingClientRect();
          var cx = e.clientX - r.left;
          var cy = e.clientY - r.top;
          var ow = r.width  || 1;
          var oh = r.height || 1;
          var nr = {
            x: Math.max(0, Math.min(1, Math.min(sx, cx) / ow)),
            y: Math.max(0, Math.min(1, Math.min(sy, cy) / oh)),
            w: Math.min(1, Math.abs(cx - sx) / ow),
            h: Math.min(1, Math.abs(cy - sy) / oh)
          };
          // Clamp right/bottom
          nr.w = Math.min(nr.w, 1 - nr.x);
          nr.h = Math.min(nr.h, 1 - nr.y);
          normRect = nr;
          showRects(nr);
        });

        document.addEventListener("mouseup", function () {
          if (!dragging) { return; }
          dragging = false;
          if (normRect && normRect.w > 0.015 && normRect.h > 0.015) {
            drawZoom(normRect);
          }
        });
      });

      // Re-draw zoom on scrubber move
      if (scrubber) {
        scrubber.addEventListener("input", function () {
          if (!normRect) { return; }
          requestAnimationFrame(function () { drawZoom(normRect); });
        });
      }

      // Called after new videos finish loading (scene change)
      return function onVideosReady() {
        if (normRect) {
          setTimeout(function () { drawZoom(normRect); }, 80);
        }
      };
    }

    function renderBottomComparisonSection() {
      var demoConfig = config.bottomComparison;
      var section = document.querySelector("#matrixcity-baseline-demo");

      if (!section) {
        return;
      }

      if (!demoConfig || demoConfig.enabled === false) {
        section.style.display = "none";
        return;
      }

      setText("#matrixcity-demo-title", formatTemplate(demoConfig.title));
      setText("#matrixcity-demo-subtitle", formatTemplate(demoConfig.subtitle));
      setText("#matrixcity-sample-label", formatTemplate(demoConfig.sampleLabel || "Sample"));
      setHtml("#matrixcity-demo-description", formatTemplate(demoConfig.descriptionHtml || ""));

      var sceneSelector = section.querySelector("#matrixcity-scene-selector");
      var methodVideos = Array.prototype.slice.call(section.querySelectorAll(".matrixcity-method-video[data-method]"));
      var methods = demoConfig.methods || [];

      if (!sceneSelector || !methodVideos.length || !methods.length) {
        return;
      }

      var methodMap = {};
      methods.forEach(function (method) {
        methodMap[String(method.id)] = method;
      });

      methodVideos = methodVideos.filter(function (video) {
        var methodId = String(video.getAttribute("data-method") || "");
        return !!methodMap[methodId];
      });

      if (!methodVideos.length) {
        section.style.display = "none";
        return;
      }

      var scenes = (demoConfig.scenes || []).map(function (scene) {
        return String(scene);
      });

      if (!scenes.length) {
        section.style.display = "none";
        return;
      }

      var state = {
        scene: String(demoConfig.defaultScene || scenes[0])
      };

      if (scenes.indexOf(state.scene) === -1) {
        state.scene = scenes[0];
      }

      // --- Scrubber state ---
      var scrubberInput = section.querySelector("#matrixcity-scrubber");
      var leaderVideo   = methodVideos[0] || null;
      var onZoomReady   = null; // set after initZoomFeature

      function resetScrubber() {
        methodVideos.forEach(function (v) { v.currentTime = 0; });
        if (scrubberInput) { scrubberInput.value = 0; }
      }

      // --- Video loading ---
      function updateVideos() {
        methodVideos.forEach(function (video) {
          var methodId = String(video.getAttribute("data-method"));
          var path = formatTemplate(demoConfig.videoPathTemplate, {
            scene: state.scene,
            method: methodId
          });
          setVideoSource(video, path);

          var labelElement = video.parentElement ? video.parentElement.querySelector(".video-label") : null;
          if (labelElement && methodMap[methodId] && methodMap[methodId].label) {
            setText(labelElement, methodMap[methodId].label);
          }
        });

        loadVideosSync(methodVideos, function () {
          // After sync-load, pause all videos and reset scrubber to frame 0
          methodVideos.forEach(function (v) { v.pause(); });
          resetScrubber();
          if (onZoomReady) { onZoomReady(); }
        });
      }

      function renderSceneButtons() {
        sceneSelector.innerHTML = "";
        scenes.forEach(function (scene) {
          var button = document.createElement("div");
          button.className = "scene-circle" + (scene === state.scene ? " active" : "");
          button.innerHTML = "<span>" + escapeHtml(scene) + "</span>";
          button.addEventListener("click", function () {
            state.scene = scene;
            renderSceneButtons();
            updateVideos();
          });
          sceneSelector.appendChild(button);
        });
      }

      // --- Scrubber events: drag to seek, always paused ---
      if (scrubberInput) {
        scrubberInput.addEventListener("input", function () {
          if (!leaderVideo) { return; }
          var duration = isFinite(leaderVideo.duration) ? leaderVideo.duration : 0;
          var time = (parseInt(scrubberInput.value, 10) / 1000) * duration;
          methodVideos.forEach(function (v) { v.currentTime = time; });
        });
      }

      renderSceneButtons();
      if (methodVideos.length > 1) {
        syncFollowerVideos(methodVideos[0], methodVideos.slice(1));
      }
      onZoomReady = initZoomFeature(section, methodVideos, scrubberInput);
      updateVideos();
    }
    document.addEventListener("DOMContentLoaded", function () {
      applyTheme(config.theme);
      applyMeta(config.meta, config.assets);
      renderSiteContent();
      renderHeroSection();
      renderBottomComparisonSection();
    });
  })();
