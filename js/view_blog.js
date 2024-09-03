
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    const userName = localStorage.getItem('userName');
    

    fetch(`http://localhost:8080/post/id/${blogId}`)
        .then(response => response.json())
        .then(blog => {
            document.getElementById('blog-title').innerText = blog.title;
            document.getElementById('blog-image').src = blog.imageUrls.length > 0 ? blog.imageUrls[0] : 'default-image.jpg';
            document.getElementById('blog-text').innerText = blog.content;

            let likeCount = blog.likes || 0;
            document.getElementById('like-count').innerText = `${likeCount} Like${likeCount === 1 ? '' : 's'}`;
            let hasLiked = blog.likedByUsers.includes(userName);

            const likeButton = document.getElementById('like-button');
            likeButton.classList.toggle('liked', hasLiked);
            likeButton.addEventListener('click', function () {
                hasLiked = !hasLiked;
                likeCount += hasLiked ? 1 : -1;
                document.getElementById('like-count').innerText = `${likeCount} Like${likeCount === 1 ? '' : 's'}`;
                likeButton.classList.toggle('liked', hasLiked);

                fetch(`http://localhost:8080/post/like/${blogId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ liked: hasLiked })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error ${hasLiked ? 'liking' : 'unliking'} the blog`);
                    }
                })
                .catch(error => console.error('Error updating like status:', error));
            });
           
        })
        .catch(error => console.error('Error fetching blog:', error));


});


