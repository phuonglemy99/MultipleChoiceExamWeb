const btnSearch = document.getElementById('btnSearch');
const txtSearch = document.getElementById('search')

btnSearch.addEventListener('click', (req, res) => {
    console.log('hihihi');
    window.location.replace('/search?title=' + txtSearch.value );
});