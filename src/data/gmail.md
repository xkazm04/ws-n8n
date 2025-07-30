# Gmail integration

Start the workflow with an incoming unread email

### Gmail Trigger

- [ ]  Search for **Gmail trigger** and add it to your workflow

*Gmail Trigger Purpose**:** Automatically detect new unread emails (on message received)*

<aside>
💡

### **Alternative Options:**

- **Webhook Trigger:** If manual trigger from email client is preferred
- **Schedule Trigger:** Run every X minutes to check for new emails
- **Manual Trigger:** For development and testing purposes
</aside>

- [ ]  **Uncheck simplify** option to retrieve all email metadata (full text body)

---

## **Test the trigger**

**Option 1: Gmail Trigger**

Send an email to yourself an email and fetch it

**Option 2: Manual trigger + Gmail node**

To prevent re-sending the same email, Gmail node can be used to fetch the latest received email, or filterd by specific criteria

[image.png](https://codahosted.io/docs/3PFXo2bENf/blobs/bl-z212nBYiMT/3c5ed3479b90a822429419f08ffab5fa0cdae758d289ffe4bd2390a479023b52a3627d3983667c71aa3a9215b12acea250a186907ad2e0fb1337e2716696831cbcc0716879dec3d0aceab087b002cd56f80d99fea0c1f19444f6661621bc22f53cd012fe)

<aside>
💡

Use filters to limit number of emails retrieved by the integration node

</aside>