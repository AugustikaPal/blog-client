document.addEventListener("DOMContentLoaded", function () {
    // Fetch all user blogs
    fetchUserBlogs();

    // Handle logout button click
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('jwtToken');
            sessionStorage.removeItem('jwtToken');
            window.location.href = "signup.html";
        });
    }
});



function fetchUserBlogs() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('You must be logged in to view your blogs.');
        return;
    }

    fetch('http://localhost:8080/post/myblogs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            // Log the error response for debugging
            return response.text().then(text => {
                console.error('Error fetching user blogs:', text);
                throw new Error(`Error: ${response.status} - ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        const blogContainer = document.getElementById('my-blog-container');
        blogContainer.innerHTML = ''; // Clear the container first
        if (data.length > 0) {
            data.forEach(blog => {
                const blogEntry = createBlogEntry(blog);
                blogContainer.appendChild(blogEntry);
            });
        } else {
            blogContainer.innerHTML = '<p>No blogs found</p>';
        }
    })
    .catch(error => console.error('Error fetching user blogs:', error));
}




function createBlogEntry(blog) {
    const blogEntry = document.createElement('div');
    blogEntry.className = 'blog-entry';
    blogEntry.innerHTML = `
        <img src="${blog.imageUrls ? blog.imageUrls[0] : 'default-image.jpg'}" alt="${blog.title}">
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <div >
        <button onclick="viewBlog('${blog.id}')">View</button>
        <button onclick="editBlog('${blog.id}')">Edit</button>
        <button onclick="deleteBlog('${blog.id}')">Delete</button>
        <div>
    `;
    return blogEntry;
}


function viewBlog(blogId) {
    window.location.href = `view_blog.html?id=${blogId}`;
}

function editBlog(blogId) {
    // Redirect to an edit blog page (not implemented here)
    window.location.href = `edit_blog.html?id=${blogId}`;
}

function deleteBlog(blogId) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('You must be logged in to delete your blogs.');
        return;
    }

    if (confirm('Are you sure you want to delete this blog?')) {
        fetch(`http://localhost:8080/post/id/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Blog deleted successfully!');
                fetchUserBlogs(); // Refresh the blog list
            } else {
                alert('Failed to delete blog.');
            }
        })
        .catch(error => console.error('Error deleting blog:', error));
    }
}
