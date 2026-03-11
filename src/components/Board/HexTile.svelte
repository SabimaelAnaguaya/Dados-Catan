<script>
  export let hex;

  const size = 130; // tamaño del hexágono
  const centerX = 400;
  const centerY = 400;

  // Conversión axial → pixel
  const x = centerX + size * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r);
  const y = centerY + size * (3/2 * hex.r);

  // Puntos del hexágono
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    return `${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`;
  }).join(" ");
</script>

<polygon 
  points={points} 
  fill="#e0c48c" 
  stroke="#8b6f47" 
  stroke-width="3"
/>
