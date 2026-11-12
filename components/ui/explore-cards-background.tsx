import React from 'react'
import Svg, { Path } from 'react-native-svg'

/**
 * Low-poly background behind the Explore grid (from assets/images/explore-cards-bg.svg).
 * Two palettes: the original dark teal one, and a soft emerald-tinted white one for light mode.
 * Same polygon index = same facet, so the pattern is identical in both modes.
 */
const DARK = ["#00242F", "#002531", "#002733", "#002834", "#002A36", "#002B38", "#002C3A", "#002E3C", "#012F3D", "#01313F", "#013241"]
const LIGHT = ["#E1EEEB", "#E3EFEC", "#E6F1EE", "#E7F2EF", "#EAF3F1", "#ECF4F2", "#EDF5F3", "#F0F7F6", "#F2F8F7", "#F5FAF9", "#F7FBFA"]

// [path, palette index]
const POLYS: [string, number][] = [
  ['M209.5 315L188.5 381L278 418L209.5 315Z', 1],
  ['M278 418L307 307L209.5 315L278 418Z', 7],
  ['M188.5 381L201.5 478L278 418L188.5 381Z', 6],
  ['M201.5 478L311 481L278 418L201.5 478Z', 3],
  ['M278 418L396.5 406L307 307L278 418Z', 10],
  ['M311 481L396.5 406L278 418L311 481Z', 9],
  ['M398.5 277L307 214V307L398.5 277Z', 10],
  ['M307 307V214L209.5 315L307 307Z', 3],
  ['M396.5 406L398.5 277L307 307L396.5 406Z', 7],
  ['M307 214L170.5 208L209.5 315L307 214Z', 9],
  ['M209.5 315L88 290L188.5 381L209.5 315Z', 10],
  ['M170.5 208L88 290L209.5 315L170.5 208Z', 8],
  ['M188.5 381L77 504L201.5 478L188.5 381Z', 6],
  ['M311 481L395.5 486L396.5 406L311 481Z', 7],
  ['M291 600L395.5 486L311 481L291 600Z', 10],
  ['M88 290L53 385L188.5 381L88 290Z', 7],
  ['M53 385L77 504L188.5 381L53 385Z', 1],
  ['M201.5 478L291 600L311 481L201.5 478Z', 3],
  ['M398.5 277V194L307 214L398.5 277Z', 2],
  ['M307 214L191.5 124L170.5 208L307 214Z', 1],
  ['M198.5 600H291L201.5 478L198.5 600Z', 7],
  ['M77 504L198.5 600L201.5 478L77 504Z', 7],
  ['M314 118L191.5 124L307 214L314 118Z', 7],
  ['M170.5 208L52 209L88 290L170.5 208Z', 7],
  ['M90 93L52 209L170.5 208L90 93Z', 10],
  ['M88 290L-44.5 303L53 385L88 290Z', 4],
  ['M398.5 194L314 118L307 214L398.5 194Z', 10],
  ['M291 600H411.5L395.5 486L291 600Z', 4],
  ['M52 209L-44.5 303L88 290L52 209Z', 9],
  ['M53 385L-61.5 490L77 504L53 385Z', 3],
  ['M77 504L61 600H198.5L77 504Z', 4],
  ['M-13.5 600H61L77 504L-13.5 600Z', 5],
  ['M398.5 194L424.5 113L314 118L398.5 194Z', 4],
  ['M-44.5 303L-60.5 403L53 385L-44.5 303Z', 4],
  ['M192.5 0L90 93L191.5 124L192.5 0Z', 7],
  ['M191.5 124L90 93L170.5 208L191.5 124Z', 2],
  ['M52 209L-54.5 194L-44.5 303L52 209Z', 7],
  ['M192.5 0L191.5 124L314 118L192.5 0Z', 4],
  ['M-60.5 403L-61.5 490L53 385L-60.5 403Z', 2],
  ['M-51.5 93L-54.5 194L52 209L-51.5 93Z', 10],
  ['M-61.5 490L-13.5 600L77 504L-61.5 490Z', 0],
  ['M308 0H192.5L314 118L308 0Z', 2],
  ['M90 93H-51.5L52 209L90 93Z', 1],
  ['M391.5 0L314 118L424.5 113L391.5 0Z', 6],
  ['M391.5 0H308L314 118L391.5 0Z', 9],
  ['M192.5 0H81L90 93L192.5 0Z', 10],
  ['M-31.5 0L-51.5 93H90L-31.5 0Z', 10],
  ['M81 0H-31.5L90 93L81 0Z', 10],
]

export const ExploreCardsBackground = React.memo(function ExploreCardsBackground({
  isDark,
}: {
  isDark: boolean
}) {
  const palette = isDark ? DARK : LIGHT
  return (
    <Svg
      width='100%'
      height='100%'
      viewBox='0 0 375 515'
      preserveAspectRatio='xMidYMid slice'
      fill='none'
      pointerEvents='none'
    >
      {POLYS.map(([d, c], i) => (
        <Path key={i} d={d} fill={palette[c]} stroke={palette[c]} strokeLinejoin='bevel' />
      ))}
    </Svg>
  )
})
