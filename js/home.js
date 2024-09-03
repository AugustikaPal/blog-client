

document.addEventListener("DOMContentLoaded", function () {
    // Fetch all blogs
    fetchBlogs();

    // Handle blog creation form submission
    const blogForm = document.getElementById('blogForm');
    blogForm.addEventListener('submit', function (e) {
        e.preventDefault();
        createBlog();
    });

    // Handle logout button click
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Remove JWT token from local storage or cookies
             // Assuming you're storing the JWT in localStorage
            localStorage.removeItem('jwtToken');
            sessionStorage.removeItem('jwtToken');
            // Redirect to signup page
            window.location.href = "signup.html";
        });
    }
});

function fetchBlogs() {
    fetch('https://blog-server-production-4e9b.up.railway.app/post/allblog')
        .then(response => response.json())
        .then(blogs => {
            const blogContainer = document.getElementById('blog-container');
            blogContainer.innerHTML = ''; // Clear the container before adding blogs
            if (blogs.length === 0) {
                blogContainer.innerHTML = '<p>No blogs available.</p>';
            } else {
                blogs.forEach(blog => {
                    const blogEntry = createBlogEntry(blog);
                    blogContainer.appendChild(blogEntry);
                });
            }
        })
        .catch(error => console.error('Error fetching blogs:', error));
}

function displayUserName() {
    const token = localStorage.getItem('jwtToken');
    if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userName = payload.userName || 'User';
        
        const heroContent = document.querySelector('.hero-content h2');
        heroContent.textContent = `Welcome, ${userName}`;
        console.log(`{userName}`);
    } else {
        console.error('Invalid JWT token format.');
        window.location.href = "login.html"; // Redirect if the token is not valid
    }
}

function createBlogEntry(blog) {
    const blogEntry = document.createElement('div');
    blogEntry.className = 'blog-entry';
    blogEntry.innerHTML = `
        <img src="${blog.imageUrls ? blog.imageUrls[0] : 'default-image.jpg'}" alt="${blog.title}">
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <button onclick="viewBlog('${blog.id}')">View Blog</button>
    `;
    return blogEntry;
}




function createBlog() {
    const formData = new FormData(document.getElementById('blogForm'));
    const token= localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

    if (token && token.split('.').length === 3) {
        console.log('Valid JWT token format.');
    } else {
        console.error('Invalid JWT token format.');
        alert('Invalid JWT token. Please log in again.');
        return; // Prevent the request from being sent
    }
    fetch('https://blog-server-production-4e9b.up.railway.app/post/create', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
    })
    .then(newBlog => {
        alert('Blog created successfully!');
        const blogContainer = document.getElementById('blog-container');
        const blogEntry = createBlogEntry(newBlog);
        blogContainer.insertBefore(blogEntry, blogContainer.firstChild);
        document.getElementById('blogForm').reset();
    })
    .catch(error => {
        console.error('Error creating blog:', error);
        alert('Error creating blog: ' + error.message);
    });
}

function viewBlog(blogId) {
    window.location.href = `view_blog.html?id=${blogId}`;
}
// Dialog box functions
function showDialog(message) {
    const dialogBox = document.getElementById('dialogBox');
    const dialogMessage = document.getElementById('dialogMessage');
    dialogMessage.textContent = message;
    dialogBox.style.display = 'flex';
}
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.style.display = 'block';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 3000); // Hide after 3 seconds
}


