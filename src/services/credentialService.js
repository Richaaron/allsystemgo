// Secure Credential Generation and Management Service

export class CredentialService {
  // Generate secure random password
  static generateSecurePassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Fill the rest with random characters from the full charset
    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password to avoid predictable patterns
    return this.shuffleString(password);
  }

  // Generate username based on teacher details
  static generateUsername(firstName, lastName, staffId = null) {
    // Remove spaces and convert to lowercase
    const cleanFirstName = firstName.toLowerCase().replace(/\s/g, '');
    const cleanLastName = lastName.toLowerCase().replace(/\s/g, '');
    
    if (staffId) {
      // Use staff ID if available (e.g., FVS/STF/001 -> fvs001)
      const staffNumber = staffId.split('/').pop();
      return `${cleanFirstName}.${cleanLastName}${staffNumber}`;
    } else {
      // Fallback to name-based username with random number
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${cleanFirstName}.${cleanLastName}${randomSuffix}`;
    }
  }

  // Generate staff ID
  static generateStaffId(existingIds = []) {
    const prefix = 'FVS/STF';
    let staffNumber;
    let attempts = 0;
    
    do {
      staffNumber = (Math.floor(Math.random() * 9000) + 1000).toString();
      attempts++;
      
      if (attempts > 100) {
        throw new Error('Unable to generate unique staff ID after multiple attempts');
      }
    } while (existingIds.includes(`${prefix}/${staffNumber}`));
    
    return `${prefix}/${staffNumber}`;
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*]/.test(password)
    };
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const strength = (passedChecks / Object.keys(checks).length) * 100;
    
    let strengthLevel = 'Weak';
    if (strength >= 80) strengthLevel = 'Strong';
    else if (strength >= 60) strengthLevel = 'Medium';
    else if (strength >= 40) strengthLevel = 'Fair';
    
    return {
      ...checks,
      strength,
      strengthLevel,
      isValid: checks.length === passedChecks
    };
  }

  // Hash password (in real app, use bcrypt or similar)
  static async hashPassword(password) {
    // In a real application, use a proper hashing library
    // For demo purposes, we'll simulate hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // Verify password (in real app, use bcrypt or similar)
  static async verifyPassword(password, hashedPassword) {
    const hash = await this.hashPassword(password);
    return hash === hashedPassword;
  }

  // Generate temporary password for password reset
  static generateTemporaryPassword() {
    const length = 8;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Generate session token
  static generateSessionToken() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    for (let i = 0; i < 32; i++) {
      token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return token;
  }

  // Check if password is commonly used (basic security check)
  static isCommonPassword(password) {
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'abc123', 'password1', '123456789', 'welcome', 'login',
      'teacher', 'student', 'school', 'folusho', 'victory'
    ];
    
    const lowerPassword = password.toLowerCase();
    return commonPasswords.some(common => 
      lowerPassword.includes(common) || common.includes(lowerPassword)
    );
  }

  // Generate credentials for new teacher
  static generateTeacherCredentials(teacherData, existingStaffIds = []) {
    const { firstName, lastName, email } = teacherData;
    
    // Generate staff ID
    const staffId = this.generateStaffId(existingStaffIds);
    
    // Generate username
    const username = this.generateUsername(firstName, lastName, staffId);
    
    // Generate secure password
    const password = this.generateSecurePassword();
    
    // Generate login URL
    const loginUrl = `${process.env.REACT_APP_BASE_URL || 'https://folushovictory.sch.ng'}/login`;
    
    return {
      staffId,
      username,
      password,
      loginUrl,
      temporaryPassword: false,
      expiresAt: null
    };
  }

  // Generate credentials for password reset
  static generatePasswordResetCredentials(teacherData) {
    const temporaryPassword = this.generateTemporaryPassword();
    const resetToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    return {
      username: teacherData.username,
      temporaryPassword,
      resetToken,
      expiresAt,
      loginUrl: `${process.env.REACT_APP_BASE_URL || 'https://folushovictory.sch.ng'}/reset-password?token=${resetToken}`
    };
  }

  // Validate credentials format
  static validateCredentials(credentials) {
    const errors = [];
    
    if (!credentials.username || credentials.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (!credentials.password || credentials.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    const passwordValidation = this.validatePasswordStrength(credentials.password);
    if (!passwordValidation.isValid) {
      const missingRequirements = Object.entries(passwordValidation)
        .filter(([key, value]) => key !== 'strength' && key !== 'strengthLevel' && key !== 'isValid' && !value)
        .map(([key]) => {
          const requirementMap = {
            uppercase: 'uppercase letter',
            lowercase: 'lowercase letter',
            numbers: 'number',
            symbols: 'special character'
          };
          return requirementMap[key] || key;
        });
      
      errors.push(`Password must contain: ${missingRequirements.join(', ')}`);
    }
    
    if (this.isCommonPassword(credentials.password)) {
      errors.push('Password is too common. Please choose a more secure password');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format credentials for display (mask sensitive info)
  static formatCredentialsForDisplay(credentials, showPassword = false) {
    return {
      staffId: credentials.staffId,
      username: credentials.username,
      password: showPassword ? credentials.password : '•'.repeat(credentials.password.length),
      loginUrl: credentials.loginUrl,
      temporaryPassword: credentials.temporaryPassword,
      expiresAt: credentials.expiresAt
    };
  }

  // Helper function to shuffle string
  static shuffleString(string) {
    const array = string.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  // Generate API key for teacher (for system integration)
  static generateApiKey() {
    const prefix = 'fvs_';
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = prefix;
    
    for (let i = 0; i < 24; i++) {
      apiKey += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return apiKey;
  }

  // Validate API key format
  static validateApiKey(apiKey) {
    return /^fvs_[A-Za-z0-9]{24}$/.test(apiKey);
  }

  // Generate one-time login code (for 2FA or temporary access)
  static generateOneTimeCode(length = 6) {
    const charset = '0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return code;
  }

  // Check if credentials have expired
  static haveCredentialsExpired(credentials) {
    if (!credentials.expiresAt) {
      return false; // Permanent credentials don't expire
    }
    
    return new Date() > new Date(credentials.expiresAt);
  }

  // Get credential expiry time in human readable format
  static getExpiryTime(credentials) {
    if (!credentials.expiresAt) {
      return 'Never expires';
    }
    
    const expiryDate = new Date(credentials.expiresAt);
    const now = new Date();
    const diff = expiryDate - now;
    
    if (diff <= 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${(hours % 24) > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }
}
