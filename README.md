graph TD
    Root["📁 typenest (Root)"]

    subgraph Core_App ["🚀 Core Pages & App"]
        Index["📄 index.html"]
        Typing["📄 typing.html"]
        Tests["📄 tests.html"]
        Courses["📄 courses.html"]
        Leaderboard["📄 leaderboard.html"]
        Profile["📄 profile.html"]
        Certificate["📄 certificate.html"]
    end

    subgraph Learn_Module ["📚 /learn/ Directory"]
        LearnHub["📄 learn.html"]
        TopRow["📄 toprow.html"]
        BottomRow["📄 bottomrow.html"]
        Numbers["📄 numbers.html"]
        Words["📄 words.html"]
        Advanced["📄 advanced.html"]
    end

    subgraph Practice_Modes ["⌨️ Specialized Practice"]
        Punc["📄 punctuation-typing-practice.html"]
        NumPractice["📄 number-typing-practice.html"]
        DiffWords["📄 difficult-words-typing-practice.html"]
        SpeedBuild["📄 speed-building.html"]
        Timed["📄 typing-test (30s/60s/100s)"]
    end

    subgraph Blog_Guides ["📰 Blog & Guides"]
        BlogIndex["📄 blog.html"]
        TouchGuide["📄 touch-typing-guide.html"]
        KeyGuides["📄 keyboard-shortcuts & guides"]
        SpeedGuides["📄 speed-building-guides"]
        GovtGuides["📄 government-typing-guides"]
    end

    subgraph Assets_Config ["⚙️ Assets & Engine"]
        ScriptJS["📜 script.js / typing.js"]
        AuthJS["📜 auth-navbar.js / login.js"]
        MainCSS["🎨 CSS Files"]
    end

    %% Root Connections
    Root --> Index
    Root --> Core_App
    Root --> Learn_Module
    Root --> Practice_Modes
    Root --> Blog_Guides

    %% Navigation Flow
    Index --> Typing
    Index --> Tests
    Index --> Courses
    Index --> LearnHub
    Index --> BlogIndex

    %% Learning Module Flow
    LearnHub --> TopRow
    LearnHub --> BottomRow
    LearnHub --> Numbers
    LearnHub --> Words
    LearnHub --> Advanced

    %% Practice Flow
    Tests --> Timed
    Courses --> Practice_Modes
    Typing --> Certificate
    Typing --> Leaderboard

    %% Engine Links
    Typing -.-> ScriptJS
    Index -.-> AuthJS
    Core_App -.-> MainCSS
