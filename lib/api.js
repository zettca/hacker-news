const axios = require('axios');

const apiBase = 'https://hacker-news.firebaseio.com/v0/';

const items = {};
const stories = { top: null, new: null, best: null };

const getCat = (cat) => Object.keys(stories).includes(cat) && cat || 'top';

function slicePage(list, page) {
    page = Number(page);
    const NUM_PER_PAGE = 10;
    return list.slice(page * NUM_PER_PAGE, (page + 1) * NUM_PER_PAGE);
}

function fetchItem(itemId) {
    const url = `${apiBase}item/${itemId}.json`;
    return (items[itemId])
        ? Promise.resolve(items[itemId])
        : axios.get(url).then(res => {
            items[itemId] = res.data;
            return Promise.resolve(res.data);
        });
}

function fetchStories(cat) {
    const url = `${apiBase}${cat}stories.json`;
    return (stories[cat])
        ? Promise.resolve(stories[cat])
        : axios.get(url).then(res => {
            stories[cat] = res.data;
            return Promise.resolve(res.data);
        });
}

function fetchAllComments(comments = []) {
    return Promise.all(comments.map(id => fetchItem(id)));
}

module.exports = {
    getItem: (req, res) => {
        const itemId = req.params.id;

        fetchItem(itemId).then(item => {
            res.json(item);
        });
    },
    getStories: (req, res) => {
        const cat = getCat(req.params.cat), page = req.params.page;

        fetchStories(cat, page).then(storiesIds => {
            Promise.all(slicePage(storiesIds, page).map((id => fetchItem(id))))
                .then(stories => res.json(stories));
        });
    },
    getComments: (req, res) => {
        const id = req.params.id;

        fetchItem(id)
            .then(item => fetchAllComments(item.kids))
            .then(comments => res.json(comments))
            .catch(err => console.log(err));
    }
};
