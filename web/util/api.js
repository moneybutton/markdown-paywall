
/**
 *
 */
const API_URL = process.env.API_URL

/**
 *
 */
export async function getUser () {
  let user = null, error = null
  try {
    const res = await fetch(
      `${API_URL}/whoami`,
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    const json = await res.json()
    if (json.data !== undefined) {
      user = json.data
    } else if (json.error !== undefined) {
      error = json.error
    }
  } catch (err) {
    console.error(err)
    error = 'Unexpected network error.'
  }
  if (error !== null) {
    throw new Error(error)
  }
  return user
}

/**
 *
 */
export async function updateUser (id, attributes) {
  let user = null, error = null
  try {
    const res = await fetch(
      `${API_URL}/users/${id}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attributes)
      }
    )
    const json = await res.json()
    if (json.data !== undefined) {
      user = json.data
    } else if (json.error !== undefined) {
      error = json.error
    }
  } catch (err) {
    console.error(err)
    error = 'Unexpected network error.'
  }
  if (error !== null) {
    throw new Error(error)
  }
  return user
}

/**
 *
 */
export async function createPost (attributes) {
  let post = null, error = null
  try {
    const res = await fetch(
      `${API_URL}/posts`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attributes)
      }
    )
    const json = await res.json()
    if (json.data !== undefined) {
      post = json.data
    } else if (json.error !== undefined) {
      error = json.error
    }
  } catch (err) {
    console.error(err)
    error = 'Unexpected network error.'
  }
  if (error !== null) {
    throw new Error(error)
  }
  return post
}

/**
 *
 */
export async function getPost (postId) {
  let post = null, author = null, error = null
  try {
    const res = await fetch(
      `${API_URL}/posts/${postId}`,
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    const json = await res.json()
    if (json.data !== undefined) {
      post = json.data
      if (json.included !== undefined) {
        author = json.included
      }
    } else if (json.error !== undefined) {
      error = json.error
    }
  } catch (err) {
    console.error(err)
    error = 'Unexpected network error.'
  }
  if (error !== null) {
    throw new Error(error)
  }
  return { post, author }
}

/**
 *
 */
export async function getPosts () {
  let posts = null, authors = null, error = null
  try {
    const res = await fetch(
      `${API_URL}/posts`,
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    const json = await res.json()
    if (json.data !== undefined) {
      posts = json.data
      if (json.included !== undefined) {
        authors = json.included
      }
    } else if (json.error !== undefined) {
      error = json.error
    }
  } catch (err) {
    console.error(err)
    error = 'Unexpected network error.'
  }
  if (error !== null) {
    throw new Error(error)
  }
  return { posts, authors }
}
