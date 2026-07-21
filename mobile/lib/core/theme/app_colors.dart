import 'package:flutter/material.dart';

class AppColors {
  // Backgrounds — deep space dark
  static const Color background = Color(0xFF080B14);       // Near-black base
  static const Color surfacePrimary = Color(0xFF0F1629);   // Card background
  static const Color surfaceSecondary = Color(0xFF151E35); // Elevated surface
  static const Color glassOverlay = Color(0x1AFFFFFF);     // 10% white glass layer

  // Neon accent system
  static const Color neonCyan = Color(0xFF00F5FF);         // Primary accent
  static const Color neonPurple = Color(0xFF7B2FFF);       // Secondary accent
  static const Color neonPink = Color(0xFFFF2D8B);         // Danger/delete
  static const Color neonGreen = Color(0xFF39FF14);        // Success/active

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00F5FF), Color(0xFF7B2FFF)],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0x1A00F5FF), Color(0x1A7B2FFF)],
  );

  static const LinearGradient dangerGradient = LinearGradient(
    colors: [Color(0xFFFF2D8B), Color(0xFFFF6B35)],
  );

  // Text
  static const Color textPrimary = Color(0xFFF0F4FF);
  static const Color textSecondary = Color(0xFF8892B0);
  static const Color textMuted = Color(0xFF4A5568);

  // Borders — subtle glow
  static const Color borderGlow = Color(0x3300F5FF);       // Cyan glow border
  static const Color borderSubtle = Color(0x1AFFFFFF);     // Subtle glass border

  // Status
  static const Color statusActive = neonGreen;
  static const Color statusInactive = Color(0xFF6B7280);
  static const Color statusWarning = Color(0xFFFFB800);
  static const Color statusError = neonPink;
}
