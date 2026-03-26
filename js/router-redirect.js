
(function () {
    if (sessionStorage.redirect) {
        var redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;

        // Check if it's a specific work URL: /works/three-years
        var worksMatch = redirect.match(/^\/works\/([a-zA-Z0-9-]+)/);

        if (worksMatch && worksMatch[1]) {
            var workId = worksMatch[1];

            // Determine correct viewer
            var targetViewer = "viewer.html";
            if (window.innerWidth < 768) targetViewer = "viewer_mobile.html";
            else if (window.innerWidth < 1024) targetViewer = "viewer_tablet.html";

            // If we are NOT already on that page, redirect to it
            if (!window.location.pathname.includes(targetViewer)) {
                window.location.replace("works/" + targetViewer + "?work=" + workId);
                return;
            } else {
                // We are on the correct page, restore the CLEAN URL
                window.history.replaceState(null, null, "/works/" + workId);
                return;
            }
        }

        window.history.replaceState(null, null, redirect);
    }
})();
