# VS Code CSS Validation for Tailwind CSS

The project contains CSS files that use Tailwind CSS directives like `@tailwind` and `@apply`.

To suppress the CSS validation warnings in VS Code:

1. Install the "Tailwind CSS IntelliSense" extension by Tailwind Labs
2. We've added VS Code settings to disable standard CSS validation in the project

The `.vscode/settings.json` file contains:
```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

This is normal behavior with Tailwind CSS and not an error in the code.
