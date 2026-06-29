const WEDDING_CONFIG = {
  weddingDate: "2026-12-08T15:00:00+08:00",
  googleFormUrl: "https://forms.gle/REPLACE_WITH_YOUR_GOOGLE_FORM_LINK",
  googleFormFields: {
    name: "",
    pax: "",
  },
  guests: [
    { name: "Mitch Dee Tan", pax: 2 },
    { name: "Lyndon Las", pax: 1 },
    { name: "Christine Carlos", pax: 4 },
    { name: "Ohana Family", pax: 2 },
  ],
};

const form = document.querySelector("#rsvpPanel");
const guestInput = document.querySelector("#guestName");
const result = document.querySelector("#guestResult");
const googleFormLink = document.querySelector("#googleFormLink");
const music = document.querySelector("#weddingMusic");
const musicToggle = document.querySelector("#musicToggle");
const countdownDays = document.querySelector("#countdownDays");
const countdownHours = document.querySelector("#countdownHours");
const countdownMinutes = document.querySelector("#countdownMinutes");
const countdownSeconds = document.querySelector("#countdownSeconds");

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function findGuest(value) {
  const requestedName = normalizeName(value);
  return WEDDING_CONFIG.guests.find((guest) => normalizeName(guest.name) === requestedName);
}

function buildGoogleFormUrl(guestName, pax) {
  const url = new URL(WEDDING_CONFIG.googleFormUrl);
  const fields = WEDDING_CONFIG.googleFormFields;

  if (fields.name) {
    url.searchParams.set(fields.name, guestName);
  }

  if (fields.pax) {
    url.searchParams.set(fields.pax, String(pax));
  }

  return url.toString();
}

function updateGuestResult(guest) {
  if (!guest) {
    result.textContent =
      "We could not find that name yet. Please check the spelling or contact the couple.";
    googleFormLink.href = WEDDING_CONFIG.googleFormUrl;
    return;
  }

  result.textContent = `${guest.name}, we reserved ${guest.pax} pax for your invitation.`;
  googleFormLink.href = buildGoogleFormUrl(guest.name, guest.pax);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateGuestResult(findGuest(guestInput.value));
});

guestInput.addEventListener("input", () => {
  const guest = findGuest(guestInput.value);
  if (guest) {
    updateGuestResult(guest);
  }
});

googleFormLink.addEventListener("click", (event) => {
  if (!guestInput.value.trim()) {
    event.preventDefault();
    guestInput.focus();
    result.textContent = "Please enter your guest name first.";
    return;
  }

  const guest = findGuest(guestInput.value);
  updateGuestResult(guest);

  if (!guest) {
    event.preventDefault();
  }
});

musicToggle.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicToggle.classList.add("is-playing");
      musicToggle.setAttribute("aria-label", "Pause background music");
    } else {
      music.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-label", "Play background music");
    }
  } catch (error) {
    result.textContent = "Add your music file at assets/Wedding Music.mp3, then tap play again.";
  }
});

function updateCountdown() {
  const weddingTime = new Date(WEDDING_CONFIG.weddingDate).getTime();
  const remaining = weddingTime - Date.now();

  if (remaining <= 0) {
    countdownDays.textContent = "0";
    countdownHours.textContent = "0";
    countdownMinutes.textContent = "0";
    countdownSeconds.textContent = "0";
    return;
  }

  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const leftoverSeconds = seconds % 60;

  countdownDays.textContent = String(days);
  countdownHours.textContent = String(hours).padStart(2, "0");
  countdownMinutes.textContent = String(minutes).padStart(2, "0");
  countdownSeconds.textContent = String(leftoverSeconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
