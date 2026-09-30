mermaid
graph TD
    Root["📁 Root Directory (/)"]
    
    %% Root Files
    Root --> Index["📄 index.html"]
    Root --> Readme["📄 README.md"]
    Root --> StyleFolder["📁 css/"]
    Root --> PagesFolder["📁 pages/"]
    
    %% Subfolders
    StyleFolder --> CSS["🎨 style.css"]
    PagesFolder --> About["📄 about.html"]
    PagesFolder --> Contact["📄 contact.html"]
    
    %% Internal Links (कशी जोडली आहेत)
    Index -->|link| About
    Index -->|link| Contact
    Index -.->|includes| CSS
    About -.->|includes| CSS
