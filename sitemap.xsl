<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Oops! Sitemap - Adri Velasco</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400..800&amp;display=swap" rel="stylesheet" />
        <style>
          body {
            background-color: #0000ff;
            color: #ffffff;
            font-family: 'Syne', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
          }
          h1 {
            font-size: clamp(2rem, 5vw, 4rem);
            margin-bottom: 20px;
            font-weight: 800;
          }
          p {
            font-size: 1.2rem;
            max-width: 600px;
            margin-bottom: 40px;
            line-height: 1.6;
          }
          .btn {
            background-color: #ffffff;
            color: #0000ff;
            text-decoration: none;
            padding: 15px 35px;
            border-radius: 40px;
            font-weight: 800;
            font-size: 1.1rem;
            text-transform: uppercase;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          .btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          }
          .robot-emoji {
            font-size: 4rem;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops!</h1>
        <p>
          oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops!
          <br/><br/>
          oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops! oops!
        </p>
        <a href="https://adrivelasco.com/" class="btn">adrivelaasco.com</a>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
