'use client'

// React Imports
import { forwardRef } from 'react'

// Next Imports
import Link from 'next/link'
import type { LinkProps } from 'next/link'

// Type Imports
import type { ChildrenType } from '../types'

type RouterLinkProps = LinkProps &
  Partial<ChildrenType> & {
    className?: string
  }

export const RouterLink = forwardRef((props: RouterLinkProps, ref: any) => {
  // Props
  const { className, ...other } = props

  return (
    <Link ref={ref} className={className} {...other}>
      {props.children}
    </Link>
  )
})
