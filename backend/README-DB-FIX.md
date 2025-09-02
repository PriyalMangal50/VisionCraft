# MongoDB Index Fix Instructions

This document provides instructions for fixing the MongoDB duplicate key error related to the `title_1` index in the products collection.

## The Problem

The error occurs when trying to add products with duplicate titles because there's a unique index on the `title` field in the MongoDB products collection.

## Fix Using the Script

A script has been created to fix this issue by removing the problematic index.

### Steps to Run the Fix:

1. Ensure your MongoDB connection string is correctly set in your `.env` file
2. Open a terminal in the backend directory
3. Run the script with:

```bash
node fix-db-index.js
```

### Expected Output:

```
Connecting to MongoDB...
Connected to MongoDB
Dropping the 'title_1' index...
Index 'title_1' successfully dropped
Database index fixed successfully
MongoDB connection closed
```

## Manual Fix Alternative

If the script doesn't work, you can manually fix the issue by connecting to your MongoDB instance and running:

```javascript
db.products.dropIndex("title_1")
```

## Post-Fix Verification

After running the fix, you should be able to add products with the same title without encountering duplicate key errors.

## Note

This fix removes the unique constraint on the title field. If you need to maintain uniqueness for product identification, consider using other fields or a combination of fields.
