/**
 * CaRide survey — relay function
 * -------------------------------
 * This file runs on NETLIFY'S OWN COMPUTERS, not on the respondent's laptop
 * or phone. That's the whole point of it: the respondent's browser only
 * ever talks to your own site (which the university allows), and THIS
 * program is the one that talks to Google (which the university may block).
 * Networks that block Google never even see that second conversation happen.
 *
 * You do not need to understand the code below. You only need to update
 * the one line marked "PASTE YOUR GOOGLE SCRIPT URL HERE" if you ever
 * re-deploy your Google Apps Script and get a new address.
 */

// PASTE YOUR GOOGLE SCRIPT URL HERE (the same one you put in index.html):
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywTb5OXQlPYPYsnEphqPsc4IHzdY3s6iqWbIXmfXANnYOXLRpRU8RK91s9YgyW49eJYg/exec";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  try {
    const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: event.body
    });
    // Google's script always replies (even if it hits an internal error),
    // so if we got this far, the data reached your Sheet's mailbox.
    await googleResponse.text().catch(() => {});
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    // This only happens if Netlify itself couldn't reach Google — rare,
    // and unrelated to any university network, since this code runs on
    // Netlify's servers, not the respondent's device.
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(err) })
    };
  }
};
