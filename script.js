document.addEventListener("DOMContentLoaded", () => {
    // Auth DOM Elements
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const authContainer = document.getElementById("auth-container");
    const mainApp = document.getElementById("main-app");
    
    const goToSignup = document.getElementById("go-to-signup");
    const goToLogin = document.getElementById("go-to-login");
    
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginError = document.getElementById("login-error");
    const signupSuccess = document.getElementById("signup-success");
    
    const userDisplayInfo = document.getElementById("user-display-name");
    const logoutBtn = document.getElementById("logout-btn");

    // Post DOM Elements
    const createPostForm = document.getElementById("create-post-form");
    const postTextInput = document.getElementById("post-text");
    const postImageInput = document.getElementById("post-image");
    const imagePreviewContainer = document.getElementById("image-preview-container");
    const imagePreview = document.getElementById("image-preview");
    const postsFeed = document.getElementById("posts-feed");

    let currentLoggedInUser = localStorage.getItem("loggedInUser") || null;
    let imageBase64Data = ""; 

    // ---- Check Existing Login State ----
    if (currentLoggedInUser) {
        showMainApp(currentLoggedInUser);
    }

    // ---- Toggle Pages Navigation ----
    goToSignup.addEventListener("click", () => {
        loginSection.classList.add("hidden");
        signupSection.classList.remove("hidden");
        loginError.textContent = "";
    });

    goToLogin.addEventListener("click", () => {
        signupSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        signupSuccess.textContent = "";
    });

    // ---- Signup Action ----
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("signup-username").value.trim();
        const pass = document.getElementById("signup-password").value;

        let users = JSON.parse(localStorage.getItem("users")) || {};

        if (users[user]) {
            signupSuccess.style.color = "#ff0055";
            signupSuccess.textContent = "Username setup duplicate! Try another.";
        } else {
            users[user] = pass; 
            localStorage.setItem("users", JSON.stringify(users));
            signupSuccess.style.color = "#00b300";
            signupSuccess.textContent = "Successfully Registered! Go Login.";
            signupForm.reset();
        }
    });

    // ---- Login Action Verification ----
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("login-username").value.trim();
        const pass = document.getElementById("login-password").value;

        let users = JSON.parse(localStorage.getItem("users")) || {};

        if (users[user] && users[user] === pass) {
            localStorage.setItem("loggedInUser", user);
            currentLoggedInUser = user;
            showMainApp(user);
            loginForm.reset();
        } else {
            loginError.textContent = "Invalid Account Credentials! ❌";
        }
    });

    // ---- Logout Execution ----
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        currentLoggedInUser = null;
        mainApp.classList.add("hidden");
        authContainer.classList.remove("hidden");
        loginSection.classList.remove("hidden");
        signupSection.classList.add("hidden");
    });

    function showMainApp(username) {
        authContainer.classList.add("hidden");
        mainApp.classList.remove("hidden");
        userDisplayInfo.textContent = username;
    }

    // ---- Image Handling Module ----
    postImageInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function() {
                imagePreview.setAttribute("src", this.result);
                imageBase64Data = this.result; 
                imagePreviewContainer.classList.remove("hidden");
            });
            reader.readAsDataURL(file);
        }
    });

    // ---- Create Post Module ----
    createPostForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = postTextInput.value;

        if (!imageBase64Data) {
            alert("Please pick an image profile card!");
            return;
        }

        const postCard = document.createElement("div");
        postCard.classList.add("post");
        postCard.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <strong>${currentLoggedInUser}</strong>
                    <button class="follow-btn">Follow</button>
                </div>
                <button class="delete-btn">🗑️</button>
            </div>
            <div class="post-content">
                <p>${text}</p>
                <img src="${imageBase64Data}" class="post-image-display" alt="Attached Media">
            </div>
            <button class="like-btn">Like ♡</button>
            <div class="comments-section">
                <ul class="comments-list"></ul>
                <form class="comment-form">
                    <input type="text" class="comment-input" placeholder="Add a comment..." required>
                    <button type="submit" class="comment-submit">Post</button>
                </form>
            </div>
        `;

        postsFeed.prepend(postCard);

        // Reset inputs
        createPostForm.reset();
        imagePreviewContainer.classList.add("hidden");
        imagePreview.setAttribute("src", "");
        imageBase64Data = "";
    });

    // ---- Buttons Operations Core (Like, Follow, Delete) ----
    postsFeed.addEventListener("click", (e) => {
        
        // Follow/Following toggle setup
        if (e.target.classList.contains("follow-btn")) {
            const followBtn = e.target;
            if (followBtn.textContent.trim() === "Follow") {
                followBtn.textContent = "Following";
                followBtn.classList.add("following");
            } else {
                followBtn.textContent = "Follow";
                followBtn.classList.remove("following");
            }
        }

        // Like/Liked interface toggle
        if (e.target.classList.contains("like-btn")) {
            const likeBtn = e.target;
            likeBtn.classList.toggle("liked");
            if (likeBtn.classList.contains("liked")) {
                likeBtn.innerHTML = "Liked ❤️";
            } else {
                likeBtn.innerHTML = "Like ♡";
            }
        }

        // Delete execution confirmation
        if (e.target.classList.contains("delete-btn")) {
            const postCard = e.target.closest(".post");
            if(confirm("Do you really want to remove this post record?")) {
                postCard.remove();
            }
        }
    });

    // ---- Comments Submission Setup ----
    postsFeed.addEventListener("submit", (e) => {
        if (e.target.classList.contains("comment-form")) {
            e.preventDefault();
            const form = e.target;
            const input = form.querySelector(".comment-input");
            const commentsList = form.closest(".comments-section").querySelector(".comments-list");

            if (input.value.trim() !== "") {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${currentLoggedInUser}:</strong> ${input.value.trim()}`;
                commentsList.appendChild(li);
                input.value = ""; 
            }
        }
    });
});