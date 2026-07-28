import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables — a missing/broken .env must not blank-screen
  // the app; AppConfig falls back to its default base URL
  try {
    await dotenv.load(fileName: '.env');
  } catch (e) {
    // initialize an empty env so dotenv.env reads don't throw NotInitializedError
    dotenv.testLoad(fileInput: '');
    debugPrint('Could not load .env, using defaults: $e');
  }

  runApp(
    const ProviderScope(
      child: PortfolioAdminApp(),
    ),
  );
}
