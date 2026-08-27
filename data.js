// ╔══════════════════════════════════════════════════════════════╗
// ║  🎯 EDIT SEMUA DI SINI — Save, refresh browser, done.      ║
// ║  Dipakai bareng index.html dan index-3d.html, jadi cukup    ║
// ║  edit sekali di file ini untuk mengubah kedua halaman.      ║
// ╚══════════════════════════════════════════════════════════════╝

const CONFIG = {

  // ─── 👤 INFO DASAR ───
  name: "Fitri Maharani",
  logoFirst: "Fitri",
  logoAccent: "Maharani",
  resumeFile: "YOUR-RESUME.pdf",

  // ─── 📸 FOTO CAROUSEL ───
  // Taruh file foto di folder yang sama, lalu tambahin namanya di sini.
  // Auto-slide tiap 4 detik, bisa juga geser manual / klik dot.
  // Minimal 1 foto, maksimal bebas.
  photos: [
    // "foto1.jpg",
    // "foto2.jpg",
    // "foto3.jpg",
    // "foto4.jpg",
    // "foto-lulus.jpg",
    // "foto-presentasi.jpg",
  ],
  photoAutoSlideSeconds: 4,  // ganti angka = ganti kecepatan auto-slide

  // ─── 🏠 HERO ───
  hero: {
    tag: "Apple Developer Institute · AIML",
    headlines: [
      "Hey, I'm",
      "Fitri Maharani.",
      "I teach machines to see,",
      "hear, and think.",
    ],
    description:
      "iOS developer with a thing for machine learning. I build apps where " +
      "AI does the heavy lifting, from reading damaged receipts to " +
      "understanding spoken food orders. Currently at Apple Developer Institute for AI/ML.",
    buttons: {
      primary: { text: "See My Work", link: "#projects" },
      secondary: { text: "Let's Talk", link: "#contact" },
      resume: true,
    },
  },

  // ─── 👤 ABOUT ───
  about: {
    title: "From hydroponics\nto AI pipelines.",
    stats: [
      { number: "6+", label: "Projects" },
      { number: "1",  label: "Publication" },
      { number: "4",  label: "AI domains" },
    ],
    paragraphs: [
      'I started my journey building <span class="hl">IoT systems for hydroponic farms</span>, connecting sensors, syncing edge-to-cloud data, and figuring out how to make plants healthier with code. That curiosity led me straight into machine learning.',

      'Now I\'m at the <span class="hl">Apple Developer Institute for AI/ML</span>, where I\'ve built production-ready iOS apps powered by computer vision, NLP, and audio processing. I\'ve trained models from scratch, deployed them on-device via Core ML and ONNX, and built full-stack AI pipelines with RAG, vector databases, and local LLMs.',

      'I\'m the kind of developer who <span class="hl">deliberately avoids the easy route</span>. I skipped Apple\'s Vision framework to learn how OCR actually works at the model level. I believe understanding the fundamentals makes you build better things.',
    ],
    badges: [
      { icon: "🍎", text: "Apple Developer Institute", color: "teal" },
      { icon: "📄", text: "Published Researcher",      color: "amber" },
      { icon: "🎓", text: "Teaching Assistant",         color: "accent" },
    ],
  },

  // ─── 🛠 SKILLS ───
  skills: {
    title: "Four AI domains.\nOne full stack.",
    categories: [
      { label: "Apple / iOS",          items: ["Swift","SwiftUI","Core ML","ONNX Runtime","Xcode","CocoaPods"] },
      { label: "Machine Learning & AI", items: ["Python","PyTorch","XGBoost","NAFNet","PaddleOCR","MLX","Qwen2.5-VL","Gemma 3","SileroVAD","RAG"] },
      { label: "Backend & Data",        items: ["FastAPI","ChromaDB","BM25","HuggingFace","REST API"] },
      { label: "IoT & Hardware",        items: ["Arduino","ESP32","Edge Computing","MQTT","Sensor Integration"] },
    ],
  },

  // ─── 💼 PROJECTS ───
  // Setiap project punya: image (screenshot) dan demoVideo (link video/gif)
  // Kosongkan = tampil icon. Isi nanti kalau sudah punya screenshot/video.
  projects: {
    sectionLabel: "Apple Developer Institute · AIML",
    title: "Projects that ship.",

    featured: {
      type: "Audio · Challenge 1",
      title: "Pezen: The AI Waiter That Actually Listens",
      description:
        "An iPad app that replaces human waiters with voice AI. Customers " +
        "speak their orders naturally, and the system detects when they stop talking, " +
        "transcribes their speech, repairs disfluencies, extracts intent, " +
        "validates against the menu, and responds aloud. All in real time.",
      icon: "🎙️",
      image: "",       // ← nanti: "pezen-screenshot.png"
      demoVideo: "",   // ← nanti: "pezen-demo.mp4" atau link YouTube
      tags: ["SwiftUI","SileroVAD","Speech-to-Text","Intent Extraction","Text-to-Speech","Python"],
      links: [{ label: "GitHub →", url: "#" }],
      // ↓ Isi ini = muncul di popup detail. Dikosongkan = nggak tampil.
      detail: {
        overview: [],    // ["Paragraf satu.", "Paragraf dua."]
        highlights: [ { label: "Platform", value: "iPadOS" }, { label: "Voice Activity", value: "SileroVAD" }, { label: "Respons", value: "Real-time" } ],
        images: [],      // ["shot1.png", "shot2.png"]
        video: "",       // link YouTube atau file .mp4
      },
    },

    cards: [
      {
        type: "NLP · Challenge 1",
        title: "LearnToRecall: Your Textbook, But Smarter",
        description:
          "Upload any textbook, get AI-generated flashcards and a RAG-powered " +
          "chatbot that answers questions grounded in your material. Uses hybrid " +
          "retrieval with ChromaDB + BM25, Reciprocal Rank Fusion, and Gemma 3 4B " +
          "running locally via MLX.",
        icon: "🧠",
        image: "",       // ← nanti: "learntorecall.png"
        demoVideo: "",   // ← nanti: link demo
        tags: ["RAG","ChromaDB","Gemma 3","Qwen2.5-VL","MLX","SwiftUI"],
        links: [{ label: "GitHub →", url: "#" }],
        // ↓ Isi ini = muncul di popup detail. Dikosongkan = nggak tampil.
        detail: {
          overview: [],    // ["Paragraf satu.", "Paragraf dua."]
          highlights: [ { label: "LLM", value: "Gemma 3 4B" }, { label: "Retrieval", value: "Hybrid + RRF" }, { label: "Runtime", value: "MLX on-device" } ],
          images: [],      // ["shot1.png", "shot2.png"]
          video: "",       // link YouTube atau file .mp4
        },
      },
      {
        type: "Tabular ML · Challenge 1",
        title: "House Price Predictor: 14 Cities, One Tap",
        description:
          "An iOS app that predicts house prices across Central Java. " +
          "Web-scraped 12K+ listings, cleaned to 4,206 records, trained " +
          "XGBoost with manual hyperparameter tuning, then converted to " +
          "Core ML for on-device inference. R² = 0.66 with just 5 features.",
        icon: "🏠",
        image: "",
        demoVideo: "",
        tags: ["XGBoost","Core ML","SwiftUI","Python","Web Scraping"],
        links: [{ label: "GitHub →", url: "#" }],
        // ↓ Isi ini = muncul di popup detail. Dikosongkan = nggak tampil.
        detail: {
          overview: [],    // ["Paragraf satu.", "Paragraf dua."]
          highlights: [ { label: "Akurasi", value: "R2 0.66" }, { label: "Data Bersih", value: "4.206 listing" }, { label: "Fitur", value: "5" } ],
          images: [],      // ["shot1.png", "shot2.png"]
          video: "",       // link YouTube atau file .mp4
        },
      },
      {
        type: "Computer Vision · Challenge 1",
        title: "Receipt Scanner: Restore, Read, Record",
        description:
          "Snap a damaged Indonesian receipt and the app reconstructs it " +
          "using NAFNet (23.8M params, trained on 4,445 image pairs), " +
          "then reads it with PaddleOCR via FastAPI, and parses totals " +
          "with layered regex. All deployed on-device via ONNX.",
        icon: "📸",
        image: "",
        demoVideo: "",
        tags: ["NAFNet","PaddleOCR","ONNX","FastAPI","PyTorch","SwiftUI"],
        links: [{ label: "GitHub →", url: "#" }],
        // ↓ Isi ini = muncul di popup detail. Dikosongkan = nggak tampil.
        detail: {
          overview: [],    // ["Paragraf satu.", "Paragraf dua."]
          highlights: [ { label: "Parameter Model", value: "23,8 juta" }, { label: "Data Latih", value: "4.445 pasang" }, { label: "Inference", value: "On-device (ONNX)" } ],
          images: [],      // ["shot1.png", "shot2.png"]
          video: "",       // link YouTube atau file .mp4
        },
      },
    ],
  },

  // ─── 📚 RESEARCH ───
  research: {
    title: "Published & peer-reviewed.",
    papers: [
      {
        type: "Undergraduate Thesis", color: "amber",
        title: "AI-Based Early Disease Detection for Hydroponic Lettuce Using IoT",
        description: "Built an end-to-end system that uses artificial intelligence to detect plant diseases early in hydroponic lettuce farms, connected via IoT sensors for real-time monitoring.",
        link: "https://etd.polines.ac.id/index.php?p=show_detail&id=15311&keywords=",
        linkText: "Read Full Thesis →",
      },
      {
        type: "International Journal (IJASEIT)", color: "teal",
        title: "Synchronization of Data Transmission between Edge and Cloud in IoT-Based Hydroponics",
        description: "Explored how to reliably sync sensor data between edge devices and cloud infrastructure in hydroponic IoT systems. Published in the International Journal on Advanced Science, Engineering and Information Technology.",
        link: "https://ijaseit.insightsociety.org/index.php/ijaseit/article/view/20326",
        linkText: "Read Publication →",
      },
    ],
  },

  // ─── 📬 CONTACT ───
  contact: {
    title: "Let's build something\nworth shipping.",
    description: "Open for iOS development roles, AI/ML projects, and research collaborations. Whether it's a startup idea or a complex ML pipeline. I'm all ears.",
    links: [
      { icon: "✉",  label: "Email",     value: "fitrim1411@gmail.com", url: "mailto:fitrim1411@gmail.com" },
      { icon: "in", label: "LinkedIn",  value: "/in/fitri-maharani",   url: "https://www.linkedin.com/in/fitri-maharani-0ab984420" },
      { icon: "⌘",  label: "GitHub",    value: "@Fitrim1411",          url: "https://github.com/Fitrim1411" },
      { icon: "◎",  label: "Instagram", value: "@piyuyouw",            url: "https://www.instagram.com/piyuyouw/" },
    ],
  },

  footer: {
    left: "Built from scratch.",
    right: "iOS · AI/ML · IoT",
  },
};
