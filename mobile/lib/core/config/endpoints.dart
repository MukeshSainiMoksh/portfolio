class Endpoints {
  // Auth
  static const String login = '/api/admin/auth/login';
  static const String me = '/api/admin/auth/me';
  static const String logout = '/api/admin/auth/logout';

  // Content - Skills
  static const String skills = '/api/admin/content/skills';
  static String skillById(int id) => '/api/admin/content/skills/$id';

  // Content - Projects
  static const String projects = '/api/admin/content/projects';
  static String projectById(int id) => '/api/admin/content/projects/$id';

  // Content - Experience
  static const String experience = '/api/admin/content/experience';
  static String experienceById(int id) => '/api/admin/content/experience/$id';

  // Content - Education
  static const String education = '/api/admin/content/education';
  static String educationById(int id) => '/api/admin/content/education/$id';

  // Content - Profile
  static const String profile = '/api/admin/content/profile';
  static String profileById(int id) => '/api/admin/content/profile/$id';

  // Certifications
  static const String certifications = '/api/admin/certifications/';
  static String certificationById(int id) => '/api/admin/certifications/$id';

  // Media
  static const String mediaFiles = '/api/admin/media/files';
  static const String mediaUpload = '/api/admin/media/upload';
  static String mediaFileById(int id) => '/api/admin/media/files/$id';

  // Public
  static const String portfolio = '/api/website/content/portfolio';
  static const String health = '/health';
}
