import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'headphones',
    name: 'Wireless Headphones',
    price: 89.99,
    image: 'https://picsum.photos/seed/headphones/200',
    description: 'Noise-cancelling over-ear headphones with 30h battery life.',
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch Pro',
    price: 149.0,
    image: 'https://picsum.photos/seed/smartwatch/200',
    description: 'Fitness tracker with heart rate, GPS, and AMOLED display.',
  },
  {
    id: 'laptop-stand',
    name: 'Aluminum Laptop Stand',
    price: 39.5,
    image: 'https://picsum.photos/seed/laptop-stand/200',
    description: 'Ergonomic adjustable stand fits 11" to 17" laptops.',
  },
  {
    id: 'keyboard',
    name: 'Mechanical Keyboard',
    price: 129.9,
    image: 'https://picsum.photos/seed/keyboard/200',
    description: 'Hot-swappable 75% mechanical keyboard, RGB, USB-C.',
  },
  {
    id: 'usb-hub',
    name: '7-in-1 USB-C Hub',
    price: 45.0,
    image: 'https://picsum.photos/seed/usb-hub/200',
    description: 'HDMI 4K, 100W PD, SD/microSD, and 3× USB-A 3.0 ports.',
  },
  {
    id: 'webcam',
    name: '1080p Streaming Webcam',
    price: 59.9,
    image: 'https://picsum.photos/seed/webcam/200',
    description: 'Autofocus 1080p webcam with dual noise-reduction mics.',
  },
];
