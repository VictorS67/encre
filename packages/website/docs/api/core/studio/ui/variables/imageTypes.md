# Variable: imageTypes

> `const` **imageTypes**: [`"image/png"`, `"image/jpeg"`, `"image/gif"`, `"image/svg+xml"`]

Represents a tuple of all supported image MIME types used within the system.
This tuple is used for validating and handling image data operations, ensuring compatibility and correct processing.

- 'image/png': Standard PNG format, useful for images that require transparency.
- 'image/jpeg': Commonly used for photographs and other images with gradients.
- 'image/gif': Used for images with simple animations.
- 'image/svg+xml': Used for vector graphics which are scalable without loss of quality.

## Source

[packages/core/src/studio/ui.ts:366](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L366)
