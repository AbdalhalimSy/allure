/**
 * Theme configuration with consistent colors across the application
 */

export const colors = {
  primary: {
    DEFAULT: '#c49a47',
    hover: '#b88833',
    light: '#e3c37b',
  },
  border: {
    light: 'border-gray-200',
    lightDashed: 'border-gray-200',
  },
  background: {
    card: 'bg-white',
    cardBorder: 'bg-white border border-gray-200',
    input: 'bg-white',
    hover: 'hover:bg-gray-50',
  },
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    label: 'text-gray-700',
  },
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 focus:border-[#c49a47]',
  },
  selected: {
    bg: 'bg-[#c49a47]/10',
    text: 'text-[#c49a47]',
  },
} as const;

export const classNames = {
  input: `px-3 py-2 border ${colors.border.light} rounded-lg ${colors.background.input} ${colors.text.primary} ${colors.focus.ring} transition-colors`,
  uploadZone: `border-2 border-dashed ${colors.border.lightDashed} rounded-lg p-6 hover:border-[#c49a47] transition-colors`,
  fileListItem: `flex items-center justify-between p-3 ${colors.background.cardBorder} rounded-lg`,
  label: `block text-sm font-medium ${colors.text.label}`,
  button: {
    primary: `bg-[#c49a47] text-white hover:bg-[#b88833] transition-all shadow-md shadow-[#c49a47]/30`,
    secondary: `${colors.text.primary} ${colors.background.hover} transition-colors`,
  },
} as const;
