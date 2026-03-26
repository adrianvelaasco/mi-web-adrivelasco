import os

base_dir = '/Users/adrianvelascocarneros/Desktop/Otros/adrivelasco_webflow-export/works'

redirects = {
    'pianogames.html': 'pianogames',
    'rumble.html': 'rumble',
    'osc-protocol.html': 'osc-protocol',
    'game-of-life.html': 'game-of-life',
    'another-music-conservatory.html': 'another-music-conservatory',
    'lespontanea.html': 'lespontanea',
    'minuit-toujours-arrive.html': 'minuit-toujours-arrive',
    'cisne-y-cerdo.html': 'cisne-y-cerdo',
    'three-years-of-evolution.html': 'three-years-of-evolution',
    'personas-que-quiza-conozcas.html': 'personas-que-quiza-conozcas',
    'in-search-of-the-perfect-video.html': 'en-busca-del-video-perfecto'
}

template = """<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=viewer.html?work={work_id}">
    <script>
        // Check if loaded inside an iframe (viewer context) or standalone
        // However, standard viewer uses client-side rendering from JSON, not iframe loading of these files.
        // So we can safely redirect always.
        window.location.replace("viewer.html?work={work_id}");
    </script>
</head>
<body>
    <p>Redirecting to {work_id}...</p>
</body>
</html>"""

for filename, work_id in redirects.items():
    file_path = os.path.join(base_dir, filename)
    with open(file_path, 'w') as f:
        f.write(template.format(work_id=work_id))
    print(f"Updated {filename} to redirect to {work_id}")
