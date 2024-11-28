const $ = cheerio.load(html);
console.log('Classes trouvées:', {
    followers: $('[data-testid="user-followers"]').text(),
    rating: $('[data-testid="user-rating"]').text(),
    items: $('[data-testid="user-items"]').text()
});
