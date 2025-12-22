## Packages
recharts | Visualization for expense breakdown (Pie charts)
framer-motion | Smooth animations for page transitions and layout changes
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}
API uses 'numeric' type for money, so frontend must handle string-to-number conversion for charts.
