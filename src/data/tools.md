# Optional: AI Agent with tools

With improving LLM capabilities the AI Agent node can replace functionality of some of the non-AI nodes we had to create for the decision logic and branching the workflow into a complex structure.

The complexity can be moved from the workflow design into a a one comprehensive prompt which allows the agent to decide which integration to choose and use it in one shot.

### 1. Use integrations as tools

- [ ]  Create a tool for Asana task creation
- [ ]  Create tools for Gmail: Mark as read, Delete
- [ ]  Pass Message ID from the Gmail trigger

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-niMdt1KFqs/96c707996700c86bac35ec9954752241413adc51d1419c5366082b914299ff6cfb1e80e64d2f3b73b314a41405b76620bcdbc688d67b595f3ef162cd4057e41fc6ea726c44603cea6ef1b29badb5882186782574a68a1ab1c3709a5d8dc76b15bad572d8)

### 2. Prompt adjustment

To help AI execute the right tool at the right moment, the AI Agent node needs additional setup and a change in the wording of its prompt.

- [ ]  Replace the prompt in AI agent mode to an extended version (attached below on the page bottom)

Some LLM models require detailed instructions to keep their response behavior stable and reliable, some can think more out of the box. You can always start from a simple instructions and add more together with Claude/Gemini/GPT to extend it.

It is recommended to

- **Describe** available **tools** agent can use
- Define the **situations** when to use them and how to decide
- Define an **output structure** with examples in case you would to work further with agentic results

Even with defined output structure in the prompt the AI Agent could create different format than expected, in this case you can support it with an additional AI layer to post-process the result → **Output parser**

- [ ]  Enable **Specific output format** in AI Agent node
- [ ]  Add Structured Output Parser to the AI Agent node
- [ ]  Pass example value from the prompt below into **JSON Example**Enable **Auto-Fix** format, to let AI review Connect a **Gemini Chat Model** into the **Structured Output Parse**r

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl--MnHfIHK8m/b0a07772f952c1638f09e3dc5e1c1b66c863303594abda4a35a97d863c69b3644ae224b75ca2ee570d22c0cdcee41a8deed227d46d4ef76f952b8c390b8f44ab1af85aea2c0c86078f05a421cf8affc552a7df9f7e09f66a3d188a7a0aa3ceca4d025a7d)

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-MFBCs_bY8y/831498c568e95a9a7fbedd81d69636d5949cb0090530687d9454268d8b2e5a687ad30ff336ed331a8fff24c9fbd7c84fecec690dccc21f3eddb2696feef097d9883b9e7085bf08583a77d1760eb9ab88dcb29fbbb7b2f6038277422af5aaf053999116ed)

Comparison of methodology (images below)

- **Left**: Original workflow
- 
    - AI Agent only summarizes the emails, other activities are no-coded into the workflow
    - More responsibility on your side to design, but more reliable
- **Right**: New workflow
- 
    - AI Agent does everything in one shot
    - More responsibility on the AI side, but more risky to fail
    - Fine for universal workflows, less fine for a transparent design on the first sight

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-lhK3lhx_hm/cd1c467b962ba90f84a119b3142e56633b0bbf6821955b128630d46497a3c64414151034dd5cf39caaa69168f7d26ca05ded9445b8622a679418b2244b8eb3fd1d315982e2072671400a05cae19c047b0b2f86204b7d154291f5883b829aee2dd72b9246)

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-o0h83C6V0c/0055f9fb25b9937ff2e47b6d0ee2ae01f3cb47ea5646d4c1e8ad6f1895ec0062d587948b7e00aa10e476900b436a2ad778151cce4fc391ff39330d05e740c35202ab10b3dd4569b93a43dad20b696720c9c10fc72befdde7e05e060c88fda443d631a1e8)

Now AI agent can produce nicely formatted response without a need of JavaScript Code node

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-b2eR9BDJht/52fbc4244c6ae9eef70243882db7b848a9e056e979819eae7708dc880e72c7f98a50c75b7a357ffcb24246b31080040cc521c8caea4b9556ead37f19eab2f19adce3a68977c81d0ee83402acc4210f410cbb6d7024de40f253e97ef625b1a4c8ccc6bf2b)

---

## Attachment - Enhanced Prompt

**SYSTEM MESSAGE:**You are an email processing assistant with access to Gmail and Asana tools. Your job is to analyze emails, determine if they require action, execute the appropriate tools, and return structured JSON responses.

**Available Tools:**- gmail_mark_read: Mark message as read- gmail_delete: Delete a message  - asana_create_task: Create a task in Asana

**CRITICAL RESPONSE FORMAT:**You must return ONLY a valid JSON object with this exact structure:{  "action": "ACTION_REQUIRED" or "NO_ACTION",  "reason": "brief explanation of your decision",  "tool_used": "name of tool executed",  "success": true/false}

Do not include any other text, explanations, markdown, or formatting outside this JSON.

**USER MESSAGE:**Analyze this email and take the appropriate action:

Email Subject: {{ $json.headers.subject }}Email Body: {{ $json.text }}From: {{ $json.headers.from }}Email ID: {{ $json.id }}

**DECISION CRITERIA:**

**ACTION_REQUIRED** (execute asana_create_task):- Questions directed at recipient that need answers- Requests for information, approval, or tasks- Meeting invitations requiring response- Urgent matters with deadlines- Action items or assignments- Requests for feedback or review- Scheduling requests- Project-related discussions needing input

**NO_ACTION** (execute gmail_mark_read then gmail_delete):- FYI/informational emails with no required response- Company newsletters or announcements  - Auto-generated notifications (system alerts, receipts)- Simple acknowledgments or confirmations- Status updates with no action needed- General company updates- Automated reports

**TOOL EXECUTION LOGIC:**1. If ACTION_REQUIRED: Use asana_create_task with:   - name: "Email from [sender]: [subject]"   - notes: Include email content and context   - due_date: Set 2-3 days from now for non-urgent, 1 day for urgent   - project_id: Use default project ID

2. If NO_ACTION: First use gmail_mark_read, then gmail_delete (both with message_id)

Execute the appropriate tool(s) based on your analysis and return only the JSON response.

- --

**EXAMPLE RESPONSES:**

For action-required email:{  "action": "ACTION_REQUIRED",  "reason": "Budget review request with Friday deadline requires response",  "tool_used": "asana_create_task",  "success": true}

For informational email:{  "action": "NO_ACTION",   "reason": "Office policy update is informational only",  "tool_used": "gmail_mark_read",  "success": true}