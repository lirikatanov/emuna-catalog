(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyBEamvBVE1cQedNFkGgL7pcFnQFSs9tyv8",
    authDomain: "emuna-reviews.firebaseapp.com",
    projectId: "emuna-reviews",
    storageBucket: "emuna-reviews.firebasestorage.app",
    messagingSenderId: "674453993828",
    appId: "1:674453993828:web:15c3beec83cf514476a271"
  };

  if (!window.firebase) return;

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const reviewsCol = db.collection("reviews");

  const form = document.getElementById("reviewForm");
  const nameInput = document.getElementById("rv-name");
  const textInput = document.getElementById("rv-text");
  const starsWrap = document.getElementById("reviewStars");
  const stars = starsWrap ? Array.from(starsWrap.querySelectorAll(".star")) : [];
  const msg = document.getElementById("reviewMsg");
  const charCount = document.getElementById("reviewCharCount");
  const list = document.getElementById("reviewsList");
  const emptyMsg = document.getElementById("reviewsEmpty");

  let rating = 0;

  function paintStars(value) {
    stars.forEach((s) => {
      s.classList.toggle("active", Number(s.dataset.value) <= value);
    });
  }

  stars.forEach((s) => {
    s.addEventListener("click", () => {
      rating = Number(s.dataset.value);
      paintStars(rating);
    });
    s.addEventListener("mouseenter", () => paintStars(Number(s.dataset.value)));
  });
  if (starsWrap) {
    starsWrap.addEventListener("mouseleave", () => paintStars(rating));
  }

  if (textInput && charCount) {
    const updateCount = () => {
      charCount.textContent = textInput.value.length + "/70";
    };
    textInput.addEventListener("input", updateCount);
    updateCount();
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderReview(data) {
    const el = document.createElement("div");
    el.className = "review-card";
    const rating = Math.min(5, Math.max(1, Number(data.rating) || 0));
    const filled = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    el.innerHTML =
      '<div class="review-card-stars">' + filled + empty + "</div>" +
      '<p class="review-card-text">' + escapeHTML(data.text || "") + "</p>" +
      '<p class="review-card-name">' + escapeHTML(data.name || "") + "</p>";
    return el;
  }

  if (list) {
    reviewsCol
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot(
        (snap) => {
          list.innerHTML = "";
          if (snap.empty) {
            if (emptyMsg) list.appendChild(emptyMsg);
            return;
          }
          snap.forEach((doc) => {
            list.appendChild(renderReview(doc.data()));
          });
        },
        (err) => {
          console.error("reviews load error", err);
        }
      );
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      if (!name || !text || !rating) {
        msg.textContent = "נא למלא שם, דירוג וחוויה קצרה";
        msg.className = "form-msg error";
        return;
      }
      if (text.length > 70) {
        msg.textContent = "הביקורת ארוכה מדי (עד 70 תווים)";
        msg.className = "form-msg error";
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      try {
        await reviewsCol.add({
          name: name.slice(0, 30),
          text: text.slice(0, 70),
          rating,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        form.reset();
        rating = 0;
        paintStars(0);
        charCount.textContent = "0/70";
        msg.textContent = "תודה! הביקורת פורסמה.";
        msg.className = "form-msg success";
      } catch (err) {
        console.error(err);
        msg.textContent = "משהו השתבש, נסו שוב.";
        msg.className = "form-msg error";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
