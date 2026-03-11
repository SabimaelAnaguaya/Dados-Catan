<script>
  import Board from "./components/Board/Board.svelte";
  import DiceRoller from "./components/DiceRoller.svelte";
  import BuildPanel from "./components/BuildPanel.svelte";

  let nodes;
  let edges;
</script>

<Board bind:nodes bind:edges />

<BuildPanel {nodes} {edges} />

<DiceRoller />
