export const createPostContent = ( {id = '', content = '', images = [], imageUrls = []} = {}) => ({
    id,
    content,
    images: Array.isArray(images) ? images : [],
    imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
})