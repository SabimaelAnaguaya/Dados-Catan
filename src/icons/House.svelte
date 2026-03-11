<script >
  export let size = 75;
  export let style = "";
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 192 192" 
  stroke="currentColor"
  style={style}
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Paredes (siempre blancas) -->
  <path 
    d="M13.5854 122.866V62.8664L55.5854 36.3664L175.085 58.3664V122.866L78.0854 160.866L55.5854 147.866V103.866L29.5854 90.8664V134.366L13.5854 122.866Z" 
    fill="white"
    stroke="currentColor"
    stroke-width="5"
  />

  <!-- Techo (cambia de color) -->
  <path 
    d="M100.585 98.8664L187.085 70.3664L135.085 2.86639L55.5854 25.3664L3.58539 61.8664L7.08539 66.3664L55.5854 35.8664L100.585 98.8664Z"
    fill="currentColor"
    stroke="currentColor"
    stroke-width="5"
  />
</svg>
