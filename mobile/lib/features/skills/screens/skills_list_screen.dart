import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../providers/skill_provider.dart';
import '../../../core/router/route_names.dart';

class SkillsListScreen extends ConsumerWidget {
  const SkillsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final skillsAsync = ref.watch(skillsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Skills'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(RouteNames.skillCreate),
        child: const Icon(Icons.add),
      ),
      body: skillsAsync.when(
        data: (skills) => skills.isEmpty
            ? const EmptyView(
              message: 'No skills yet',
              subtitle: 'Add your first skill',
              icon: Icons.star_outline,
            )
            : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: skills.length,
              itemBuilder: (context, index) {
                final skill = skills[index];
                return GlassCard(
                  padding: const EdgeInsets.all(16),
                  onTap: () => context.go(
                    '${RouteNames.skills}/${skill.id}/edit',
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  skill.skillName,
                                  style:
                                  Theme.of(context).textTheme.titleMedium,
                                ),
                                Text(
                                  skill.category,
                                  style:
                                  Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.delete,
                              color: AppColors.neonPink,
                            ),
                            onPressed: () {
                              ConfirmDialog.show(
                                context,
                                title: 'Delete Skill',
                                message:
                                'Are you sure you want to delete "${skill.skillName}"?',
                              ).then((confirmed) {
                                if (confirmed ?? false) {
                                  ref
                                      .read(skillsProvider.notifier)
                                      .delete(skill.id);
                                }
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: skill.skillLevel / 100,
                          minHeight: 6,
                          backgroundColor: AppColors.surfaceSecondary,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            AppColors.neonCyan,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${skill.skillLevel}%',
                        style:
                        Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.neonCyan,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
        loading: () => const Center(
          child: CircularProgressIndicator(
            valueColor:
            AlwaysStoppedAnimation<Color>(AppColors.neonCyan),
          ),
        ),
        error: (error, st) => ErrorView(
          message: 'Failed to load skills',
          onRetry: () => ref.refresh(skillsProvider),
        ),
      ),
    );
  }
}
