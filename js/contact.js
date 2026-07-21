/**
 * contact.js
 * Handles the contact form on a static host (e.g. GitHub Pages) — no PHP needed.
 *   1. "Send Email" -> sends via EmailJS (client-side email API)
 *   2. "Send on WhatsApp" -> opens WhatsApp with the message pre-filled
 *
 * SETUP (one-time, ~5 minutes):
 *   1. Create a free account at https://www.emailjs.com
 *   2. Email Services -> Add Service -> connect it to yash99227744@gmail.com
 *   3. Email Templates -> create one using variables: from_name, from_email, message
 *   4. Copy your Public Key, Service ID and Template ID from the EmailJS dashboard
 *   5. Paste them into the CONFIG block below
 *
 * Until configured, the email button falls back to opening the visitor's own
 * email app with your address pre-filled, so the form never breaks.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------ */
  /* CONFIG — fill these in from your EmailJS dashboard                  */
  /* ------------------------------------------------------------------ */
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

  const OWNER_EMAIL = "yash99227744@gmail.com";
  const WHATSAPP_NUMBER = "917290971368"; // international format, no "+", no spaces

  const isEmailJsConfigured =
    EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
    EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID";

  if (isEmailJsConfigured && window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* ------------------------------------------------------------------ */
  /* Elements                                                             */
  /* ------------------------------------------------------------------ */
  const form = document.getElementById("contact-form");
  if (!form) return; // no contact form on this page

  const status = document.getElementById("form-status");
  const whatsappBtn = document.getElementById("whatsapp-send");
  const submitBtn = form.querySelector('button[type="submit"]');

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */
  function getFormValues() {
    return {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      honeypot: form.website ? form.website.value.trim() : "",
    };
  }

  function validate({ name, email, message }) {
    if (!name || !email || !message) return "Please fill in all fields.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return "Please enter a valid email address.";
    if (message.length < 10) return "Your message is a little short — tell me a bit more.";
    return null;
  }

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = "form-status" + (type ? ` ${type}` : "");
  }

  /* ------------------------------------------------------------------ */
  /* Send Email (EmailJS, with mailto fallback)                          */
  /* ------------------------------------------------------------------ */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const values = getFormValues();

    if (values.honeypot) return; // likely a bot, silently ignore

    const errorMsg = validate(values);
    if (errorMsg) {
      setStatus(errorMsg, "error");
      return;
    }

    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";
    setStatus("", "");

    if (isEmailJsConfigured && window.emailjs) {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: values.name,
          from_email: values.email,
          message: values.message,
          to_email: OWNER_EMAIL,
        });
        setStatus(`Thanks, ${values.name} — your message has been sent.`, "success");
        form.reset();
      } catch (err) {
        setStatus(
          "Could not send right now — try the WhatsApp button instead, or email me directly.",
          "error"
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    } else {
      // EmailJS not configured yet — open the visitor's own email app instead.
      const subject = encodeURIComponent(`New message from ${values.name}`);
      const body = encodeURIComponent(
        `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
      );
      window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("Opening your email app...", "success");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });

  /* ------------------------------------------------------------------ */
  /* Send on WhatsApp                                                     */
  /* ------------------------------------------------------------------ */
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      const values = getFormValues();
      if (values.honeypot) return;

      const errorMsg = validate(values);
      if (errorMsg) {
        setStatus(errorMsg, "error");
        return;
      }

      const text = encodeURIComponent(
        `Hi Yash, I'm ${values.name} (${values.email}).\n\n${values.message}`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
      setStatus("Opening WhatsApp...", "success");
    });
  }
});
