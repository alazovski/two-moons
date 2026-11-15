import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.ts'

// Warm night: dark umber, lamp-amber accent, moonlight-cream text.
const { theme, problems } = makeColors({
  label: 'Two moons',
  only: 'dark',
  roles: { accent: '#e3a15a', danger: '#d4645a', success: '#9cb37c', warning: '#e6bb5c', pro: '#c08fb8' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#17100e',
        'surface-1': '#1e1613',
        'surface-2': '#251b17',
        'surface-3': '#2a201b',
        'text-primary': '#f3e7d3',
        'text-secondary': '#d6c5ad',
        'text-muted': '#aa9a84',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'two-moons', glass: { blur: 16, tint: '#17100e', opacity: 0.68 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'two-moons') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Two moons over a quiet Tokyo street: a coffee house, a glowing vending machine and a cat on a wall" isInteractive />
  })
}
