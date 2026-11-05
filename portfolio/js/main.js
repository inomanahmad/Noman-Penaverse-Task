/* ==========================================================================
   Noman Ahmad | portfolio interactions
   Vanilla JavaScript, no dependencies. Every effect checks for
   prefers-reduced-motion and for touch screens before it runs.
   ========================================================================== */
(() => {
  "use strict";

  window.__portfolioReady = true;

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasIO = "IntersectionObserver" in window;

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  /* ------------------------------------------------------------------
     Scroll / resize engine: one rAF-throttled scroll pass for everything
     ------------------------------------------------------------------ */
  const scrollFns = [];
  const resizeFns = [];
  const onScroll = (fn) => scrollFns.push(fn);
  const onResize = (fn) => resizeFns.push(fn);

  let scrollQueued = false;
  const runScroll = () => {
    scrollQueued = false;
    const y = window.scrollY;
    for (const fn of scrollFns) fn(y);
  };
  const runResize = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    for (const fn of resizeFns) fn();
    runScroll();
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(runScroll);
      }
    },
    { passive: true }
  );

  let resizeTimer = 0;
  const queueResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(runResize, 120);
  };
  window.addEventListener("resize", queueResize);

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  // Wrap every word of an element in <span class="{cls}"><span class="{cls}__inner">
  // while keeping inline markup such as <em> intact.
  function splitWords(el, cls = "word") {
    const words = [];
    let index = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          if (!child.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          // split on ordinary whitespace only, so "proud&nbsp;of." stays one unit
          child.textContent.split(/([ \t\n\r\f]+)/).forEach((part) => {
            if (!part) return;
            if (!/[^ \t\n\r\f]/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const outer = document.createElement("span");
            const inner = document.createElement("span");
            outer.className = cls;
            inner.className = `${cls}__inner`;
            inner.style.setProperty("--i", index++);
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
            words.push(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
    return words;
  }

  const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  /* ------------------------------------------------------------------
     1. Reveal on scroll (headings split into words, staggered groups)
     ------------------------------------------------------------------ */
  function initReveal() {
    $$("[data-split]").forEach((el) => splitWords(el));
    $$("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => child.style.setProperty("--i", i));
    });

    const targets = $$("[data-reveal], [data-split], [data-stagger]");
    if (reducedMotion || !hasIO) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------
     2. Navigation: glass on scroll, hide on scroll down, active link pill,
        mobile menu with focus management
     ------------------------------------------------------------------ */
  function initNav() {
    const nav = $("[data-nav]");
    if (!nav) return;
    const linksWrap = $(".nav__links", nav);
    const links = $$(".nav__links a", nav);
    const indicator = $(".nav__indicator", nav);
    const toggle = $(".nav__toggle", nav);
    const menu = $("#menu");
    const main = $("main");
    const footer = $("footer");
    let menuOpen = false;
    let lastY = window.scrollY;

    onScroll((y) => {
      nav.classList.toggle("is-scrolled", y > 24);
      if (menuOpen || y < 240) {
        nav.classList.remove("is-hidden");
        lastY = y;
        return;
      }
      if (Math.abs(y - lastY) < 8) return;
      nav.classList.toggle("is-hidden", y > lastY);
      lastY = y;
    });

    // Keyboard users tabbing into a hidden nav should see it
    nav.addEventListener("focusin", () => nav.classList.remove("is-hidden"));

    // Sliding pill behind the active / hovered link
    const moveIndicator = (link) => {
      if (!indicator) return;
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    const activeLink = () => links.find((a) => a.classList.contains("is-active"));
    links.forEach((a) => a.addEventListener("pointerenter", () => moveIndicator(a)));
    linksWrap?.addEventListener("pointerleave", () => moveIndicator(activeLink()));
    onResize(() => moveIndicator(activeLink()));

    // Scroll spy
    if (hasIO) {
      const ids = new Set(links.map((a) => a.getAttribute("href").slice(1)));
      const watched = $$("main > section[id]");
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = ids.has(entry.target.id) ? entry.target.id : null;
            links.forEach((a) => {
              const on = a.getAttribute("href") === `#${id}`;
              a.classList.toggle("is-active", on);
              if (on) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
            moveIndicator(activeLink());
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      watched.forEach((s) => spy.observe(s));
    }

    // Mobile menu
    if (!toggle || !menu) return;
    const setMenu = (open) => {
      menuOpen = open;
      root.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.inert = !open;
      if (main) main.inert = open;
      if (footer) footer.inert = open;
      if (open) {
        nav.classList.remove("is-hidden");
        setTimeout(() => $("a", menu)?.focus({ preventScroll: true }), 350);
      }
    };
    toggle.addEventListener("click", () => setMenu(!menuOpen));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenu(false);
        toggle.focus();
      }
    });
    onResize(() => {
      if (vw > 960 && menuOpen) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     3. Scroll progress bar
     ------------------------------------------------------------------ */
  function initProgress() {
    const bar = $(".scroll-progress span");
    if (!bar) return;
    let max = 1;
    onResize(() => {
      max = Math.max(1, root.scrollHeight - vh);
    });
    onScroll((y) => {
      bar.style.transform = `scaleX(${clamp(y / max, 0, 1).toFixed(4)})`;
    });
  }

  /* ------------------------------------------------------------------
     4. Hero: network canvas, mouse parallax, rotating word, live toasts
     ------------------------------------------------------------------ */
  function initNetwork(canvas) {
    const hero = canvas.closest(".hero");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { start() {} };

    const ACCENT = "190, 242, 100";
    let w = 0;
    let h = 0;
    let nodes = [];
    let pulses = [];
    let linkDist = 130;
    let raf = 0;
    let visible = true;
    let started = false;
    let last = 0;
    let lastSpawn = 0;
    const mouse = { x: 0, y: 0, active: false };

    const makeNode = () => {
      const hub = Math.random() < 0.12;
      const speed = 0.12 + Math.random() * 0.22;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: hub ? 2.6 : 1 + Math.random() * 1.1,
        hub,
        phase: Math.random() * Math.PI * 2,
      };
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const sameWidth = Math.abs(rect.width - w) < 1 && Math.abs(rect.height - h) < 160;
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      linkDist = clamp(Math.min(w, h) * 0.2, 95, 150);
      if (!sameWidth || !nodes.length) {
        const count = Math.round(clamp((w * h) / 15000, 26, 96));
        nodes = Array.from({ length: count }, makeNode);
        pulses = [];
      }
      if (reducedMotion || !raf) draw(performance.now());
    }

    function spawnPulse() {
      const a = nodes[(Math.random() * nodes.length) | 0];
      const b = nearestNeighbour(a, null);
      if (b) pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.012, hops: 2 + ((Math.random() * 3) | 0) });
    }

    function nearestNeighbour(a, exclude) {
      let best = null;
      let bestD = Infinity;
      for (const n of nodes) {
        if (n === a || n === exclude) continue;
        const d = Math.hypot(n.x - a.x, n.y - a.y);
        if (d < linkDist && d < bestD && Math.random() > 0.25) {
          best = n;
          bestD = d;
        }
      }
      return best;
    }

    function draw(now) {
      const dt = last ? clamp((now - last) / 16.67, 0, 3) : 1;
      last = now;
      ctx.clearRect(0, 0, w, h);

      // Move
      if (!reducedMotion) {
        for (const n of nodes) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          if (mouse.active) {
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < 90 && d > 0.1) {
              const push = (1 - d / 90) * 1.2 * dt;
              n.x += (dx / d) * push;
              n.y += (dy / d) * push;
            }
          }
        }
      }

      // Links between nearby nodes
      const ld2 = linkDist * linkDist;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > ld2) continue;
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Links to the pointer
      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d > 190) continue;
          ctx.strokeStyle = `rgba(${ACCENT}, ${((1 - d / 190) * 0.55).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Signals travelling through the network
      if (!reducedMotion) {
        if (now - lastSpawn > 480 && pulses.length < 7) {
          spawnPulse();
          lastSpawn = now;
        }
        pulses = pulses.filter((p) => {
          p.t += p.speed * dt;
          if (p.t >= 1) {
            const next = p.hops > 0 ? nearestNeighbour(p.b, p.a) : null;
            if (!next) return false;
            p.a = p.b;
            p.b = next;
            p.t = 0;
            p.hops -= 1;
          }
          const x = lerp(p.a.x, p.b.x, p.t);
          const y = lerp(p.a.y, p.b.y, p.t);
          ctx.strokeStyle = `rgba(${ACCENT}, 0.35)`;
          ctx.beginPath();
          ctx.moveTo(p.a.x, p.a.y);
          ctx.lineTo(p.b.x, p.b.y);
          ctx.stroke();
          ctx.fillStyle = `rgba(${ACCENT}, 0.22)`;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${ACCENT})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
      }

      // Nodes
      for (const n of nodes) {
        if (n.hub) {
          const s = 1 + Math.sin(now * 0.002 + n.phase) * 0.35;
          ctx.fillStyle = `rgba(${ACCENT}, 0.16)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 3.4 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${ACCENT}, 0.95)`;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (raf || !started || !visible || document.hidden || reducedMotion) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    hero.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    hero.addEventListener("pointerleave", () => {
      mouse.active = false;
    });

    if (hasIO) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
    onResize(resize);
    resize();

    return {
      start() {
        started = true;
        if (reducedMotion) draw(0);
        else play();
      },
    };
  }

  function initHero() {
    const hero = $(".hero");
    if (!hero) return { start() {} };
    const canvas = $(".hero__canvas", hero);
    const network = canvas ? initNetwork(canvas) : { start() {} };

    // Mouse parallax on the floating dashboard cards
    if (finePointer && !reducedMotion) {
      const cards = $$(".hcard", hero).map((el) => ({ el, depth: parseFloat(el.dataset.depth) || 1 }));
      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;
      let raf = 0;
      const tick = () => {
        cx = lerp(cx, tx, 0.07);
        cy = lerp(cy, ty, 0.07);
        cards.forEach(({ el, depth }) => {
          el.style.translate = `${(-cx * 26 * depth).toFixed(2)}px ${(-cy * 26 * depth).toFixed(2)}px`;
        });
        raf = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.001 ? requestAnimationFrame(tick) : 0;
      };
      hero.addEventListener("pointermove", (e) => {
        tx = e.clientX / vw - 0.5;
        ty = e.clientY / vh - 0.5;
        if (!raf) raf = requestAnimationFrame(tick);
      });
      hero.addEventListener("pointerleave", () => {
        tx = 0;
        ty = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      });
    }

    // The hero drifts up and fades as you scroll past it
    const grid = $(".hero__grid", hero);
    if (grid && !reducedMotion) {
      onScroll((y) => {
        if (y > vh * 1.2) return;
        const p = clamp(y / vh, 0, 1);
        grid.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
        grid.style.opacity = (1 - p * 0.85).toFixed(3);
      });
    }

    return {
      start() {
        network.start();
        setTimeout(initRotator, 1600);
        setTimeout(initToasts, 2600);
      },
    };
  }

  function initRotator() {
    const words = $$(".rotator__word");
    if (words.length < 2 || reducedMotion) return;
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      const current = words[i];
      i = (i + 1) % words.length;
      const next = words[i];
      current.classList.remove("is-active");
      current.classList.add("is-exit");
      next.classList.remove("is-exit");
      next.classList.add("is-active");
      setTimeout(() => current.classList.remove("is-exit"), 950);
    }, 2600);
  }

  const TOAST_ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  };
  const TOASTS = [
    { icon: "check", title: "Deal closed · $240K", meta: "Enterprise SaaS · just now" },
    { icon: "link", title: "Partnership signed", meta: "Reseller network · just now" },
    { icon: "calendar", title: "Meeting booked", meta: "VP Sales · Logistics" },
    { icon: "globe", title: "New market launched", meta: "6 partners onboarded" },
  ];

  function initToasts() {
    const toast = $("[data-toast]");
    if (!toast || reducedMotion) return;
    const icon = $(".toast__icon", toast);
    const title = $(".toast__title", toast);
    const meta = $(".toast__meta", toast);
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      toast.classList.add("is-out");
      setTimeout(() => {
        i = (i + 1) % TOASTS.length;
        const item = TOASTS[i];
        icon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${TOAST_ICONS[item.icon]}</svg>`;
        title.textContent = item.title;
        meta.textContent = item.meta;
        toast.classList.remove("is-out");
        toast.classList.add("is-in");
        setTimeout(() => toast.classList.remove("is-in"), 700);
      }, 450);
    }, 3400);
  }

  /* ------------------------------------------------------------------
     5. Marquee: endless loop that speeds up with scroll velocity and
        follows the scroll direction
     ------------------------------------------------------------------ */
  function initMarquee() {
    const section = $(".marquee");
    const rows = $$("[data-marquee]");
    if (!section || !rows.length || reducedMotion) return;

    const states = rows.map((row) => {
      const track = $(".marquee__track", row);
      const list = $(".marquee__list", track);
      return { row, track, list, dir: parseFloat(row.dataset.marquee) || -1, x: 0, w: 1 };
    });

    const fill = () => {
      states.forEach((s) => {
        s.w = s.list.offsetWidth || 1;
        // enough copies to cover the row width plus one full list
        const needed = Math.ceil((s.row.offsetWidth + s.w) / s.w) + 1;
        while (s.track.children.length < needed) {
          const clone = s.list.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          s.track.appendChild(clone);
        }
      });
    };
    onResize(fill);
    fill();

    let direction = 1;
    let boost = 0;
    let lastY = window.scrollY;
    onScroll((y) => {
      const d = y - lastY;
      lastY = y;
      if (d) direction = d > 0 ? 1 : -1;
      boost = clamp(boost + Math.abs(d) * 0.04, 0, 9);
    });

    let raf = 0;
    let last = 0;
    const loop = (now) => {
      const dt = last ? Math.min(now - last, 50) / 1000 : 0;
      last = now;
      boost *= Math.pow(0.9, dt * 60);
      states.forEach((s) => {
        s.x += s.dir * direction * 55 * (1 + boost) * dt;
        if (s.x <= -s.w) s.x += s.w;
        else if (s.x > 0) s.x -= s.w;
        s.track.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (hasIO) {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause())).observe(section);
    } else {
      play();
    }
  }

  /* ------------------------------------------------------------------
     6. About: paragraph lights up word by word as you scroll
     ------------------------------------------------------------------ */
  function initScrub() {
    const el = $("[data-scrub]");
    if (!el) return;
    const words = splitWords(el, "scrub");
    if (reducedMotion) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    let lit = -1;
    onScroll(() => {
      const r = el.getBoundingClientRect();
      const start = vh * 0.85;
      const span = vh * 0.35 + r.height;
      const count = Math.round(clamp((start - r.top) / span, 0, 1) * words.length);
      if (count === lit) return;
      lit = count;
      words.forEach((w, i) => w.classList.toggle("is-lit", i < count));
    });
  }

  /* ------------------------------------------------------------------
     7. Counters
     ------------------------------------------------------------------ */
  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length || reducedMotion || !hasIO) return;

    const format = (el, value) => {
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const num = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return `${el.dataset.prefix || ""}${num}${el.dataset.suffix || ""}`;
    };

    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const duration = 2000;
      const t0 = performance.now();
      const tick = (now) => {
        const t = clamp((now - t0) / duration, 0, 1);
        el.textContent = format(el, target * easeOutExpo(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          animate(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    els.forEach((el) => {
      el.textContent = format(el, 0);
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     8. Chart: drawn from the data table in the HTML, with a hover /
        keyboard crosshair and tooltip
     ------------------------------------------------------------------ */
  function monotonePath(pts) {
    const n = pts.length;
    if (n < 2) return "";
    const dx = [];
    const m = [];
    const t = [];
    for (let i = 0; i < n - 1; i++) {
      dx[i] = pts[i + 1].x - pts[i].x;
      m[i] = (pts[i + 1].y - pts[i].y) / dx[i];
    }
    t[0] = m[0];
    t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) {
        t[i] = 0;
        t[i + 1] = 0;
        continue;
      }
      const a = t[i] / m[i];
      const b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const k = 3 / Math.sqrt(s);
        t[i] = k * a * m[i];
        t[i + 1] = k * b * m[i];
      }
    }
    const f = (v) => +v.toFixed(2);
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += `C${f(pts[i].x + h)} ${f(pts[i].y + t[i] * h)} ${f(pts[i + 1].x - h)} ${f(pts[i + 1].y - t[i + 1] * h)} ${f(pts[i + 1].x)} ${f(pts[i + 1].y)}`;
    }
    return d;
  }

  function initChart() {
    const fig = $("[data-chart]");
    if (!fig) return;
    const host = $(".chart", fig);
    const table = $("table", fig);
    const tip = $(".chart__tooltip", fig);
    const live = $(".chart__live", fig);
    if (!host || !table || !tip) return;

    const data = Array.from(table.tBodies[0].rows)
      .map((row) => ({ label: row.cells[0].textContent.trim(), value: parseFloat(row.cells[1].textContent) }))
      .filter((d) => Number.isFinite(d.value));
    if (data.length < 2) return;

    const prefix = fig.dataset.prefix || "";
    const suffix = fig.dataset.suffix || "";
    const fmt = (v) => `${prefix}${v.toLocaleString("en-US", { maximumFractionDigits: 1 })}${suffix}`;
    const NS = "http://www.w3.org/2000/svg";
    const make = (tag, attrs, parent) => {
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      if (parent) parent.appendChild(node);
      return node;
    };

    let points = [];
    let current = -1;
    let drawn = false;
    let parts = {};
    let lastWidth = 0;

    function render() {
      const W = host.clientWidth;
      const H = host.clientHeight;
      if (!W || !H) return;
      lastWidth = W;
      host.querySelector("svg")?.remove();

      const m = { top: 18, right: 58, bottom: 34, left: 44 };
      const innerW = W - m.left - m.right;
      const innerH = H - m.top - m.bottom;
      const maxVal = Math.max(...data.map((d) => d.value));
      const step = maxVal <= 5 ? 1 : maxVal <= 10 ? 2 : Math.pow(10, Math.floor(Math.log10(maxVal)));
      const yMax = Math.ceil(maxVal / step) * step;
      const x = (i) => m.left + (i * innerW) / (data.length - 1);
      const y = (v) => m.top + innerH - (v / yMax) * innerH;

      const svg = make("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true", focusable: "false" });
      const defs = make("defs", {}, svg);
      const grad = make("linearGradient", { id: "chartArea", x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
      make("stop", { offset: "0", "stop-color": "#65a30d", "stop-opacity": "0.22" }, grad);
      make("stop", { offset: "1", "stop-color": "#65a30d", "stop-opacity": "0" }, grad);

      // Grid + y labels
      const gridG = make("g", { class: "chart__grid" }, svg);
      const axisG = make("g", { class: "chart__axis" }, svg);
      for (let v = 0; v <= yMax + 1e-9; v += step) {
        const gy = Math.round(y(v)) + 0.5;
        make("line", { x1: m.left, x2: W - m.right + 20, y1: gy, y2: gy }, gridG);
        const label = make("text", { x: m.left - 12, y: gy + 4, "text-anchor": "end" }, axisG);
        label.textContent = v === 0 ? "0" : fmt(v);
      }
      // X labels (thin them out on narrow charts)
      const every = innerW / data.length < 44 ? 2 : 1;
      data.forEach((d, i) => {
        if (i % every && i !== data.length - 1) return;
        const label = make("text", { x: x(i), y: H - 10, "text-anchor": "middle" }, axisG);
        label.textContent = d.label;
      });

      points = data.map((d, i) => ({ ...d, x: x(i), y: y(d.value) }));
      const linePath = monotonePath(points);
      const lastP = points[points.length - 1];
      const base = y(0);

      make("path", { class: "chart__area", d: `${linePath}L${lastP.x} ${base}L${points[0].x} ${base}Z`, fill: "url(#chartArea)" }, svg);
      make("path", { class: "chart__line", d: linePath, pathLength: "1" }, svg);

      // Hover layer
      const hover = make("g", { class: "chart__hover" }, svg);
      const cross = make("line", { class: "chart__cross", y1: m.top, y2: base }, hover);
      const focus = make("circle", { class: "chart__focus", r: 5 }, hover);

      // End marker + direct label (the one value worth labelling)
      const end = make("g", { class: "chart__end" }, svg);
      make("circle", { cx: lastP.x, cy: lastP.y, r: 5 }, end);
      const endLabel = make("text", { x: lastP.x + 12, y: lastP.y + 5 }, end);
      endLabel.textContent = fmt(lastP.value);

      // Hit area bigger than the marks
      const hit = make("rect", { class: "chart__hit", x: m.left - 20, y: 0, width: innerW + 40, height: H }, svg);
      hit.addEventListener("pointermove", (e) => {
        const r = svg.getBoundingClientRect();
        const px = e.clientX - r.left;
        let idx = 0;
        let best = Infinity;
        points.forEach((p, i) => {
          const d = Math.abs(p.x - px);
          if (d < best) {
            best = d;
            idx = i;
          }
        });
        show(idx);
      });
      hit.addEventListener("pointerleave", hide);

      host.prepend(svg);
      parts = { cross, focus, end };
      if (drawn) {
        host.classList.add("no-anim", "is-drawn");
        requestAnimationFrame(() => host.classList.remove("no-anim"));
      }
      if (current >= 0 && host.classList.contains("is-hovering")) show(current);
    }

    function show(i, announce = false) {
      const p = points[i];
      if (!p) return;
      current = i;
      parts.cross.setAttribute("x1", p.x);
      parts.cross.setAttribute("x2", p.x);
      parts.focus.setAttribute("cx", p.x);
      parts.focus.setAttribute("cy", p.y);
      $("strong", tip).textContent = fmt(p.value);
      $(".chart__tip-label", tip).textContent = p.label;
      host.classList.add("is-hovering");
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const left = clamp(p.x - tw / 2, 0, host.clientWidth - tw);
      const top = Math.max(0, p.y - th - 14);
      tip.style.transform = `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`;
      if (announce && live) live.textContent = `${p.label}: ${fmt(p.value)}`;
    }

    function hide() {
      host.classList.remove("is-hovering");
    }

    host.addEventListener("focus", () => show(current >= 0 ? current : points.length - 1, true));
    host.addEventListener("blur", hide);
    host.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const next = clamp((current < 0 ? points.length - 1 : current) + keys[e.key], 0, points.length - 1);
      show(Number.isFinite(next) ? next : 0, true);
    });

    onResize(() => {
      if (host.clientWidth !== lastWidth) render();
    });
    render();

    const reveal = () => {
      drawn = true;
      requestAnimationFrame(() => host.classList.add("is-drawn"));
    };
    if (reducedMotion || !hasIO) {
      drawn = true;
      host.classList.add("is-drawn");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        reveal();
      },
      { threshold: 0.4 }
    );
    io.observe(host);
  }

  /* ------------------------------------------------------------------
     9. Process: horizontal pipeline pinned on desktop, vertical on mobile
     ------------------------------------------------------------------ */
  function initProcess() {
    const section = $(".process");
    if (!section) return;
    const viewport = $(".process__viewport", section);
    const track = $(".process__track", section);
    const rail = $(".process__rail", section);
    const stages = $$(".stage", section);
    if (!viewport || !track || !rail || !stages.length) return;

    let pinned = false;
    let top = 0;
    let scrollLen = 1;
    let shift = 0;
    let trackTop = 0;
    let railStart = 0;
    let railLen = 1;
    let nodes = [];

    function measure() {
      pinned = vw >= 900 && vh >= 620 && !reducedMotion;
      section.classList.toggle("is-pinned", pinned);
      section.style.height = "";
      track.style.transform = "";

      const centres = stages.map((s) => {
        const node = $(".stage__node", s);
        return pinned
          ? s.offsetLeft + node.offsetLeft + node.offsetWidth / 2
          : s.offsetTop + node.offsetTop + node.offsetHeight / 2;
      });
      railStart = centres[0];
      railLen = Math.max(1, centres[centres.length - 1] - railStart);
      nodes = centres.map((c) => c - railStart);
      rail.style.setProperty("--start", `${railStart}px`);
      rail.style.setProperty("--len", `${railLen}px`);

      if (pinned) {
        shift = Math.max(0, track.offsetWidth - viewport.clientWidth);
        section.style.height = `${Math.round(vh + shift)}px`;
      }
      top = docTop(section);
      trackTop = docTop(track);
      scrollLen = Math.max(1, section.offsetHeight - vh);
    }

    function update(y) {
      let p;
      if (pinned) {
        p = clamp((y - top) / scrollLen, 0, 1);
        track.style.transform = `translate3d(${(-p * shift).toFixed(2)}px, 0, 0)`;
      } else {
        p = clamp((y + vh * 0.62 - trackTop - railStart) / railLen, 0, 1);
      }
      rail.style.setProperty("--p", p.toFixed(4));
      const reach = p * railLen;
      stages.forEach((s, i) => s.classList.toggle("is-active", nodes[i] <= reach + 2));
    }

    onResize(measure);
    onScroll(update);
  }

  /* ------------------------------------------------------------------
     10. Experience timeline progress
     ------------------------------------------------------------------ */
  function initTimeline() {
    const timeline = $(".timeline");
    if (!timeline) return;
    const roles = $$(".role", timeline);
    let top = 0;
    let height = 1;
    let dots = [];

    onResize(() => {
      top = docTop(timeline);
      height = Math.max(1, timeline.offsetHeight);
      dots = roles.map((role) => {
        const dot = $(".role__dot", role);
        return role.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
      });
    });
    onScroll((y) => {
      const reach = y + vh * 0.62 - top;
      timeline.style.setProperty("--p", clamp(reach / height, 0, 1).toFixed(4));
      roles.forEach((role, i) => role.classList.toggle("is-active", reach >= dots[i]));
    });
  }

  /* ------------------------------------------------------------------
     11. Stacking case-study cards: earlier cards shrink and dim
     ------------------------------------------------------------------ */
  function initStack() {
    const cards = $$(".case");
    if (cards.length < 2 || reducedMotion) return;
    let enabled = false;
    let sticks = [];
    let heights = [];

    onResize(() => {
      enabled = vw > 760;
      sticks = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
      heights = cards.map((c) => c.offsetHeight);
      if (!enabled) {
        cards.forEach((c) => {
          c.firstElementChild.style.scale = "";
          c.firstElementChild.style.removeProperty("--dim");
        });
      }
    });

    onScroll(() => {
      if (!enabled) return;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const nextTop = next.getBoundingClientRect().top;
        const p = clamp(1 - (nextTop - sticks[i + 1]) / heights[i], 0, 1);
        const inner = card.firstElementChild;
        inner.style.scale = (1 - p * 0.06).toFixed(4);
        inner.style.setProperty("--dim", (p * 0.45).toFixed(3));
      });
    });
  }

  /* ------------------------------------------------------------------
     12. Small parallax for decorative elements
     ------------------------------------------------------------------ */
  function initParallax() {
    if (reducedMotion) return;
    const items = $$("[data-parallax]").map((el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0.1 }));
    if (!items.length) return;
    onScroll(() => {
      items.forEach(({ el, speed }) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    });
  }

  /* ------------------------------------------------------------------
     13. Pointer effects: 3D tilt + spotlight, magnetic buttons, cursor
     ------------------------------------------------------------------ */
  function initTilt() {
    if (!finePointer) return;
    $$("[data-tilt]").forEach((card) => {
      const max = parseFloat(card.dataset.tilt) || 8;
      let raf = 0;
      let px = 0.5;
      let py = 0.5;
      const apply = () => {
        raf = 0;
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        if (!reducedMotion) {
          card.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg)`;
        }
      };
      card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        px = clamp((e.clientX - r.left) / r.width, 0, 1);
        py = clamp((e.clientY - r.top) / r.height, 0, 1);
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        raf = 0;
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  function initMagnetic() {
    if (!finePointer || reducedMotion) return;
    $$("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  function initCursor() {
    const cursor = $(".cursor");
    if (!cursor || !finePointer || reducedMotion) return;
    const dot = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);
    const label = $(".cursor__label", cursor);
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let started = false;

    const follow = () => {
      rx = lerp(rx, mx, 0.2);
      ry = lerp(ry, my, 0.2);
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      raf = Math.abs(rx - mx) + Math.abs(ry - my) > 0.2 ? requestAnimationFrame(follow) : 0;
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        if (!started) {
          started = true;
          rx = mx;
          ry = my;
          root.classList.add("has-cursor");
        }
        cursor.classList.remove("is-hidden");
        if (!raf) raf = requestAnimationFrame(follow);
      },
      { passive: true }
    );
    root.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));

    document.addEventListener("pointerover", (e) => {
      const target = e.target.closest("[data-cursor], a, button, label, [data-tilt], input, textarea, .chart");
      cursor.classList.remove("is-hover", "is-label", "is-text");
      if (!target) return;
      if (target.matches("input:not([type=radio]), textarea")) {
        cursor.classList.add("is-text");
      } else if (target.dataset.cursor) {
        label.textContent = target.dataset.cursor;
        cursor.classList.add("is-label");
      } else {
        cursor.classList.add("is-hover");
      }
    });
  }

  /* ------------------------------------------------------------------
     14. Contact form: validates, then opens the visitor's email app
     ------------------------------------------------------------------ */
  function initForm() {
    const form = $("[data-contact-form]");
    if (!form) return;
    const status = $(".form__status", form);
    const to = form.dataset.email || "";

    const validate = (input) => {
      const valid = input.checkValidity() && input.value.trim() !== "";
      const field = input.closest(".field");
      field?.classList.toggle("is-invalid", !valid);
      if (valid) input.removeAttribute("aria-invalid");
      else input.setAttribute("aria-invalid", "true");
      return valid;
    };

    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field");
      if (field?.classList.contains("is-invalid")) validate(e.target);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = $$("[required]", form).filter((input) => !validate(input));
      if (invalid.length) {
        status.dataset.state = "error";
        status.textContent = "Please check the highlighted fields.";
        invalid[0].focus();
        if (!reducedMotion) {
          form.classList.remove("shake");
          void form.offsetWidth;
          form.classList.add("shake");
        }
        return;
      }
      const data = new FormData(form);
      const name = String(data.get("name")).trim();
      const company = String(data.get("company") || "").trim();
      const subject = `${data.get("topic") || "Enquiry"} | ${name}${company ? `, ${company}` : ""}`;
      const body = `${String(data.get("message")).trim()}\n\n${name}${company ? `\n${company}` : ""}\n${String(data.get("email")).trim()}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.dataset.state = "success";
      status.textContent = "Thanks! Your email app should open with the message ready to send.";
    });
  }

  /* ------------------------------------------------------------------
     15. Footer: giant name rises in, letters lift near the pointer
     ------------------------------------------------------------------ */
  function initFooter() {
    $$("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });

    $(".to-top")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      $(".nav__brand")?.focus({ preventScroll: true });
    });

    const name = $(".footer__name");
    if (!name) return;
    const text = name.textContent.trim();
    name.textContent = "";
    const letters = Array.from(text).map((ch, i) => {
      const span = document.createElement("span");
      span.className = "footer__char";
      span.textContent = ch === " " ? " " : ch;
      span.style.setProperty("--i", i);
      name.appendChild(span);
      return span;
    });

    const ready = () => name.classList.add("is-visible");
    if (reducedMotion || !hasIO) {
      ready();
    } else {
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        ready();
        setTimeout(() => name.classList.add("is-ready"), 1100 + letters.length * 45);
      });
      io.observe(name);
    }

    if (!finePointer || reducedMotion) return;
    let raf = 0;
    let px = -9999;
    const update = () => {
      raf = 0;
      letters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const d = Math.abs(px - (r.left + r.width / 2));
        l.style.setProperty("--lift", clamp(1 - d / 240, 0, 1).toFixed(3));
      });
    };
    name.addEventListener("pointermove", (e) => {
      px = e.clientX;
      if (!raf) raf = requestAnimationFrame(update);
    });
    name.addEventListener("pointerleave", () => {
      px = -9999;
      if (!raf) raf = requestAnimationFrame(update);
    });
  }

  /* ------------------------------------------------------------------
     16. Intro loader, then the hero entrance
     ------------------------------------------------------------------ */
  function runPreloader(onDone) {
    const preloader = $(".preloader");
    const finish = () => {
      root.classList.remove("is-loading");
      root.classList.add("is-loaded");
      onDone();
    };

    if (!preloader || reducedMotion || !root.classList.contains("js")) {
      preloader?.remove();
      finish();
      return;
    }

    root.classList.add("is-loading");
    const count = $(".preloader__count", preloader);
    const bar = $(".preloader__bar", preloader);
    const minDuration = 1400;
    let fontsReady = false;
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(() => {
      fontsReady = true;
    });

    const t0 = performance.now();
    const tick = (now) => {
      const t = clamp((now - t0) / minDuration, 0, 1);
      const eased = easeInOutCubic(t);
      count.textContent = String(Math.round(eased * 100));
      bar.style.setProperty("--p", eased.toFixed(4));
      if (t < 1 || !fontsReady) {
        requestAnimationFrame(tick);
        return;
      }
      setTimeout(() => {
        preloader.classList.add("is-done");
        setTimeout(finish, 380);
        setTimeout(() => preloader.remove(), 1300);
      }, 160);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  initReveal();
  initNav();
  const hero = initHero();
  initMarquee();
  initScrub();
  initCounters();
  initChart();
  initProcess();
  initTimeline();
  initStack();
  initParallax();
  initTilt();
  initMagnetic();
  initCursor();
  initForm();
  initFooter();
  initProgress(); // last, so it measures the final page height

  runResize();
  runPreloader(() => hero.start());

  // Layout shifts once web fonts and everything else finish loading
  document.fonts?.ready.then(queueResize);
  window.addEventListener("load", queueResize);
  if ("ResizeObserver" in window) {
    let lastHeight = document.body.offsetHeight;
    new ResizeObserver(() => {
      const hgt = document.body.offsetHeight;
      if (hgt !== lastHeight) {
        lastHeight = hgt;
        queueResize();
      }
    }).observe(document.body);
  }
})();
