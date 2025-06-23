// const PostContent = {
//     id: '',
//     content: '',
//     images: []
// };

// export default PostContent

export const createPostContent = ( {id = '', content = '', images = []} = {}) => ({
    id,
    content,
    images: Array.isArray(images) ? images : [],
})