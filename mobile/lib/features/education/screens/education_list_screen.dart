import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../providers/education_provider.dart';
import '../../../core/router/route_names.dart';

class EducationListScreen extends ConsumerWidget {
  const EducationListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eduAsync = ref.watch(educationProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Education')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(RouteNames.educationCreate),
        child: const Icon(Icons.add),
      ),
      body: eduAsync.when(
        data: (items) => items.isEmpty
            ? const EmptyView(message: 'No education yet')
            : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final edu = items[index];
                return GlassCard(
                  onTap: () =>
                  context.go('${RouteNames.education}/${edu.id}/edit'),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                              CrossAxisAlignment.start,
                              children: [
                                Text(
                                  edu.degree,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium,
                                  maxLines: 2,
                                  overflow:
                                  TextOverflow.ellipsis,
                                ),
                                Text(
                                  edu.institution,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall,
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
                                title: 'Delete Education',
                                message:
                                'Delete this education?',
                              ).then((confirmed) {
                                if (confirmed ?? false) {
                                  ref
                                      .read(educationProvider
                                      .notifier)
                                      .delete(edu.id);
                                }
                              });
                            },
                          ),
                        ],
                      ),
                      if (edu.year != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          edu.year!,
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(
                            color:
                            AppColors.textSecondary,
                          ),
                        ),
                      ],
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
          message: 'Failed to load education',
          onRetry: () => ref.refresh(educationProvider),
        ),
      ),
    );
  }
}
