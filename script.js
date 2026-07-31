/* .js files add interaction to your website */

// Dropdown functionality for project cards
document.addEventListener("DOMContentLoaded", function () {
  const dropdownButtons = document.querySelectorAll(".dropdown-btn");

  dropdownButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const projectCard = this.closest(".project-card");
      projectCard.classList.toggle("active");
    });
  });

  // Carousel functionality
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    let currentSlide = 0;

    function showSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      // Add active class to current slide and dot
      if (slides[index]) {
        slides[index].classList.add("active");
      }
      if (dots[index]) {
        dots[index].classList.add("active");
      }

      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    // Initialize first slide
    showSlide(0);
  });

  // Terminal marquee animation
  const terms = document.querySelectorAll(".terminal-content");
  if (terms.length > 0) {
    const BLINK_COUNT = 3;
    const BLINK_CYCLE = 600;
    const TYPE_SPEED = 100;
    const RESPONSE_DELAY = 800;
    const DISPLAY_TIME = 3000;

    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function animateTerm(term, isLast) {
      const cmd = term.querySelector(".terminal-command");
      const resp = term.querySelector(".terminal-response");
      const text = cmd.textContent;

      term.classList.add("active");
      cmd.style.width = "0";

      // Blink cursor 3 times
      cmd.classList.add("blink");
      await sleep(BLINK_COUNT * BLINK_CYCLE * 2);
      cmd.classList.remove("blink");

      // Measure actual character widths accounting for letter-spacing
      cmd.style.visibility = "hidden";
      cmd.style.width = "auto";
      cmd.style.overflow = "visible";
      const fullWidth = cmd.scrollWidth;
      const charWidths = [];
      for (let i = 1; i <= text.length; i++) {
        cmd.textContent = text.slice(0, i);
        charWidths.push(cmd.scrollWidth);
      }
      cmd.textContent = text;
      cmd.style.visibility = "";
      cmd.style.width = "0";
      cmd.style.overflow = "hidden";

      // Type characters one by one
      cmd.classList.add("typing");
      for (let i = 0; i < charWidths.length; i++) {
        cmd.style.width = charWidths[i] + "px";
        await sleep(TYPE_SPEED);
      }

      // Hide cursor, show response
      cmd.classList.remove("typing");
      cmd.classList.add("done");
      await sleep(RESPONSE_DELAY);
      resp.classList.add("visible");

      if (!isLast) {
        // Hold, then hide everything
        await sleep(DISPLAY_TIME);
        resp.classList.remove("visible");
        term.classList.remove("active");
        cmd.classList.remove("done");
        cmd.style.width = "0";
      }
    }

    (async function runTerminal() {
      for (let i = 0; i < terms.length; i++) {
        const isLast = i === terms.length - 1;
        await animateTerm(terms[i], isLast);
        if (!isLast) await sleep(300);
      }
    })();
  }

  // Substack RSS feed
  const substackGrid = document.getElementById("substack-articles");
  if (substackGrid) {
    const SUBSTACK_FEED = "https://indugadiraju.substack.com/feed";
    const loadingEl = document.getElementById("substack-loading");
    const errorEl = document.getElementById("substack-error");

    fetch(SUBSTACK_FEED)
      .then((res) => {
        if (!res.ok) throw new Error("Feed fetch failed");
        return res.text();
      })
      .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const items = doc.querySelectorAll("item");

        if (items.length === 0) {
          loadingEl.style.display = "none";
          errorEl.style.display = "block";
          return;
        }

        items.forEach((item) => {
          const title = item.querySelector("title")?.textContent || "Untitled";
          const link = item.querySelector("link")?.textContent || "#";
          const pubDate = item.querySelector("pubDate")?.textContent;
          const description =
            item.querySelector("description")?.textContent || "";

          // Strip HTML tags from description for a clean excerpt
          const tmp = document.createElement("div");
          tmp.innerHTML = description;
          const excerpt = tmp.textContent.trim().slice(0, 200);

          // Extract first image from description if available
          const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
          const imgSrc = imgMatch ? imgMatch[1] : null;

          const dateStr = pubDate
            ? new Date(pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "";

          const card = document.createElement("a");
          card.href = link;
          card.target = "_blank";
          card.rel = "noopener";
          card.className = "substack-card card";

          card.innerHTML =
            (imgSrc
              ? '<div class="substack-card-img"><img src="' +
                imgSrc +
                '" alt="" loading="lazy" /></div>'
              : "") +
            '<div class="substack-card-body">' +
            "<h3>" +
            title +
            "</h3>" +
            (dateStr ? '<p class="substack-date">' + dateStr + "</p>" : "") +
            (excerpt
              ? '<p class="substack-excerpt">' +
                excerpt +
                (excerpt.length >= 200 ? "&hellip;" : "") +
                "</p>"
              : "") +
            "</div>";

          substackGrid.appendChild(card);
        });

        loadingEl.style.display = "none";
      })
      .catch(() => {
        loadingEl.style.display = "none";
        errorEl.style.display = "block";
      });
  }

  // Film-strip drag-to-scroll (supports multiple strips)
  const filmstrips = document.querySelectorAll(".filmstrip-track");
  const lightbox = document.getElementById("filmstrip-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  filmstrips.forEach((filmstrip) => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    filmstrip.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      filmstrip.classList.add("dragging");
      startX = e.pageX - filmstrip.offsetLeft;
      scrollLeft = filmstrip.scrollLeft;
    });

    filmstrip.addEventListener("mouseleave", () => {
      isDown = false;
      filmstrip.classList.remove("dragging");
    });

    filmstrip.addEventListener("mouseup", () => {
      isDown = false;
      filmstrip.classList.remove("dragging");
    });

    filmstrip.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - filmstrip.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) hasDragged = true;
      filmstrip.scrollLeft = scrollLeft - walk;
    });

    if (lightbox) {
      filmstrip.querySelectorAll(".frame-image").forEach((frame) => {
        frame.addEventListener("click", () => {
          if (hasDragged) return;
          const src = frame.querySelector("img").src;
          lightboxImg.src = src;
          lightbox.classList.add("active");
        });
      });
    }
  });

  if (lightbox) {
    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
      }
    });
  }
});
