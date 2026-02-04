export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateSocialLink = (platform: string, url: string): ValidationResult => {
  if (!url) {
    return { isValid: true };
  }

  let regexPattern: RegExp;

  switch (platform.toLowerCase()) {
    case 'twitter':
      regexPattern = /^@[a-zA-Z0-9_]{1,15}$/;
      if (!regexPattern.test(url)) {
        return {
          isValid: false,
          message: 'Twitter用户名格式不正确 (例如: @username)'
        };
      }
      break;

    case 'github':
      regexPattern = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;
      if (!regexPattern.test(url)) {
        return {
          isValid: false,
          message: 'GitHub用户名格式不正确'
        };
      }
      break;

    case 'linkedin':
      regexPattern = /^[a-zA-Z0-9-]{1,100}$/;
      if (!regexPattern.test(url)) {
        return {
          isValid: false,
          message: 'LinkedIn用户名格式不正确'
        };
      }
      break;

    case 'website':
      try {
        new URL(url);
      } catch {
        return {
          isValid: false,
          message: '请输入有效的网址 (例如: https://example.com)'
        };
      }
      break;

    default:
      return { isValid: true };
  }

  return { isValid: true };
};
