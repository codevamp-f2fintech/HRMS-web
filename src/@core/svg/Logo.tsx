// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg width='1.2658em' height='1em' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      {/* "F" character */}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 10 H40 V20 H20 V40 H40 V50 H20 V90 H10 V50 H0 V40 H10 V20 H0 V10 Z'
        fill='currentColor'
      />
      {/* "2" character */}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M60 10 H80 A10 10 0 0 1 90 20 V40 A10 10 0 0 1 80 50 H70 A10 10 0 0 0 60 60 V90 H50 V60 A10 10 0 0 1 60 50 H70 A10 10 0 0 0 80 40 V20 A10 10 0 0 0 70 10 Z'
        fill='currentColor'
      />
      {/* Shadows for "F" and "2" */}
      <path
        opacity='0.077704'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 10 H40 V20 H20 V40 H40 V50 H20 V90 H10 V50 H0 V40 H10 V20 H0 V10 Z'
        fill='black'
      />
      <path
        opacity='0.077704'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M60 10 H80 A10 10 0 0 1 90 20 V40 A10 10 0 0 1 80 50 H70 A10 10 0 0 0 60 60 V90 H50 V60 A10 10 0 0 1 60 50 H70 A10 10 0 0 0 80 40 V20 A10 10 0 0 0 70 10 Z'
        fill='black'
      />
    </svg>
  )
}

export default Logo
