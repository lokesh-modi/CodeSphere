import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/run', async (req, res) => {
  const { script, language, versionIndex, stdin } = req.body;

  if (!script || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  try {
    const requestBody = {
      script,
      language,
      versionIndex: versionIndex || '0',
      clientId,
      clientSecret,
    };

    // Add stdin if provided
    if (stdin !== undefined && stdin !== null && stdin !== '') {
      requestBody.stdin = stdin;
    }

    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // JDoodle may return output and error separately, or combine them
    // When input() is called without stdin, the prompt appears before EOFError
    const hasOutput = data.output && data.output.trim() !== '';
    const hasError = data.error && data.error.trim() !== '';
    
    // If both exist, return both (output contains prompt, error contains EOFError)
    if (hasOutput && hasError) {
      return res.json({ 
        error: data.error, 
        output: data.output,
        hasOutput: true 
      });
    }

    // If only error exists, check if it contains the prompt before traceback
    if (hasError && !hasOutput) {
      // Try to extract prompt from error (it might be in the first line before traceback)
      const errorLines = data.error.split('\n');
      // Look for lines before "Traceback" that might be prompts
      let promptLine = '';
      for (let i = 0; i < errorLines.length; i++) {
        if (errorLines[i].includes('Traceback')) break;
        if (/[:?]\s*$/.test(errorLines[i].trim()) || /Enter\s+\w+[\s:]+$/i.test(errorLines[i])) {
          promptLine = errorLines[i].trim();
          break;
        }
      }
      
      if (promptLine) {
        return res.json({ 
          error: data.error, 
          output: promptLine,
          hasOutput: true 
        });
      }
      
      return res.json({ error: data.error, output: data.error });
    }

    if (hasError) {
      return res.json({ error: data.error, output: data.error });
    }

    res.json({
      output: data.output || '',
      statusCode: data.statusCode,
      memory: data.memory,
      cpuTime: data.cpuTime,
    });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      error: 'Failed to execute code',
      output: `Error: ${error.message}`,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
