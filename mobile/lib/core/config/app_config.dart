import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String get baseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'http://localhost:8000';

  static const int connectTimeoutMs = 10000;
  static const int receiveTimeoutMs = 30000;
  static const String tokenKey = 'admin_jwt_token';

  // App constants
  static const String appName = 'Portfolio Admin';
  static const String appVersion = '1.0.0';
}
