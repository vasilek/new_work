export default (post) => {
  return {
    comment: post.comment,
    author: post.author,
    number: post.number
  }
}