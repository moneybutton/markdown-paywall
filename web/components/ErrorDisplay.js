import 'react'

/**
 * 
 */
export default function ErrorDisplay ({ error }) {
  return error !== null ? <p>{error}</p> : null
}
