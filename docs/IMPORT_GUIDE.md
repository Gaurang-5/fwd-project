# Chapter Import JSON Guide

## 📋 JSON Format Template

Use the provided `chapters-import-template.json` file as a starting point. The structure is:

```json
{
  "chapters": [
    {
      "title": "Chapter Title Here",
      "chapterNumber": 1,
      "classNumber": 9,
      "unitName": "Unit Name Here",
      "videoLink": "https://youtube.com/watch?v=...",
      "notesLink": "https://drive.google.com/...",
      "questionsLink": "https://drive.google.com/..."
    }
  ]
}
```

## 🔧 Field Descriptions

### Required Fields (Must be filled):

1. **`title`** (string)
   - The full name of the chapter
   - Example: `"Matrices and System of Linear Equations"`

2. **`chapterNumber`** (number)
   - The chapter number (numeric value only)
   - Example: `1`, `2`, `3`, etc.

3. **`classNumber`** (number)
   - Use `9` for **Chemistry Cycle**
   - Use `10` for **Physics Cycle**
   - These are the only two valid values

4. **`unitName`** (string)
   - The name of the unit/module this chapter belongs to
   - Example: `"Applied Mathematics-I"`, `"Engineering Physics"`

### Optional Fields (Can be empty):

5. **`videoLink`** (string)
   - YouTube or other video platform URL
   - Leave as empty string `""` if not available
   - Example: `"https://youtube.com/watch?v=abc123"`

6. **`notesLink`** (string)
   - PDF or document link (Google Drive, Dropbox, etc.)
   - Leave as empty string `""` if not available
   - Example: `"https://drive.google.com/file/d/xyz789/view"`

7. **`questionsLink`** (string)
   - Questions/practice problems PDF link
   - Leave as empty string `""` if not available
   - Example: `"https://drive.google.com/file/d/questions123/view"`

## ✅ Guidelines & Best Practices

### 1. File Structure
- Must start with `{"chapters": [...]}`
- Each chapter object separated by commas
- Last chapter should NOT have a trailing comma

### 2. Data Types
- Strings: Use double quotes `"text here"`
- Numbers: No quotes `9` or `10`
- Empty values: Use `""` (empty string), not `null`

### 3. Chapter Numbering
- Use sequential numbers: 1, 2, 3, 4...
- Each cycle (Chemistry/Physics) can have its own numbering

### 4. Class Numbers
- **Chemistry Cycle = 9**
- **Physics Cycle = 10**
- Do NOT use any other numbers

### 5. Unit Names
- Keep consistent spelling across chapters in the same unit
- Units will be automatically grouped in the admin panel
- Examples:
  - `"Applied Mathematics-I"`
  - `"Applied Mathematics-II"`
  - `"Engineering Physics"`
  - `"Engineering Chemistry"`

### 6. Links
- Use full URLs including `https://`
- Test links before importing to ensure they work
- For empty links, use `""` not leaving the field out

## 📝 Example: Complete Import File

```json
{
  "chapters": [
    {
      "title": "Matrices and System of Linear Equations",
      "chapterNumber": 1,
      "classNumber": 9,
      "unitName": "Applied Mathematics-I",
      "videoLink": "https://youtube.com/watch?v=xyz",
      "notesLink": "https://drive.google.com/file/d/abc/view",
      "questionsLink": "https://drive.google.com/file/d/def/view"
    },
    {
      "title": "Multivariable Calculus",
      "chapterNumber": 2,
      "classNumber": 9,
      "unitName": "Applied Mathematics-I",
      "videoLink": "",
      "notesLink": "",
      "questionsLink": ""
    },
    {
      "title": "Calculus of One Variable",
      "chapterNumber": 1,
      "classNumber": 10,
      "unitName": "Applied Mathematics-II",
      "videoLink": "https://youtube.com/watch?v=abc",
      "notesLink": "https://drive.google.com/file/d/123/view",
      "questionsLink": ""
    }
  ]
}
```

## 🚀 How to Import

1. **Prepare Your File**
   - Copy `chapters-import-template.json`
   - Fill in your chapter data following the format above
   - Save with `.json` extension

2. **Validate Your JSON**
   - Use an online JSON validator (jsonlint.com)
   - Check for missing commas, quotes, or brackets
   - Ensure no trailing commas after last items

3. **Import in Admin Panel**
   - Login to admin panel
   - Click the **"Import"** button
   - Select your JSON file
   - Review the preview
   - Confirm import

4. **Verify**
   - Check that all chapters appear correctly
   - Verify chapter numbers and cycles
   - Ensure units are grouped properly
   - Test resource links

## ⚠️ Common Mistakes to Avoid

❌ **Wrong:**
```json
{
  "title": 'Single quotes',  // Must use double quotes
  "chapterNumber": "1",       // Must be number, not string
  "classNumber": 11,          // Only 9 or 10 allowed
  "videoLink": null,          // Use "" instead of null
}                              // Trailing comma
```

✅ **Correct:**
```json
{
  "title": "Double quotes",
  "chapterNumber": 1,
  "classNumber": 9,
  "videoLink": ""
}
```

## 🔍 Troubleshooting

**Import fails:**
- Validate JSON syntax at jsonlint.com
- Check all required fields are present
- Ensure classNumber is 9 or 10 only
- Remove any trailing commas

**Chapters not grouping by unit:**
- Check unit name spelling is identical
- Units are case-sensitive
- Extra spaces matter

**Links not working:**
- Ensure full URL with https://
- Test links in browser first
- Check for special characters that need encoding

## 💾 Backup Tip

Before importing, use the **Export** button to download current data as backup in case you need to restore.

---

**Need help?** Contact support or check the admin panel documentation.
