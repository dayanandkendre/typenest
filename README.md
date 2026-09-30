mermaid
graph TD
    %% Root Node
    Root["📁 typenest-main (Root)"]

    %% Core Application Pages
    subgraph Core_App ["🚀 Core Pages & App"]
        Index["📄 index.html (Home)"]
        Typing["📄 typing.html (Typing Area)"]
        Tests["📄 tests.html (Typing Tests)"]
        Courses["📄 courses.html (Courses Hub)"]
        Leaderboard["📄 leaderboard.html (Rankings)"]
        Profile["📄 profile.html (User Profile)"]
        Certificate["📄 certificate.html (Certification)"]
    end

    %% Learning Module Subfolder
    subgraph Learn_Module ["📚 /learn/ Directory"]
        LearnHub["📄 learn.html"]
        TopRow["📄 toprow.html / toprowlevel.html"]
        BottomRow["📄 bottomrow.html / bottomrowlevel.html"]
        Numbers["📄 numbers.html / numberslevel.html"]
        Words["📄 words.html / wordslevel.html"]
        Advanced["📄 advanced.html / advancedlevel.html"]
        LevelView["📄 level.html"]
    end

    %% Practice Modes
    subgraph Practice_Modes ["⌨️ Specialized Practice"]
        Punc["📄 punctuation-typing-practice.html"]
        NumPractice["📄 number-typing-practice.html"]
        DiffWords["📄 difficult-words-typing-practice.html"]
        SpeedBuild["📄 speed-building.html"]
        Timed30["📄 typing-test-30-seconds.html"]
        Timed60["📄 typing-test-60-seconds.html"]
        Timed100["📄 typing-test-100-seconds.html"]
    end

    %% Blog & Guides (Major Hub)
    subgraph Blog_Guides ["📰 Blog & Guides Hub"]
        BlogIndex["📄 blog.html"]
        TouchGuide["📄 touch-typing-guide.html"]
        KeyboardGuides["📄 mechanical-vs-membrane-keyboards.html<br/>keyboard-shortcuts.html<br/>top-custom-mechanical-keyboards..."]
        SpeedGuides["📄 increase-typing-speed-guide.html<br/>typing-speed-benchmarks-guide.html<br/>how-wpm-and-accuracy-are-calculated.html"]
        CareerGuides["📄 government-typing-exam-gcc-tbc-guide.html<br/>data-entry-operator-typing-speed-secrets.html<br/>typing-speed-requirements-for-remote-jobs.html"]
    end

    %% Support & Informational
    subgraph Support_Pages ["ℹ️ Info & Support"]
        About["📄 about.html"]
        Contact["📄 contact.html"]
        FAQ["📄 faq.html"]
        Privacy["📄 privacy.html"]
        Terms["📄 terms.html"]
        Disclaimer["📄 disclaimer.html"]
    end

    %% Assets & Config
    subgraph Assets_Config ["⚙️ Assets & Engine"]
        ScriptJS["📜 script.js / typing.js"]
        AuthJS["📜 auth-navbar.js / login.js / firebase-config.js"]
        MainCSS["🎨 style.css / typing.css / courses.css"]
        Audio["🔊 key.wav"]
        BlogImages["🖼️ /images/blog/* (WebP Assets)"]
        CourseImages["🖼️ /images/courses/*"]
    end

    %% Root Connections
    Root --> Index
    Root --> Core_App
    Root --> Learn_Module
    Root --> Practice_Modes
    Root --> Blog_Guides
    Root --> Support_Pages

    %% Internal Linking Flow
    Index -->|Directs to| Typing
    Index -->|Directs to| Tests
    Index -->|Directs to| Courses
    Index -->|Directs to| LearnHub
    Index -->|Directs to| BlogIndex

    %% Learning Flow
    LearnHub --> TopRow
    LearnHub --> BottomRow
    LearnHub --> Numbers
    LearnHub --> Words
    LearnHub --> Advanced
    TopRow & BottomRow & Numbers & Words & Advanced --> LevelView

    %% Practice Flow
    Tests --> Timed30
    Tests --> Timed60
    Tests --> Timed100
    Courses --> Practice_Modes
    Typing --> Certificate
    Typing --> Leaderboard

    %% Blog Internal Links
    BlogIndex --> TouchGuide
    BlogIndex --> KeyboardGuides
    BlogIndex --> SpeedGuides
    BlogIndex --> CareerGuides

    %% Engine Ties (Dotted)
    Typing -.-> ScriptJS
    Typing -.-> Audio
    Index -.-> AuthJS
    Blog_Guides -.-> BlogImages
    Courses -.-> CourseImages
