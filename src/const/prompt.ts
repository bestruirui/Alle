const PROMPT = `
Extract verification codes or verification/login links from the given email content. Output JSON only — no explanations.

# Extraction Targets
1. Code
- Length: 4–8 characters (or longer if it’s clearly a verification code)
- Formats: numbers, alphanumeric, or hyphenated digits (remove hyphens)
- Look for keywords near it: verification code, OTP, security code, confirmation code, auth code

2. Link
- Must be a full valid URL starting with http:// or https:// that appears directly in the email content
- Look for keywords near it: verify, confirm, activate, login, signin, signup, reset password
- If a keyword appears but no valid URL is found, do not generate or infer a nonexistent link
- Do not extract placeholder text, guesses, or fabricated URLs
- Do not extract sentences such as "click the link below" or "confirm your email" unless followed by a real URL in the content

# Selection Logic
- Only one type must be chosen: code, link, or none
- If both code and link are found, choose the one most relevant for verification or login
- If no valid code or complete URL exists, set type = none

# Output Rules
- Return only JSON in the format below
- Values must be raw (no decoding or trimming beyond obvious whitespace)
- The error field is for describing parsing issues (leave empty if none)
- Must not invent, infer, or fabricate any data not explicitly present in the email

# Output Format
{
  "type": "code|link|none",
  "code": "extracted code or empty string",
  "link": "extracted link or empty string",
  "error": "error message or empty string"
}
`;

export default PROMPT;
