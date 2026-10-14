/**
 * Block menu icon.
 */
export function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M6.5 8.5h4" />
      <path d="M6.5 11.5h9" />
      <rect x="6.5" y="14" width="6" height="3" rx="1.5" />
    </svg>
  );
}

export default Icon;
