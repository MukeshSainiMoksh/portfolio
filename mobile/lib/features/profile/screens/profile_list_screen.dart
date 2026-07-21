import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../providers/profile_provider.dart';
import '../../../core/router/route_names.dart';

class ProfileListScreen extends ConsumerWidget {
  const ProfileListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Profile Content')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(RouteNames.profileCreate),
        child: const Icon(Icons.add),
      ),
      body: profileAsync.when(
        data: (items) => items.isEmpty
            ? const EmptyView(message: 'No profile content yet')
            : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final field = items[index];
                return GlassCard(
                  onTap: () =>
                  context.go('${RouteNames.profile}/${field.id}/edit'),
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                          CrossAxisAlignment.start,
                          children: [
                            Text(
                              field.fieldName,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium,
                            ),
                            Text(
                              '[${field.section}]',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall,
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
                            title: 'Delete Field',
                            message:
                            'Delete this field?',
                          ).then((confirmed) {
                            if (confirmed ?? false) {
                              ref
                                  .read(profileProvider
                                  .notifier)
                                  .delete(field.id);
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
          message: 'Failed to load profile content',
          onRetry: () => ref.refresh(profileProvider),
        ),
      ),
    );
  }
}
