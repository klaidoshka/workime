class TextUtils {
  static parseTagsFromText(text: string): string[] {
    if (!text) {
      return [];
    }

    const matches = text.match(/#[\w-]+/g);

    if (!matches) {
      return [];
    }

    const extracted = matches
      .map(tag => tag.slice(1).toLowerCase().trim())
      .filter(tag => tag.length > 0 && tag.length < 32); // Take only tags that are non-empty and reasonably short

    return [...new Set(extracted)];
  }

  static formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export default TextUtils;
