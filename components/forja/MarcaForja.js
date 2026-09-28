// Logotipo de FORJA: un disco de pesas visto de frente, con la barra
// asomando a los lados. Mismo espíritu que components/Marca.js (línea
// simple), pero con la identidad propia de este proyecto.
export default function MarcaForja({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth="2.4"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 16h6M24 16h6" stroke="currentColor" />
      <circle cx="16" cy="16" r="11.5" stroke="currentColor" />
      <circle cx="16" cy="16" r="4.2" stroke="var(--f-accent)" />
    </svg>
  );
}
