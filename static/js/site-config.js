// Edit this file to customize the site title, authors, theme, and video paths.
window.SITE_CONFIG = {
  theme: {
    primary: "#3273dc",
    darkText: "#363636",
    bodyText: "#4a4a4a",
    secondaryText: "#666666",
    mutedText: "#888888",
    authorLink: "hsl(204, 86%, 53%)",
    sceneCircleBackground: "#e0e0e0",
    sceneCircleHover: "#c0c0c0",
    lidarAccent: "#ff9800"
  },

  meta: {
    browserTitle: "TideGS Supplementary Material",
    description: "Supplementary webpage for TideGS with visual quality comparisons and a method overview.",
    keywords: "TideGS, 3D Gaussian Splatting, supplementary material",
    ogTitle: "TideGS Supplementary Material",
    ogDescription: "Supplementary webpage for TideGS with visual quality comparisons and a method overview.",
    ogUrl: "",
    ogImage: "static/images/overview.png",
    twitterTitle: "TideGS Supplementary Material",
    twitterDescription: "Supplementary webpage for TideGS with visual quality comparisons and a method overview.",
    twitterImage: "static/images/overview.png"
  },

  assets: {
    favicon: "static/images/overview.png"
  },

  site: {
    projectName: "TideGS",
    title: "Scalable Training of 3D Gaussian Splatting via Out-of-Core Optimization",
    venue: "ICML 2026 Submission #3888",
    footerSubtitle: "ICML 2026 Submission #3888",
    // abstractTitle: "Abstract",
    // abstractHtml: "This webpage presents supplementary visualizations for <strong>{projectName}</strong>, including a direct visual quality comparison and a method overview. Replace this paragraph with your paper abstract if you want the website text to match the manuscript exactly."
  },

  authors: [
    // Example:
    // { name: "First Author", url: "https://example.com" },
    // { name: "Second Author" },
    // { name: "Third Author" }
  ],

  overview: {
    title: "Method Overview",
    image: "static/images/overview.png",
    alt: "Method Overview",
    captionHtml: "Method overview for <strong>{projectName}</strong>."
  },

  hero: {
    title: "Visual Quality Comparison",
    summaryHtml: "Drag the two split bars to compare TideGS, CLM, and Vanilla 3DGS in one view.",
    tripleComparison: {
      leftVideo: "static/videos/visual-quality/tidegs_15s_6fps.mp4",
      middleVideo: "static/videos/visual-quality/clm_15s_6fps.mp4",
      rightVideo: "static/videos/visual-quality/vanilla_3dgs_15s_6fps.mp4",
      leftLabel: "TideGS",
      middleLabel: "CLM",
      rightLabel: "Vanilla 3DGS",
      firstDivider: 33.33,
      secondDivider: 66.66,
      minGap: 8
    }
  }
};
