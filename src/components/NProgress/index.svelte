<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'
  const { preloading, page, session } = stores()
  import styles from './style.module.css'
  import cx from 'classnames'
</script>

{#if $preloading}
  <div class={styles.np}>
    <div class={cx(styles.bar, styles.inner)}>
      <div class={styles.peg} />
    </div>
    <div class={styles.spinner}>
      <div class={styles.spinnerIcon} />
    </div>
  </div>
{/if}
