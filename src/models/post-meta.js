export const createPostMeta  = ({title = '', category = '', user ='', summary=''} = {}) => ({
    title, 
    category,
    user,
    summary,
    createDt : new Date().toISOString(),
    updateDt: null,
    year: new Date().getFullYear()
});
