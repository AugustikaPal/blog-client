document.addEventListener("DOMContentLoaded", function () {
    const blogId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('jwtToken');

    if (!blogId || !token) {
        alert('Invalid access. Please log in.');
        window.location.href = 'myblogs.html';
    }

    // Fetch the blog details and populate the form
    fetch(`https://blog-server-production-4e9b.up.railway.app/post/id/${blogId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(blog => {
        document.getElementById('title').value = blog.title;
        document.getElementById('content').value = blog.content;
        // Image handling if necessary
        document.getElementById('image').src = blog.imageUrls[0];

    })
    .catch(error => console.error('Error fetching blog details:', error));

    // Handle form submission for updating the blog
    const editBlogForm = document.getElementById('editBlogForm');
    editBlogForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('content', document.getElementById('content').value);
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('files', imageFile);
        }

        fetch(`https://blog-server-production-4e9b.up.railway.app/post/id/${blogId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
    
               .then(response => {
            return response.json().then(data => { // Handle the response correctly
                if (response.ok) {
                    alert('Blog updated successfully!');
                    window.location.href = 'myblogs.html';
                } else {
                    console.error('Failed to update blog:', data);
                    alert('Failed to update blog: ' + (data.message || 'Unknown error'));
                }
            });
        })
        .catch(error => console.error('Error updating blog:', error));
    });
});
