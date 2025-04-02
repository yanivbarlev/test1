function populateSoftwarePage(params) {
    // Default parameters in case some are missing
    const defaults = {
        icon: "default-icon.png",
        title: "Software Title",
        developer: "Developer Name",
        rating: "0.0",
        downloads: "0 Downloads",
        age: "0+",
        description: "No description available.",
        downloadLink: "#" // Add a default download link
    };
    
    // Merge provided params with defaults
    const software = { ...defaults, ...params };
    
    // Populate the page elements with the provided data
    document.getElementById("software-icon").src = software.icon;
    document.getElementById("software-icon").alt = `${software.title} Icon`;
    document.getElementById("software-title").textContent = software.title;
    document.getElementById("software-developer").textContent = software.developer;
    document.getElementById("software-rating").textContent = software.rating;
    document.getElementById("software-downloads").textContent = software.downloads;
    document.getElementById("software-age").textContent = software.age;
    document.getElementById("software-description").textContent = software.description;
    
    // Add event listener to the download button
    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.addEventListener("click", function() {
        window.location.href = software.downloadLink;
    });
    
    // Update the page title dynamically
    document.title = `${software.title} - akaqa.com`;
}