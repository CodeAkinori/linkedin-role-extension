# LinkedIn Role Extension

## Overview

The **LinkedIn Role Extension** is a browser extension that analyzes LinkedIn job postings and evaluates whether the role matches your resume. It uses the **Groq API** to compare the job description against your CV (in Markdown format) and provides a decision in Portuguese:  

-  *Vale a pena* (Worth applying)  
- *Não vale a pena* (Not worth applying)  

The output also contains a brief analysis of strengths, weaknesses, and recommendations.


## Features
- Extracts job description text from LinkedIn automatically.  
- Uses a Markdown CV stored locally (`static/resume.md`).  
- Sends job + CV to Groq API and receives a compact analysis.  
- Displays the result in a clean, dark-themed popup.  
- Simple Node.js backend handles API requests.  
- Minimal token usage for Groq API.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/codeakinori/linkedin-role-extension.git
cd linkedin-role-extension
```

2.  Install backend dependencies:
    

```bash
cd server
npm install
```

3.  Configure your API Key:
    
    -   Open `config.js` (or create it if not present):
        

```js
export const GROQ_API_KEY = "your_api_key_here";
```

> Keep this key secret if the extension is shared. For local/private use only, exposing the key in `config.js` is acceptable.

## Usage

### 1. Start the backend

```bash
node index.js
```

The server will run at `http://localhost:3000`.

### 2. Load the extension in Chrome

1.  Open Chrome → `chrome://extensions/`.
    
2.  Enable **Developer Mode**.
    
3.  Click **Load unpacked** → select the `linkedin-role-extension` folder.
    

### 3. Open LinkedIn Jobs

-   Navigate to a job posting: `https://www.linkedin.com/jobs/`.
    
-   Click the extension icon.
    
-   Press **“Extract role and analyze”**.
    
-   Wait for the analysis to appear in the popup.

## Resume Setup

Create a Markdown file in the `static` folder: `resume.md`. Use the template below:

### Resume Example

```markdown
# John Doe
**Full Stack Developer**
Email: john.doe@example.com | Location: City, Country

## Personal Statement
Brief summary about your skills, experience, and career focus.

## Work Experience
### Job Title – Company Name
*Month Year – Month Year · Location*
- Describe your responsibilities and achievements in bullet points.

## Education
**Degree** – Institution Name
*Month Year – Month Year*
Brief description or specialization.

## Certifications
- Certification Name – Issuing Organization (Year)

```

> The extension reads this file automatically. No need to attach the CV every time.

----------

## Folder Structure

```
linkedin-role-extension/
├─ content.js           # Extracts job text from LinkedIn
├─ popup.html           # Extension popup
├─ popup.js             # Popup logic
├─ popup.css            # Styles (dark theme)
├─ manifest.json        # Extension manifest
├─ static/
│   └─ resume.md            # User resume in Markdown
├─ server/
│   ├─ index.js         # Node.js backend
│   └─ config.js        # Groq API key

```

----------

## Links & Resources

-   [Groq API Documentation](https://console.groq.com/docs/api-reference)
    
-   [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)
    
-   [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
    
-   [LinkedIn Jobs](https://www.linkedin.com/jobs/)
    

----------

## Security Notes

-   The API key is stored locally in `config.js`.
    
-   Do **not** commit `config.js` to public repositories.
    
-   Recommended for **personal/private use only**.
    

----------

## Troubleshooting

-   **“Error communicating with Node server”** → Ensure `node index.js` is running at port 3000.
    
-   **Output shows `undefined`** → Backend updated to handle all SDK response formats. Ensure `GROQ_API_KEY` is valid.
    
-   **Extension cannot extract job text** → Make sure you are on a LinkedIn job posting page.
    

----------

## Diagram (Flow)

```
LinkedIn Job Posting
        │
        ▼
  Chrome Extension
        │
        ▼
  Node.js Backend
        │
        ▼
     Groq API
        │
        ▼
      Popup

```
This shows the full flow from job extraction to analysis display.
