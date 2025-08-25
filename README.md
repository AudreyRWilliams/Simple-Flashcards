# Simple Flashcard App
This project uses only Express 4 + vanilla HTML/JS/CSS (no React), and saves data to a small data.json file.  The pictures below demonstrate each feature of the app:
- This is the starting screen which shows all of the available flashcard decks that you can go through.  Starting off, the only deck that's available because it's hard-coded into the `server.js` program is the `Demo: Basic Spanish`: <br>
<img width="692" height="215" alt="Screen Shot 2025-08-25 at 12 00 50 AM" src="https://github.com/user-attachments/assets/1f3c1914-c346-40c0-8471-2e32aa431196" /> <br>
- Below is the screen that you'll see when you click the `open` button for the Basic Spanish deck.
<img width="698" height="663" alt="Screen Shot 2025-08-25 at 12 01 12 AM" src="https://github.com/user-attachments/assets/672fd2b0-e11d-4878-b920-68e7fb9461a0" /> <br>
- Here we've added a card for `Dog` to the Basic Spanish deck.
<img width="690" height="699" alt="Screen Shot 2025-08-25 at 12 02 19 AM" src="https://github.com/user-attachments/assets/fea53e5b-274e-4a37-8158-55a60422994c" /> <br>
- Below we've gone back to our Decks and added a new one entitled `Demo: Basic French`:
<img width="698" height="260" alt="Screen Shot 2025-08-25 at 12 03 18 AM" src="https://github.com/user-attachments/assets/1c0e7d4e-97b4-4f36-9db2-74d59e481b2a" /> <br>
- Here we've added 3 new cards to the Basic French deck:
<img width="696" height="718" alt="Screen Shot 2025-08-25 at 12 05 59 AM" src="https://github.com/user-attachments/assets/5c17db8b-912d-4d9c-b774-a7ea6ee99558" /> <br>
- Here we've successfully deleted a card from the deck:
<img width="691" height="677" alt="Screen Shot 2025-08-25 at 12 06 33 AM" src="https://github.com/user-attachments/assets/76abc629-8d07-441c-ad23-66609f8409e8" />


## Below are the steps to build this project:
## 1) Create the project & init npm
Open Terminal: <br>
<img width="211" height="163" alt="Screen Shot 2025-08-25 at 1 30 13 AM" src="https://github.com/user-attachments/assets/c3c14ca5-71fc-4baf-b2fa-8d490b9e8ba2" />

## 2) Create files/folders
Create this structure: <br>
<img width="368" height="220" alt="Screen Shot 2025-08-25 at 1 56 27 AM" src="https://github.com/user-attachments/assets/f931d41b-f2e6-4776-a8dd-ddaee57720bc" />
- data.json (initial empty DB)
- server.js (Express backend + simple JSON storage)

## 3) Add an npm start script
Open package.json and add this inside "scripts": <br>
<img width="253" height="127" alt="Screen Shot 2025-08-25 at 1 59 02 AM" src="https://github.com/user-attachments/assets/1cbda608-8453-435f-991a-38f2674e0f4d" /> <br>
Now you can run:
<img width="93" height="75" alt="Screen Shot 2025-08-25 at 1 59 59 AM" src="https://github.com/user-attachments/assets/2aaf109a-26b8-47fd-a4d8-e6353507bf47" /> <br>
Open your browser at http://localhost:3000
You’ll see the demo deck, can create new decks, add cards, study, and delete cards. Data persists in data.json.

## 4) Commit and push to GitHub
Create a new (empty) repo on GitHub (e.g., FlashcardSimple). Then: <br>
- cd ~/FlashcardSimple
- git add .
- git commit -m "Initial simple flashcards (Express + vanilla JS)"
- git branch -M main
- git remote add origin https://github.com/<your-username>/FlashcardSimple.git
- git push -u origin main
