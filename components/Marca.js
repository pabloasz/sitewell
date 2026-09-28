// Logotipo de Sitewell: un cubo isométrico (guiño al 3D).
// Usa el color del texto para el contorno y el acento de la marca para las aristas internas.
export default function Marca({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 2 28 9v14L16 30 4 23V9z" stroke="currentColor" />
      <path d="M4 9l12 7 12-7M16 16v14" stroke="var(--accent)" />
    </svg>
  );
}
