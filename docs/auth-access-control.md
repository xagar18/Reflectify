## Authentication & Access Control – Reflectify

### User Types
1. Logged-out (Guest) users
2. Logged-in (Authenticated) users

---

### Access Control for Logged-Out Users
Logged-out users are provided with a limited trial experience.

Allowed:
- Text-only chat
- Short conversations

Restricted:
- No voice input
- No image input
- No chat history saving
- Limited number of messages per day

Message Limit:
- Maximum 5 messages per day per user

---

### Feature Restrictions
| Feature | Logged-out | Logged-in |
|------|---------|---------|
| Text Chat | Yes | Yes |
| Voice Input | No | Yes |
| Image Input | No | Yes |
| Chat History | No | Yes |
| Daily Message Limit | 5 | Higher limit |

---

### Social Authentication
Reflectify uses OAuth 2.0 for secure social login.

Supported providers:
- Google
- Github 
- Instagram / Facebook (optional)

Authentication tokens are generated and validated on the backend.
No passwords are stored in the system.

---

### Rate Limiting
API-level rate limiting is applied to prevent abuse.

Limits:
- Logged-out users: 5 messages/day
- Logged-in users: 30 requests/minute
- Logged-in users: 200 messages/day
