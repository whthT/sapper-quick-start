<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'
  const { preloading, page, session } = stores()
</script>

<style>
  @keyframes nprogressMove {
    from {
      transform: translate3d(-100%, 0px, 0px);
    }
    to {
      transform: translate3d(100%, 0px, 0px);
    }
  }
  .nprogress {
    animation: nprogressMove 3s infinite;
  }
</style>

{#if $preloading}
  <div id="nprogress">
    <div class="bar nprogress">
      <div class="peg" />
    </div>
    <div class="spinner">
      <div class="spinner-icon" />
    </div>
  </div>
{/if}
