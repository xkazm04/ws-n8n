# AI Agent

Gemini analyzes email content to determine if action is required.

**Option 1: AI Agent + Gemini Chat model**

- Simplifies API setup into a predefined node

**Option 2: Using HTTP Request Node (Alternative)**

- Use if advance Gemini setup required (web search, advance API filtering)
- Method: POST
- URL**:** https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
- Reference: [https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)

---

### **A. Add nodes to leverage LLM functionality**

- [ ]  Add **AI Agent** node
- [ ]  Add **Gemini Chat Model** to the node
    - [ ]  Preconditions: Added Gemini credentials  - [Gemini AI](https://coda.io/d/_d3PFXo2bENf/_surMv)

<aside>
💡

**Gemini Chat Model** can be replaced by other providers to test their capabilties (**OpenAI**, **Claude, Perplexity**, …)

</aside>

### **B. Passing the prompt**

- *reference: [https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf](https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf)*
- [ ]  Add Prompt directly into the AI Agent node
- [ ]  **Source for Prompt** = Pass prompt defined below ****with mapped fields from precessor

Drag and drop values from predecessor directly to the prompt

- subject → Email Subject
- text -> Email Body
- from.value.value[0].address → From

```markdown
# Prompt instructions
Analyze this email and determine if it requires action from the recipient.
- Email Subject: {{ $json.subject }}
- Email Body: {{ $json.text }}
- From: {{ $json.from.value[0].name }} - {{ $json.from.value[0].address }}

Respond with only **"ACTION_REQUIRED"** or **"NO_ACTION"** and a brief reason.

Consider these as requiring action:
- Questions directed at recipient
- Requests for information, approval, or tasks
- Meeting invitations requiring response
- Urgent matters or deadlines

Consider these as NOT requiring action:
- FYI/informational emails
- Newsletters or announcements
- Auto-generated notifications
- Simple acknowledgments

```

*prompt example*

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-WRzkrs-mR6/99fb29aa18a091ff56582f3f9e3617bc7104c8e78a64b01afe5cd6dc3dd8cfade0abdf7433eaf731f78a3fbee61779638cbf7a9373f44afaeb88126a67a28c749dd21ee0266a732838d581fde3fd47f4c69ae8c0c0f24d4577c58614ddd94a4c00109795)

*mapping workflow attributes into a node expression*

---

<aside>
💡

**Tips**

- Add **token limit** to the chat model to prevent costly runs
- Use **output parser** with another chat model inside in case very specific output format needed
</aside>

### Optional: Output parsing using LLM