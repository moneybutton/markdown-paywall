import 'react'

/**
 * 
 */
export default function Loading ({ loading }) {
  if (!loading) {
    return null
  }
  return (
    <div>
      <p>Loading ...</p>
    </div>
  )
}
