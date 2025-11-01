# CodeSphere - Online Compiler & Interpreter

A fully functional online compiler website that allows users to write, run, and view output for multiple programming languages directly in the browser.

## Features

- 15+ Programming Languages (Python, Java, C, C++, JavaScript, TypeScript, Go, PHP, Ruby, Kotlin, Swift, Rust, R, SQL, C#)
- Monaco Editor with syntax highlighting
- Real-time code execution
- Dark/Light theme toggle
- Keyboard shortcuts (Ctrl+Enter to run, Ctrl+S to save)
- Share code via URL
- Responsive design
- Code persistence with localStorage

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure JDoodle API

To enable code execution, you need to get JDoodle API credentials:

1. Sign up at [JDoodle](https://www.jdoodle.com/compiler-api)
2. Get your Client ID and Client Secret
3. Update the `.env` file:

```
JDOODLE_CLIENT_ID=your_actual_client_id
JDOODLE_CLIENT_SECRET=your_actual_client_secret
```

### 3. Run the Application

Start the backend server (in one terminal):

```bash
node server.js
```

Start the frontend development server (in another terminal):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Visit the homepage to see all available programming languages
2. Click on any language to open the compiler
3. Write your code in the Monaco editor
4. Click "Run" or press Ctrl+Enter to execute
5. View output in the right panel
6. Use the sidebar to switch between languages
7. Share your code using the Share button

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor
- **Backend**: Node.js, Express
- **Code Execution**: JDoodle API
- **Icons**: Lucide React

## Keyboard Shortcuts

- `Ctrl + Enter` - Run code
- `Ctrl + S` - Save code to localStorage

## Notes

- Code is automatically saved to localStorage per language
- Theme preference is persisted
- Shared URLs include both language and code
- The backend server must be running for code execution to work
