import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../core/widgets/error_view.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/skill_provider.dart';
import '../../../providers/project_provider.dart';
import '../../../providers/experience_provider.dart';
import '../../../providers/education_provider.dart';
import '../../../providers/certification_provider.dart';
import '../../../core/router/route_names.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final skillsAsync = ref.watch(skillsProvider);
    final projectsAsync = ref.watch(projectsProvider);
    final experienceAsync = ref.watch(experienceProvider);
    final educationAsync = ref.watch(educationProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Dashboard'),
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Text(
                authState.user?.fullName ?? 'Admin',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
              context.go(RouteNames.login);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome section
            GlassCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome Back!',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Here\'s an overview of your portfolio',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Stats grid
            GridView.count(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _StatCard(
                  title: 'Skills',
                  asyncValue: skillsAsync,
                  icon: Icons.star,
                  onTap: () => context.go(RouteNames.skills),
                ),
                _StatCard(
                  title: 'Projects',
                  asyncValue: projectsAsync,
                  icon: Icons.work,
                  onTap: () => context.go(RouteNames.projects),
                ),
                _StatCard(
                  title: 'Experience',
                  asyncValue: experienceAsync,
                  icon: Icons.business_center,
                  onTap: () => context.go(RouteNames.experience),
                ),
                _StatCard(
                  title: 'Education',
                  asyncValue: educationAsync,
                  icon: Icons.school,
                  onTap: () => context.go(RouteNames.education),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Quick actions
            Text(
              'Quick Actions',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ElevatedButton.icon(
                  icon: const Icon(Icons.add),
                  label: const Text('Add Skill'),
                  onPressed: () => context.go(RouteNames.skillCreate),
                ),
                ElevatedButton.icon(
                  icon: const Icon(Icons.add),
                  label: const Text('Add Project'),
                  onPressed: () => context.go(RouteNames.projectCreate),
                ),
                ElevatedButton.icon(
                  icon: const Icon(Icons.add),
                  label: const Text('Upload Media'),
                  onPressed: () => context.go(RouteNames.media),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final AsyncValue asyncValue;
  final IconData icon;
  final VoidCallback onTap;

  const _StatCard({
    required this.title,
    required this.asyncValue,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.neonCyan.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppColors.neonCyan),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 8),
                asyncValue.when(
                  data: (items) => Text(
                    '${items.length}',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: AppColors.neonCyan,
                    ),
                  ),
                  loading: () => const Text(
                    '-',
                    style: TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  error: (_, __) => const Text(
                    '?',
                    style: TextStyle(
                      color: AppColors.neonPink,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
