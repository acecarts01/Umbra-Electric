'use client';
import { useCallback, useEffect, useState } from 'react';

const CART_KEY = 'mm-cart';
const CHANGE_EVENT = 'umbra-cart-change';

export function readCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addToCart(slug, name, price, qty = 1) {
  const cart = readCart();
  const existing = cart.find((i) => i.slug === slug);
  if (existing) existing.q += qty;
  else cart.push({ slug, name, price, q: qty });
  writeCart(cart);
}

export function incItem(slug) {
  const cart = readCart();
  const item = cart.find((i) => i.slug === slug);
  if (item) item.q += 1;
  writeCart(cart);
}

export function decItem(slug) {
  let cart = readCart();
  const item = cart.find((i) => i.slug === slug);
  if (item) {
    item.q -= 1;
    if (item.q <= 0) cart = cart.filter((i) => i.slug !== slug);
  }
  writeCart(cart);
}

export function removeItem(slug) {
  writeCart(readCart().filter((i) => i.slug !== slug));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(readCart());
    const onChange = () => setCart(readCart());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  return cart;
}

export function useCartCount() {
  const cart = useCart();
  return cart.reduce((a, i) => a + i.q, 0);
}
