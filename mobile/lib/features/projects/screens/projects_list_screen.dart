import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../providers/project_provider.dart';
import '../../../core/router/route_names.dart';

class ProjectsListScreen extends ConsumerWidget {
  const ProjectsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final projectsAsync = ref.watch(projectsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Projects')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(RouteNames.projectCreate),
        child: const Icon(Icons.add),
      ),
      body: projectsAsync.when(
        data: (projects) => projects.isEmpty
            ? const EmptyView(
              message: 'No projects yet',
              icon: Icons.work_outline,
            )
            : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: projects.length,
              itemBuilder: (context, index) {
                final project = projects[index];
                return GlassCard(
                  padding: const EdgeInsets.all(16),
                  onTap: () =>
                  context.go('${RouteNames.projects}/${project.id}/edit'),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              project.title,
                              style:
                              Theme.of(context).textTheme.titleMedium,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (project.isFeatured)
                            const Chip(
                              label: Text('Featured'),
                              backgroundColor: AppColors.neonCyan,
                            ),
                        ],
                      ),
                      if (project.tagline != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          project.tagline!,
                          style: Theme.of(context).textTheme.bodySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Wrap(
                              spacing: 4,
                              children: [
                                if (project.technologies != null)
                                  for (final tech in project.technologies!
                                      .take(2))
                                    Chip(
                                      label: Text(tech),
                                      visualDensity: VisualDensity
                                          .compact,
                                    ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete,
                              color: AppColors.neonPink,
                            ),
                            onPressed: () {
                              ConfirmDialog.show(
                                context,
                                title: 'Delete Project',
                                message:
                                'Delete "${project.title}"?',
                              ).then((confirmed) {
                                if (confirmed ?? false) {
                                  ref
                                      .read(projectsProvider.notifier)
                                      .delete(project.id);
                                }
                              });
                            },
                          ),
                        ],
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
        error: (_, __) => ErrorView(
          message: 'Failed to load projects',
          onRetry: () => ref.refresh(projectsProvider),
        ),
      ),
    );
  }
}
