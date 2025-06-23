export const createPostMeta  = ({title = '', category = '', user =''} = {}) => ({
    title, 
    category,
    user,
    createDt : new Date().toISOString(),
    updateDt: null,
    year: new Date().getFullYear()
});
