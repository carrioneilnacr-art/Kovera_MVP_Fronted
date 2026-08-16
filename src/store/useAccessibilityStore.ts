import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityState {
  highContrast: boolean;
  fontSize: FontSize;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetAccessibility: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      highContrast: false,
      fontSize: 'normal',
      toggleHighContrast: () => {
        const hc = !get().highContrast;
        set({ highContrast: hc });
        applyAccessibility(hc, get().fontSize);
      },
      increaseFontSize: () => {
        const sizes: FontSize[] = ['normal', 'large', 'xlarge'];
        const current = get().fontSize;
        const next = sizes[Math.min(sizes.indexOf(current) + 1, sizes.length - 1)];
        set({ fontSize: next });
        applyAccessibility(get().highContrast, next);
      },
      decreaseFontSize: () => {
        const sizes: FontSize[] = ['normal', 'large', 'xlarge'];
        const current = get().fontSize;
        const prev = sizes[Math.max(sizes.indexOf(current) - 1, 0)];
        set({ fontSize: prev });
        applyAccessibility(get().highContrast, prev);
      },
      resetAccessibility: () => {
        set({ highContrast: false, fontSize: 'normal' });
        applyAccessibility(false, 'normal');
      },
    }),
    { name: 'kovera-accessibility' }
  )
);

function applyAccessibility(highContrast: boolean, fontSize: FontSize) {
  const html = document.documentElement;
  // High contrast
  if (highContrast) {
    html.classList.add('high-contrast');
  } else {
    html.classList.remove('high-contrast');
  }
  // Font size
  html.classList.remove('font-large', 'font-xlarge');
  if (fontSize === 'large') html.classList.add('font-large');
  if (fontSize === 'xlarge') html.classList.add('font-xlarge');
}

// Aplicar al cargar
export function initAccessibility() {
  const state = useAccessibilityStore.getState();
  applyAccessibility(state.highContrast, state.fontSize);
}
