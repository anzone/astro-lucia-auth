import { addDynamicIconSelectors } from '@iconify/tailwind'
import tailwindForms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['clamp(0.56rem, 0.13vw + 0.53rem, 0.63rem)', { lineHeight: '1rem' }],
        sm: ['clamp(0.7rem, 0.26vw + 0.63rem, 0.84rem)', { lineHeight: '1.25rem' }],
        base: ['clamp(0.88rem, 0.45vw + 0.76rem, 1.13rem)', { lineHeight: '1.5rem' }],
        lg: ['clamp(1.09rem, 0.74vw + 0.91rem, 1.5rem)', { lineHeight: '1.75rem' }],
        xl: ['clamp(1.37rem, 1.15vw + 1.08rem, 2rem)', { lineHeight: '1.75rem' }],
        '2xl': ['clamp(1.71rem, 1.74vw + 1.27rem, 2.66rem)', { lineHeight: '2rem' }],
        '3xl': ['clamp(2.14rem, 2.57vw + 1.49rem, 3.55rem)', { lineHeight: '2.25rem' }],
        '4xl': ['clamp(2.67rem, 3.75vw + 1.73rem, 4.73rem)', { lineHeight: '2.5rem' }],
        '5xl': ['clamp(3.34rem, 5.41vw + 1.99rem, 6.31rem)', { lineHeight: '1' }],
        '6xl': ['clamp(4.17rem, 7.71vw + 2.24rem, 8.41rem)', { lineHeight: '1' }],
        '7xl': ['clamp(5.22rem, 10.91vw + 2.49rem, 11.21rem)', { lineHeight: '1' }],
        '8xl': ['clamp(6.52rem, 15.33vw + 2.69rem, 14.95rem)', { lineHeight: '1' }],
        '9xl': ['clamp(8.15rem, 21.42vw + 2.8rem, 19.93rem)', { lineHeight: '1' }],
      }
    },
  },
  plugins: [
    tailwindForms(),
    addDynamicIconSelectors(),
  ],
}
