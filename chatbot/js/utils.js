// utils.js – helper utilities for MentalBot

// Simple DOM element creator
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') el.className = value;
    else if (key === 'style') Object.assign(el.style, value);
    else el.setAttribute(key, value);
  });
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  });
  return el;
}

// Fetch JSON with error handling
export async function fetchJson(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Network error: ${resp.status}`);
  return resp.json();
}

// Debounce function
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Simple logger (can be overridden)
export const log = console.log.bind(console);
