<script>
  import cx from 'classnames'
  import NProgress from '../components/NProgress'
  import Nav from '../components/Nav'
  import global from '../styles/global.css'

  export let segment
</script>

<NProgress />
<Nav {segment} />
<main class={cx(global.container)}>
  <slot />
</main>
