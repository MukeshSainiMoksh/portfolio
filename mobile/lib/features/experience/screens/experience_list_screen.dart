import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../providers/experience_provider.dart';
import '../../../core/router/route_names.dart';

class ExperienceListScreen extends ConsumerWidget {
  const ExperienceListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expAsync = ref.watch(experienceProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Experience')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(RouteNames.experienceCreate),
        child: const Icon(Icons.add),
      ),
      body: expAsync.when(
        data: (items) => items.isEmpty
            ? const EmptyView(message: 'No experience yet')
            : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final exp = items[index];
                return GlassCard(
                  onTap: () =>
                  context.go('${RouteNames.experience}/${exp.id}/edit'),
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: const BoxDecoration(
                              color: AppColors.neonCyan,
                              shape: BoxShape.circle,
                            ),
                          ),
                          if (index < items.length - 1)
                            Container(
                              width: 2,
                              height: 60,
                              color:
                              AppColors.borderGlow,
                            ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                          CrossAxisAlignment.start,
                          children: [
                            Text(
                              exp.jobTitle,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium,
                            ),
                            Text(
                              exp.company,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall,
                            ),
                            if (exp.isCurrent)
                              const Padding(
                                padding: EdgeInsets.only(top: 8),
                                child: Chip(
                                  label: Text('Current'),
                                  backgroundColor:
                                  AppColors.neonGreen,
                                ),
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
                            title: 'Delete Experience',
                            message: 'Delete this position?',
                          ).then((confirmed) {
                            if (confirmed ?? false) {
                              ref
                                  .read(experienceProvider.notifier)
                                  .delete(exp.id);
                            }
                          });
                        },
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
          message: 'Failed to load experience',
          onRetry: () => ref.refresh(experienceProvider),
        ),
      ),
    );
  }
}
